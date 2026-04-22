/**
 * For a given slug, print the top-level ## headings for each locale side-by-side
 * to expose which sections got dropped during translation.
 */
import { readFileSync } from 'fs';

const slug = process.argv[2];
if (!slug) { console.error('usage: compare-sections.ts <slug>'); process.exit(1); }
const data = JSON.parse(readFileSync(`data/spot-check/${slug}.json`, 'utf8'));

function headings(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());
}

const enHeads = headings(data.en.body);
const locales = ['fr','es','de','pt'] as const;
const locHeads: Record<string, string[]> = {};
for (const loc of locales) locHeads[loc] = headings(data.trs[loc]?.body ?? '');

console.log(`== ${slug} ==`);
console.log(`EN has ${enHeads.length} ## headings, ${data.en.paras} paras`);
for (const loc of locales) {
  console.log(`${loc}: ${locHeads[loc].length} ## headings, ${data.trs[loc].paras} paras, ${data.trs[loc].wc}w`);
}
console.log(`\nEN heading walk:`);
for (let i = 0; i < enHeads.length; i++) {
  const row = [
    `${String(i+1).padStart(2,' ')}. ${enHeads[i]}`.padEnd(55),
    `fr: ${locHeads.fr[i] ?? '--'}`.padEnd(50),
    `de: ${locHeads.de[i] ?? '--'}`,
  ];
  console.log(`  ${row[0]}`);
  console.log(`    fr: ${locHeads.fr[i] ?? '(MISSING)'}`);
  console.log(`    es: ${locHeads.es[i] ?? '(MISSING)'}`);
  console.log(`    de: ${locHeads.de[i] ?? '(MISSING)'}`);
  console.log(`    pt: ${locHeads.pt[i] ?? '(MISSING)'}`);
}
