import { describe, test, expect } from 'vitest';
import { selectEquipmentAsins, MACHINE_ASIN, PINTS_ASIN, MAX_EQUIPMENT_ITEMS } from './equipment';

describe('selectEquipmentAsins', () => {
  test('always leads with the machine', () => {
    // Arrange
    const ingredients = ['heavy cream', 'whole milk', 'sugar'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert
    expect(result[0]).toBe(MACHINE_ASIN);
  });

  test('pads with pints when no ingredients match', () => {
    // Arrange
    const ingredients = ['heavy cream', 'whole milk', 'sugar'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert
    expect(result).toContain(PINTS_ASIN);
    expect(result.length).toBeLessThanOrEqual(MAX_EQUIPMENT_ITEMS);
  });

  test('matches distinctive ingredients over universal ones', () => {
    // Arrange
    const ingredients = ['allulose', 'vanilla extract', 'cream cheese', 'peppermint extract'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert: allulose (B07YBTWGPM) and peppermint (B000B6KRJW) outrank vanilla/cream cheese
    expect(result).toEqual([MACHINE_ASIN, 'B07YBTWGPM', 'B000B6KRJW']);
  });

  test('never exceeds the item cap', () => {
    // Arrange
    const ingredients = ['allulose', 'xanthan gum', 'molasses', 'greek yogurt', 'honey', 'cocoa powder'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert
    expect(result.length).toBe(MAX_EQUIPMENT_ITEMS);
  });

  test('matches case-insensitively and within longer names', () => {
    // Arrange
    const ingredients = ['Full-Fat Canned Coconut Milk', 'Sweetened Condensed Milk'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert: condensed milk rule outranks coconut milk rule
    expect(result).toEqual([MACHINE_ASIN, 'B07NVY89WP', 'B0042FVLMK']);
  });

  test('does not match honey inside other words', () => {
    // Arrange
    const ingredients = ['honeydew melon'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert: word-boundary pattern must not treat honeydew as honey
    expect(result).not.toContain('B00CMQD3VS');
  });

  test('returns no duplicate ASINs', () => {
    // Arrange
    const ingredients = ['cocoa powder', 'dutch cocoa', 'unsweetened cocoa'];
    // Act
    const result = selectEquipmentAsins(ingredients);
    // Assert
    expect(new Set(result).size).toBe(result.length);
  });
});
