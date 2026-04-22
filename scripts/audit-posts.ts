/**
 * Audit post_translations with two tight signals:
 *   1. EN-phrase leaks: specific English phrases appearing in non-EN translations.
 *      Signals are tightened to reduce false positives (no "Mix-In", no loanwords).
 *   2. Missing diacritics: FR/DE/PT translation body has text of length >=200 with
 *      ZERO diacritic characters. (ES skipped — Spanish legitimately has many
 *      accent-free passages.)
 *
 * Output: data/post-flags.json with two separate categories.
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EN_PHRASES = [
  /\bif needed\b/i, /\buntil smooth\b/i, /\bmade with\b/i, /\bperfect for\b/i,
  /\bpacked with\b/i, /\binspired by\b/i, /\btreat yourself\b/i,
  /\b(cream|sugar|vanilla|chocolate|milk|butter) and (cream|sugar|vanilla|chocolate|milk|butter|allulose)\b/i,
  /\bfor a (smooth|smoother|creamy|creamier)\b/i,
  /\bin a splash\b/i, /\bof warm\b/i,
];

const DIACRITICS: Record<string, string> = {
  fr: 'àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ',
  de: 'äöüßÄÖÜ',
  pt: 'ãõáéíóúâêîôûàçÁÉÍÓÚÂÊÎÔÛÀÇÃÕ',
};

function hasDia(text: string, locale: keyof typeof DIACRITICS): boolean {
  const set = DIACRITICS[locale];
  for (const ch of text) if (set.includes(ch)) return true;
  return false;
}

function hasEnLeak(text: string): string[] {
  const hits: string[] = [];
  for (const re of EN_PHRASES) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return hits;
}

(async () => {
  const all: any[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('post_translations')
      .select('id, post_id, locale, title, excerpt, body')
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  console.log(`Total post_translations rows: ${all.length}`);

  const enLeakRows: any[] = [];
  const missingDiaRows: any[] = [];

  for (const r of all) {
    const combined = [r.title, r.excerpt, r.body].filter(Boolean).join('\n');
    const hits = hasEnLeak(combined);
    if (hits.length > 0) enLeakRows.push({ id: r.id, post_id: r.post_id, locale: r.locale, hits });

    if (r.locale !== 'es') {
      const body = r.body ?? '';
      if (body.length >= 200 && !hasDia(body, r.locale)) {
        missingDiaRows.push({
          id: r.id,
          post_id: r.post_id,
          locale: r.locale,
          title: r.title,
          body_length: body.length,
          body_preview: body.slice(0, 200),
        });
      }
    }
  }

  console.log(`\nEN-leak rows: ${enLeakRows.length}`);
  const enByLoc = new Map<string, number>();
  for (const r of enLeakRows) enByLoc.set(r.locale, (enByLoc.get(r.locale) ?? 0) + 1);
  for (const [l, n] of [...enByLoc.entries()].sort()) console.log(`  ${l}: ${n}`);

  console.log(`\nMissing-diacritic rows (body >=200 chars, zero diacritics): ${missingDiaRows.length}`);
  const diaByLoc = new Map<string, number>();
  for (const r of missingDiaRows) diaByLoc.set(r.locale, (diaByLoc.get(r.locale) ?? 0) + 1);
  for (const [l, n] of [...diaByLoc.entries()].sort()) console.log(`  ${l}: ${n}`);

  // Show 5 samples from each
  console.log('\nEN-leak samples:');
  for (const r of enLeakRows.slice(0, 5)) {
    console.log(`  [${r.locale}] hits=${r.hits.join(',')}  post_id=${r.post_id.slice(0, 8)}`);
  }
  console.log('\nMissing-diacritic samples:');
  for (const r of missingDiaRows.slice(0, 5)) {
    console.log(`  [${r.locale}] "${r.title}" (${r.body_length} chars)`);
    console.log(`    ${r.body_preview.slice(0, 150)}`);
  }

  mkdirSync('data', { recursive: true });
  writeFileSync('data/post-flags.json', JSON.stringify({ enLeakRows, missingDiaRows }, null, 2));
  console.log(`\nWrote data/post-flags.json`);
})();
