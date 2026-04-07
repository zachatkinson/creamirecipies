import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/sitemap';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, localePath } from '../i18n';
import { COLLECTIONS } from '../lib/collections';

export const prerender = false;

interface PageEntry {
  url: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
}

/** Static pages sitemap with hreflang for all locales */
export const GET: APIRoute = async () => {
  const today = new Date().toISOString().split('T')[0];
  const pages: PageEntry[] = [
    { url: '/', changefreq: 'daily', priority: 1.0, lastmod: today },
    { url: '/recipes', changefreq: 'daily', priority: 0.9, lastmod: today },
    ...COLLECTIONS.map((c) => ({ url: `/recipes/collection/${c.slug}`, changefreq: 'weekly' as const, priority: 0.8, lastmod: today })),
    { url: '/blog', changefreq: 'weekly', priority: 0.7, lastmod: today },
    { url: '/about', changefreq: 'monthly', priority: 0.5 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  const urls: string[] = [];

  for (const p of pages) {
    const hreflangLinks = SUPPORTED_LOCALES.map((loc) =>
      `\n    <xhtml:link rel="alternate" hreflang="${loc}" href="${SITE_URL}${localePath(p.url, loc)}" />`
    ).join('');
    const xDefault = `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${p.url}" />`;
    const lastmodTag = p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : '';

    for (const loc of SUPPORTED_LOCALES) {
      urls.push(`
  <url>
    <loc>${SITE_URL}${localePath(p.url, loc)}</loc>${lastmodTag}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${loc === DEFAULT_LOCALE ? p.priority : Math.max(p.priority - 0.1, 0.2)}</priority>${hreflangLinks}${xDefault}
  </url>`);
    }
  }

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
