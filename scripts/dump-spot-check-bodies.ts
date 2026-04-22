import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
function wc(s: string | null | undefined) { return (s ?? '').split(/\s+/).filter(Boolean).length; }
function paraSplit(s: string | null | undefined) { return ((s ?? '').split(/\n\n+/).filter(Boolean)); }

const SLUGS = [
  'coconut-milk-vs-coconut-cream',
  'memorial-day-ice-cream-bar-bbq',
  'greek-yogurt-creami-best-practices',
  'how-much-sugar-creami-ice-cream',
  'christmas-ice-cream-festive-flavors',
  'new-years-eve-champagne-cocktail-ice-cream',
  'color-presentation-tips-creami',
  'comparing-all-ninja-creami-models',
  'creami-cookbook-reviews',
  'ninja-creami-gift-guide',
  'right-way-add-mix-ins',
  'pint-storage-lids-solutions',
];

(async () => {
  for (const slug of SLUGS) {
    const { data: post } = await supabase.from('posts').select('id, title, excerpt, body').eq('slug', slug).single();
    if (!post) continue;
    const { data: trs } = await supabase.from('post_translations').select('locale, title, excerpt, body').eq('post_id', post.id);
    const data = {
      slug,
      en: { title: post.title, excerpt: post.excerpt, body: post.body, wc: wc(post.body as string), paras: paraSplit(post.body as string).length },
      trs: Object.fromEntries((trs ?? []).map(t => [t.locale, {
        title: t.title,
        excerpt: t.excerpt,
        body: t.body,
        wc: wc(t.body as string),
        paras: paraSplit(t.body as string).length,
      }])),
    };
    writeFileSync(`data/spot-check/${slug}.json`, JSON.stringify(data, null, 2));
  }
  console.log('dumped 12 posts to data/spot-check/');
})();
