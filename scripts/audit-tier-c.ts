/**
 * Tier C Audit — DE recipe_translations rows with clear ASCII-fallback diacritic bugs
 * that can be mechanically fixed. Each match requires verification before write.
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/audit-tier-c.ts
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

// Mechanical substitutions: ASCII fallback → proper German.
// These are chosen conservatively — each pattern must be an unambiguous error in a
// German recipe context. "Genuss" is modern-correct post-1996 reform → NOT flagged.
// Order matters slightly (longer patterns first within a topic).
const DE_FIXES: { pattern: RegExp; fix: string }[] = [
  // ue → ü
  { pattern: /\bGewuerz(\w*)\b/g, fix: 'Gewürz$1' },
  { pattern: /\bKuechen(\w*)\b/g, fix: 'Küchen$1' },
  { pattern: /\bKueche\b/g, fix: 'Küche' },
  { pattern: /\bueberrasch(\w*)\b/g, fix: 'überrasch$1' },
  { pattern: /\boefter\b/g, fix: 'öfter' },
  { pattern: /\buebliche?\b/g, fix: 'üblich' },
  { pattern: /\buebliches\b/g, fix: 'übliches' },
  { pattern: /\buebliche\b/g, fix: 'übliche' },
  { pattern: /\bnatuerlich(\w*)\b/g, fix: 'natürlich$1' },
  { pattern: /\bsuess(\w*)\b/g, fix: 'süß$1' },
  { pattern: /\bkuehl(\w*)\b/g, fix: 'kühl$1' },
  { pattern: /\bFuelle(\w*)\b/g, fix: 'Fülle$1' },
  { pattern: /\bLoeffel(\w*)\b/g, fix: 'Löffel$1' },
  { pattern: /\bKoerper(\w*)\b/g, fix: 'Körper$1' },
  { pattern: /\bkoestlich(\w*)\b/g, fix: 'köstlich$1' },
  { pattern: /\bkoennen\b/g, fix: 'können' },
  { pattern: /\bfuer\b/g, fix: 'für' },
  { pattern: /\bueber\b/g, fix: 'über' },
  { pattern: /\bStueck(\w*)\b/g, fix: 'Stück$1' },
  { pattern: /\bglueckl(\w*)\b/g, fix: 'glückl$1' },
  { pattern: /\bfluessig(\w*)\b/g, fix: 'flüssig$1' },
  { pattern: /\bverspueren(\w*)\b/g, fix: 'verspüren$1' },
  // ae → ä
  { pattern: /\bStaerke\b/g, fix: 'Stärke' },
  { pattern: /\bKaesekuchen\b/g, fix: 'Käsekuchen' },
  { pattern: /\bKaese\b/g, fix: 'Käse' },
  { pattern: /\bgaenzlich\b/g, fix: 'gänzlich' },
  { pattern: /\bangenehm(\w*)\b/g, fix: 'angenehm$1' }, // already correct, just keep
  { pattern: /\baehnlich(\w*)\b/g, fix: 'ähnlich$1' },
  { pattern: /\bPekannuessen\b/g, fix: 'Pekannüssen' },
  { pattern: /\bNuessen\b/g, fix: 'Nüssen' },
  { pattern: /\bMuerbe(\w*)\b/g, fix: 'Mürbe$1' },
  { pattern: /\bSuesse\b/g, fix: 'Süße' },
  { pattern: /\bsuesse(\w*)\b/g, fix: 'süße$1' },
  { pattern: /\bSuess(\w*)\b/g, fix: 'Süß$1' },
  { pattern: /\bausgewaehlt(\w*)\b/g, fix: 'ausgewählt$1' },
  { pattern: /\bGraessern(\w*)\b/g, fix: 'Grässern$1' },
  { pattern: /\bfaellt\b/g, fix: 'fällt' },
  { pattern: /\baeltere?\b/g, fix: 'ältere' },
  // oe → ö
  { pattern: /\bKoestlich(\w*)\b/g, fix: 'Köstlich$1' },
  { pattern: /\bschoen(\w*)\b/g, fix: 'schön$1' },
  { pattern: /\bmoeglich(\w*)\b/g, fix: 'möglich$1' },
  { pattern: /\bgroesse(r?n?)\b/g, fix: 'größe$1' },
  { pattern: /\bGroesse(\w*)\b/g, fix: 'Größe$1' },
  // ss → ß  (conservative — only proven inflections)
  { pattern: /\bgross(e[rsnm]?)?\b/g, fix: 'groß$1' },
  { pattern: /\bweiss(e[rsnm]?)?\b/g, fix: 'weiß$1' },
  { pattern: /\bSuesses\b/g, fix: 'Süßes' },
];

type Row = {
  id: string;
  recipe_id: string;
  locale: string;
  title: string | null;
  description: string | null;
};

async function fetchAll(): Promise<Row[]> {
  const all: Row[] = [];
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('id, recipe_id, locale, title, description')
      .eq('locale', 'de')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

function applyFixes(text: string): { fixed: string; changes: Array<{ from: string; to: string }> } {
  let cur = text;
  const changes: Array<{ from: string; to: string }> = [];
  for (const { pattern, fix } of DE_FIXES) {
    cur = cur.replace(pattern, (m) => {
      const out = m.replace(pattern, fix);
      if (out !== m) changes.push({ from: m, to: out });
      return out;
    });
  }
  return { fixed: cur, changes };
}

(async () => {
  const rows = await fetchAll();
  console.log(`Total DE rows: ${rows.length}`);

  const candidates: {
    id: string;
    slug?: string;
    title_before: string | null;
    title_after: string | null;
    desc_before: string | null;
    desc_after: string | null;
    changes: Array<{ from: string; to: string }>;
  }[] = [];

  for (const r of rows) {
    const titleRes = r.title ? applyFixes(r.title) : null;
    const descRes = r.description ? applyFixes(r.description) : null;
    const allChanges = [
      ...(titleRes?.changes ?? []),
      ...(descRes?.changes ?? []),
    ];
    if (allChanges.length === 0) continue;
    candidates.push({
      id: r.id,
      title_before: r.title,
      title_after: titleRes && titleRes.fixed !== r.title ? titleRes.fixed : null,
      desc_before: r.description,
      desc_after: descRes && descRes.fixed !== r.description ? descRes.fixed : null,
      changes: allChanges,
    });
  }

  // Attach slugs for display
  const recipeIds = [...new Set(candidates.map((c) => (rows.find((r) => r.id === c.id)!.recipe_id)))];
  const { data: rdata } = await supabase
    .from('recipes')
    .select('id, slug')
    .in('id', recipeIds);
  const slugMap = new Map((rdata ?? []).map((r) => [r.id, r.slug]));
  for (const c of candidates) {
    const row = rows.find((r) => r.id === c.id)!;
    c.slug = slugMap.get(row.recipe_id) ?? '(unknown)';
  }

  console.log(`Candidate rows: ${candidates.length}\n`);
  for (const c of candidates) {
    console.log(`  ${c.slug}  (${c.id})`);
    if (c.title_after) {
      console.log(`    title: ${JSON.stringify(c.title_before)}`);
      console.log(`        -> ${JSON.stringify(c.title_after)}`);
    }
    if (c.desc_after) {
      console.log(`    desc:  ${JSON.stringify(c.desc_before)}`);
      console.log(`        -> ${JSON.stringify(c.desc_after)}`);
    }
  }

  mkdirSync('data', { recursive: true });
  writeFileSync('data/tier-c-candidates.json', JSON.stringify(candidates, null, 2));
  console.log(`\nWrote ${candidates.length} candidates to data/tier-c-candidates.json`);
})();
