import { describe, test, expect } from 'vitest';
import { assembleFanFavorites } from './fanFavorites';

interface Row {
  id: string;
}
const idOf = (r: Row): string => r.id;
const rows = (...ids: string[]): Row[] => ids.map((id) => ({ id }));
const mapOf = (items: Row[]): Map<string, Row> => new Map(items.map((r) => [r.id, r]));

describe('assembleFanFavorites', () => {
  test('returns ranked rows in rank order when the window fully fills the list', () => {
    // Arrange
    const ranked = rows('a', 'b', 'c');
    const fallback = rows('x', 'y', 'z');
    // Act
    const result = assembleFanFavorites(['a', 'b', 'c'], mapOf(ranked), fallback, 3, idOf);
    // Assert
    expect(result.map(idOf)).toEqual(['a', 'b', 'c']);
  });

  test('falls back to all-time pool when there are no ranked ids', () => {
    // Arrange
    const fallback = rows('x', 'y', 'z', 'w');
    // Act
    const result = assembleFanFavorites([], new Map(), fallback, 3, idOf);
    // Assert
    expect(result.map(idOf)).toEqual(['x', 'y', 'z']);
  });

  test('fills the shortfall from the fallback pool after ranked entries', () => {
    // Arrange
    const ranked = rows('a');
    const fallback = rows('x', 'y', 'z');
    // Act
    const result = assembleFanFavorites(['a'], mapOf(ranked), fallback, 3, idOf);
    // Assert
    expect(result.map(idOf)).toEqual(['a', 'x', 'y']);
  });

  test('de-duplicates ids shared between the ranked list and the fallback pool', () => {
    // Arrange
    const ranked = rows('a', 'b');
    const fallback = rows('a', 'c', 'd'); // 'a' also appears in the fallback pool
    // Act
    const result = assembleFanFavorites(['a', 'b'], mapOf(ranked), fallback, 3, idOf);
    // Assert
    expect(result.map(idOf)).toEqual(['a', 'b', 'c']);
  });

  test('skips ranked ids that have no matching card row', () => {
    // Arrange — 'b' ranked but missing from the map (e.g. unpublished between calls)
    const ranked = rows('a', 'c');
    const fallback = rows('z');
    // Act
    const result = assembleFanFavorites(['a', 'b', 'c'], mapOf(ranked), fallback, 3, idOf);
    // Assert
    expect(result.map(idOf)).toEqual(['a', 'c', 'z']);
  });

  test('never exceeds the requested limit', () => {
    // Arrange
    const ranked = rows('a', 'b', 'c', 'd');
    // Act
    const result = assembleFanFavorites(['a', 'b', 'c', 'd'], mapOf(ranked), rows('x'), 3, idOf);
    // Assert
    expect(result).toHaveLength(3);
  });
});
