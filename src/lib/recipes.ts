import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, RecipeWithDetails, RecipeCard } from './types';
import type { Locale } from '../i18n';

type Client = SupabaseClient<Database>;

/** Map category slugs to DB base_type names */
const BASE_TYPE_FROM_SLUG: Record<string, string> = {
  'ice-cream': 'Ice Cream',
  'sorbet': 'Sorbet',
  'gelato': 'Gelato',
  'frozen-yogurt': 'Frozen Yogurt',
  'milkshake': 'Milkshake',
  'smoothie-bowl': 'Smoothie Bowl',
  'lite-ice-cream': 'Lite Ice Cream',
  'italian-ice': 'Italian Ice',
};

export interface RecipeQueryParams {
  q?: string;
  base?: string[];
  difficulty?: string[];
  flavor?: string[];
  dietary?: string[];
  model?: string[];
  rating?: number;
  sort?: 'newest' | 'rating' | 'reviews' | 'prep-time';
  page?: number;
  pageSize?: number;
  locale?: Locale;
}

export interface EnrichedRecipeCard {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  base_type: string;
  avg_rating: number;
  rating_count: number;
  prep_time_minutes: number | null;
  hero_image_url: string | null;
  categories: string[];
  models: string[];
}

/** Filtered, paginated, translated recipe query for the listing API */
export async function getFilteredRecipes(
  client: Client,
  params: RecipeQueryParams,
): Promise<{ recipes: EnrichedRecipeCard[]; total: number; facets: Record<string, Record<string, number>> }> {
  const {
    q, base, difficulty, flavor, dietary, model, rating,
    sort = 'newest', page = 1, pageSize = 24, locale = 'en',
  } = params;

  // Step 1: Collect recipe IDs that match category/model filters (junction table queries)
  let categoryFilterIds: string[] | null = null;
  let modelFilterIds: string[] | null = null;

  const categorySlugs = [...(flavor ?? []), ...(dietary ?? [])];
  if (categorySlugs.length > 0) {
    const { data: cats } = await client
      .from('categories')
      .select('id')
      .in('slug', categorySlugs) as { data: { id: string }[] | null };
    if (cats && cats.length > 0) {
      const { data: rcLinks } = await client
        .from('recipe_categories')
        .select('recipe_id')
        .in('category_id', cats.map((c) => c.id)) as { data: { recipe_id: string }[] | null };
      categoryFilterIds = [...new Set((rcLinks ?? []).map((r) => r.recipe_id))];
    } else {
      categoryFilterIds = [];
    }
  }

  if (model && model.length > 0) {
    const { data: models } = await client
      .from('creami_models')
      .select('id')
      .in('slug', model) as { data: { id: string }[] | null };
    if (models && models.length > 0) {
      const { data: rmLinks } = await client
        .from('recipe_models')
        .select('recipe_id')
        .in('model_id', models.map((m) => m.id)) as { data: { recipe_id: string }[] | null };
      modelFilterIds = [...new Set((rmLinks ?? []).map((r) => r.recipe_id))];
    } else {
      modelFilterIds = [];
    }
  }

  // Intersect category and model filter IDs
  let constrainedIds: string[] | null = null;
  if (categoryFilterIds !== null && modelFilterIds !== null) {
    const modelSet = new Set(modelFilterIds);
    constrainedIds = categoryFilterIds.filter((id) => modelSet.has(id));
  } else if (categoryFilterIds !== null) {
    constrainedIds = categoryFilterIds;
  } else if (modelFilterIds !== null) {
    constrainedIds = modelFilterIds;
  }

  // Early return if junction filters produced zero results
  if (constrainedIds !== null && constrainedIds.length === 0) {
    return { recipes: [], total: 0, facets: {} };
  }

  // Step 2: Build main query
  let query = client
    .from('recipes')
    .select('id, title, slug, description, difficulty, base_type, hero_image_url, avg_rating, rating_count, prep_time_minutes', { count: 'exact' })
    .eq('status', 'published');

  // Text search — search both English and translated titles/descriptions
  if (q) {
    let searchIds: string[] | null = null;

    // Search translations table for non-English locales
    if (locale !== 'en') {
      const { data: transMatches } = await client
        .from('recipe_translations')
        .select('recipe_id')
        .eq('locale', locale)
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`) as { data: { recipe_id: string }[] | null };
      if (transMatches && transMatches.length > 0) {
        searchIds = transMatches.map((r) => r.recipe_id);
      }
    }

    // Also search English titles/descriptions
    const { data: enMatches } = await client
      .from('recipes')
      .select('id')
      .eq('status', 'published')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`) as { data: { id: string }[] | null };
    const enIds = (enMatches ?? []).map((r) => r.id);

    // Combine both result sets
    const allMatchIds = [...new Set([...(searchIds ?? []), ...enIds])];
    if (allMatchIds.length === 0) {
      return { recipes: [], total: 0, facets: {} };
    }
    query = query.in('id', allMatchIds);
  }

  // Base type filter (slug → name)
  if (base && base.length > 0) {
    const names = base.map((s) => BASE_TYPE_FROM_SLUG[s]).filter(Boolean);
    if (names.length > 0) query = query.in('base_type', names);
  }

  // Difficulty filter
  if (difficulty && difficulty.length > 0) {
    query = query.in('difficulty', difficulty);
  }

  // Rating filter
  if (rating && rating > 0) {
    query = query.gte('avg_rating', rating);
  }

  // Junction table filter (category + model IDs)
  if (constrainedIds !== null) {
    query = query.in('id', constrainedIds);
  }

  // Sort
  switch (sort) {
    case 'rating': query = query.order('avg_rating', { ascending: false }); break;
    case 'reviews': query = query.order('rating_count', { ascending: false }); break;
    case 'prep-time': query = query.order('prep_time_minutes', { ascending: true, nullsFirst: false }); break;
    default: query = query.order('published_at', { ascending: false }); break;
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: rawData, count, error } = await query;
  if (error || !rawData) {
    console.warn('getFilteredRecipes error:', error?.message);
    return { recipes: [], total: 0, facets: {} };
  }

  const data = rawData as unknown as { id: string; title: string; slug: string; description: string; difficulty: string; base_type: string; hero_image_url: string | null; avg_rating: number; rating_count: number; prep_time_minutes: number | null }[];
  const recipeIds = data.map((r) => r.id);
  if (recipeIds.length === 0) return { recipes: [], total: count ?? 0, facets: {} };

  // Step 3: Enrich with categories and models (only for this page of results)
  const [catRes, modelRes] = await Promise.all([
    client.from('recipe_categories').select('recipe_id, category:categories (slug)').in('recipe_id', recipeIds) as unknown as { data: Record<string, unknown>[] | null },
    client.from('recipe_models').select('recipe_id, model:creami_models (slug)').in('recipe_id', recipeIds) as unknown as { data: Record<string, unknown>[] | null },
  ]);

  const catMap = new Map<string, string[]>();
  for (const rc of (catRes.data ?? []) as Record<string, unknown>[]) {
    const slug = (rc.category as Record<string, unknown>)?.slug as string;
    const rid = rc.recipe_id as string;
    if (!slug) continue;
    if (!catMap.has(rid)) catMap.set(rid, []);
    catMap.get(rid)!.push(slug);
  }

  const modelMap = new Map<string, string[]>();
  for (const rm of (modelRes.data ?? []) as Record<string, unknown>[]) {
    const slug = (rm.model as Record<string, unknown>)?.slug as string;
    const rid = rm.recipe_id as string;
    if (!slug) continue;
    if (!modelMap.has(rid)) modelMap.set(rid, []);
    modelMap.get(rid)!.push(slug);
  }

  // Step 4: Apply translations if non-English
  let transMap = new Map<string, { title: string; description: string }>();
  if (locale !== 'en') {
    const { data: translations } = await client
      .from('recipe_translations')
      .select('recipe_id, title, description')
      .eq('locale', locale)
      .in('recipe_id', recipeIds) as { data: { recipe_id: string; title: string; description: string }[] | null };
    if (translations) {
      transMap = new Map(translations.map((tr) => [tr.recipe_id, tr]));
    }
  }

  // Step 5: Build enriched results
  const recipes: EnrichedRecipeCard[] = data.map((r) => {
    const tr = transMap.get(r.id);
    return {
      id: r.id,
      title: tr?.title ?? r.title,
      slug: r.slug,
      description: (tr?.description ?? r.description)?.slice(0, 150) ?? '',
      difficulty: r.difficulty,
      base_type: r.base_type,
      avg_rating: r.avg_rating,
      rating_count: r.rating_count,
      prep_time_minutes: r.prep_time_minutes,
      hero_image_url: r.hero_image_url,
      categories: catMap.get(r.id) ?? [],
      models: modelMap.get(r.id) ?? [],
    };
  });

  // Step 6: Fetch facet counts (total published recipes per difficulty)
  const facetQueries = await Promise.all([
    client.from('recipes').select('id', { count: 'exact', head: true }).eq('status', 'published').eq('difficulty', 'beginner'),
    client.from('recipes').select('id', { count: 'exact', head: true }).eq('status', 'published').eq('difficulty', 'intermediate'),
    client.from('recipes').select('id', { count: 'exact', head: true }).eq('status', 'published').eq('difficulty', 'advanced'),
  ]);

  const facets: Record<string, Record<string, number>> = {
    difficulty: {
      beginner: facetQueries[0].count ?? 0,
      intermediate: facetQueries[1].count ?? 0,
      advanced: facetQueries[2].count ?? 0,
    },
  };

  return { recipes, total: count ?? 0, facets };
}

/** Get all published recipes as cards for listing pages */
export async function getPublishedRecipes(client: Client): Promise<RecipeCard[]> {
  const { data, error } = await client
    .from('recipes')
    .select(`
      id, title, slug, description, difficulty, base_type,
      hero_image_url, avg_rating, rating_count,
      prep_time_minutes, freeze_time_hours,
      author:profiles!author_id (username, display_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch recipes:', error.message);
    return [];
  }
  return (data ?? []) as unknown as RecipeCard[];
}

/** Get a single recipe with all related data by slug */
export async function getRecipeBySlug(client: Client, slug: string): Promise<RecipeWithDetails | null> {
  const { data: rawRecipe, error } = await client
    .from('recipes')
    .select(`
      *,
      author:profiles!author_id (*),
      ingredients (*),
      steps (*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !rawRecipe) return null;
  const recipe = rawRecipe as Record<string, unknown>;

  // Fetch many-to-many relations
  const recipeId = recipe.id as string;
  const [categoriesRes, tagsRes, modelsRes] = await Promise.all([
    client.from('recipe_categories').select('category:categories (*)').eq('recipe_id', recipeId) as unknown as { data: Record<string, unknown>[] | null },
    client.from('recipe_tags').select('tag:tags (*)').eq('recipe_id', recipeId) as unknown as { data: Record<string, unknown>[] | null },
    client.from('recipe_models').select('model:creami_models (*)').eq('recipe_id', recipeId) as unknown as { data: Record<string, unknown>[] | null },
  ]);

  const ingredients = (recipe.ingredients as { sort_order: number }[] ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const steps = (recipe.steps as { step_number: number }[] ?? []).sort((a, b) => a.step_number - b.step_number);

  return {
    ...recipe,
    ingredients,
    steps,
    categories: (categoriesRes.data ?? []).map((r) => r.category).filter(Boolean),
    tags: (tagsRes.data ?? []).map((r) => r.tag).filter(Boolean),
    models: (modelsRes.data ?? []).map((r) => r.model).filter(Boolean),
  } as unknown as RecipeWithDetails;
}

/** Get recipes by category slug */
export async function getRecipesByCategory(client: Client, categorySlug: string): Promise<RecipeCard[]> {
  const { data: category } = await client
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  const { data: recipeIds } = await client
    .from('recipe_categories')
    .select('recipe_id')
    .eq('category_id', category.id);

  if (!recipeIds?.length) return [];

  const { data, error } = await client
    .from('recipes')
    .select(`
      id, title, slug, description, difficulty, base_type,
      hero_image_url, avg_rating, rating_count,
      prep_time_minutes, freeze_time_hours,
      author:profiles!author_id (username, display_name, avatar_url)
    `)
    .eq('status', 'published')
    .in('id', recipeIds.map((r) => r.recipe_id))
    .order('published_at', { ascending: false });

  if (error) {
    console.warn('Supabase query error:', error.message);
    return [];
  }
  return (data ?? []) as unknown as RecipeCard[];
}

/** Get featured recipes for homepage (highest rated) */
export async function getFeaturedRecipes(client: Client, limit = 6): Promise<RecipeCard[]> {
  const { data, error } = await client
    .from('recipes')
    .select(`
      id, title, slug, description, difficulty, base_type,
      hero_image_url, avg_rating, rating_count,
      prep_time_minutes, freeze_time_hours,
      author:profiles!author_id (username, display_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('avg_rating', { ascending: false })
    .order('rating_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('Supabase query error:', error.message);
    return [];
  }
  return (data ?? []) as unknown as RecipeCard[];
}

/** Get all published recipe slugs (for static generation) */
export async function getAllRecipeSlugs(client: Client): Promise<string[]> {
  const { data, error } = await client
    .from('recipes')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.warn('Supabase query error:', error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

/** Get all categories */
export async function getCategories(client: Client) {
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.warn('Supabase query error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get all Creami models */
export async function getCreamiModels(client: Client) {
  const { data, error } = await client
    .from('creami_models')
    .select('*')
    .order('name');

  if (error) {
    console.warn('Supabase query error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Generate a URL-safe slug from a title */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
