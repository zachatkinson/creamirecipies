import { describe, test, expect } from 'vitest';
import { logQueryError, CATEGORY_COLORS, DIFFICULTY_COLORS, BASE_TYPE_FROM_SLUG, INGREDIENT_GROUP_ORDER } from './blog';

describe('CATEGORY_COLORS', () => {
  test('has colors for all blog categories', () => {
    expect(CATEGORY_COLORS).toHaveProperty('news');
    expect(CATEGORY_COLORS).toHaveProperty('tips');
    expect(CATEGORY_COLORS).toHaveProperty('reviews');
    expect(CATEGORY_COLORS).toHaveProperty('guides');
  });

  test('color values contain Tailwind classes', () => {
    // Assert
    Object.values(CATEGORY_COLORS).forEach((color) => {
      expect(color).toContain('bg-');
      expect(color).toContain('text-');
    });
  });
});

describe('DIFFICULTY_COLORS', () => {
  test('has colors for all difficulty levels', () => {
    expect(DIFFICULTY_COLORS).toHaveProperty('beginner');
    expect(DIFFICULTY_COLORS).toHaveProperty('intermediate');
    expect(DIFFICULTY_COLORS).toHaveProperty('advanced');
  });
});

describe('BASE_TYPE_FROM_SLUG', () => {
  test('maps all 9 base type slugs', () => {
    // Assert
    expect(Object.keys(BASE_TYPE_FROM_SLUG)).toHaveLength(9);
    expect(BASE_TYPE_FROM_SLUG['ice-cream']).toBe('Ice Cream');
    expect(BASE_TYPE_FROM_SLUG['sorbet']).toBe('Sorbet');
    expect(BASE_TYPE_FROM_SLUG['gelato']).toBe('Gelato');
    expect(BASE_TYPE_FROM_SLUG['frozen-yogurt']).toBe('Frozen Yogurt');
    expect(BASE_TYPE_FROM_SLUG['milkshake']).toBe('Milkshake');
    expect(BASE_TYPE_FROM_SLUG['smoothie-bowl']).toBe('Smoothie Bowl');
    expect(BASE_TYPE_FROM_SLUG['lite-ice-cream']).toBe('Lite Ice Cream');
    expect(BASE_TYPE_FROM_SLUG['italian-ice']).toBe('Italian Ice');
    expect(BASE_TYPE_FROM_SLUG['soft-serve']).toBe('Soft Serve');
  });
});

describe('INGREDIENT_GROUP_ORDER', () => {
  test('has correct ordering', () => {
    expect(INGREDIENT_GROUP_ORDER[0]).toBe('base');
    expect(INGREDIENT_GROUP_ORDER[1]).toBe('mix-ins');
    expect(INGREDIENT_GROUP_ORDER).toContain('swirl');
    expect(INGREDIENT_GROUP_ORDER).toContain('topping');
  });
});

describe('logQueryError', () => {
  test('logs to console.warn without throwing', () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act
    logQueryError('testContext', 'test error message');

    // Assert
    expect(warnSpy).toHaveBeenCalledWith('[testContext]', 'test error message');
    warnSpy.mockRestore();
  });

  test('handles missing message', () => {
    // Arrange
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act
    logQueryError('testContext');

    // Assert
    expect(warnSpy).toHaveBeenCalledWith('[testContext]', 'Unknown error');
    warnSpy.mockRestore();
  });
});
