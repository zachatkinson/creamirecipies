import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

(async () => {
  const slug = process.argv[2];
  if (!slug) { console.error('usage: dump-post-for-translation.ts <slug>'); process.exit(1); }
  const { data: post } = await supabase.from('posts').select('id, slug, title, excerpt, body').eq('slug', slug).single();
  if (!post) { console.error('not found'); process.exit(1); }
  const { data: trs } = await supabase.from('post_translations').select('locale, title, excerpt, body').eq('post_id', post.id);
  const payload = { post, translations: trs };
  const path = `data/post-${slug}.json`;
  writeFileSync(path, JSON.stringify(payload, null, 2));
  console.log(`wrote ${path}`);
  console.log(`EN title: ${post.title}`);
  console.log(`EN body words: ${(post.body as string).split(/\s+/).filter(Boolean).length}`);
  for (const t of trs ?? []) {
    console.log(`${t.locale}: ${(t.body as string).split(/\s+/).filter(Boolean).length} words`);
  }
})();
