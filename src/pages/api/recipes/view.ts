/**
 * Record a recipe page view. Called client-side on page load so bots
 * (which rarely execute JS) don't inflate the count.
 *
 * POST /api/recipes/view { slug: "..." }
 */
import type { APIRoute } from 'astro';
import { createSupabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 200) {
      return new Response(JSON.stringify({ error: 'slug required' }), { status: 400 });
    }

    const admin = createSupabaseAdmin();
    // @ts-expect-error — increment_recipe_views was added in migration 028, DB types not yet regenerated
    const { error } = await admin.rpc('increment_recipe_views', { p_slug: slug });
    if (error) {
      return new Response(JSON.stringify({ ok: false }), { status: 200 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
};
