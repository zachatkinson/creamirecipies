/**
 * Build-time i18n key validation.
 * Ensures all locale JSON files have the same keys as English.
 * Run: npx tsx scripts/validate-i18n.ts
 */

import en from '../src/i18n/en.json';
import fr from '../src/i18n/fr.json';
import es from '../src/i18n/es.json';
import de from '../src/i18n/de.json';
import pt from '../src/i18n/pt.json';

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const locales = { fr, es, de, pt };
let errors = 0;

for (const [locale, data] of Object.entries(locales)) {
  const localeKeys = new Set(getKeys(data));

  // Keys in English but missing from this locale
  for (const key of enKeys) {
    if (!localeKeys.has(key)) {
      console.error(`MISSING [${locale}]: ${key}`);
      errors++;
    }
  }

  // Keys in this locale but not in English (orphaned)
  for (const key of localeKeys) {
    if (!enKeys.has(key)) {
      console.warn(`ORPHAN  [${locale}]: ${key}`);
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} missing translation keys found.`);
  process.exit(1);
} else {
  console.log(`✓ All ${enKeys.size} keys present in all 5 locales.`);
}
