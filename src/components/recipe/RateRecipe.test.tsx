import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RateRecipe from './RateRecipe';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockReturnValue({ matches: false }),
});

// Mock canvas context for confetti burst
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  fillRect: vi.fn(),
  set globalAlpha(_: number) {},
  set fillStyle(_: string) {},
});

beforeEach(() => {
  mockFetch.mockReset();
  // Clear all cookies
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
});

describe('RateRecipe', () => {
  test('renders star buttons and prompt text', () => {
    // Arrange & Act
    render(<RateRecipe recipeId="test-id" initialRating={0} initialCount={0} />);

    // Assert
    expect(screen.getByText('How would you rate this recipe?')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  test('shows "Be the first to rate!" when no ratings exist', () => {
    // Arrange & Act
    render(<RateRecipe recipeId="test-id" initialRating={0} initialCount={0} />);

    // Assert
    expect(screen.getByText('Be the first to rate!')).toBeInTheDocument();
  });

  test('shows average when ratings exist', () => {
    // Arrange & Act
    render(<RateRecipe recipeId="test-id" initialRating={4.5} initialCount={10} />);

    // Assert
    expect(screen.getByText('4.5 average from 10 ratings')).toBeInTheDocument();
  });

  test('submits rating on star click', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, avg_rating: 4, rating_count: 1 }),
    });
    render(<RateRecipe recipeId="test-id" initialRating={0} initialCount={0} />);

    // Act
    fireEvent.click(screen.getByLabelText('4 stars'));

    // Assert
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/recipes/rate', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  test('sends correct payload with honeypot', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, avg_rating: 5, rating_count: 1 }),
    });
    render(<RateRecipe recipeId="my-recipe" initialRating={0} initialCount={0} />);

    // Act
    fireEvent.click(screen.getByLabelText('5 stars'));

    // Assert
    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.recipe_id).toBe('my-recipe');
      expect(body.rating).toBe(5);
      expect(body.honeypot).toBe('');
    });
  });

  test('shows thanks message after successful rating', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, avg_rating: 4, rating_count: 1 }),
    });
    render(<RateRecipe recipeId="test-id" initialRating={0} initialCount={0} />);

    // Act
    fireEvent.click(screen.getByLabelText('4 stars'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Thanks for rating!')).toBeInTheDocument();
    });
  });

  test('shows error message on failed rating', async () => {
    // Arrange — use unique recipeId so cookie from prior tests doesn't interfere
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed' }),
    });
    render(<RateRecipe recipeId="error-test-id" initialRating={0} initialCount={0} />);

    // Act
    fireEvent.click(screen.getByLabelText('3 stars'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables stars after successful rating', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, avg_rating: 5, rating_count: 1 }),
    });
    render(<RateRecipe recipeId="test-id" initialRating={0} initialCount={0} />);

    // Act
    fireEvent.click(screen.getByLabelText('5 stars'));

    // Assert
    await waitFor(() => {
      screen.getAllByRole('radio').forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });

  test('updates displayed average after rating', async () => {
    // Arrange — unique recipeId to avoid cookie interference
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true, avg_rating: 4.5, rating_count: 2 }),
    });
    render(<RateRecipe recipeId="avg-test-id" initialRating={4} initialCount={1} />);

    // Act
    fireEvent.click(screen.getByLabelText('5 stars'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('4.5 average from 2 ratings')).toBeInTheDocument();
    });
  });
});
