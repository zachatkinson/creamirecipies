/**
 * Dump PT Tier B rows (stripped diacritics) for hand-rewrite.
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/dump-tier-b-pt.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PT_DIACRITICS = 'ãõáéíóúâêîôûàçÁÉÍÓÚÂÊÎÔÛÀÇÃÕ';
const MIN_LEN = 40;

function hasDiacritic(text: string): boolean {
  for (const ch of text) if (PT_DIACRITICS.includes(ch)) return true;
  return false;
}

(async () => {
  const all: Array<{ id: string; recipe_id: string; title: string | null; description: string | null }> = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('id, recipe_id, title, description')
      .eq('locale', 'pt')
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }

  const flagged: Array<{
    id: string;
    recipe_id: string;
    slug: string | null;
    en_title: string | null;
    en_description: string | null;
    current_title: string | null;
    current_description: string | null;
    title_needs_fix: boolean;
    desc_needs_fix: boolean;
  }> = [];

  for (const r of all) {
    const titleBad = !!(r.title && r.title.length >= MIN_LEN && !hasDiacritic(r.title));
    const descBad = !!(r.description && r.description.length >= MIN_LEN && !hasDiacritic(r.description));
    if (!titleBad && !descBad) continue;
    flagged.push({
      id: r.id,
      recipe_id: r.recipe_id,
      slug: null,
      en_title: null,
      en_description: null,
      current_title: r.title,
      current_description: r.description,
      title_needs_fix: titleBad,
      desc_needs_fix: descBad,
    });
  }

  const recipeIds = [...new Set(flagged.map((f) => f.recipe_id))];
  const rmap = new Map<string, { slug: string; title: string; description: string }>();
  for (let i = 0; i < recipeIds.length; i += 50) {
    const slice = recipeIds.slice(i, i + 50);
    const { data, error } = await supabase
      .from('recipes')
      .select('id, slug, title, description')
      .in('id', slice);
    if (error) console.error(error);
    for (const r of data ?? []) rmap.set(r.id, { slug: r.slug, title: r.title, description: r.description });
  }
  for (const f of flagged) {
    const r = rmap.get(f.recipe_id);
    if (r) { f.slug = r.slug; f.en_title = r.title; f.en_description = r.description; }
  }

  flagged.sort((a, b) => (a.slug ?? '').localeCompare(b.slug ?? ''));
  mkdirSync('data', { recursive: true });
  writeFileSync('data/tier-b-pt-dump.json', JSON.stringify(flagged, null, 2));
  console.log(`Wrote ${flagged.length} PT rows to data/tier-b-pt-dump.json`);
})();
