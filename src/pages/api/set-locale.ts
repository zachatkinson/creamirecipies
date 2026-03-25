import type { APIRoute } from 'astro';
import { SUPPORTED_LOCALES, type Locale } from '../../i18n';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { locale } = await request.json();

  if (SUPPORTED_LOCALES.includes(locale as Locale)) {
    cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  const referer = request.headers.get('referer') ?? '/';
  return redirect(referer, 302);
};

export const prerender = false;
