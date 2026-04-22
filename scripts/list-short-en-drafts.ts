import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
function wc(s: string | null | undefined) { return (s ?? '').split(/\s+/).filter(Boolean).length; }

(async () => {
  const { data } = await supabase.from('posts').select('id, slug, title, status, published_at, body').eq('status', 'draft').order('published_at', { ascending: true });
  if (!data) return;
  const short = data.filter(p => wc(p.body as string) < 1000).sort((a,b) => wc(a.body as string) - wc(b.body as string));
  console.log(`Drafts with <1000 EN word body: ${short.length}\n`);
  for (const p of short) {
    console.log(`  [${wc(p.body as string)}] ${p.slug} — pub ${p.published_at ?? 'null'}`);
    console.log(`    ${p.title}`);
  }
})();
