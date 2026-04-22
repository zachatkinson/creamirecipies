/**
 * Audit step_translations for genuinely broken rows only.
 *
 * Signals (any one triggers a flag):
 *   1. English function/content words appearing as standalone tokens in non-EN text.
 *      Example: "Dissolvez espresso powder in a splash of warm milk" — "in", "a", "of"
 *      appear as isolated tokens. Clean French like "Chauffer le lait" has none.
 *   2. For PT: broken Portuguglish phrases like "bata all ingredients".
 *
 * Loanwords (cream cheese, cookie dough, graham cracker, frozen yogurt, cookies and
 * cream, Ice Cream as machine name) are allowed.
 *
 * Run: source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/audit-steps.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Conservative set of English-only function words — these should not appear as standalone
// tokens in legitimate FR/ES/DE/PT text (some overlap like "a" = FR/PT; handled below).
const EN_WORDS_BY_LOCALE: Record<string, RegExp[]> = {
  // FR: skip "a" (means "has"), "the", "and" → "et", etc.
  // Common: skip "Mix" (→ Mix-In feature), skip "In"/"in" (product name),
  // skip "the" (too common in brand names), skip "for" (in "for a", "for X")
  // Keep multi-word phrases and high-signal single English words.
  fr: [
    /\bif needed\b/i, /\buntil smooth\b/i, /\ball ingredients\b/i,
    /\bwarm milk\b/i, /\bcold water\b/i, /\bhot fudge\b/i, /\bespresso powder\b/i,
    /\bin a splash\b/i, /\bof warm\b/i, /\bfor extra\b/i, /\bfor a\b/i,
    /\b(cream|sugar|vanilla|butter|milk|chocolate) and\b/i,
    /\band (cream|sugar|vanilla|butter|milk|chocolate|allulose|salt)\b/i,
    /\bRelancez (if|once|twice|for)\b/i, /\bRelancez (jusqu|au)?\b.{0,3}(once|twice|if)\b/i,
    /\bAjoutez (cream|sugar|vanilla|chocolate|salt) /i,
  ],
  es: [
    /\bif needed\b/i, /\buntil smooth\b/i, /\ball ingredients\b/i,
    /\bwarm milk\b/i, /\bespresso powder\b/i, /\bin a splash\b/i,
    /\bof warm\b/i, /\bfor extra\b/i, /\bfor a smooth\b/i,
    /\b(cream|sugar|vanilla|butter|milk|chocolate) and\b/i,
    /\band (cream|sugar|vanilla|butter|milk|chocolate|allulose|salt)\b/i,
    /\bAgregue (cream|sugar|vanilla|chocolate) /i,
  ],
  de: [
    /\bif needed\b/i, /\buntil smooth\b/i, /\ball ingredients\b/i,
    /\bwarm milk\b/i, /\bespresso powder\b/i, /\bin a splash\b/i,
    /\bof warm\b/i, /\bfor extra\b/i, /\bfor a smooth\b/i,
    /\b(cream|sugar|vanilla|butter|milk|chocolate) and\b/i,
    /\band (cream|sugar|vanilla|butter|milk|chocolate|allulose|salt)\b/i,
    /\bFügen Sie (cream|sugar|vanilla|chocolate) /i,
  ],
  pt: [
    /\bif needed\b/i, /\buntil smooth\b/i, /\ball ingredients\b/i,
    /\bwarm milk\b/i, /\bespresso powder\b/i, /\bin a splash\b/i,
    /\bof warm\b/i, /\bfor extra\b/i, /\bfor a smooth\b/i,
    /\bdissolves\b/i, /\bmelts\b/i, /\bcombined\b/i,
    /\b(cream|sugar|vanilla|butter|milk|chocolate) and\b/i,
    /\band (cream|sugar|vanilla|butter|milk|chocolate|allulose|salt)\b/i,
    /\baté .{0,30} dissolves?\b/i, /\bbata all\b/i,
    /\bAdicione (cream|sugar|vanilla|chocolate) /i,
  ],
};

function flag(text: string | null, locale: keyof typeof EN_WORDS_BY_LOCALE): string[] {
  if (!text) return [];
  const hits: string[] = [];
  for (const re of EN_WORDS_BY_LOCALE[locale]) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return hits;
}

type Row = {
  id: string;
  instruction_en: string | null;
  instruction_fr: string | null;
  instruction_es: string | null;
  instruction_de: string | null;
  instruction_pt: string | null;
  hint_en: string | null;
  hint_fr: string | null;
  hint_es: string | null;
  hint_de: string | null;
  hint_pt: string | null;
};

(async () => {
  const all: Row[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('step_translations')
      .select('*')
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as any));
    if (data.length < 1000) break;
    from += 1000;
  }
  console.log(`Total step_translations rows: ${all.length}`);

  const flagged: Array<{
    id: string;
    instruction_en: string | null;
    hint_en: string | null;
    locale: string;
    field: 'instruction' | 'hint';
    current: string;
    hits: string[];
  }> = [];

  for (const row of all) {
    for (const locale of ['fr', 'es', 'de', 'pt'] as const) {
      for (const field of ['instruction', 'hint'] as const) {
        const text = row[`${field}_${locale}`] as string | null;
        if (!text) continue;
        const hits = flag(text, locale);
        if (hits.length > 0) {
          flagged.push({
            id: row.id,
            instruction_en: row.instruction_en,
            hint_en: row.hint_en,
            locale,
            field,
            current: text,
            hits,
          });
        }
      }
    }
  }

  console.log(`Flagged events: ${flagged.length}`);
  const perLocale = new Map<string, number>();
  for (const f of flagged) perLocale.set(f.locale, (perLocale.get(f.locale) ?? 0) + 1);
  for (const [loc, n] of [...perLocale.entries()].sort()) console.log(`  ${loc}: ${n}`);

  mkdirSync('data', { recursive: true });
  writeFileSync('data/step-flags.json', JSON.stringify(flagged, null, 2));
  console.log(`\nWrote ${flagged.length} flags to data/step-flags.json`);

  // Show 15 samples
  console.log('\nSamples:');
  for (const f of flagged.slice(0, 15)) {
    console.log(`  [${f.locale}/${f.field}] hits=${f.hits.join(',')}`);
    console.log(`    current: ${f.current}`);
    console.log(`    en: ${f.instruction_en}`);
  }
})();
