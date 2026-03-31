/** Shared test mocks */
import { vi } from 'vitest';

/** Create a mock Supabase client that returns configurable data */
export function createMockSupabaseClient(overrides: Record<string, unknown> = {}) {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn(),
    ...overrides,
  };

  // Make terminal methods resolve with data
  mockQuery.single = vi.fn().mockResolvedValue({ data: overrides.singleData ?? null, error: null });

  const client = {
    from: vi.fn(() => mockQuery),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  return { client: client as unknown, mockQuery };
}

/** Sample recipe data for tests */
export const SAMPLE_RECIPE = {
  id: 'test-recipe-id',
  title: 'Test Vanilla Ice Cream',
  slug: 'test-vanilla-ice-cream',
  description: 'A test recipe',
  difficulty: 'beginner' as const,
  base_type: 'Ice Cream',
  hero_image_url: '/images/recipes/test.avif',
  avg_rating: 4.5,
  rating_count: 10,
  prep_time_minutes: 10,
  freeze_time_hours: 24,
  servings: 4,
  status: 'published' as const,
  published_at: '2026-03-25T09:00:00Z',
  author: { username: 'test', display_name: 'Test User', avatar_url: null },
  ingredients: [
    { id: '1', recipe_id: 'test', name: 'whole milk', amount: '1', unit: 'cup', group_name: 'base' as const, sort_order: 1, master_ingredient_id: 'mi-1' },
    { id: '2', recipe_id: 'test', name: 'heavy cream', amount: '3/4', unit: 'cup', group_name: 'base' as const, sort_order: 2, master_ingredient_id: 'mi-2' },
    { id: '3', recipe_id: 'test', name: 'granulated sugar', amount: '1/3', unit: 'cup', group_name: 'base' as const, sort_order: 3, master_ingredient_id: 'mi-3' },
  ],
  steps: [
    { step_number: 1, instruction: 'Mix ingredients', hint: 'Whisk well', image_url: null, duration_minutes: null },
    { step_number: 2, instruction: 'Freeze for 24 hours', hint: null, image_url: null, duration_minutes: null },
  ],
  categories: [
    { slug: 'ice-cream', name: 'Ice Cream', type: 'base_type' },
    { slug: 'vanilla', name: 'Vanilla', type: 'flavor_profile' },
    { slug: 'gluten-free', name: 'Gluten-Free', type: 'dietary' },
  ],
  tags: [{ name: 'beginner-friendly' }],
  models: [{ name: 'Ninja CREAMi 7-in-1', slug: '7-in-1', pint_size_oz: 16 }],
  video_url: null,
  video_thumbnail_url: null,
  meta_title: null,
  meta_description: null,
  is_sponsored: false,
  sponsor_name: null,
  sponsor_logo_url: null,
  sponsor_url: null,
  is_swirl_recipe: false,
  pint_size: '16oz',
  churn_program: 'Ice Cream',
};

/** Sample blog post data */
export const SAMPLE_POST = {
  id: 'test-post-id',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'A test excerpt',
  category: 'reviews',
  hero_image_url: '/images/blog/test.avif',
  published_at: '2026-03-25T09:00:00Z',
  created_at: '2026-03-24T09:00:00Z',
  body: '# Test Post\n\nThis is test content.',
  status: 'published' as const,
};
