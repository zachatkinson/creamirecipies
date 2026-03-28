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

/** Base type slug-to-DB-name mapping */
export const BASE_TYPE_FROM_SLUG: Record<string, string> = {
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

/** Base type translated display names (for FAQs, SEO) */
export const BASE_TYPE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'ice cream': { en: 'ice cream', fr: 'creme glacee', es: 'helado', de: 'Eiscreme', pt: 'sorvete' },
  'sorbet': { en: 'sorbet', fr: 'sorbet', es: 'sorbete', de: 'Sorbet', pt: 'sorbet' },
  'gelato': { en: 'gelato', fr: 'gelato', es: 'gelato', de: 'Gelato', pt: 'gelato' },
  'frozen yogurt': { en: 'frozen yogurt', fr: 'yaourt glace', es: 'yogur helado', de: 'Frozen Joghurt', pt: 'iogurte gelado' },
  'milkshake': { en: 'milkshake', fr: 'milkshake', es: 'batido', de: 'Milkshake', pt: 'milkshake' },
  'smoothie bowl': { en: 'smoothie bowl', fr: 'smoothie bowl', es: 'smoothie bowl', de: 'Smoothie Bowl', pt: 'smoothie bowl' },
  'lite ice cream': { en: 'lite ice cream', fr: 'creme glacee legere', es: 'helado ligero', de: 'leichtes Eis', pt: 'sorvete light' },
  'italian ice': { en: 'italian ice', fr: 'granite italien', es: 'hielo italiano', de: 'italienisches Eis', pt: 'granita italiana' },
  'soft serve': { en: 'soft serve', fr: 'glace molle', es: 'helado suave', de: 'Softeis', pt: 'sorvete soft' },
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
