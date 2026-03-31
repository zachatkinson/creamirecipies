import { describe, test, expect } from 'vitest';
import { formatPublishDate } from './formatting';

describe('formatPublishDate', () => {
  test('formats date with short month by default', () => {
    // Arrange
    const date = '2026-03-25T09:00:00Z';

    // Act
    const result = formatPublishDate(date, 'en');

    // Assert
    expect(result).toContain('Mar');
    expect(result).toContain('25');
    expect(result).toContain('2026');
  });

  test('formats date with long month when specified', () => {
    // Arrange
    const date = '2026-03-25T09:00:00Z';

    // Act
    const result = formatPublishDate(date, 'en', 'long');

    // Assert
    expect(result).toContain('March');
    expect(result).toContain('25');
    expect(result).toContain('2026');
  });

  test('formats date in French locale', () => {
    // Arrange
    const date = '2026-03-25T09:00:00Z';

    // Act
    const result = formatPublishDate(date, 'fr');

    // Assert
    expect(result).toContain('2026');
    // French month abbreviation for March is "mars"
    expect(result.toLowerCase()).toContain('mars');
  });

  test('handles different date string formats', () => {
    // Arrange
    const isoDate = '2026-12-25T12:00:00Z';

    // Act
    const result = formatPublishDate(isoDate, 'en');

    // Assert
    expect(result).toContain('Dec');
    expect(result).toContain('25');
  });
});
