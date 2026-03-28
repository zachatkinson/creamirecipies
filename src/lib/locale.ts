import type { Locale } from '../i18n';
import { SUPPORTED_LOCALES } from '../i18n';

/**
 * Resolve locale from URL params and request locals.
 * Prefers explicit locale param, falls back to middleware-set locale from cookie.
 */
export function resolveLocale(
  params: URLSearchParams,
  locals: { locale?: Locale },
): Locale {
  const paramLocale = params.get('locale');
  return (paramLocale && SUPPORTED_LOCALES.includes(paramLocale as Locale))
    ? paramLocale as Locale
    : (locals.locale ?? 'en');
}
