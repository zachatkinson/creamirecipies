/**
 * Sample flagged rows from post_translations and step_translations to gauge
 * false-positive rate and scope real work.
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DIACRITICS: Record<string, string> = {
  fr: 'àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ',
  de: 'äöüßÄÖÜ',
  pt: 'ãõáéíóúâêîôûàçÁÉÍÓÚÂÊÎÔÛÀÇÃÕ',
};

function hasDia(text: string, locale: keyof typeof DIACRITICS): boolean {
  const set = DIACRITICS[locale];
  for (const ch of text) if (set.includes(ch)) return true;
  return false;
}

(async () => {
  console.log('=== STEP TRANSLATIONS — FR samples (missing diacritics) ===');
  const { data: steps } = await supabase.from('step_translations').select('*').limit(2000);
  let fr = 0;
  for (const s of steps ?? []) {
    const text = s.instruction_fr;
    if (!text || text.length < 40 || hasDia(text, 'fr')) continue;
    fr++;
    if (fr > 10) break;
    console.log(`  [${s.id.slice(0, 8)}] ${text.slice(0, 120)}`);
  }

  console.log('\n=== STEP TRANSLATIONS — PT EN-leak samples ===');
  let pt = 0;
  for (const s of steps ?? []) {
    const text = s.instruction_pt ?? '';
    if (!/\b(ice cream|frozen yogurt|chocolate chip|brown sugar|cream cheese|cookie dough)\b/i.test(text)) continue;
    pt++;
    if (pt > 10) break;
    console.log(`  [${s.id.slice(0, 8)}] ${text.slice(0, 120)}`);
  }

  console.log('\n=== POST_TRANSLATIONS — FR missing-diacritic samples ===');
  const { data: ptrans } = await supabase.from('post_translations').select('*').eq('locale', 'fr').limit(200);
  let fp = 0;
  for (const p of ptrans ?? []) {
    // Use body as the signal (it's the long one)
    const text = (p.body ?? '').slice(0, 400);
    if (text.length < 40 || hasDia(text, 'fr')) continue;
    fp++;
    if (fp > 5) break;
    console.log(`  post_id=${p.post_id.slice(0, 8)} title="${p.title}"`);
    console.log(`    body[:200]: ${text.slice(0, 200)}`);
  }

  console.log('\n=== POST_TRANSLATIONS — PT EN-leak samples ===');
  const { data: ptPosts } = await supabase.from('post_translations').select('*').eq('locale', 'pt').limit(200);
  let pp = 0;
  for (const p of ptPosts ?? []) {
    const combined = [p.title, p.excerpt, (p.body ?? '').slice(0, 1500)].join(' ');
    if (!/\b(ice cream|frozen yogurt|chocolate chip|brown sugar|cookie dough|graham cracker|soft serve|cookies and cream|cream cheese)\b/i.test(combined)) continue;
    pp++;
    if (pp > 5) break;
    const match = combined.match(/([^.]{0,80}\b(ice cream|frozen yogurt|chocolate chip|brown sugar|cookie dough|graham cracker|soft serve|cookies and cream|cream cheese)\b[^.]{0,80})/i);
    console.log(`  post_id=${p.post_id.slice(0, 8)} title="${p.title}"`);
    console.log(`    hit: ...${match?.[1] ?? '???'}...`);
  }
})();
