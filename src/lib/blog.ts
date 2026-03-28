/** Shared blog and recipe UI constants */

/** Category badge color classes for blog post cards */
export const CATEGORY_COLORS: Record<string, string> = {
  news: 'bg-lavender/20 text-[#7B5A9E]',
  tips: 'bg-mint/20 text-[#2D6B56]',
  reviews: 'bg-vanilla/20 text-[#6B4F3E]',
  guides: 'bg-blush/20 text-berry',
};

/** Difficulty badge color classes for recipe cards */
export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-mint/40 text-[#1a6b4f]',
  intermediate: 'bg-vanilla/40 text-[#5C3D2E]',
  advanced: 'bg-blush/40 text-[#6b1d42]',
};

/** Ingredient group display order */
export const INGREDIENT_GROUP_ORDER = ['base', 'mix-ins', 'swirl', 'topping'] as const;

/** Ingredient group label translations */
export const INGREDIENT_GROUP_LABELS: Record<string, Record<string, string>> = {
  base: { en: 'Base Ingredients', fr: 'Ingredients de Base', es: 'Ingredientes Base', de: 'Grundzutaten', pt: 'Ingredientes Base' },
  'mix-ins': { en: 'Mix-Ins', fr: 'Garnitures', es: 'Complementos', de: 'Mix-Ins', pt: 'Complementos' },
  topping: { en: 'Toppings', fr: 'Garniture', es: 'Cobertura', de: 'Topping', pt: 'Cobertura' },
  swirl: { en: 'Swirl', fr: 'Spirale', es: 'Espiral', de: 'Wirbel', pt: 'Espiral' },
};
