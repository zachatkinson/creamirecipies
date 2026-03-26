import type { APIRoute } from 'astro';

export const prerender = false;

const siteUrl = 'https://eatcreami.com';

/** Static pages sitemap */
export const GET: APIRoute = async () => {
  const pages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/recipes', changefreq: 'daily', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.7' },
    { url: '/about', changefreq: 'monthly', priority: '0.5' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  ];

  const urls = pages.map((p) => `
  <url>
    <loc>${siteUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
