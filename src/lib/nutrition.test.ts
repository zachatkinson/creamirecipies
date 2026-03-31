import { describe, test, expect, vi } from 'vitest';
import { calculateNutrition } from './nutrition';

function createMockClient(nutritionData: Record<string, unknown>[] | null) {
  const query = {
    select: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockResolvedValue({ data: nutritionData }),
  };
  return { from: vi.fn(() => query), query };
}

describe('calculateNutrition', () => {
  test('returns zeros when no ingredients have master_ingredient_id', async () => {
    // Arrange
    const client = createMockClient(null);
    const ingredients = [
      { master_ingredient_id: null, amount: '1', unit: 'cup' },
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert
    expect(result).toEqual({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  });

  test('calculates nutrition from master ingredients', async () => {
    // Arrange
    const nutritionData = [
      { id: 'mi-1', calories_per_100g: 60, protein_per_100g: 3, fat_per_100g: 3.5, carbs_per_100g: 5 },
    ];
    const client = createMockClient(nutritionData);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '1', unit: 'cup' }, // 1 cup = 240g
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert — 240g / 100 = factor 2.4
    expect(result.calories).toBeCloseTo(60 * 2.4);
    expect(result.protein).toBeCloseTo(3 * 2.4);
    expect(result.fat).toBeCloseTo(3.5 * 2.4);
    expect(result.carbs).toBeCloseTo(5 * 2.4);
  });

  test('handles tablespoon unit conversion', async () => {
    // Arrange
    const nutritionData = [
      { id: 'mi-1', calories_per_100g: 100, protein_per_100g: 0, fat_per_100g: 0, carbs_per_100g: 25 },
    ];
    const client = createMockClient(nutritionData);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '2', unit: 'tablespoon' }, // 2 tbsp = 30g
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert — 30g / 100 = factor 0.3
    expect(result.calories).toBeCloseTo(100 * 0.3);
    expect(result.carbs).toBeCloseTo(25 * 0.3);
  });

  test('handles teaspoon unit conversion', async () => {
    // Arrange
    const nutritionData = [
      { id: 'mi-1', calories_per_100g: 200, protein_per_100g: 0, fat_per_100g: 0, carbs_per_100g: 50 },
    ];
    const client = createMockClient(nutritionData);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '1', unit: 'teaspoon' }, // 1 tsp = 5g
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert — 5g / 100 = factor 0.05
    expect(result.calories).toBeCloseTo(200 * 0.05);
  });

  test('sums nutrition across multiple ingredients', async () => {
    // Arrange
    const nutritionData = [
      { id: 'mi-1', calories_per_100g: 60, protein_per_100g: 3, fat_per_100g: 3, carbs_per_100g: 5 },
      { id: 'mi-2', calories_per_100g: 340, protein_per_100g: 2, fat_per_100g: 36, carbs_per_100g: 3 },
    ];
    const client = createMockClient(nutritionData);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '1', unit: 'cup' },    // 240g
      { master_ingredient_id: 'mi-2', amount: '3/4', unit: 'cup' },  // 0.75 * 240 = 180g — but parseFloat('3/4') = 3
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert — calories should be sum of both
    expect(result.calories).toBeGreaterThan(0);
    expect(result.protein).toBeGreaterThan(0);
  });

  test('skips ingredients without matching nutrition data', async () => {
    // Arrange
    const nutritionData = [
      { id: 'mi-1', calories_per_100g: 100, protein_per_100g: 5, fat_per_100g: 5, carbs_per_100g: 10 },
    ];
    const client = createMockClient(nutritionData);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '1', unit: 'cup' },
      { master_ingredient_id: 'mi-999', amount: '1', unit: 'cup' }, // no match
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert — only mi-1 contributes
    expect(result.calories).toBeCloseTo(100 * 2.4);
  });

  test('returns zeros when database returns null', async () => {
    // Arrange
    const client = createMockClient(null);
    const ingredients = [
      { master_ingredient_id: 'mi-1', amount: '1', unit: 'cup' },
    ];

    // Act
    const result = await calculateNutrition(client as unknown as Parameters<typeof calculateNutrition>[0], ingredients);

    // Assert
    expect(result).toEqual({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  });
});
