import type { APIRoute } from 'astro';
import { supabase, createSupabaseAdmin } from '../../../lib/supabase';
import crypto from 'node:crypto';

export const prerender = false;

/** Hash IP address for privacy-safe deduplication */
function hashIp(ip: string): string {
  const salt = import.meta.env.RATING_SALT ?? 'eatcreami-ratings-2026';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

/** Rate limit: max ratings per IP per hour */
const RATE_LIMIT = 10;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { recipe_id, rating, honeypot } = body;

    // Honeypot check — bots fill hidden fields, humans don't
    if (honeypot) {
      // Silently accept but don't save (don't reveal the trap)
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate inputs
    if (!recipe_id || typeof recipe_id !== 'string') {
      return new Response(JSON.stringify({ error: 'recipe_id required' }), { status: 400 });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return new Response(JSON.stringify({ error: 'rating must be 1-5' }), { status: 400 });
    }

    // Get IP and hash it
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown';
    const ipHash = hashIp(ip);

    // Rate limiting: check recent ratings from this IP
    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
    const { count: recentCount } = await supabase
      .from('anonymous_ratings')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', oneHourAgo);

    if ((recentCount ?? 0) >= RATE_LIMIT) {
      return new Response(JSON.stringify({ error: 'Too many ratings. Try again later.' }), { status: 429 });
    }

    // Verify recipe exists
    const { data: recipe } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', recipe_id)
      .eq('status', 'published')
      .single();

    if (!recipe) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404 });
    }

    // Upsert rating (one per recipe per IP)
    const { error } = await supabase
      .from('anonymous_ratings')
      .upsert(
        { recipe_id, rating: ratingNum, ip_hash: ipHash },
        { onConflict: 'recipe_id,ip_hash' },
      );

    if (error) {
      console.warn('[rate]', error.message);
      return new Response(JSON.stringify({ error: 'Failed to save rating' }), { status: 500 });
    }

    // Recalculate avg from anonymous_ratings using admin client
    const admin = createSupabaseAdmin();
    const { data: allRatings } = await admin
      .from('anonymous_ratings')
      .select('rating')
      .eq('recipe_id', recipe_id);

    const ratings = allRatings ?? [];
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 100) / 100
      : 0;

    await admin
      .from('recipes')
      .update({ avg_rating: avgRating, rating_count: ratings.length })
      .eq('id', recipe_id);

    return new Response(JSON.stringify({
      ok: true,
      avg_rating: avgRating,
      rating_count: ratings.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};
