/** Allergen detection from ingredient lists */
import type { Ingredient } from './types';

const ALLERGEN_KEYWORDS: Record<string, string[]> = {
  Dairy: ['cream', 'milk', 'yogurt', 'cheese', 'butter', 'eggnog', 'mascarpone', 'condensed milk', 'evaporated milk'],
  Nuts: ['almond', 'pecan', 'walnut', 'cashew', 'hazelnut', 'pistachio', 'macadamia'],
  Peanuts: ['peanut'],
  Gluten: ['cookie', 'cracker', 'wafer', 'cereal', 'pretzel', 'ladyfinger', 'shortbread', 'biscoff', 'brownie', 'cake', 'graham'],
  Eggs: ['egg', 'eggnog'],
  Soy: ['soy'],
  Sesame: ['sesame', 'tahini'],
};

const DAIRY_FREE_PREFIXES = ['coconut', 'almond', 'oat', 'cashew', 'dairy-free', 'vegan'];
const NUT_FALSE_POSITIVES = ['milk', 'extract'];
const BUTTER_FALSE_POSITIVES = ['cookie butter', 'peanut butter', 'almond butter', 'cashew butter'];

/**
 * Detect allergens from a list of ingredients.
 * Handles false positives like "coconut cream" (not dairy) and "almond milk" (not nuts).
 */
export function detectAllergens(ingredients: Ingredient[]): string[] {
  const detected: string[] = [];
  const ingredientText = ingredients.map((i) => i.name.toLowerCase()).join(' ');

  for (const [allergen, keywords] of Object.entries(ALLERGEN_KEYWORDS)) {
    if (!keywords.some((kw) => ingredientText.includes(kw))) continue;

    if (allergen === 'Dairy') {
      const hasDairy = ingredients.some((i) => {
        const n = i.name.toLowerCase();
        const matchesDairy = n.includes('cream') || n.includes('milk') || n.includes('yogurt') ||
          n.includes('cheese') || n.includes('butter') || n.includes('eggnog') || n.includes('mascarpone');
        if (!matchesDairy) return false;
        const isFalsePositive = DAIRY_FREE_PREFIXES.some((p) => n.includes(p)) ||
          BUTTER_FALSE_POSITIVES.some((p) => n.includes(p));
        return !isFalsePositive;
      });
      if (hasDairy) detected.push(allergen);
    } else if (allergen === 'Nuts') {
      const hasNuts = ingredients.some((i) => {
        const n = i.name.toLowerCase();
        return keywords.some((kw) => n.includes(kw)) &&
          !NUT_FALSE_POSITIVES.some((fp) => n.includes(fp));
      });
      if (hasNuts) detected.push(allergen);
    } else {
      detected.push(allergen);
    }
  }

  return detected;
}
