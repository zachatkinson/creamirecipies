import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import type { Locale } from '../i18n';
import { t } from '../i18n';
import { resolveLocale } from '../lib/locale';
import { translateRecipeArray } from '../lib/translations';

export const prerender = false;

const LANGUAGE_MAP: Record<Locale, string> = {
  en: 'en-us', fr: 'fr-fr', es: 'es-mx', de: 'de-de', pt: 'pt-br',
};

export const GET: APIRoute = async ({ url, locals }) => {
  const locale = resolveLocale(url.searchParams, locals);
  const siteDesc = t('footer.description', locale);

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, slug, description, published_at, base_type')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50) as { data: { id: string; title: string; slug: string; description: string; published_at: string; base_type: string }[] | null };

  // Apply translations if non-English
  const recipeList = (recipes ?? []) as Record<string, unknown>[];
  await translateRecipeArray(supabase, recipeList, locale);

  const siteUrl = 'https://eatcreami.com';
  const items = recipeList
    .map(
      (r) => `
    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${siteUrl}/recipes/${r.slug}</link>
      <description><![CDATA[${r.description}]]></description>
      <pubDate>${new Date((r.published_at as string) ?? Date.now()).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/recipes/${r.slug}</guid>
      <category>${r.base_type}</category>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Creami Recipes</title>
    <link>${siteUrl}</link>
    <description>${siteDesc}</description>
    <language>${LANGUAGE_MAP[locale]}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml${locale !== 'en' ? `?lang=${locale}` : ''}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
