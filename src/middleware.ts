import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from './i18n';

/** Non-default locale prefixes that trigger URL-based rewriting */
const LOCALE_PREFIXES = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE);
const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALE_PREFIXES.join('|')})(/|$)`);

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const pathname = context.url.pathname;

  // --- i18n: detect locale from URL, then cookie, then Accept-Language ---
  let locale: Locale = DEFAULT_LOCALE;

  // Check URL for locale prefix (/fr/, /es/, etc.)
  const prefixMatch = pathname.match(LOCALE_PREFIX_RE);
  if (prefixMatch) {
    locale = prefixMatch[1] as Locale;
    const strippedPath = pathname.slice(prefixMatch[1].length + 1) || '/';
    // Set locale BEFORE rewrite so it persists through context.locals
    context.locals.locale = locale;
    // Rewrite to the base path — context.rewrite() re-executes middleware,
    // but the rewritten path won't have a prefix so it falls through to cookie/header detection.
    // We set a cookie to preserve the locale through the rewrite.
    context.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return context.rewrite(strippedPath);
  }

  // No URL prefix — fall back to cookie → Accept-Language → default
  const cookieLocale = context.cookies.get('locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    const acceptLang = context.request.headers.get('accept-language') ?? '';
    const detected = detectPreferredLocale(acceptLang);
    if (detected) locale = detected;
  }

  context.locals.locale = locale;

  // --- Supabase Auth ---
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get('cookie') ?? '') as { name: string; value: string }[];
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, {
            path: '/',
            ...options,
          });
        }
      },
    },
  });

  context.locals.supabase = supabase;

  const response = await next();

  // Use the ORIGINAL pathname (with locale prefix) for cache-control matching
  const path = strippedPath;

  // Ensure Content-Type includes charset for faster browser parsing
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html') && !contentType.includes('charset')) {
    response.headers.set('Content-Type', 'text/html;charset=utf-8');
  }

  // --- CDN Cache-Control headers ---
  // With URL-based localization, each locale has a unique URL = unique cache key.
  // No Vary: Cookie needed since the URL determines the locale.
  if (!path.startsWith('/api/') && response.status < 400) {
    if (path.match(/^\/(recipes|blog)\/[^/]+/)) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else if (path === '/' || path === '') {
      response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=43200');
    } else if (path === '/recipes' || path === '/blog') {
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    } else if (path.endsWith('.xml')) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    }
  }

  return response;
});

function detectPreferredLocale(acceptLang: string): Locale | null {
  if (!acceptLang) return null;

  const langs = acceptLang
    .split(',')
    .map((part) => {
      const [lang, qPart] = part.trim().split(';');
      const q = qPart ? parseFloat(qPart.split('=')[1]) : 1;
      return { lang: lang.trim().split('-')[0].toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of langs) {
    if (SUPPORTED_LOCALES.includes(lang as Locale)) {
      return lang as Locale;
    }
  }

  return null;
}
