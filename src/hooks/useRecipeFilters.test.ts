import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeFilters } from './useRecipeFilters';
import type { RecipeData } from './useRecipeFilters';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.history
const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockReturnValue({ matches: false }),
});

const sampleRecipes: RecipeData[] = [
  { id: '1', title: 'Vanilla', slug: 'vanilla', description: 'Vanilla ice cream', difficulty: 'beginner', base_type: 'Ice Cream', avg_rating: 4, rating_count: 5, prep_time_minutes: 10, hero_image_url: null, categories: [], models: [] },
  { id: '2', title: 'Chocolate', slug: 'chocolate', description: 'Chocolate ice cream', difficulty: 'intermediate', base_type: 'Ice Cream', avg_rating: 5, rating_count: 3, prep_time_minutes: 15, hero_image_url: null, categories: [], models: [] },
];

beforeEach(() => {
  mockFetch.mockReset();
  replaceStateSpy.mockClear();
});

describe('useRecipeFilters', () => {
  test('initializes with provided recipes and total', () => {
    // Arrange & Act
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 10, {}));

    // Assert
    expect(result.current.recipes).toEqual(sampleRecipes);
    expect(result.current.total).toBe(10);
    expect(result.current.loading).toBe(false);
  });

  test('hasMore is true when recipes.length < total', () => {
    // Arrange & Act
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 10, {}));

    // Assert
    expect(result.current.hasMore).toBe(true);
  });

  test('hasMore is false when all recipes loaded', () => {
    // Arrange & Act
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Assert
    expect(result.current.hasMore).toBe(false);
  });

  test('query defaults to empty string', () => {
    // Arrange & Act
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Assert
    expect(result.current.query).toBe('');
  });

  test('setQuery updates query state', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act
    act(() => { result.current.setQuery('vanilla'); });

    // Assert
    expect(result.current.query).toBe('vanilla');
  });

  test('clearAll resets all filter state', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act — set some filters then clear
    act(() => {
      result.current.setQuery('test');
      result.current.setMinRating(4);
      result.current.setSortBy('rating');
    });
    act(() => { result.current.clearAll(); });

    // Assert
    expect(result.current.query).toBe('');
    expect(result.current.minRating).toBe(0);
    expect(result.current.sortBy).toBe('newest');
  });

  test('toggle adds value to set', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act
    act(() => {
      result.current.toggle(result.current.selectedDifficulty, 'beginner', result.current.setSelectedDifficulty);
    });

    // Assert
    expect(result.current.selectedDifficulty.has('beginner')).toBe(true);
  });

  test('toggle removes value if already in set', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act — toggle on then off
    act(() => {
      result.current.toggle(result.current.selectedDifficulty, 'beginner', result.current.setSelectedDifficulty);
    });
    act(() => {
      result.current.toggle(result.current.selectedDifficulty, 'beginner', result.current.setSelectedDifficulty);
    });

    // Assert
    expect(result.current.selectedDifficulty.has('beginner')).toBe(false);
  });

  test('mobileFilterOpen defaults to false', () => {
    // Arrange & Act
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Assert
    expect(result.current.mobileFilterOpen).toBe(false);
  });

  test('setMobileFilterOpen toggles mobile filter', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act
    act(() => { result.current.setMobileFilterOpen(true); });

    // Assert
    expect(result.current.mobileFilterOpen).toBe(true);
  });

  test('toggleGroup expands/collapses filter groups', () => {
    // Arrange
    const { result } = renderHook(() => useRecipeFilters(sampleRecipes, 2, {}));

    // Act
    act(() => { result.current.toggleGroup('difficulty'); });

    // Assert
    expect(result.current.expandedGroups.has('difficulty')).toBe(true);

    // Act — toggle again
    act(() => { result.current.toggleGroup('difficulty'); });

    // Assert
    expect(result.current.expandedGroups.has('difficulty')).toBe(false);
  });
});
