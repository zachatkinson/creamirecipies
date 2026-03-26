import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const prerender = false;

const siteUrl = 'https://eatcreami.com';

/** Blog sitemap — all published posts with lastmod and image tags */
export const GET: APIRoute = async () => {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, updated_at, hero_image_url')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const urls = (posts ?? []).map((p) => {
    const lastmod = new Date(p.updated_at).toISOString().split('T')[0];
    const imageTag = p.hero_image_url
      ? `
    <image:image>
      <image:loc>${siteUrl}${p.hero_image_url}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
    </image:image>`
      : '';
    return `
  <url>
    <loc>${siteUrl}/blog/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${imageTag}
  </url>`;
  }).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
