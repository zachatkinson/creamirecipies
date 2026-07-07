import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from './i18n';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // --- i18n: detect locale from URL prefix, then cookie, then Accept-Language ---
  const LOCALE_PREFIX_RE = /^\/(fr|es|de|pt)(\/.*|$)/;
  const pathname = context.url.pathname;
  let locale: Locale = DEFAULT_LOCALE;

  const prefixMatch = pathname.match(LOCALE_PREFIX_RE);
  if (prefixMatch) {
    locale = prefixMatch[1] as Locale;
    context.locals.locale = locale;
    // Strip locale prefix: /fr/recipes/slug → /recipes/slug, /fr → /, /fr/ → /
    let strippedPath = pathname.slice(prefixMatch[1].length + 1);
    if (!strippedPath || strippedPath === '/') strippedPath = '/';
    // Redirect trailing-slash bare locale (/fr/) to clean form (/fr)
    if (pathname === `/${locale}/`) {
      return context.redirect(`/${locale}`, 301);
    }
    // Rewrite to stripped path — next(path) does NOT re-execute middleware
    return next(strippedPath);
  }

  // --- No URL prefix: this is the default-locale (English) surface. ---
  // Prefix-less URLs ALWAYS render English, so the URL fully determines the
  // language (deterministic, CDN-cacheable, and the switcher can reliably
  // return you to English). Other languages are reached via their URL prefix
  // (/fr, /es, …). A saved `locale` cookie no longer overrides the render — it
  // only drives the one-time homepage redirect below.
  locale = DEFAULT_LOCALE;
  context.locals.locale = locale;

  // First-visit / returning-visitor auto-localization — homepage only, so that
  // content pages stay deterministically English and shared-cacheable.
  //   • saved cookie  → send the visitor to their chosen locale
  //   • no cookie     → suggest from browser language, then Québec geo, and
  //                     persist that guess so it only happens once
  if (pathname === '/' && context.request.method === 'GET') {
    const cookieLocale = context.cookies.get('locale')?.value;
    const savedLocale =
      cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)
        ? (cookieLocale as Locale)
        : null;
    const target = savedLocale ?? suggestLocale(context.request.headers);

    if (target && target !== DEFAULT_LOCALE) {
      // Persist a fresh guess so we don't re-detect on every homepage visit.
      if (!savedLocale) {
        context.cookies.set('locale', target, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        });
      }
      const redirectRes = context.redirect(`/${target}`, 302);
      redirectRes.headers.set('Cache-Control', 'private, no-store');
      return redirectRes;
    }
  }

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

  // Strip _locale from the path for cache-control matching
  const path = context.url.pathname;

  // Ensure Content-Type includes charset for faster browser parsing
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html') && !contentType.includes('charset')) {
    response.headers.set('Content-Type', 'text/html;charset=utf-8');
  }

  // --- CDN Cache-Control headers ---
  // With URL-based localization, /fr/recipes/slug and /recipes/slug are different
  // Vercel CDN cache keys. No Vary header needed.
  if (!path.startsWith('/api/') && response.status < 400) {
    if (path.match(/^\/(recipes|blog)\/[^/]+/)) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    } else if (path === '/' || path === '') {
      // The homepage runs per-visitor locale detection and may redirect, so it
      // must NOT be shared-cached at the CDN (that would bypass the redirect).
      // Browsers may still privately cache it briefly.
      response.headers.set('Cache-Control', 'private, no-store');
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

/**
 * Suggest a locale for a first-time visitor on a prefix-less URL.
 * Respects the person first (browser language), then falls back to a Québec
 * geo signal so anglophone visitors in the rest of Canada stay in English.
 * Returns null when English is the best guess.
 */
function suggestLocale(headers: Headers): Locale | null {
  // 1. Explicit browser language preference wins (fr-CA browser → 'fr', etc.)
  const detected = detectPreferredLocale(headers.get('accept-language') ?? '');
  if (detected) return detected;

  // 2. No clear browser signal — nudge Québec visitors to French (Bill 96).
  const country = headers.get('x-vercel-ip-country');
  const region = headers.get('x-vercel-ip-country-region');
  if (country === 'CA' && region === 'QC') return 'fr';

  return null;
}

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
