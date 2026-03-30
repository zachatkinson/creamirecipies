import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import { buildSitemapUrls, wrapSitemapXml } from '../lib/sitemap';

export const prerender = false;

/** Recipe sitemap — all published recipes with lastmod and image tags */
export const GET: APIRoute = async () => {
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, title, updated_at, hero_image_url')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const urls = buildSitemapUrls(recipes ?? [], '/recipes', 'weekly', 0.8);

  return new Response(wrapSitemapXml(urls), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
