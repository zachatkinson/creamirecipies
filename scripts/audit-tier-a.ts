/**
 * Tier A Audit — fresh heuristic over recipe_translations for English noun-phrase leaks.
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/audit-tier-a.ts
 */

import { createClient } from '@supabase/supabase-js';

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

(async () => {
  const rows = await fetchAll();
  console.log(`Total rows (fr/es/de/pt): ${rows.length}`);

  const hits: { row: Row; field: 'title' | 'description'; labels: string[]; text: string }[] = [];
  const phraseCounts = new Map<string, number>();
  const localeCounts = new Map<string, number>();

  for (const r of rows) {
    for (const field of ['title', 'description'] as const) {
      const text = r[field];
      if (!text) continue;
      const labels: string[] = [];
      for (const { re, label } of EN_COMPOUNDS) {
        if (re.test(text)) labels.push(label);
      }
      if (labels.length) {
        hits.push({ row: r, field, labels, text });
        for (const l of labels) phraseCounts.set(l, (phraseCounts.get(l) ?? 0) + 1);
        localeCounts.set(r.locale, (localeCounts.get(r.locale) ?? 0) + 1);
      }
    }
  }

  console.log(`\nTotal hits (title+description, any row): ${hits.length}`);
  console.log('\nBy locale:');
  for (const [loc, n] of [...localeCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${loc}: ${n}`);
  }

  console.log('\nBy phrase:');
  for (const [p, n] of [...phraseCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n.toString().padStart(4)}  ${p}`);
  }

  // Unique rows (one row can have hits in both title and description)
  const uniqueRowIds = new Set(hits.map((h) => h.row.id));
  console.log(`\nUnique row IDs: ${uniqueRowIds.size}`);
})();
