import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
function paras(s: string | null | undefined): number { return ((s ?? '').split(/\n\n+/).filter(Boolean)).length; }
function wc(s: string | null | undefined): number { return (s ?? '').split(/\s+/).filter(Boolean).length; }

const SLUGS = [
  'easter-ice-cream-pastel-treats-spring-flavors',
  '5-common-creami-mistakes',
  'best-greek-yogurts-frozen-yogurt',
  'best-containers-batch-prepping',
  'best-kitchen-scales-creami',
  'best-nut-butters-ninja-creami',
  'best-protein-powders-creami',
];

(async () => {
  const { data: posts } = await supabase.from('posts').select('id, slug, title, published_at, body').in('slug', SLUGS);
  if (!posts) return;
  posts.sort((a,b) => (a.published_at as string).localeCompare(b.published_at as string));
  for (const p of posts) {
    const { data: trs } = await supabase.from('post_translations').select('locale, body').eq('post_id', p.id);
    const ep = paras(p.body as string); const ew = wc(p.body as string);
    console.log(`\n${p.slug}`);
    console.log(`  published: ${p.published_at?.slice(0,10)}  title: ${p.title}`);
    console.log(`  EN: ${ew}w, ${ep} paras`);
    for (const t of trs ?? []) {
      const tp = paras(t.body as string); const tw = wc(t.body as string);
      const delta = tp - ep; const ratio = (tw/ew*100).toFixed(0);
      const severity = delta <= -5 ? 'SEVERE' : delta <= -3 ? 'MOD' : delta <= -1 ? 'MARG' : 'OK';
      console.log(`  ${t.locale}: ${tw}w (${ratio}%), ${tp} paras (Δ${delta}) — ${severity}`);
    }
  }
})();
