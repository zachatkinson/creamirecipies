import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getFilteredRecipes } from '../../../lib/recipes';
import type { RecipeQueryParams } from '../../../lib/recipes';
import { resolveLocale } from '../../../lib/locale';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const params = url.searchParams;
  const locale = resolveLocale(params, locals as Record<string, unknown>);

  const queryParams: RecipeQueryParams = {
    q: params.get('q') || undefined,
    base: params.getAll('base').filter(Boolean),
    difficulty: params.getAll('difficulty').filter(Boolean),
    flavor: params.getAll('flavor').filter(Boolean),
    dietary: params.getAll('dietary').filter(Boolean),
    tag: params.getAll('tag').filter(Boolean),
    model: params.getAll('model').filter(Boolean),
    rating: params.get('rating') ? Number(params.get('rating')) : undefined,
    sort: (params.get('sort') as RecipeQueryParams['sort']) || 'newest',
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: Math.min(48, Math.max(1, Number(params.get('pageSize')) || 24)),
    locale,
  };

  const result = await getFilteredRecipes(supabase, queryParams);

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
};
