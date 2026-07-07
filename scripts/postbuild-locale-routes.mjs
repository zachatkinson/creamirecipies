/**
 * Post-build: inject routes into the Vercel output config that the
 * @astrojs/vercel adapter doesn't emit correctly.
 *
 * The adapter generates a catch-all route with status: 404 for unmatched
 * paths, which stamps a 404 on anything reaching it. Two cases need to bypass
 * that:
 *   1. Locale-prefixed URLs (/fr/*, /es/*, …) must reach the Astro function
 *      WITHOUT the 404 status so middleware can rewrite them to the base path.
 *   2. /ads.txt must 301 to Ezoic's Ads.txt Manager at the edge (the function's
 *      own redirect status gets overridden to 404 by the catch-all).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CONFIG_PATH = '.vercel/output/config.json';
const LOCALES = ['fr', 'es', 'de', 'pt'];
const ADSTXT_TARGET = 'https://srv.adstxtmanager.com/19390/eatcreami.com';

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

// 1. Edge 301 for Ezoic ads.txt — highest priority, before any catch-all.
if (!config.routes.some((r) => r.src === '^/ads\\.txt$')) {
  config.routes.unshift({
    src: '^/ads\\.txt$',
    status: 301,
    headers: { Location: ADSTXT_TARGET },
  });
  console.log('[postbuild] Injected ads.txt 301 →', ADSTXT_TARGET);
}

// 2. Locale routes before the catch-all 404.
const catchAllIndex = config.routes.findIndex(
  (r) => r.src === '^/.*$' && r.status === 404
);
if (catchAllIndex !== -1) {
  const localePattern = `^/(${LOCALES.join('|')})(/.*)?$`;
  config.routes.splice(catchAllIndex, 0, { src: localePattern, dest: '_render' });
  console.log(`[postbuild] Injected locale route: ${localePattern}`);
} else {
  console.warn('[postbuild] Catch-all 404 route not found — locale routes not injected');
}

writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'));
