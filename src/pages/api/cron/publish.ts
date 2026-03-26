import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Verify the request is from Vercel Cron (or has the correct secret)
  const authHeader = request.headers.get('authorization');
  const cronSecret = import.meta.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const now = new Date().toISOString();

  // Publish scheduled recipes
  const { data: publishedRecipes, error: recipeError } = await supabase
    .from('recipes')
    .update({ status: 'published' })
    .eq('status', 'draft')
    .not('published_at', 'is', null)
    .lte('published_at', now)
    .select('id, title, published_at');

  // Publish scheduled posts
  const { data: publishedPosts, error: postError } = await supabase
    .from('posts')
    .update({ status: 'published' })
    .eq('status', 'draft')
    .not('published_at', 'is', null)
    .lte('published_at', now)
    .select('id, title, published_at');

  return new Response(JSON.stringify({
    ok: true,
    timestamp: now,
    recipes: {
      published: publishedRecipes?.length ?? 0,
      error: recipeError?.message ?? null,
    },
    posts: {
      published: publishedPosts?.length ?? 0,
      error: postError?.message ?? null,
    },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
