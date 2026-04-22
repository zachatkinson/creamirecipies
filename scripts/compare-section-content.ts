import { readFileSync } from 'fs';
const slug = process.argv[2];
const locale = process.argv[3] ?? 'de';
if (!slug) { console.error('usage: compare-section-content.ts <slug> [locale]'); process.exit(1); }
const data = JSON.parse(readFileSync(`data/spot-check/${slug}.json`, 'utf8'));

function sections(body: string): Array<{ heading: string; paras: string[] }> {
  const parts = body.split(/\n(?=## )/);
  return parts.map(p => {
    const [h, ...rest] = p.split('\n');
    return { heading: h.replace(/^##\s+/, ''), paras: rest.join('\n').split(/\n\n+/).filter(Boolean) };
  });
}

const en = sections(data.en.body);
const tr = sections(data.trs[locale].body);

for (let i = 0; i < en.length; i++) {
  const e = en[i];
  const t = tr[i];
  console.log(`\n----- Section ${i+1}: ${e.heading} -----`);
  console.log(`  EN: ${e.paras.length} paras`);
  if (t) console.log(`  ${locale}: ${t.paras.length} paras  (${t.heading})`);
  const maxParas = Math.max(e.paras.length, t?.paras.length ?? 0);
  for (let j = 0; j < maxParas; j++) {
    const ep = e.paras[j];
    const tp = t?.paras[j];
    const epLen = ep ? ep.length : 0;
    const tpLen = tp ? tp.length : 0;
    console.log(`\n  Para ${j+1}:  EN:${epLen}c   ${locale}:${tpLen}c`);
    if (ep) console.log(`    EN: ${ep.slice(0, 200).replace(/\n/g,' ')}${ep.length > 200 ? '…' : ''}`);
    if (tp) console.log(`    ${locale.toUpperCase()}: ${tp.slice(0, 200).replace(/\n/g,' ')}${tp.length > 200 ? '…' : ''}`);
    else console.log(`    ${locale.toUpperCase()}: (MISSING)`);
  }
}
