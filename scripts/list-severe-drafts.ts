import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
function paras(s: string | null | undefined): number { return ((s ?? '').split(/\n\n+/).filter(Boolean)).length; }
function wc(s: string | null | undefined): number { return (s ?? '').split(/\s+/).filter(Boolean).length; }

(async () => {
  const { data: posts } = await supabase.from('posts').select('id, slug, title, status, published_at, body').eq('status', 'draft').order('published_at', { ascending: true });
  if (!posts) return;

  const { data: trs } = await supabase.from('post_translations').select('post_id, locale, body');
  const byPL = new Map<string, string>();
  for (const t of trs ?? []) byPL.set(`${t.post_id}__${t.locale}`, (t.body as string) ?? '');

  const severeDrafts: Array<{ slug: string; title: string; published_at: string; enParas: number; severeLocales: string[] }> = [];
  for (const p of posts) {
    const ep = paras(p.body as string);
    const severeLocales: string[] = [];
    for (const loc of ['fr','es','de','pt']) {
      const tp = paras(byPL.get(`${p.id}__${loc}`) ?? '');
      if (ep - tp >= 5) severeLocales.push(`${loc}(Δ${tp - ep})`);
    }
    if (severeLocales.length > 0) {
      severeDrafts.push({
        slug: p.slug as string,
        title: p.title as string,
        published_at: (p.published_at as string)?.slice(0,10) ?? '?',
        enParas: ep,
        severeLocales,
      });
    }
  }

  console.log(`Severe drafts: ${severeDrafts.length}\n`);
  for (const d of severeDrafts) {
    console.log(`  ${d.published_at}  ${d.slug}  (${d.enParas}p)`);
    console.log(`    ${d.severeLocales.join(', ')}`);
  }
})();
