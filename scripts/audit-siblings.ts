/**
 * Audit the sibling translation tables: posts, master_ingredients (name columns),
 * and step_translations.
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/audit-siblings.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EN_COMPOUNDS = [
  /\bice cream\b/i,
  /\bsoft serve\b/i,
  /\bfrozen yogurt\b/i,
  /\bpeanut butter\b/i,
  /\balmond butter\b/i,
  /\bcashew butter\b/i,
  /\bchocolate chip(?:s)?\b/i,
  /\bwhite chocolate\b/i,
  /\bdark chocolate\b/i,
  /\bbrown sugar\b/i,
  /\bpowdered sugar\b/i,
  /\bheavy cream\b/i,
  /\bwhole milk\b/i,
  /\bgraham cracker(?:s)?\b/i,
  /\bcookie dough\b/i,
  /\bcream cheese\b/i,
  /\bmaple syrup\b/i,
  /\bcaramel sauce\b/i,
  /\bhot fudge\b/i,
  /\bmarshmallow fluff\b/i,
  /\bmade with\b/i,
  /\bperfect for\b/i,
  /\bpacked with\b/i,
  /\binspired by\b/i,
];

const DIACRITICS: Record<string, string> = {
  fr: 'àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ',
  de: 'äöüßÄÖÜ',
  pt: 'ãõáéíóúâêîôûàçÁÉÍÓÚÂÊÎÔÛÀÇÃÕ',
};

function hasCompound(text: string): boolean {
  for (const re of EN_COMPOUNDS) if (re.test(text)) return true;
  return false;
}

function missingDiacritics(text: string, locale: keyof typeof DIACRITICS): boolean {
  if (text.length < 40) return false;
  const set = DIACRITICS[locale];
  for (const ch of text) if (set.includes(ch)) return false;
  return true;
}

async function fetchAll<T>(table: string, cols: string): Promise<T[]> {
  const all: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select(cols).range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as any));
    if (data.length < 1000) break;
    from += 1000;
  }
  return all;
}

(async () => {
  console.log('=== post_translations (blog posts) ===');
  const ptrans = await fetchAll<any>('post_translations', 'id, post_id, locale, title, excerpt, body');
  const { data: allPostsData } = await supabase.from('posts').select('id, slug, status');
  const postMap = new Map((allPostsData ?? []).map((p) => [p.id, p]));
  console.log(`  total post_translations: ${ptrans.length}, total posts: ${postMap.size}`);
  const postStats: Record<string, { enLeaks: number; missingDia: number; count: number }> = {};
  for (const loc of ['fr', 'es', 'de', 'pt']) {
    let enLeaks = 0, missingDia = 0, count = 0;
    for (const p of ptrans) {
      if (p.locale !== loc) continue;
      count++;
      for (const text of [p.title, p.excerpt, p.body]) {
        if (!text) continue;
        if (hasCompound(text)) { enLeaks++; break; }
      }
      if (loc !== 'es') {
        for (const text of [p.title, p.excerpt, p.body]) {
          if (!text || text.length < 40) continue;
          if (missingDiacritics(text, loc as any)) { missingDia++; break; }
        }
      }
    }
    postStats[loc] = { enLeaks, missingDia, count };
  }
  for (const [loc, s] of Object.entries(postStats)) {
    console.log(`  ${loc}: ${s.count} translations, ${s.enLeaks} EN-leak suspects, ${s.missingDia} missing-diacritic suspects`);
  }

  console.log('\n=== master_ingredients (name_* columns) ===');
  const mis = await fetchAll<any>('master_ingredients', 'id, slug, name, name_fr, name_es, name_de, name_pt');
  console.log(`  total ingredients: ${mis.length}`);
  const miStats: Record<string, { enLeaks: number; missing: number; sample: string[] }> = {};
  for (const loc of ['fr', 'es', 'de', 'pt']) {
    let enLeaks = 0, missing = 0;
    const sample: string[] = [];
    for (const m of mis) {
      const text = m[`name_${loc}`];
      if (!text) { missing++; continue; }
      if (hasCompound(text) || /\b(the|and|with|for)\b/i.test(text)) {
        enLeaks++;
        if (sample.length < 5) sample.push(`${m.slug}: ${text}`);
      }
    }
    miStats[loc] = { enLeaks, missing, sample };
  }
  for (const [loc, s] of Object.entries(miStats)) {
    console.log(`  ${loc}: ${s.enLeaks} EN-leak suspects, ${s.missing} missing translations`);
    for (const ex of s.sample) console.log(`    e.g. ${ex}`);
  }

  console.log('\n=== step_translations ===');
  const steps = await fetchAll<any>('step_translations', 'id, instruction_en, instruction_fr, instruction_es, instruction_de, instruction_pt, hint_en, hint_fr, hint_es, hint_de, hint_pt');
  console.log(`  total step rows: ${steps.length}`);
  const stepStats: Record<string, { enLeaks: number; missingDia: number; missing: number }> = {};
  for (const loc of ['fr', 'es', 'de', 'pt']) {
    let enLeaks = 0, missingDia = 0, missing = 0;
    for (const s of steps) {
      const instr = s[`instruction_${loc}`];
      const hint = s[`hint_${loc}`];
      if (!instr && !hint) { missing++; continue; }
      for (const text of [instr, hint]) {
        if (!text) continue;
        if (hasCompound(text)) { enLeaks++; break; }
      }
      if (loc !== 'es') {
        for (const text of [instr, hint]) {
          if (!text || text.length < 40) continue;
          if (missingDiacritics(text, loc as any)) { missingDia++; break; }
        }
      }
    }
    stepStats[loc] = { enLeaks, missingDia, missing };
  }
  for (const [loc, s] of Object.entries(stepStats)) {
    console.log(`  ${loc}: ${s.enLeaks} EN leaks, ${s.missingDia} missing-diacritic, ${s.missing} unpopulated`);
  }
})();
