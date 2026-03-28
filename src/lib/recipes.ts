import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, RecipeWithDetails, RecipeCard, CreamiModel } from './types';
import type { Locale } from '../i18n';

type Client = SupabaseClient<Database>;

/** Helper to cast Supabase join query results that TypeScript can't infer */
type JoinResult = { data: Record<string, unknown>[] | null };

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
  'soft-serve': 'Soft Serve',
};

export interface RecipeQueryParams {
  q?: string;
  base?: string[];
  difficulty?: string[];
  flavor?: string[];
  dietary?: string[];
  tag?: string[];
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
    q, base, difficulty, flavor, dietary, tag, model, rating,
    sort = 'newest', page = 1, pageSize = 24, locale = 'en',
  } = params;

  // Step 1: Resolve search IDs (for text search across translations)
  let searchIds: string[] | null = null;
  if (q) {
    const ids = new Set<string>();

    // Search English titles/descriptions
    let enPage = 0;
    while (true) {
      const { data: batch } = await client
        .from('recipes')
        .select('id')
        .eq('status', 'published')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .range(enPage * 1000, (enPage + 1) * 1000 - 1) as { data: { id: string }[] | null };
      if (!batch || batch.length === 0) break;
      for (const r of batch) ids.add(r.id);
      if (batch.length < 1000) break;
      enPage++;
    }

    // Also search translations if non-English
    if (locale !== 'en') {
      let trPage = 0;
      while (true) {
        const { data: batch } = await client
          .from('recipe_translations')
          .select('recipe_id')
          .eq('locale', locale)
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .range(trPage * 1000, (trPage + 1) * 1000 - 1) as { data: { recipe_id: string }[] | null };
        if (!batch || batch.length === 0) break;
        for (const r of batch) ids.add(r.recipe_id);
        if (batch.length < 1000) break;
        trPage++;
      }
    }

    searchIds = ids.size > 0 ? [...ids] : [];
    if (searchIds.length === 0) return { recipes: [], total: 0, facets: {} };
  }

  // Step 2: Use Postgres RPC for filtered, paginated recipe IDs
  // This handles junction table joins server-side, avoiding URL length limits
  const categorySlugs = [...(flavor ?? []), ...(dietary ?? []), ...(tag ?? [])];
  const baseTypeNames = (base && base.length > 0)
    ? base.map((s) => BASE_TYPE_FROM_SLUG[s]).filter(Boolean)
    : null;

  const { data: rpcResult, error: rpcError } = await client.rpc('get_filtered_recipe_ids', {
    p_status: 'published',
    p_base_types: baseTypeNames ?? undefined,
    p_difficulties: (difficulty && difficulty.length > 0) ? difficulty : undefined,
    p_category_slugs: categorySlugs.length > 0 ? categorySlugs : undefined,
    p_model_slugs: (model && model.length > 0) ? model : undefined,
    p_min_rating: (rating && rating > 0) ? rating : undefined,
    p_search_ids: searchIds ?? undefined,
    p_sort: sort,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize,
  });

  if (rpcError || !rpcResult) {
    console.warn('getFilteredRecipes RPC error:', rpcError?.message);
    return { recipes: [], total: 0, facets: {} };
  }

  const totalCount = rpcResult.length > 0 ? Number(rpcResult[0].total_count) : 0;
  const recipeIds = rpcResult.map((r) => r.recipe_id);

  if (recipeIds.length === 0) return { recipes: [], total: totalCount, facets: {} };

  // Step 3: Fetch full recipe data for just this page of IDs (max 48)
  const { data: rawData } = await client
    .from('recipes')
    .select('id, title, slug, description, difficulty, base_type, hero_image_url, avg_rating, rating_count, prep_time_minutes')
    .in('id', recipeIds) as { data: { id: string; title: string; slug: string; description: string; difficulty: string; base_type: string; hero_image_url: string | null; avg_rating: number; rating_count: number; prep_time_minutes: number | null }[] | null };

  if (!rawData) return { recipes: [], total: totalCount, facets: {} };

  // Preserve the sort order from the RPC
  const orderMap = new Map(recipeIds.map((id, i) => [id, i]));
  const data = rawData.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
  const pageIds = data.map((r) => r.id);
  if (pageIds.length === 0) return { recipes: [], total: totalCount, facets: {} };

  // Step 3: Enrich with categories and models (only for this page of results)
  const [catRes, modelRes] = await Promise.all([
    client.from('recipe_categories').select('recipe_id, category:categories (slug)').in('recipe_id', pageIds) as unknown as JoinResult,
    client.from('recipe_models').select('recipe_id, model:creami_models (slug)').in('recipe_id', pageIds) as unknown as JoinResult,
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
      .in('recipe_id', pageIds) as { data: { recipe_id: string; title: string; description: string }[] | null };
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

  return { recipes, total: totalCount, facets };
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
  return (data ?? []) as RecipeCard[];
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
    client.from('recipe_categories').select('category:categories (*)').eq('recipe_id', recipeId) as unknown as JoinResult,
    client.from('recipe_tags').select('tag:tags (*)').eq('recipe_id', recipeId) as unknown as JoinResult,
    client.from('recipe_models').select('model:creami_models (*)').eq('recipe_id', recipeId) as unknown as JoinResult,
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
  } as RecipeWithDetails;
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
  return (data ?? []) as RecipeCard[];
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
  return (data ?? []) as RecipeCard[];
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
export async function getCreamiModels(client: Client): Promise<CreamiModel[]> {
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
