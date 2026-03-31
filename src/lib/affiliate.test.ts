import { describe, test, expect } from 'vitest';
import { amazonProductUrl, AMAZON_TAG } from './affiliate';

describe('AMAZON_TAG', () => {
  test('has a default affiliate tag', () => {
    expect(AMAZON_TAG).toBeTruthy();
    expect(AMAZON_TAG).toContain('eatcreami');
  });
});

describe('amazonProductUrl', () => {
  test('generates correct Amazon URL with ASIN and tag', () => {
    // Arrange
    const asin = 'B071J6P6KQ';

    // Act
    const url = amazonProductUrl(asin);

    // Assert
    expect(url).toBe(`https://www.amazon.com/dp/B071J6P6KQ?tag=${AMAZON_TAG}`);
  });

  test('works with different ASINs', () => {
    // Arrange & Act
    const url = amazonProductUrl('B003VSBX3I');

    // Assert
    expect(url).toContain('/dp/B003VSBX3I');
    expect(url).toContain('tag=');
  });
});
