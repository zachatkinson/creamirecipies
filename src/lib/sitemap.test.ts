import { describe, test, expect } from 'vitest';
import { escapeXml, buildSitemapUrls, wrapSitemapXml, SITE_URL } from './sitemap';

describe('escapeXml', () => {
  test('escapes ampersands', () => {
    expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('escapes angle brackets', () => {
    expect(escapeXml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  test('escapes quotes and apostrophes', () => {
    expect(escapeXml("It's a \"test\"")).toBe("It&apos;s a &quot;test&quot;");
  });

  test('returns clean string unchanged', () => {
    expect(escapeXml('Hello World')).toBe('Hello World');
  });
});

describe('SITE_URL', () => {
  test('is the production domain', () => {
    expect(SITE_URL).toBe('https://eatcreami.com');
  });
});

describe('buildSitemapUrls', () => {
  test('generates URL entries for all locales', () => {
    // Arrange
    const items = [{
      slug: 'vanilla-ice-cream',
      title: 'Vanilla Ice Cream',
      updated_at: '2026-03-25T09:00:00Z',
      hero_image_url: '/images/recipes/vanilla-ice-cream.avif',
    }];

    // Act
    const urls = buildSitemapUrls(items, '/recipes', 'weekly', 0.8);

    // Assert — should have 5 locale entries (en, fr, es, de, pt)
    expect(urls).toContain('/recipes/vanilla-ice-cream');
    expect(urls).toContain('/fr/recipes/vanilla-ice-cream');
    expect(urls).toContain('/es/recipes/vanilla-ice-cream');
    expect(urls).toContain('/de/recipes/vanilla-ice-cream');
    expect(urls).toContain('/pt/recipes/vanilla-ice-cream');
  });

  test('includes hreflang cross-references', () => {
    // Arrange
    const items = [{ slug: 'test', title: 'Test', updated_at: '2026-03-25T09:00:00Z', hero_image_url: null }];

    // Act
    const urls = buildSitemapUrls(items, '/recipes', 'weekly', 0.8);

    // Assert
    expect(urls).toContain('xhtml:link rel="alternate" hreflang="en"');
    expect(urls).toContain('xhtml:link rel="alternate" hreflang="fr"');
    expect(urls).toContain('xhtml:link rel="alternate" hreflang="x-default"');
  });

  test('includes image tags when hero_image_url is present', () => {
    // Arrange
    const items = [{ slug: 'test', title: 'Test Recipe', updated_at: '2026-03-25T09:00:00Z', hero_image_url: '/images/recipes/test.avif' }];

    // Act
    const urls = buildSitemapUrls(items, '/recipes', 'weekly', 0.8);

    // Assert
    expect(urls).toContain('image:image');
    expect(urls).toContain('/images/recipes/test.avif');
    expect(urls).toContain('Test Recipe');
  });

  test('omits image tags when hero_image_url is null', () => {
    // Arrange
    const items = [{ slug: 'test', title: 'Test', updated_at: '2026-03-25T09:00:00Z', hero_image_url: null }];

    // Act
    const urls = buildSitemapUrls(items, '/recipes', 'weekly', 0.8);

    // Assert
    expect(urls).not.toContain('image:image');
  });

  test('escapes special characters in titles', () => {
    // Arrange
    const items = [{ slug: 'test', title: 'PB & Jelly "Ice Cream"', updated_at: '2026-03-25T09:00:00Z', hero_image_url: '/img.avif' }];

    // Act
    const urls = buildSitemapUrls(items, '/recipes', 'weekly', 0.8);

    // Assert
    expect(urls).toContain('PB &amp; Jelly &quot;Ice Cream&quot;');
  });
});

describe('wrapSitemapXml', () => {
  test('wraps content in valid XML with namespaces', () => {
    // Arrange
    const urls = '<url><loc>https://example.com</loc></url>';

    // Act
    const xml = wrapSitemapXml(urls);

    // Assert
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain('xmlns:image=');
    expect(xml).toContain('xmlns:xhtml=');
    expect(xml).toContain(urls);
  });
});
