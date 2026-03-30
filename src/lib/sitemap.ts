/** Shared sitemap utilities */

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

/** Build sitemap URL entries from a list of content items */
export function buildSitemapUrls(
  items: SitemapItem[],
  basePath: string,
  changefreq: 'daily' | 'weekly' | 'monthly',
  priority: number,
): string {
  return items.map((item) => {
    const lastmod = new Date(item.updated_at).toISOString().split('T')[0];
    const imageTag = item.hero_image_url
      ? `
    <image:image>
      <image:loc>${SITE_URL}${item.hero_image_url}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
    </image:image>`
      : '';
    return `
  <url>
    <loc>${SITE_URL}${basePath}/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>`;
  }).join('');
}

/** Wrap URL entries in a full sitemap XML document */
export function wrapSitemapXml(urls: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}
