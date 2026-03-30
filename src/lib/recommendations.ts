/** Similar recipe recommendations by shared categories + ingredients */

import type { SupabaseClient } from '@supabase/supabase-js';
import { translateRecipeArray } from './translations';
import type { Locale } from '../i18n';

const RECIPE_SELECT = 'id, title, slug, description, difficulty, base_type, hero_image_url, avg_rating, rating_count, prep_time_minutes, is_sponsored, sponsor_name, sponsor_logo_url, sponsor_url';

/** Fetch similar recipes scored by category + ingredient overlap, with base_type fallback */
export async function getSimilarRecipes(
  client: SupabaseClient,
  recipeId: string,
  categorySlugs: string[],
  locale: Locale,
  limit: number = 6,
  baseType?: string,
  masterIngredientIds?: string[],
): Promise<Record<string, unknown>[]> {
  const scores = new Map<string, number>();

  // Score by shared categories (weight: 2 per shared category)
  if (categorySlugs.length > 0) {
    const { data: catIds } = await client
      .from('categories')
      .select('id')
      .in('slug', categorySlugs) as { data: { id: string }[] | null };

    if (catIds && catIds.length > 0) {
      const { data: sharedLinks } = await client
        .from('recipe_categories')
        .select('recipe_id')
        .in('category_id', catIds.map((c) => c.id))
        .neq('recipe_id', recipeId) as { data: { recipe_id: string }[] | null };

      if (sharedLinks) {
        for (const link of sharedLinks) {
          scores.set(link.recipe_id, (scores.get(link.recipe_id) ?? 0) + 2);
        }
      }
    }
  }

  // Score by shared master ingredients (weight: 1 per shared ingredient)
  if (masterIngredientIds && masterIngredientIds.length > 0) {
    const { data: sharedIngs } = await client
      .from('ingredients')
      .select('recipe_id')
      .in('master_ingredient_id', masterIngredientIds)
      .neq('recipe_id', recipeId) as { data: { recipe_id: string }[] | null };

    if (sharedIngs) {
      for (const ing of sharedIngs) {
        scores.set(ing.recipe_id, (scores.get(ing.recipe_id) ?? 0) + 1);
      }
    }
  }

  // Get top candidates by combined score
  let recipes: Record<string, unknown>[] = [];
  if (scores.size > 0) {
    const topIds = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit * 5)
      .map(([id]) => id);

    const { data: similar } = await client
      .from('recipes')
      .select(RECIPE_SELECT)
      .in('id', topIds)
      .eq('status', 'published')
      .neq('id', recipeId)
      .limit(limit);

    if (similar) recipes = similar as Record<string, unknown>[];
  }

  // Fallback: fill remaining slots with same base_type
  if (recipes.length < limit && baseType) {
    const existingIds = new Set(recipes.map((r) => r.id as string));
    existingIds.add(recipeId);

    const { data: fallback } = await client
      .from('recipes')
      .select(RECIPE_SELECT)
      .eq('status', 'published')
      .eq('base_type', baseType)
      .not('id', 'in', `(${[...existingIds].join(',')})`)
      .order('avg_rating', { ascending: false })
      .limit(limit - recipes.length);

    if (fallback) recipes = [...recipes, ...(fallback as Record<string, unknown>[])];
  }

  await translateRecipeArray(client, recipes, locale);
  return recipes;
}
