/**
 * Backfill published recipes and blog posts to the Wayback Machine.
 *
 * Submits the canonical English URL for each published item to
 * https://web.archive.org/save/{url}. Respects the anonymous rate
 * limit (~15/min) by sleeping between requests.
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/backfill-wayback.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SITE = 'https://eatcreami.com';
const DELAY_MS = 5000;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

async function submitToWayback(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      method: 'GET',
      headers: { 'User-Agent': 'eatcreami-wayback-bot/1.0' },
      redirect: 'manual',
    });
    return { ok: res.status < 500, status: res.status };
  } catch (err) {
    return { ok: false, status: 0 };
  }
}

async function main(): Promise<void> {
  const { data: recipes, error: rErr } = await supabase
    .from('recipes')
    .select('slug')
    .eq('status', 'published')
    .order('scheduled_publish_at', { ascending: true });
  if (rErr) { console.error('Recipe fetch failed:', rErr.message); process.exit(1); }

  const { data: posts, error: pErr } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')
    .order('published_at', { ascending: true });
  if (pErr) { console.error('Post fetch failed:', pErr.message); process.exit(1); }

  const urls: string[] = [
    ...(recipes ?? []).map(r => `${SITE}/recipes/${r.slug}`),
    ...(posts ?? []).map(p => `${SITE}/blog/${p.slug}`),
  ];

  console.log(`Submitting ${urls.length} URLs to Wayback Machine (${DELAY_MS}ms between requests)...\n`);

  let ok = 0, fail = 0;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await submitToWayback(url);
    const prefix = `[${i + 1}/${urls.length}]`;
    if (result.ok) {
      ok++;
      console.log(`${prefix} OK  (${result.status}) ${url}`);
    } else {
      fail++;
      console.log(`${prefix} FAIL (${result.status}) ${url}`);
    }
    if (i < urls.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nDone: ${ok} succeeded, ${fail} failed.`);
}

main().catch(e => { console.error(e); process.exit(1); });
