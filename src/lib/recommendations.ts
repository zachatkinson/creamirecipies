/** Similar recipe recommendations by shared categories */

import type { SupabaseClient } from '@supabase/supabase-js';
import { translateRecipeArray } from './translations';
import type { Locale } from '../i18n';

/** Fetch similar recipes based on shared category overlap */
export async function getSimilarRecipes(
  client: SupabaseClient,
  recipeId: string,
  categorySlugs: string[],
  locale: Locale,
  limit: number = 6,
): Promise<Record<string, unknown>[]> {
  if (categorySlugs.length === 0) return [];

  const { data: catIds } = await client
    .from('categories')
    .select('id')
    .in('slug', categorySlugs) as { data: { id: string }[] | null };

  if (!catIds || catIds.length === 0) return [];

  const { data: sharedLinks } = await client
    .from('recipe_categories')
    .select('recipe_id')
    .in('category_id', catIds.map((c) => c.id))
    .neq('recipe_id', recipeId) as { data: { recipe_id: string }[] | null };

  if (!sharedLinks || sharedLinks.length === 0) return [];

  // Count shared categories per recipe, pick top candidates
  const counts = new Map<string, number>();
  for (const link of sharedLinks) {
    counts.set(link.recipe_id, (counts.get(link.recipe_id) ?? 0) + 1);
  }
  const topIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit + 3) // fetch extra to filter published
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const { data: similar } = await client
    .from('recipes')
    .select('id, title, slug, description, difficulty, base_type, hero_image_url, avg_rating, rating_count, prep_time_minutes, is_sponsored, sponsor_name, sponsor_logo_url, sponsor_url')
    .in('id', topIds)
    .eq('status', 'published')
    .neq('id', recipeId)
    .limit(limit);

  if (!similar) return [];

  const recipes = similar as Record<string, unknown>[];
  await translateRecipeArray(client, recipes, locale);
  return recipes;
}
