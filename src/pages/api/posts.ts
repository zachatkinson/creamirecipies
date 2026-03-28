import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { resolveLocale } from '../../lib/locale';
import { translatePostArray } from '../../lib/translations';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const params = url.searchParams;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(params.get('pageSize')) || 12));
  const category = params.get('category') || undefined;
  const locale = resolveLocale(params, locals as Record<string, unknown>);

  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, hero_image_url, published_at, created_at', { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ posts: [], total: 0 }), { status: 500 });
  }

  // Apply translations if non-English
  const posts = (data ?? []) as Record<string, unknown>[];
  await translatePostArray(supabase, posts, locale);

  return new Response(JSON.stringify({ posts, total: count ?? 0, page, pageSize }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  });
};
