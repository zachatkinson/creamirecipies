import en from './en.json';
import fr from './fr.json';
import es from './es.json';

import de from './de.json';
import pt from './pt.json';

export const LOCALES = {
  en: { label: 'English', flag: '🇺🇸', translations: en },
  fr: { label: 'Français', flag: '🇨🇦', translations: fr },
  es: { label: 'Español', flag: '🇲🇽', translations: es },
  de: { label: 'Deutsch', flag: '🇩🇪', translations: de },
  pt: { label: 'Português', flag: '🇧🇷', translations: pt },
} as const;

export type Locale = keyof typeof LOCALES;
export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

/** Recursively build dot-notation key paths from the translation JSON structure */
type DotPaths<T, Prefix extends string = ''> = T extends object
  ? { [K in keyof T & string]: T[K] extends object
      ? DotPaths<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
      : Prefix extends '' ? K : `${Prefix}.${K}` }[keyof T & string]
  : never;

/** All valid translation key paths, derived from the English JSON */
export type TranslationKey = DotPaths<typeof en>;

/**
 * Get a translation value by dot-notation path.
 * Keys are type-checked against the English JSON structure at compile time.
 *
 * Usage: t('home.heroTitle', 'en') => "Perfect Creami"
 *        t('home.heroTitle', 'fr') => "Un Creami Parfait"
 */
export function t(path: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  const translations = LOCALES[locale]?.translations ?? en;
  const keys = path.split('.');
  let value: unknown = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      // Fallback to English
      let fallback: unknown = en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = (fallback as Record<string, unknown>)[k];
        } else {
          return path; // Return the key path if not found anywhere
        }
      }
      return String(fallback);
    }
  }

  return String(value);
}

/**
 * Detect locale from URL path prefix.
 * /fr/recipes -> 'fr'
 * /recipes -> 'en' (default)
 */
export function getLocaleFromPath(path: string): Locale {
  const firstSegment = path.split('/').filter(Boolean)[0];
  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as Locale) && firstSegment !== DEFAULT_LOCALE) {
    return firstSegment as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Build a localized path.
 * localePath('/recipes', 'fr') => '/fr/recipes'
 * localePath('/recipes', 'en') => '/recipes' (no prefix for default)
 */
export function localePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path}`;
}

/**
 * Get all alternate URLs for a path (for hreflang tags).
 */
export function getAlternateUrls(siteUrl: string, path: string): { locale: Locale; url: string }[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    url: `${siteUrl}${localePath(path, locale)}`,
  }));
}
