import { describe, test, expect } from 'vitest';
import { selectEquipmentAsins, COLLECTION_EQUIPMENT, MACHINE_ASIN, PINTS_ASIN, MAX_EQUIPMENT_ITEMS } from './equipment';
import { COLLECTIONS } from './collections';

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

describe('COLLECTION_EQUIPMENT', () => {
  test('covers every collection hub', () => {
    // Arrange
    const hubSlugs = COLLECTIONS.map((c) => c.slug);
    // Act
    const mappedSlugs = Object.keys(COLLECTION_EQUIPMENT);
    // Assert
    for (const slug of hubSlugs) {
      expect(mappedSlugs).toContain(slug);
    }
  });

  test('every set has exactly three unique, well-formed ASINs', () => {
    // Arrange
    const asinFormat = /^B[A-Z0-9]{9}$/;
    // Act & Assert
    for (const [slug, asins] of Object.entries(COLLECTION_EQUIPMENT)) {
      expect(asins.length, slug).toBe(MAX_EQUIPMENT_ITEMS);
      expect(new Set(asins).size, slug).toBe(asins.length);
      for (const asin of asins) expect(asin, slug).toMatch(asinFormat);
    }
  });

  test('soft-serve leads with the Scoop & Swirl, others with the 7-in-1', () => {
    // Arrange
    const { 'soft-serve': softServe, ...rest } = COLLECTION_EQUIPMENT;
    // Act & Assert
    expect(softServe[0]).toBe('B0DSJW8SFG');
    for (const [slug, asins] of Object.entries(rest)) {
      expect(asins[0], slug).toBe(MACHINE_ASIN);
    }
  });
});
