import { describe, test, expect } from 'vitest';
import { t, localePath, getLocaleFromPath, SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from './index';

describe('SUPPORTED_LOCALES', () => {
  test('includes all 5 locales', () => {
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('fr');
    expect(SUPPORTED_LOCALES).toContain('es');
    expect(SUPPORTED_LOCALES).toContain('de');
    expect(SUPPORTED_LOCALES).toContain('pt');
    expect(SUPPORTED_LOCALES).toHaveLength(5);
  });
});

describe('DEFAULT_LOCALE', () => {
  test('is English', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('t (translation function)', () => {
  test('returns English translation', () => {
    // Act
    const result = t('nav.recipes', 'en');

    // Assert
    expect(result).toBe('Recipes');
  });

  test('returns French translation', () => {
    // Act
    const result = t('nav.recipes', 'fr');

    // Assert
    expect(result).toBe('Recettes');
  });

  test('returns Spanish translation', () => {
    // Act
    const result = t('nav.recipes', 'es');

    // Assert
    expect(result).toBe('Recetas');
  });

  test('falls back to English for missing keys', () => {
    // Act — use a key that exists in English
    const result = t('site.name', 'fr');

    // Assert — eatcreami is never translated
    expect(result).toBe('eatcreami');
  });
});

describe('localePath', () => {
  test('returns path unchanged for default locale', () => {
    // Act
    const result = localePath('/recipes', 'en');

    // Assert
    expect(result).toBe('/recipes');
  });

  test('prefixes path for non-default locale', () => {
    // Act
    const result = localePath('/recipes', 'fr');

    // Assert
    expect(result).toBe('/fr/recipes');
  });

  test('handles root path', () => {
    expect(localePath('/', 'en')).toBe('/');
    expect(localePath('/', 'fr')).toBe('/fr/');
  });

  test('handles paths with query params', () => {
    // Act
    const result = localePath('/recipes?base=ice-cream', 'es');

    // Assert
    expect(result).toBe('/es/recipes?base=ice-cream');
  });

  test('works for all supported locales', () => {
    // Act & Assert
    for (const locale of SUPPORTED_LOCALES) {
      const result = localePath('/test', locale);
      if (locale === 'en') {
        expect(result).toBe('/test');
      } else {
        expect(result).toBe(`/${locale}/test`);
      }
    }
  });
});

describe('getLocaleFromPath', () => {
  test('detects French from path', () => {
    expect(getLocaleFromPath('/fr/recipes')).toBe('fr');
  });

  test('detects Spanish from path', () => {
    expect(getLocaleFromPath('/es/blog/test')).toBe('es');
  });

  test('returns default for English path (no prefix)', () => {
    expect(getLocaleFromPath('/recipes')).toBe('en');
  });

  test('returns default for root path', () => {
    expect(getLocaleFromPath('/')).toBe('en');
  });
});
