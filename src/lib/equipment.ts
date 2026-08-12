import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from '../i18n';

/**
 * Recipe-page equipment box: selects a small set of catalog products relevant
 * to a recipe. Always leads with the machine, then up to two products matched
 * against the recipe's (English) ingredient names, padded with extra pints.
 */

export interface EquipmentProduct {
  asin: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

export const MACHINE_ASIN = 'B08QXB9BH5'; // Ninja CREAMi 7-in-1
export const PINTS_ASIN = 'B0B8JXV17Y'; // Pint container 4-pack
export const MAX_EQUIPMENT_ITEMS = 3;

/**
 * Ingredient-to-product rules, in priority order. Distinctive ingredients come
 * first; near-universal ones (cocoa, peanut butter, cream cheese, vanilla) come
 * last so they don't crowd out the recipe-specific matches.
 */
const INGREDIENT_RULES: ReadonlyArray<{ asin: string; pattern: RegExp }> = [
  { asin: 'B07YBTWGPM', pattern: /allulose/i },
  { asin: 'B002TG3QPO', pattern: /protein powder|whey/i },
  { asin: 'B000EDK7ZQ', pattern: /xanthan/i },
  { asin: 'B000B6KRJW', pattern: /peppermint extract/i },
  { asin: 'B000JLLDCE', pattern: /molasses/i },
  { asin: 'B075RH833R', pattern: /cookie butter|biscoff/i },
  { asin: 'B00017028M', pattern: /flaky (sea )?salt|maldon/i },
  { asin: 'B07NVY89WP', pattern: /condensed milk/i },
  { asin: 'B00WTR0CDM', pattern: /greek yogurt/i },
  { asin: 'B0042FVLMK', pattern: /coconut (milk|cream)/i },
  { asin: 'B0199CJ8K2', pattern: /caramel sauce|dulce de leche/i },
  { asin: 'B00CMQD3VS', pattern: /\bhoney\b/i },
  { asin: 'B00DUF219A', pattern: /espresso|instant coffee/i },
  { asin: 'B0052WPB3C', pattern: /cocoa/i },
  { asin: 'B009LI2CKI', pattern: /peanut butter/i },
  { asin: 'B01N6PM4AI', pattern: /cream cheese/i },
  { asin: 'B006OD5ISG', pattern: /vanilla bean paste/i },
  { asin: 'B000VDSTV8', pattern: /vanilla extract/i },
];

/**
 * Pure selection logic: machine first, then the highest-priority ingredient
 * matches, padded with the pint 4-pack up to MAX_EQUIPMENT_ITEMS.
 */
export function selectEquipmentAsins(ingredientNames: string[]): string[] {
  const asins: string[] = [MACHINE_ASIN];

  for (const rule of INGREDIENT_RULES) {
    if (asins.length >= MAX_EQUIPMENT_ITEMS) break;
    if (ingredientNames.some((name) => rule.pattern.test(name))) {
      asins.push(rule.asin);
    }
  }

  if (asins.length < MAX_EQUIPMENT_ITEMS) {
    asins.push(PINTS_ASIN);
  }

  return asins;
}

/**
 * Themed equipment sets for collection hub pages: three products that fit the
 * hub's category. Soft serve leads with the Scoop & Swirl; everything else
 * leads with the 7-in-1.
 */
export const COLLECTION_EQUIPMENT: Readonly<Record<string, readonly string[]>> = {
  'protein-ice-cream': [MACHINE_ASIN, 'B002TG3QPO', 'B00H4KDZZ6'],
  'ice-cream': [MACHINE_ASIN, 'B01N6PM4AI', PINTS_ASIN],
  'sorbet': [MACHINE_ASIN, 'B007TUQF9O', PINTS_ASIN],
  'gelato': [MACHINE_ASIN, 'B0DZXPN7JQ', 'B006OD5ISG'],
  'frozen-yogurt': [MACHINE_ASIN, 'B00WTR0CDM', 'B00CMQD3VS'],
  'milkshake': [MACHINE_ASIN, 'B000VDSTV8', 'B0199CJ8K2'],
  'smoothie-bowl': [MACHINE_ASIN, 'B00JB2QS7C', 'B00CMQD3VS'],
  'lite-ice-cream': [MACHINE_ASIN, 'B07YBTWGPM', 'B000EDK7ZQ'],
  'italian-ice': [MACHINE_ASIN, 'B007TUQF9O', PINTS_ASIN],
  'soft-serve': ['B0DSJW8SFG', 'B000E1DSG8', 'B08464TZV5'],
};

/**
 * Fetch localized product data for the selected ASINs, preserving selection
 * order. Falls back to English name/description when no translation exists.
 */
export async function getEquipmentProducts(
  client: SupabaseClient,
  ingredientNames: string[],
  locale: Locale,
): Promise<EquipmentProduct[]> {
  return fetchProductsByAsins(client, selectEquipmentAsins(ingredientNames), locale);
}

/**
 * Fetch the themed equipment set for a collection hub. Returns an empty array
 * for collections without a configured set.
 */
export async function getCollectionEquipment(
  client: SupabaseClient,
  collectionSlug: string,
  locale: Locale,
): Promise<EquipmentProduct[]> {
  const asins = COLLECTION_EQUIPMENT[collectionSlug];
  if (!asins || asins.length === 0) return [];
  return fetchProductsByAsins(client, [...asins], locale);
}

async function fetchProductsByAsins(
  client: SupabaseClient,
  asins: string[],
  locale: Locale,
): Promise<EquipmentProduct[]> {
  const { data: products } = await client
    .from('products')
    .select('asin, name, description, image_url')
    .in('asin', asins);
  if (!products || products.length === 0) return [];

  const byAsin = new Map(products.map((p) => [p.asin as string, p as EquipmentProduct]));

  if (locale !== 'en') {
    const { data: translations } = await client
      .from('product_translations')
      .select('asin, name, description')
      .in('asin', asins)
      .eq('locale', locale);
    for (const t of translations ?? []) {
      const product = byAsin.get(t.asin as string);
      if (product) {
        product.name = t.name as string;
        if (t.description) product.description = t.description as string;
      }
    }
  }

  return asins
    .map((asin) => byAsin.get(asin))
    .filter((p): p is EquipmentProduct => Boolean(p));
}
