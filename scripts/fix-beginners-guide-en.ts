import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const apply = process.argv.includes('--apply');
(async () => {
  const { data: post } = await supabase.from('posts').select('id, body').eq('slug', 'beginners-guide-ninja-creami').single();
  if (!post) { console.error('not found'); process.exit(1); }
  const body = post.body as string;
  const first = body.indexOf('## What Is the Ninja Creami?');
  const second = body.indexOf('## What Is the Ninja Creami?', first + 5);
  if (second === -1) { console.error('no duplicate found'); process.exit(1); }
  const cleaned = body.slice(second);
  console.log(`Old: ${body.length} chars, ${(body.match(/\n\n/g) || []).length + 1} paras`);
  console.log(`New: ${cleaned.length} chars, ${(cleaned.match(/\n\n/g) || []).length + 1} paras`);
  if (apply) {
    const { error } = await supabase.from('posts').update({ body: cleaned }).eq('id', post.id);
    if (error) { console.error(`ERR: ${error.message}`); process.exit(1); }
    console.log('EN body updated');
  } else console.log('Dry run — use --apply');
})();
