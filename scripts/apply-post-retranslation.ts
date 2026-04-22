/**
 * Apply a full-rewrite post translation to the DB.
 *
 * Reads data/post-retranslations/<slug>.json, updates post_translations rows
 * for each locale present in the `translations` object.
 *
 * Usage:
 *   npx tsx scripts/apply-post-retranslation.ts <slug>           # dry-run
 *   npx tsx scripts/apply-post-retranslation.ts <slug> --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function wc(s: string | null | undefined): number {
  return (s ?? '').split(/\s+/).filter(Boolean).length;
}
function paras(s: string | null | undefined): number {
  return ((s ?? '').split(/\n\n+/).filter(Boolean)).length;
}

const ACCEPTABLE: Record<string, [number, number]> = {
  fr: [0.90, 1.05],
  es: [0.85, 1.00],
  de: [0.70, 0.85],
  pt: [0.85, 1.00],
};

(async () => {
  const slug = process.argv[2];
  const apply = process.argv.includes('--apply');
  if (!slug) { console.error('usage: apply-post-retranslation.ts <slug> [--apply]'); process.exit(1); }

  const payload = JSON.parse(readFileSync(`data/post-retranslations/${slug}.json`, 'utf8'));
  const { data: post } = await supabase.from('posts').select('id, body').eq('slug', slug).single();
  if (!post) { console.error(`post not found: ${slug}`); process.exit(1); }
  const enWC = wc(post.body as string);
  const enParas = paras(post.body as string);

  for (const [locale, tr] of Object.entries<any>(payload.translations)) {
    const trWC = wc(tr.body);
    const trParas = paras(tr.body);
    const ratio = trWC / enWC;
    const paraDelta = trParas - enParas;
    const [lo, hi] = ACCEPTABLE[locale] ?? [0, 99];
    const okRatio = ratio >= lo;
    const okParas = paraDelta >= -1;
    const ok = okRatio && okParas;
    console.log(`[${locale}] ${trWC}/${enWC}w (${(ratio*100).toFixed(1)}%)  ${trParas}/${enParas}p (Δ${paraDelta})  ${ok ? 'OK' : 'FAIL'}`);
    if (!ok) {
      if (!okRatio) console.error(`  ${locale} below word-count threshold ${(lo*100).toFixed(0)}%`);
      if (!okParas) console.error(`  ${locale} paragraph count Δ${paraDelta} — translations must match EN paragraph structure`);
      process.exit(1);
    }
    if (apply) {
      const { error } = await supabase.from('post_translations').update({
        title: tr.title,
        excerpt: tr.excerpt,
        body: tr.body,
      }).eq('post_id', post.id).eq('locale', locale);
      if (error) { console.error(`  ERR ${locale}: ${error.message}`); process.exit(1); }
      console.log(`  applied`);
    }
  }
  console.log(apply ? 'Done.' : 'Dry run. Use --apply to write.');
})();
