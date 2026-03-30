/**
 * Post-build: inject locale prefix routes into Vercel output config.
 *
 * The @astrojs/vercel adapter generates a catch-all route with status: 404
 * for unmatched paths. Locale-prefixed URLs (/fr/*, /es/*, etc.) need to
 * reach the Astro serverless function WITHOUT the 404 status so middleware
 * can rewrite them to the base path.
 *
 * This script adds locale routes before the catch-all.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CONFIG_PATH = '.vercel/output/config.json';
const LOCALES = ['fr', 'es', 'de', 'pt'];

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

const catchAllIndex = config.routes.findIndex(
  (r) => r.src === '^/.*$' && r.status === 404
);

if (catchAllIndex !== -1) {
  const localePattern = `^/(${LOCALES.join('|')})(/.*)?$`;
  config.routes.splice(catchAllIndex, 0, { src: localePattern, dest: '_render' });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, '\t'));
  console.log(`[postbuild] Injected locale route: ${localePattern}`);
} else {
  console.warn('[postbuild] Catch-all 404 route not found — locale routes not injected');
}
