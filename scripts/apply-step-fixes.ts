/**
 * Apply step_translations cell-level fixes.
 *
 * Usage:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-step-fixes.ts          # dry run
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-step-fixes.ts --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

type Fix = {
  id: string;
  en: string;
  instruction_fr?: string;
  instruction_es?: string;
  instruction_de?: string;
  instruction_pt?: string;
  hint_fr?: string;
  hint_es?: string;
  hint_de?: string;
  hint_pt?: string;
};

(async () => {
  const fixes: Fix[] = JSON.parse(readFileSync('data/step-fixes.json', 'utf8'));
  console.log(`Loaded ${fixes.length} fixes. Mode: ${apply ? 'APPLY' : 'DRY RUN'}\n`);

  let cells = 0, errors = 0;
  for (const f of fixes) {
    const update: Record<string, string> = {};
    for (const k of ['instruction_fr', 'instruction_es', 'instruction_de', 'instruction_pt',
                     'hint_fr', 'hint_es', 'hint_de', 'hint_pt']) {
      if (f[k as keyof Fix]) update[k] = f[k as keyof Fix] as string;
    }
    if (Object.keys(update).length === 0) continue;

    console.log(`  ${apply ? 'WRITE' : 'DIFF '} ${f.id.slice(0, 8)} — ${f.en}`);
    for (const [k, v] of Object.entries(update)) {
      console.log(`    ${k}: ${v}`);
      cells++;
    }
    if (apply) {
      const { error } = await supabase.from('step_translations').update(update).eq('id', f.id);
      if (error) { console.log(`    ERROR: ${error.message}`); errors++; }
    }
  }
  console.log(`\n${apply ? 'Updated' : 'Would update'} ${cells} cells. Errors: ${errors}`);
})();
