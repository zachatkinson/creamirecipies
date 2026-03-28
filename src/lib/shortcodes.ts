import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from '../i18n';
import { t } from '../i18n';

const AMAZON_TAG = import.meta.env.PUBLIC_AMAZON_TAG || 'eatcreami03-20';

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

// Cache products in memory for the duration of a request
let productCache: Map<string, Product> | null = null;
let translationCache: Map<string, ProductTranslation> | null = null;
let cacheLocale: string | null = null;

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

/**
 * Expand [product asin="..."] shortcodes in HTML content.
 * Fetches product data from Supabase and renders localized cards.
 */
export async function expandShortcodes(
  html: string,
  client: SupabaseClient,
  locale: Locale,
): Promise<string> {
  // Quick check: if no shortcodes, return immediately
  if (!html.includes('[product ')) return html;

  const products = await loadProducts(client);
  const translations = await loadTranslations(client, locale);

  return html.replace(
    /\[product\s+asin="([A-Z0-9]{10})"\s*\]/g,
    (_match, asin: string) => {
      const product = products.get(asin);
      if (!product) return `<!-- product ${asin} not found -->`;
      const translation = translations.get(asin);
      return renderCard(product, translation, locale);
    },
  );
}
