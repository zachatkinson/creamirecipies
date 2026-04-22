/**
 * Extract unique lowercase words from the 28 stripped-accent posts, per locale.
 * Used to build accent-restoration dictionaries.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  const flags = JSON.parse(readFileSync('data/post-flags.json', 'utf8'));
  const ids = flags.missingDiaRows.map((r: any) => r.id);
  const { data } = await supabase.from('post_translations').select('*').in('id', ids);

  const byLocale: Record<string, Map<string, number>> = { fr: new Map(), de: new Map(), pt: new Map() };
  for (const r of data ?? []) {
    const words = (r.body ?? '').toLowerCase().match(/[a-z'-]+/g) ?? [];
    for (const w of words) {
      if (w.length < 3) continue;
      byLocale[r.locale].set(w, (byLocale[r.locale].get(w) ?? 0) + 1);
    }
  }

  for (const [loc, map] of Object.entries(byLocale)) {
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 150);
    writeFileSync(`data/stripped-words-${loc}.txt`,
      sorted.map(([w, n]) => `${n}\t${w}`).join('\n'));
    console.log(`${loc}: ${map.size} unique words, top 150 saved`);
  }
})();
