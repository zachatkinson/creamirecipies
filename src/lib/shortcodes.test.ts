import { describe, test, expect } from 'vitest';
import { preserveShortcodes } from './shortcodes';

describe('preserveShortcodes', () => {
  test('returns translated body unchanged when all shortcodes present', () => {
    // Arrange
    const english = '## Intro\nSome text\n\n[recipe slug="vanilla-ice-cream"]\n\n## More\nMore text';
    const translated = '## Introducción\nAlgo de texto\n\n[recipe slug="vanilla-ice-cream"]\n\n## Más\nMás texto';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toBe(translated);
  });

  test('re-inserts missing recipe shortcodes into translated body', () => {
    // Arrange
    const english = '## Intro\nSome text\n\n[recipe slug="vanilla-ice-cream"]\n\n## More\nMore text';
    const translated = '## Introducción\nAlgo de texto\n\n## Más\nMás texto';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toContain('[recipe slug="vanilla-ice-cream"]');
  });

  test('re-inserts missing product shortcodes into translated body', () => {
    // Arrange
    const english = '## Products\nCheck these out\n\n[product asin="B08RRVT3KL"]\n[product asin="B00807EW40"]';
    const translated = '## Productos\nMira estos';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toContain('[product asin="B08RRVT3KL"]');
    expect(result).toContain('[product asin="B00807EW40"]');
  });

  test('re-inserts missing collection shortcodes into translated body', () => {
    // Arrange
    const english = '## Browse\n\n[collection slug="summer-flavors"]';
    const translated = '## Explorar';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toContain('[collection slug="summer-flavors"]');
  });

  test('returns translated body unchanged when english has no shortcodes', () => {
    // Arrange
    const english = '## Intro\nJust plain text here.';
    const translated = '## Introducción\nSolo texto simple aquí.';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toBe(translated);
  });

  test('preserves shortcodes across multiple sections', () => {
    // Arrange
    const english = [
      '## Section 1',
      'Text about strawberry',
      '[recipe slug="strawberry-ice-cream"]',
      '## Section 2',
      'Text about chocolate',
      '[recipe slug="chocolate-ice-cream"]',
      '## Section 3',
      'Buy these supplies',
      '[product asin="B08RRVT3KL"]',
    ].join('\n');
    const translated = [
      '## Sección 1',
      'Texto sobre fresa',
      '## Sección 2',
      'Texto sobre chocolate',
      '## Sección 3',
      'Compra estos suministros',
    ].join('\n');

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toContain('[recipe slug="strawberry-ice-cream"]');
    expect(result).toContain('[recipe slug="chocolate-ice-cream"]');
    expect(result).toContain('[product asin="B08RRVT3KL"]');
  });

  test('does not duplicate shortcodes that are partially present', () => {
    // Arrange
    const english = '## Intro\n[recipe slug="a"]\n[recipe slug="b"]';
    const translated = '## Intro\n[recipe slug="a"]';

    // Act
    const result = preserveShortcodes(english, translated);

    // Assert
    expect(result).toContain('[recipe slug="b"]');
    const countA = (result.match(/\[recipe slug="a"\]/g) || []).length;
    expect(countA).toBe(1);
  });
});
