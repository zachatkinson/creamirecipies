/** Nutrition calculation from master ingredients */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface NutritionTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface IngredientWithMaster {
  master_ingredient_id: string | null;
  amount: string;
  unit: string | null;
}

/** Convert an ingredient amount + unit to approximate grams */
function toGrams(amount: number, unit: string): number {
  switch (unit) {
    case 'cup': return amount * 240;
    case 'tablespoon': return amount * 15;
    case 'teaspoon': return amount * 5;
    case 'oz': return amount * 28;
    case 'g': return amount;
    default: return amount * 30;
  }
}

/** Calculate total nutrition from recipe ingredients linked to master ingredients */
export async function calculateNutrition(
  client: SupabaseClient,
  ingredients: IngredientWithMaster[],
): Promise<NutritionTotals> {
  const masterIngIds = ingredients
    .filter((i) => i.master_ingredient_id)
    .map((i) => i.master_ingredient_id as string);

  if (masterIngIds.length === 0) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }

  const { data: nutritionData } = await client
    .from('master_ingredients')
    .select('id, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g')
    .in('id', masterIngIds)
    .not('calories_per_100g', 'is', null) as {
      data: { id: string; calories_per_100g: number; protein_per_100g: number; fat_per_100g: number; carbs_per_100g: number }[] | null;
    };

  if (!nutritionData) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }

  const nutritionMap = new Map(nutritionData.map((n) => [n.id, n]));
  let calories = 0, protein = 0, fat = 0, carbs = 0;

  for (const ing of ingredients) {
    const nutrition = nutritionMap.get(ing.master_ingredient_id);
    if (!nutrition) continue;
    const amount = parseFloat(ing.amount) || 0;
    const unit = (ing.unit || '').toLowerCase();
    const factor = toGrams(amount, unit) / 100;
    calories += nutrition.calories_per_100g * factor;
    protein += nutrition.protein_per_100g * factor;
    fat += nutrition.fat_per_100g * factor;
    carbs += nutrition.carbs_per_100g * factor;
  }

  return { calories, protein, fat, carbs };
}
