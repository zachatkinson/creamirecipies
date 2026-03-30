/** Shared sitemap utilities */

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, localePath, type Locale } from '../i18n';

/** Escape special XML characters */
export function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const SITE_URL = 'https://eatcreami.com';

interface SitemapItem {
  slug: string;
  title: string;
  updated_at: string;
  hero_image_url: string | null;
}

/** Build hreflang xhtml:link tags for a path across all locales */
function buildHreflangLinks(path: string): string {
  const links = SUPPORTED_LOCALES.map((loc) =>
    `\n    <xhtml:link rel="alternate" hreflang="${loc}" href="${SITE_URL}${localePath(path, loc)}" />`
  ).join('');
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}" />`;
}

/** Build sitemap URL entries for all locales with hreflang cross-references */
export function buildSitemapUrls(
  items: SitemapItem[],
  basePath: string,
  changefreq: 'daily' | 'weekly' | 'monthly',
  priority: number,
): string {
  const allUrls: string[] = [];

  for (const item of items) {
    const lastmod = new Date(item.updated_at).toISOString().split('T')[0];
    const itemPath = `${basePath}/${item.slug}`;
    const imageTag = item.hero_image_url
      ? `\n    <image:image>\n      <image:loc>${SITE_URL}${item.hero_image_url}</image:loc>\n      <image:title>${escapeXml(item.title)}</image:title>\n    </image:image>`
      : '';
    const hreflangLinks = buildHreflangLinks(itemPath);

    // Generate a URL entry for each locale
    for (const loc of SUPPORTED_LOCALES) {
      const locUrl = `${SITE_URL}${localePath(itemPath, loc)}`;
      allUrls.push(`
  <url>
    <loc>${locUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${loc === DEFAULT_LOCALE ? priority : priority - 0.1}</priority>${imageTag}${hreflangLinks}
  </url>`);
    }
  }

  return allUrls.join('');
}

/** Wrap URL entries in a full sitemap XML document */
export function wrapSitemapXml(urls: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}
