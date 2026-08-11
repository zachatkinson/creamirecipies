import { describe, expect, test } from 'vitest';
import { BLOG_GUIDES, getGuidesForRecipe, getGuidesForCollection } from './blogGuides';
import { SUPPORTED_LOCALES } from '../i18n';

describe('getGuidesForRecipe', () => {
  test('matches the protein guide for high-protein recipes', () => {
    // Arrange
    const categorySlugs = ['ice-cream', 'high-protein'];
    // Act
    const guides = getGuidesForRecipe(categorySlugs);
    // Assert
    expect(guides.map((g) => g.postSlug)).toContain('best-protein-powders-creami');
  });

  test('matches the cocoa guide for chocolate recipes', () => {
    // Arrange
    const categorySlugs = ['gelato', 'chocolate'];
    // Act
    const guides = getGuidesForRecipe(categorySlugs);
    // Assert
    expect(guides.map((g) => g.postSlug)).toContain('best-cocoa-powders-creami');
  });

  test('returns no guides when no category matches', () => {
    // Arrange
    const categorySlugs = ['sorbet', 'fruity'];
    // Act
    const guides = getGuidesForRecipe(categorySlugs);
    // Assert
    expect(guides).toHaveLength(0);
  });

  test('returns each matching guide once for recipes matching multiple categories', () => {
    // Arrange
    const categorySlugs = ['high-protein', 'chocolate'];
    // Act
    const guides = getGuidesForRecipe(categorySlugs);
    // Assert
    expect(guides.map((g) => g.postSlug).sort()).toEqual([
      'best-cocoa-powders-creami',
      'best-protein-powders-creami',
    ]);
  });
});

describe('getGuidesForCollection', () => {
  test('surfaces the protein guide on the protein-ice-cream hub', () => {
    // Arrange
    const collectionSlug = 'protein-ice-cream';
    // Act
    const guides = getGuidesForCollection(collectionSlug);
    // Assert
    expect(guides.map((g) => g.postSlug)).toContain('best-protein-powders-creami');
  });

  test('returns no guides for hubs without a configured guide', () => {
    // Arrange
    const collectionSlug = 'sorbet';
    // Act
    const guides = getGuidesForCollection(collectionSlug);
    // Assert
    expect(guides).toHaveLength(0);
  });
});

describe('BLOG_GUIDES', () => {
  test('every guide has a label and teaser for every supported locale', () => {
    // Arrange
    const guides = BLOG_GUIDES;
    // Act
    const missing = guides.flatMap((g) =>
      SUPPORTED_LOCALES.filter((l) => !g.label[l] || !g.teaser[l]).map((l) => `${g.postSlug}:${l}`),
    );
    // Assert
    expect(missing).toEqual([]);
  });
});
