/**
 * Dump all Tier A hits — recipe_translations rows where title or description contains
 * an English noun phrase. Include the recipe slug + English source title/description
 * so we have full context for hand-translation.
 *
 * Writes: data/tier-a-hits.json
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/dump-tier-a.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EN_COMPOUNDS: { re: RegExp; label: string }[] = [
  { re: /\bice cream\b/i, label: 'ice cream' },
  { re: /\bsoft serve\b/i, label: 'soft serve' },
  { re: /\bfrozen yogurt\b/i, label: 'frozen yogurt' },
  { re: /\bfrozen yoghurt\b/i, label: 'frozen yoghurt' },
  { re: /\bpeanut butter\b/i, label: 'peanut butter' },
  { re: /\balmond butter\b/i, label: 'almond butter' },
  { re: /\bcashew butter\b/i, label: 'cashew butter' },
  { re: /\bchocolate chip(?:s)?\b/i, label: 'chocolate chip(s)' },
  { re: /\bwhite chocolate\b/i, label: 'white chocolate' },
  { re: /\bdark chocolate\b/i, label: 'dark chocolate' },
  { re: /\bbrown sugar\b/i, label: 'brown sugar' },
  { re: /\bpowdered sugar\b/i, label: 'powdered sugar' },
  { re: /\bheavy cream\b/i, label: 'heavy cream' },
  { re: /\bwhole milk\b/i, label: 'whole milk' },
  { re: /\bgraham cracker(?:s)?\b/i, label: 'graham cracker(s)' },
  { re: /\bcookie dough\b/i, label: 'cookie dough' },
  { re: /\bcream cheese\b/i, label: 'cream cheese' },
  { re: /\bmaple syrup\b/i, label: 'maple syrup' },
  { re: /\bcaramel sauce\b/i, label: 'caramel sauce' },
  { re: /\bchocolate sauce\b/i, label: 'chocolate sauce' },
  { re: /\bhot fudge\b/i, label: 'hot fudge' },
  { re: /\bmarshmallow fluff\b/i, label: 'marshmallow fluff' },
  { re: /\bcookie butter\b/i, label: 'cookie butter' },
  { re: /\bcookies and cream\b/i, label: 'cookies and cream' },
  { re: /\bmade with\b/i, label: 'made with' },
  { re: /\bperfect for\b/i, label: 'perfect for' },
  { re: /\bpacked with\b/i, label: 'packed with' },
  { re: /\binspired by\b/i, label: 'inspired by' },
  { re: /\btreat yourself\b/i, label: 'treat yourself' },
];

type TRow = {
  id: string;
  recipe_id: string;
  locale: string;
  title: string | null;
  description: string | null;
};

type RRow = {
  id: string;
  slug: string | null;
  title: string | null;
  description: string | null;
};

async function fetchAllTranslations(): Promise<TRow[]> {
  const all: TRow[] = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('id, recipe_id, locale, title, description')
      .in('locale', ['fr', 'es', 'de', 'pt'])
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function fetchRecipes(ids: string[]): Promise<Map<string, RRow>> {
  const map = new Map<string, RRow>();
  const chunk = 500;
  for (let i = 0; i < ids.length; i += chunk) {
    const slice = ids.slice(i, i + chunk);
    const { data, error } = await supabase
      .from('recipes')
      .select('id, slug, title, description')
      .in('id', slice);
    if (error) throw error;
    for (const r of data ?? []) map.set(r.id, r);
  }
  return map;
}

(async () => {
  const rows = await fetchAllTranslations();
  const hits: {
    id: string;
    recipe_id: string;
    slug: string | null;
    locale: string;
    en_title: string | null;
    en_description: string | null;
    current_title: string | null;
    current_description: string | null;
    labels_title: string[];
    labels_description: string[];
  }[] = [];

  const hitRecipeIds = new Set<string>();

  for (const r of rows) {
    const labelsTitle: string[] = [];
    const labelsDesc: string[] = [];
    if (r.title) {
      for (const { re, label } of EN_COMPOUNDS) {
        if (re.test(r.title)) labelsTitle.push(label);
      }
    }
    if (r.description) {
      for (const { re, label } of EN_COMPOUNDS) {
        if (re.test(r.description)) labelsDesc.push(label);
      }
    }
    if (labelsTitle.length || labelsDesc.length) {
      hits.push({
        id: r.id,
        recipe_id: r.recipe_id,
        slug: null,
        locale: r.locale,
        en_title: null,
        en_description: null,
        current_title: r.title,
        current_description: r.description,
        labels_title: labelsTitle,
        labels_description: labelsDesc,
      });
      hitRecipeIds.add(r.recipe_id);
    }
  }

  const recipes = await fetchRecipes([...hitRecipeIds]);
  for (const h of hits) {
    const rec = recipes.get(h.recipe_id);
    if (rec) {
      h.slug = rec.slug;
      h.en_title = rec.title;
      h.en_description = rec.description;
    }
  }

  // Sort by locale, then by slug for consistent review order
  hits.sort((a, b) => {
    const ll = a.locale.localeCompare(b.locale);
    if (ll !== 0) return ll;
    return (a.slug ?? '').localeCompare(b.slug ?? '');
  });

  const outPath = 'data/tier-a-hits.json';
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(hits, null, 2));
  console.log(`Wrote ${hits.length} hits to ${outPath}`);

  // Per-locale counts
  const byLoc = new Map<string, number>();
  for (const h of hits) byLoc.set(h.locale, (byLoc.get(h.locale) ?? 0) + 1);
  for (const [l, n] of [...byLoc.entries()].sort()) {
    console.log(`  ${l}: ${n}`);
  }
})();
