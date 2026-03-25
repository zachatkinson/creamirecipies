import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, RecipeWithDetails, RecipeCard } from './types';

type Client = SupabaseClient<Database>;

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
  const { data: recipe, error } = await client
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

  if (error || !recipe) return null;

  // Fetch many-to-many relations
  const [categoriesRes, tagsRes, modelsRes] = await Promise.all([
    client
      .from('recipe_categories')
      .select('category:categories (*)')
      .eq('recipe_id', recipe.id),
    client
      .from('recipe_tags')
      .select('tag:tags (*)')
      .eq('recipe_id', recipe.id),
    client
      .from('recipe_models')
      .select('model:creami_models (*)')
      .eq('recipe_id', recipe.id),
  ]);

  return {
    ...recipe,
    ingredients: (recipe.ingredients ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    steps: (recipe.steps ?? []).sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number),
    categories: (categoriesRes.data ?? []).map((r: Record<string, unknown>) => r.category).filter(Boolean),
    tags: (tagsRes.data ?? []).map((r: Record<string, unknown>) => r.tag).filter(Boolean),
    models: (modelsRes.data ?? []).map((r: Record<string, unknown>) => r.model).filter(Boolean),
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
