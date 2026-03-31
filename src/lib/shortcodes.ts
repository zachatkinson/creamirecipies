import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from '../i18n';
import { t, localePath } from '../i18n';
import { ui } from './translations';
import { AMAZON_TAG } from './affiliate';

interface Product {
  asin: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface ProductTranslation {
  name: string;
  description: string | null;
}

interface RecipeShortcodeData {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  base_type: string;
  hero_image_url: string | null;
  avg_rating: number;
  rating_count: number;
  prep_time_minutes: number | null;
}

interface RecipeShortcodeTranslation {
  title: string;
  description: string;
}

// Cache products in memory for the duration of a request
let productCache: Map<string, Product> | null = null;
let translationCache: Map<string, ProductTranslation> | null = null;
let cacheLocale: string | null = null;

// Cache recipes by slug for the duration of a request
let recipeCache: Map<string, RecipeShortcodeData> | null = null;
let recipeTranslationCache: Map<string, RecipeShortcodeTranslation> | null = null;
let recipeCacheLocale: string | null = null;

async function loadProducts(client: SupabaseClient): Promise<Map<string, Product>> {
  if (productCache) return productCache;
  const { data } = await client.from('products').select('asin, name, description, image_url');
  productCache = new Map((data ?? []).map((p) => [p.asin, p]));
  return productCache;
}

async function loadTranslations(client: SupabaseClient, locale: Locale): Promise<Map<string, ProductTranslation>> {
  if (translationCache && cacheLocale === locale) return translationCache;
  if (locale === 'en') {
    translationCache = new Map();
    cacheLocale = locale;
    return translationCache;
  }
  const { data } = await client.from('product_translations').select('asin, name, description').eq('locale', locale);
  translationCache = new Map((data ?? []).map((t) => [t.asin, t]));
  cacheLocale = locale;
  return translationCache;
}

function renderCard(product: Product, translation: ProductTranslation | undefined, locale: Locale): string {
  const name = translation?.name ?? product.name;
  const desc = translation?.description ?? product.description ?? '';
  const imageUrl = product.image_url ?? `/images/products/${product.asin}.avif`;
  const cta = t('shop.viewOnAmazon', locale);

  const descHtml = desc ? `<span class="text-slate-600 text-xs">${desc}</span><br/>` : '';

  return `<a href="https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}" rel="sponsored nofollow" target="_blank" class="not-prose flex items-center gap-4 p-3 my-3 bg-white border border-slate-200 rounded-xl no-underline transition-shadow hover:shadow-md"><img src="${imageUrl}" alt="${name}" class="w-20 h-20 object-contain rounded-lg shrink-0" loading="lazy" /><span class="flex-1"><strong class="text-chocolate block">${name}</strong>${descHtml}<span class="text-berry text-sm">${cta} &rarr;</span></span></a>`;
}

async function loadRecipes(client: SupabaseClient, slugs: string[]): Promise<Map<string, RecipeShortcodeData>> {
  if (recipeCache) return recipeCache;
  const { data } = await client
    .from('recipes')
    .select('id, slug, title, description, difficulty, base_type, hero_image_url, avg_rating, rating_count, prep_time_minutes')
    .in('slug', slugs)
    .eq('status', 'published');
  recipeCache = new Map((data ?? []).map((r) => [r.slug, r]));
  return recipeCache;
}

async function loadRecipeTranslations(
  client: SupabaseClient,
  recipeIds: string[],
  locale: Locale,
): Promise<Map<string, RecipeShortcodeTranslation>> {
  if (recipeTranslationCache && recipeCacheLocale === locale) return recipeTranslationCache;
  if (locale === 'en') {
    recipeTranslationCache = new Map();
    recipeCacheLocale = locale;
    return recipeTranslationCache;
  }
  const { data } = await client
    .from('recipe_translations')
    .select('recipe_id, title, description')
    .in('recipe_id', recipeIds)
    .eq('locale', locale);
  recipeTranslationCache = new Map((data ?? []).map((t) => [t.recipe_id, t]));
  recipeCacheLocale = locale;
  return recipeTranslationCache;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'background-color: rgba(169,224,198,0.4); color: #1a6b4f;',
  intermediate: 'background-color: rgba(248,228,175,0.4); color: #5C3D2E;',
  advanced: 'background-color: rgba(248,200,220,0.4); color: #6b1d42;',
};

function renderRecipeCard(recipe: RecipeShortcodeData, translation: RecipeShortcodeTranslation | undefined, locale: Locale): string {
  const title = translation?.title ?? recipe.title;
  const desc = translation?.description ?? recipe.description ?? '';
  const diffStyle = DIFFICULTY_COLORS[recipe.difficulty] ?? '';
  const diffLabel = ui(recipe.difficulty as 'beginner' | 'intermediate' | 'advanced', locale);
  const baseLabel = ui(recipe.base_type as Parameters<typeof ui>[0], locale);
  const prepLabel = ui('prep', locale).toLowerCase();
  const heroUrl = recipe.hero_image_url;

  const imageHtml = heroUrl
    ? `<img src="${heroUrl}" alt="${title}" width="600" height="450" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />`
    : `<div class="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blush/20 to-lavender/20">🍦</div>`;

  const stars = renderStars(recipe.avg_rating);
  const prepHtml = recipe.prep_time_minutes ? `<span>⏱ ${recipe.prep_time_minutes}m ${prepLabel}</span>` : '';

  return `<a href="${localePath(`/recipes/${recipe.slug}`, locale)}" class="not-prose recipe-card group block relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 no-underline my-4"><div class="aspect-[4/3] bg-cream-dark overflow-hidden">${imageHtml}</div><div class="p-5"><div class="flex items-center gap-2 mb-2"><span style="${diffStyle}" class="text-xs font-medium px-2.5 py-0.5 rounded-full">${diffLabel}</span><span class="text-xs text-slate-600">${baseLabel}</span></div><h3 class="font-display text-lg font-bold text-chocolate group-hover:text-berry transition-colors line-clamp-2 mb-1.5">${title}</h3><p class="text-sm text-slate-600 line-clamp-2 mb-3">${desc}</p><div class="flex items-center justify-between pt-3 border-t border-slate-100"><div class="flex items-center gap-2">${stars}<span class="text-xs text-slate-600">(${recipe.rating_count})</span></div><div class="flex items-center gap-3 text-xs text-slate-600">${prepHtml}</div></div></div></a>`;
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const starColor = '#D4A574';
  const emptyColor = '#e2e8f0';
  let html = '';
  for (let i = 0; i < full; i++) html += `<svg width="14" height="14" viewBox="0 0 20 20" fill="${starColor}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  if (half) html += `<svg width="14" height="14" viewBox="0 0 20 20"><defs><linearGradient id="hg"><stop offset="50%" stop-color="${starColor}"/><stop offset="50%" stop-color="${emptyColor}"/></linearGradient></defs><path fill="url(#hg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  for (let i = 0; i < empty; i++) html += `<svg width="14" height="14" viewBox="0 0 20 20" fill="${emptyColor}"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  return `<div class="flex items-center gap-0.5">${html}</div>`;
}

/**
 * Expand [product asin="..."] and [recipe slug="..."] shortcodes in HTML content.
 * Fetches data from Supabase and renders localized cards.
 */
export async function expandShortcodes(
  html: string,
  client: SupabaseClient,
  locale: Locale,
): Promise<string> {
  const hasProducts = html.includes('[product ');
  const hasRecipes = html.includes('[recipe ');

  // Quick check: if no shortcodes, return immediately
  if (!hasProducts && !hasRecipes) return html;

  // Expand product shortcodes
  if (hasProducts) {
    const products = await loadProducts(client);
    const translations = await loadTranslations(client, locale);

    html = html.replace(
      /\[product\s+asin=(?:"|&quot;)([A-Z0-9]{10})(?:"|&quot;)\s*\]/g,
      (_match, asin: string) => {
        const product = products.get(asin);
        if (!product) return `<!-- product ${asin} not found -->`;
        const translation = translations.get(asin);
        return renderCard(product, translation, locale);
      },
    );
  }

  // Expand recipe shortcodes
  if (hasRecipes) {
    // Extract all slugs first so we can batch-load
    const slugMatches = [...html.matchAll(/\[recipe\s+slug=(?:"|&quot;)([a-z0-9-]+)(?:"|&quot;)\s*\]/g)];
    const slugs = slugMatches.map((m) => m[1]);

    if (slugs.length > 0) {
      const recipes = await loadRecipes(client, slugs);
      const recipeIds = [...recipes.values()].map((r) => r.id);
      const recipeTranslations = await loadRecipeTranslations(client, recipeIds, locale);

      html = html.replace(
        /\[recipe\s+slug=(?:"|&quot;)([a-z0-9-]+)(?:"|&quot;)\s*\]/g,
        (_match, slug: string) => {
          const recipe = recipes.get(slug);
          if (!recipe) return `<!-- recipe ${slug} not found -->`;
          const translation = recipeTranslations.get(recipe.id);
          return renderRecipeCard(recipe, translation, locale);
        },
      );
    }
  }

  // Strip <p> wrappers around block-level shortcode output.
  // marked wraps [shortcode] in <p>...</p>, but our cards contain <div>s
  // which are invalid inside <p> and cause browsers to break the HTML.
  html = html.replace(/<p>(<a\s[^>]*class="not-prose[^"]*"[^>]*>)/g, '$1');
  html = html.replace(/(<\/a>)<\/p>/g, '$1');

  return html;
}

