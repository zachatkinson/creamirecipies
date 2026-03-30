import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/sitemap';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, localePath } from '../i18n';

export const prerender = false;

/** Static pages sitemap with hreflang for all locales */
export const GET: APIRoute = async () => {
  const pages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/recipes', changefreq: 'daily', priority: 0.9 },
    { url: '/blog', changefreq: 'weekly', priority: 0.7 },
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

    for (const loc of SUPPORTED_LOCALES) {
      urls.push(`
  <url>
    <loc>${SITE_URL}${localePath(p.url, loc)}</loc>
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
