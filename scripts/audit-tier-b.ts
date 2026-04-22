/**
 * Tier B Audit — rows where target-locale text has no diacritics despite
 * being long enough that it should. Indicates machine-translation bleed
 * with accent stripping.
 *
 * Skips ES (Spanish has many valid accent-free words; too noisy).
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/audit-tier-b.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DIACRITICS: Record<string, string> = {
  fr: 'àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ',
  de: 'äöüßÄÖÜ',
  pt: 'ãõáéíóúâêîôûàçÁÉÍÓÚÂÊÎÔÛÀÇÃÕ',
};

const MIN_LEN = 40;

type Row = {
  id: string;
  recipe_id: string;
  locale: string;
  title: string | null;
  description: string | null;
};

async function fetchAll(locales: string[]): Promise<Row[]> {
  const all: Row[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('id, recipe_id, locale, title, description')
      .in('locale', locales)
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  return all;
}

function hasDiacritic(text: string, locale: keyof typeof DIACRITICS): boolean {
  const set = DIACRITICS[locale];
  for (const ch of text) if (set.includes(ch)) return true;
  return false;
}

(async () => {
  const rows = await fetchAll(['fr', 'de', 'pt']);
  console.log(`Fetched ${rows.length} rows (fr/de/pt)\n`);

  const flagged: Array<{
    id: string;
    recipe_id: string;
    locale: string;
    field: 'title' | 'description';
    text: string;
  }> = [];

  const byLocale = new Map<string, { total: number; flagged: number }>();

  for (const r of rows) {
    const locale = r.locale as keyof typeof DIACRITICS;
    if (!DIACRITICS[locale]) continue;
    byLocale.set(locale, {
      total: (byLocale.get(locale)?.total ?? 0) + 1,
      flagged: byLocale.get(locale)?.flagged ?? 0,
    });

    for (const field of ['title', 'description'] as const) {
      const text = r[field];
      if (!text || text.length < MIN_LEN) continue;
      if (!hasDiacritic(text, locale)) {
        flagged.push({ id: r.id, recipe_id: r.recipe_id, locale, field, text });
      }
    }
  }

  // Recompute flagged-row counts (not flag counts) per locale
  const flaggedRowIds = new Map<string, Set<string>>();
  for (const f of flagged) {
    if (!flaggedRowIds.has(f.locale)) flaggedRowIds.set(f.locale, new Set());
    flaggedRowIds.get(f.locale)!.add(f.id);
  }

  console.log('Per-locale scope:');
  for (const [loc, n] of [...byLocale.entries()].sort()) {
    const rowsFlagged = flaggedRowIds.get(loc)?.size ?? 0;
    console.log(`  ${loc}: ${rowsFlagged} rows flagged (of ${n.total} total)`);
  }

  console.log(`\nTotal flag events (title or description): ${flagged.length}`);
  const uniqueRows = new Set(flagged.map((f) => f.id));
  console.log(`Unique rows flagged: ${uniqueRows.size}`);

  mkdirSync('data', { recursive: true });
  writeFileSync('data/tier-b-flags.json', JSON.stringify(flagged, null, 2));
  console.log(`\nWrote ${flagged.length} flags to data/tier-b-flags.json`);

  // Quick length distribution
  console.log('\nSample text lengths:');
  const samples = flagged.slice(0, 5);
  for (const s of samples) {
    console.log(`  ${s.locale} ${s.field} (${s.text.length} chars): ${s.text.slice(0, 100)}${s.text.length > 100 ? '...' : ''}`);
  }
})();
