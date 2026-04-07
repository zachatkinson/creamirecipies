import { describe, test, expect } from 'vitest';
import { COLLECTIONS, getCollection, getCollectionMeta } from './collections';

describe('COLLECTIONS', () => {
  test('every collection has a unique slug', () => {
    // Arrange
    const slugs = COLLECTIONS.map((c) => c.slug);

    // Act
    const unique = new Set(slugs);

    // Assert
    expect(unique.size).toBe(slugs.length);
  });

  test('every collection defines at least one query filter', () => {
    for (const col of COLLECTIONS) {
      // Act
      const hasFilter = !!(col.query.base || col.query.dietary || col.query.flavor || col.query.tag);

      // Assert
      expect(hasFilter, `Collection "${col.slug}" has no query filters`).toBe(true);
    }
  });
});

describe('getCollection', () => {
  test('returns collection config by slug', () => {
    // Act
    const col = getCollection('protein-ice-cream');

    // Assert
    expect(col).toBeDefined();
    expect(col!.slug).toBe('protein-ice-cream');
    expect(col!.query.dietary).toContain('high-protein');
  });

  test('returns undefined for unknown slug', () => {
    // Act
    const col = getCollection('nonexistent');

    // Assert
    expect(col).toBeUndefined();
  });
});

describe('getCollectionMeta', () => {
  test('returns English metadata by default', () => {
    // Act
    const meta = getCollectionMeta('protein-ice-cream', 'en');

    // Assert
    expect(meta).not.toBeNull();
    expect(meta!.title).toContain('Protein Ice Cream');
    expect(meta!.metaDescription).toBeTruthy();
    expect(meta!.description).toBeTruthy();
  });

  test('returns translated metadata for non-English locale', () => {
    // Act
    const meta = getCollectionMeta('frozen-yogurt', 'fr');

    // Assert
    expect(meta).not.toBeNull();
    expect(meta!.title).toContain('Frozen Yogurt');
    expect(meta!.title).toContain('Ninja Creami');
  });

  test('returns metadata for all supported locales', () => {
    // Arrange
    const locales = ['en', 'fr', 'es', 'de', 'pt'] as const;

    for (const col of COLLECTIONS) {
      for (const locale of locales) {
        // Act
        const meta = getCollectionMeta(col.slug, locale);

        // Assert
        expect(meta, `Missing meta for ${col.slug} / ${locale}`).not.toBeNull();
        expect(meta!.title.length, `Empty title for ${col.slug} / ${locale}`).toBeGreaterThan(0);
        expect(meta!.description.length, `Empty description for ${col.slug} / ${locale}`).toBeGreaterThan(0);
        expect(meta!.metaDescription.length, `Empty metaDescription for ${col.slug} / ${locale}`).toBeGreaterThan(0);
      }
    }
  });

  test('falls back to English for unknown locale', () => {
    // Act — cast to bypass type checking for edge case
    const meta = getCollectionMeta('protein-ice-cream', 'ja' as never);

    // Assert — falls back to English
    expect(meta).not.toBeNull();
    expect(meta!.title).toContain('Protein Ice Cream');
  });

  test('returns null for unknown collection slug', () => {
    // Act
    const meta = getCollectionMeta('nonexistent', 'en');

    // Assert
    expect(meta).toBeNull();
  });
});
