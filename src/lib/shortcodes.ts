import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from '../i18n';

const AMAZON_TAG = 'eatcreami03-20';
const VIEW_ON: Record<string, string> = {
  en: 'View on Amazon',
  fr: 'Voir sur Amazon',
  es: 'Ver en Amazon',
  de: 'Auf Amazon ansehen',
  pt: 'Ver na Amazon',
};

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
  const cta = VIEW_ON[locale] ?? VIEW_ON.en;

  const descHtml = desc ? `<span style="color:#475569;font-size:0.8rem">${desc}</span><br/>` : '';

  return `<a href="https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}" rel="sponsored nofollow" target="_blank" style="display:flex;align-items:center;gap:1rem;padding:0.75rem 1rem;margin:0.75rem 0;background:#fff;border:1px solid #e2e8f0;border-radius:0.75rem;text-decoration:none;transition:box-shadow 0.2s"><img src="${imageUrl}" alt="${name}" style="width:80px;height:80px;object-fit:contain;border-radius:0.5rem;flex-shrink:0" loading="lazy" /><span style="flex:1"><strong style="color:#5C3D2E;display:block">${name}</strong>${descHtml}<span style="color:#8B3A62;font-size:0.875rem">${cta} &rarr;</span></span></a>`;
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

/**
 * Clear the product cache (call between requests if needed).
 */
export function clearProductCache(): void {
  productCache = null;
  translationCache = null;
  cacheLocale = null;
}
