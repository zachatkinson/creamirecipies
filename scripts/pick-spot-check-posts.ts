import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
function wc(s: string | null | undefined) { return (s ?? '').split(/\s+/).filter(Boolean).length; }

const LOCALES = ['fr','es','de','pt'] as const;
const MIN: Record<string, number> = { fr: 0.85, es: 0.80, de: 0.65, pt: 0.80 };

(async () => {
  const { data: drafts } = await supabase.from('posts').select('id, slug, title, category, published_at, body').eq('status', 'draft').order('published_at', { ascending: true });
  if (!drafts) return;

  const { data: trs } = await supabase.from('post_translations').select('post_id, locale, body');
  const byPL = new Map<string, string>();
  for (const t of trs ?? []) byPL.set(`${t.post_id}__${t.locale}`, (t.body as string) ?? '');

  const rows = drafts.map(d => {
    const enWC = wc(d.body as string);
    const ratios: Record<string, number> = {};
    const flags: string[] = [];
    for (const loc of LOCALES) {
      const tr = byPL.get(`${d.id}__${loc}`) ?? '';
      const r = enWC === 0 ? 0 : wc(tr) / enWC;
      ratios[loc] = r;
      if (r < MIN[loc]) flags.push(loc);
    }
    return { ...d, enWC, ratios, flags };
  });

  // Print 12 to spot check: mix of flagged + clean across categories + publish dates
  // Pick 6 flagged (highest # of flagged locales) and 6 clean (all locales clean)
  const flagged = rows.filter(r => r.flags.length > 0).sort((a,b) => b.flags.length - a.flags.length);
  const clean = rows.filter(r => r.flags.length === 0);
  const pick = [
    ...flagged.slice(0, 4),
    ...flagged.slice(Math.floor(flagged.length / 2), Math.floor(flagged.length / 2) + 2),
    ...clean.slice(0, 2),
    ...clean.slice(Math.floor(clean.length / 2), Math.floor(clean.length / 2) + 2),
    ...clean.slice(-2),
  ].slice(0, 12);

  console.log('Spot-check slate (12 posts):\n');
  for (const p of pick) {
    const rstr = LOCALES.map(l => `${l}:${(p.ratios[l]*100).toFixed(0)}%${p.flags.includes(l) ? '!' : ''}`).join(' ');
    console.log(`  ${p.slug}`);
    console.log(`    ${p.category ?? '-'} | pub ${p.published_at?.slice(0,10) ?? '?'} | EN ${p.enWC}w | ${rstr}`);
  }
})();
