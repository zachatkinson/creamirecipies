import type { APIRoute } from 'astro';
import { SUPPORTED_LOCALES, type Locale } from '../../i18n';

const COOKIE_OPTS = { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' as const };

/** Only allow same-origin, absolute internal paths as redirect targets. */
function safePath(to: string | null): string {
  return to && to.startsWith('/') && !to.startsWith('//') ? to : '/';
}

// GET is used by the language switcher: /api/set-locale?locale=fr&to=/fr/recipes
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const locale = url.searchParams.get('locale');
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    cookies.set('locale', locale, COOKIE_OPTS);
  }

  const res = redirect(safePath(url.searchParams.get('to')), 302);
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { locale } = await request.json();

  if (SUPPORTED_LOCALES.includes(locale as Locale)) {
    cookies.set('locale', locale, COOKIE_OPTS);
  }

  const referer = request.headers.get('referer') ?? '/';
  return redirect(referer, 302);
};

export const prerender = false;
