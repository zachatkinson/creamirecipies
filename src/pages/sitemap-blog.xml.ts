import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import { buildSitemapUrls, wrapSitemapXml } from '../lib/sitemap';

export const prerender = false;

/** Blog sitemap — all published posts with lastmod and image tags */
export const GET: APIRoute = async () => {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, updated_at, hero_image_url')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const urls = buildSitemapUrls(posts ?? [], '/blog', 'monthly', 0.6);

  return new Response(wrapSitemapXml(urls), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
