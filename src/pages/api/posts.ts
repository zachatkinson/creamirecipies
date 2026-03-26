import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import type { Locale } from '../../i18n';
import { SUPPORTED_LOCALES } from '../../i18n';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const params = url.searchParams;
  const page = Math.max(1, Number(params.get('page')) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(params.get('pageSize')) || 12));
  const category = params.get('category') || undefined;

  const paramLocale = params.get('locale');
  const locale = (paramLocale && SUPPORTED_LOCALES.includes(paramLocale as Locale))
    ? paramLocale as Locale
    : ((locals as Record<string, unknown>).locale as Locale ?? 'en');

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
  if (locale !== 'en' && posts.length > 0) {
    const postIds = posts.map(p => p.id as string);
    const { data: translations } = await supabase
      .from('post_translations')
      .select('post_id, title, excerpt')
      .eq('locale', locale)
      .in('post_id', postIds);

    if (translations) {
      const transMap = new Map(translations.map((t: Record<string, unknown>) => [t.post_id, t]));
      for (const post of posts) {
        const tr = transMap.get(post.id as string) as Record<string, unknown> | undefined;
        if (tr) {
          post.title = tr.title;
          if (tr.excerpt) post.excerpt = tr.excerpt;
        }
      }
    }
  }

  return new Response(JSON.stringify({ posts, total: count ?? 0, page, pageSize }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  });
};
