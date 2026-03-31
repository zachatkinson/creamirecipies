import { describe, test, expect } from 'vitest';
import { renderBlogPostCardHtml, CARD_LINK_CLASS } from './card-html';

describe('renderBlogPostCardHtml', () => {
  test('renders card with image srcset when hero_image_url is avif', () => {
    // Arrange
    const post = { slug: 'test', title: 'Test Post', category: 'reviews', hero_image_url: '/images/blog/test.avif', published_at: '2026-03-25T09:00:00Z' };

    // Act
    const html = renderBlogPostCardHtml(post, 'en');

    // Assert
    expect(html).toContain('srcset=');
    expect(html).toContain('test-384w.avif 384w');
    expect(html).toContain('test-768w.avif 768w');
  });

  test('renders fallback SVG when no hero image', () => {
    // Arrange
    const post = { slug: 'test', title: 'Test Post', category: 'tips' };

    // Act
    const html = renderBlogPostCardHtml(post, 'en');

    // Assert
    expect(html).toContain('/images/blog/tips.svg');
    expect(html).not.toContain('srcset=');
  });

  test('includes category badge and date', () => {
    // Arrange
    const post = { slug: 'test', title: 'Test', category: 'guides', published_at: '2026-12-25T00:00:00Z' };

    // Act
    const html = renderBlogPostCardHtml(post, 'en');

    // Assert
    expect(html).toContain('guides');
    expect(html).toContain('Dec');
    expect(html).toContain('2026');
  });

  test('includes excerpt when present', () => {
    // Arrange
    const post = { slug: 'test', title: 'Test', category: 'news', excerpt: 'This is the excerpt' };

    // Act
    const html = renderBlogPostCardHtml(post, 'en');

    // Assert
    expect(html).toContain('This is the excerpt');
  });

  test('omits excerpt paragraph when not present', () => {
    // Arrange
    const post = { slug: 'test', title: 'Test', category: 'news' };

    // Act
    const html = renderBlogPostCardHtml(post, 'en');

    // Assert
    expect(html).not.toContain('line-clamp-3');
  });
});

describe('CARD_LINK_CLASS', () => {
  test('includes essential card styling classes', () => {
    expect(CARD_LINK_CLASS).toContain('rounded-2xl');
    expect(CARD_LINK_CLASS).toContain('shadow-sm');
    expect(CARD_LINK_CLASS).toContain('hover:shadow-lg');
  });
});
