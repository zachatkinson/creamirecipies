/**
 * IndexNow API endpoint — notify Bing/Yandex for near-instant indexing.
 *
 * POST /api/indexnow { urls: ["/recipes/new-recipe-slug"] }
 *
 * Automatically expands each path to all locale variants (en, fr, es, de, pt).
 */
import type { APIRoute } from 'astro';

const INDEXNOW_API_KEY = import.meta.env.INDEXNOW_API_KEY ?? '3259e128db3d124710601aa575a1293a';
const SITE_HOST = 'eatcreami.com';
const LOCALE_PREFIXES = ['', '/fr', '/es', '/de', '/pt'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const { urls } = await request.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'urls array required' }), { status: 400 });
    }

    const fullUrls = urls.flatMap((u: string) =>
      LOCALE_PREFIXES.map((prefix) => `https://${SITE_HOST}${prefix}${u}`)
    );

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
