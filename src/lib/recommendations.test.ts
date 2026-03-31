import { describe, test, expect, vi } from 'vitest';
import { getSimilarRecipes } from './recommendations';

function createMockClient(options: {
  catIds?: { id: string }[];
  sharedLinks?: { recipe_id: string }[];
  sharedIngs?: { recipe_id: string }[];
  similarRecipes?: Record<string, unknown>[];
  fallbackRecipes?: Record<string, unknown>[];
} = {}) {
  let callCount = 0;
  const query = {
    select: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn(function (this: typeof query) {
      callCount++;
      // Different responses based on call order
      if (callCount <= 1) return Promise.resolve({ data: options.similarRecipes ?? [] });
      return Promise.resolve({ data: options.fallbackRecipes ?? [] });
    }),
  };

  // Override specific from() table responses
  const fromResponses: Record<string, unknown> = {
    categories: { ...query, select: vi.fn().mockReturnValue({ ...query, in: vi.fn().mockResolvedValue({ data: options.catIds ?? [] }) }) },
    recipe_categories: { ...query, select: vi.fn().mockReturnValue({ ...query, in: vi.fn().mockReturnValue({ ...query, neq: vi.fn().mockResolvedValue({ data: options.sharedLinks ?? [] }) }) }) },
    ingredients: { ...query, select: vi.fn().mockReturnValue({ ...query, in: vi.fn().mockReturnValue({ ...query, neq: vi.fn().mockResolvedValue({ data: options.sharedIngs ?? [] }) }) }) },
    recipes: query,
  };

  return {
    from: vi.fn((table: string) => fromResponses[table] || query),
  };
}

describe('getSimilarRecipes', () => {
  test('returns empty array when no category slugs provided', async () => {
    // Arrange
    const client = createMockClient();

    // Act
    const result = await getSimilarRecipes(client as unknown as Parameters<typeof getSimilarRecipes>[0], 'recipe-1', [], 'en');

    // Assert
    expect(result).toEqual([]);
  });

  test('returns empty array when no shared categories found', async () => {
    // Arrange
    const client = createMockClient({ catIds: [] });

    // Act
    const result = await getSimilarRecipes(client as unknown as Parameters<typeof getSimilarRecipes>[0], 'recipe-1', ['ice-cream'], 'en');

    // Assert
    expect(result).toEqual([]);
  });

  test('calls categories table with provided slugs', async () => {
    // Arrange
    const client = createMockClient({ catIds: [{ id: 'cat-1' }], sharedLinks: [] });

    // Act
    await getSimilarRecipes(client as unknown as Parameters<typeof getSimilarRecipes>[0], 'recipe-1', ['ice-cream', 'vanilla'], 'en');

    // Assert
    expect(client.from).toHaveBeenCalledWith('categories');
  });

  test('respects limit parameter', async () => {
    // Arrange
    const client = createMockClient({
      catIds: [{ id: 'cat-1' }],
      sharedLinks: [
        { recipe_id: 'r-2' }, { recipe_id: 'r-3' }, { recipe_id: 'r-4' },
      ],
      similarRecipes: [
        { id: 'r-2', title: 'Recipe 2' },
        { id: 'r-3', title: 'Recipe 3' },
      ],
    });

    // Act
    const result = await getSimilarRecipes(client as unknown as Parameters<typeof getSimilarRecipes>[0], 'recipe-1', ['ice-cream'], 'en', 2);

    // Assert
    expect(result.length).toBeLessThanOrEqual(2);
  });
});
