import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import type { Locale } from '../i18n';
import { SUPPORTED_LOCALES } from '../i18n';

export const prerender = false;

const LANGUAGE_MAP: Record<Locale, string> = {
  en: 'en-us', fr: 'fr-fr', es: 'es-mx', de: 'de-de', pt: 'pt-br',
};

const SITE_DESC: Record<Locale, string> = {
  en: 'Discover and share delicious Ninja Creami recipes with step-by-step guidance and pro tips.',
  fr: 'Découvrez de délicieuses recettes Ninja Creami avec des instructions pas à pas et des astuces de pro.',
  es: 'Descubra deliciosas recetas Ninja Creami con instrucciones paso a paso y consejos profesionales.',
  de: 'Entdecken Sie köstliche Ninja Creami Rezepte mit Schritt-für-Schritt-Anleitungen und Profi-Tipps.',
  pt: 'Descubra deliciosas receitas Ninja Creami com instruções passo a passo e dicas profissionais.',
};

export const GET: APIRoute = async ({ url, locals }) => {
  // Detect locale from cookie or query param
  const paramLocale = url.searchParams.get('lang');
  const locale: Locale = (paramLocale && SUPPORTED_LOCALES.includes(paramLocale as Locale))
    ? paramLocale as Locale
    : ((locals as Record<string, unknown>).locale as Locale ?? 'en');

  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, title, slug, description, published_at, base_type')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50) as { data: { id: string; title: string; slug: string; description: string; published_at: string; base_type: string }[] | null };

  // Apply translations if non-English
  const recipeList = recipes ?? [];
  if (locale !== 'en' && recipeList.length > 0) {
    const recipeIds = recipeList.map(r => r.id);
    const { data: translations } = await supabase
      .from('recipe_translations')
      .select('recipe_id, title, description')
      .eq('locale', locale)
      .in('recipe_id', recipeIds) as { data: { recipe_id: string; title: string; description: string }[] | null };

    if (translations) {
      const transMap = new Map(translations.map(t => [t.recipe_id, t]));
      for (const recipe of recipeList) {
        const tr = transMap.get(recipe.id);
        if (tr) {
          recipe.title = tr.title;
          recipe.description = tr.description;
        }
      }
    }
  }

  const siteUrl = 'https://creami.recipes';
  const items = recipeList
    .map(
      (r) => `
    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${siteUrl}/recipes/${r.slug}</link>
      <description><![CDATA[${r.description}]]></description>
      <pubDate>${new Date(r.published_at ?? Date.now()).toUTCString()}</pubDate>
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
    <description>${SITE_DESC[locale]}</description>
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
