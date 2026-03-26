/**
 * IndexNow API endpoint — call this when new recipes are published
 * to notify Bing/Yandex for near-instant indexing.
 *
 * POST /api/indexnow { urls: ["/recipes/new-recipe-slug"] }
 *
 * PLACEHOLDER: Replace INDEXNOW_API_KEY with a real key from https://www.indexnow.org/
 */
import type { APIRoute } from 'astro';

const INDEXNOW_API_KEY = import.meta.env.INDEXNOW_API_KEY ?? 'PLACEHOLDER_KEY';
const SITE_HOST = 'creami.recipes';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { urls } = await request.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'urls array required' }), { status: 400 });
    }

    const fullUrls = urls.map((u: string) => `https://${SITE_HOST}${u}`);

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_API_KEY,
        urlList: fullUrls,
      }),
    });

    return new Response(JSON.stringify({ ok: response.ok, status: response.status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'IndexNow submission failed' }), { status: 500 });
  }
};

export const prerender = false;
