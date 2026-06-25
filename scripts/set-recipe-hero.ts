/**
 * Set hero_image_url on a recipe by slug.
 * Usage: npx tsx scripts/set-recipe-hero.ts <slug> <url>
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error('Usage: set-recipe-hero.ts <slug> <url>');
  process.exit(1);
}

(async () => {
  const { data, error } = await supabase
    .from('recipes')
    .update({ hero_image_url: url })
    .eq('slug', slug)
    .select('slug, title, hero_image_url');
  if (error) { console.error(error); process.exit(1); }
  console.log(JSON.stringify(data, null, 2));
})();
