import { describe, test, expect } from 'vitest';
import { buildBlogImageSrcset, buildRecipeImageSrcset } from './images';

describe('buildBlogImageSrcset', () => {
  test('generates correct srcset for blog image', () => {
    // Arrange
    const imageUrl = '/images/blog/test-post.avif';

    // Act
    const result = buildBlogImageSrcset(imageUrl);

    // Assert
    expect(result.src).toBe('/images/blog/test-post.avif');
    expect(result.srcset).toContain('test-post-384w.avif 384w');
    expect(result.srcset).toContain('test-post-768w.avif 768w');
    expect(result.srcset).toContain('test-post.avif 1200w');
    expect(result.sizes).toContain('384px');
  });

  test('strips .avif extension for base path', () => {
    // Arrange
    const imageUrl = '/images/blog/my-post.avif';

    // Act
    const result = buildBlogImageSrcset(imageUrl);

    // Assert
    expect(result.srcset).toContain('/images/blog/my-post-384w.avif');
    expect(result.srcset).not.toContain('.avif-384w');
  });
});

describe('buildRecipeImageSrcset', () => {
  test('generates correct srcset for recipe image', () => {
    // Arrange
    const imageUrl = '/images/recipes/vanilla-ice-cream.avif';

    // Act
    const result = buildRecipeImageSrcset(imageUrl);

    // Assert
    expect(result.src).toBe('/images/recipes/vanilla-ice-cream.avif');
    expect(result.srcset).toContain('vanilla-ice-cream-384w.avif 384w');
    expect(result.srcset).toContain('vanilla-ice-cream-768w.avif 768w');
    expect(result.srcset).toContain('vanilla-ice-cream.avif 800w');
  });

  test('uses 800w max width for recipes (not 1200w like blog)', () => {
    // Arrange
    const imageUrl = '/images/recipes/test.avif';

    // Act
    const result = buildRecipeImageSrcset(imageUrl);

    // Assert
    expect(result.srcset).toContain('800w');
    expect(result.srcset).not.toContain('1200w');
  });
});
