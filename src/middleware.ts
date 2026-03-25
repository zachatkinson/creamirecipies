import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { Database } from './lib/types';
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
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get('cookie') ?? '');
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

  return next();
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
