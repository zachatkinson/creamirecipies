import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from './i18n';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // --- i18n: detect locale ---
  // Priority: 1) cookie preference  2) Accept-Language header  3) default
  let locale: Locale = DEFAULT_LOCALE;

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
  const path = context.url.pathname;

  // Ensure Content-Type includes charset for faster browser parsing
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html') && !contentType.includes('charset')) {
    response.headers.set('Content-Type', 'text/html;charset=utf-8');
  }

  // --- CDN Cache-Control headers ---
  // Vercel CDN respects s-maxage; stale-while-revalidate serves cached
  // content instantly while refreshing in the background.
  // Errors are never cached to prevent serving broken pages.
  if (!path.startsWith('/api/') && response.status < 400) {
    if (path.match(/^\/(recipes|blog)\/[^/]+/)) {
      // Recipe & blog detail pages: cache 1 hour, stale up to 24h
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else if (path === '/' || path === '') {
      // Homepage: cache 30 min, stale up to 12h
      response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=43200');
    } else if (path === '/recipes' || path === '/blog') {
      // Listing pages: cache 5 min, stale up to 1h
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    } else if (path.endsWith('.xml')) {
      // Sitemaps, RSS: cache 1 hour, stale up to 24h
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else {
      // Static pages (/about, /privacy, /terms): cache 1 day, stale up to 7 days
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    }
    // Vary by cookie so locale preference creates separate cache entries
    response.headers.set('Vary', 'Cookie');
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
