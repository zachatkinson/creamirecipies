/**
 * Apply Tier C mechanical diacritic fixes.
 *
 * Usage:
 *   # Dry run
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-tier-c.ts
 *
 *   # Apply
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-tier-c.ts --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

type Candidate = {
  id: string;
  slug?: string;
  title_before: string | null;
  title_after: string | null;
  desc_before: string | null;
  desc_after: string | null;
};

(async () => {
  const candidates: Candidate[] = JSON.parse(readFileSync('data/tier-c-candidates.json', 'utf8'));
  console.log(`Loaded ${candidates.length} candidates`);
  console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}\n`);

  let updated = 0;
  let errored = 0;

  for (const c of candidates) {
    const update: { title?: string; description?: string } = {};
    if (c.title_after !== null) update.title = c.title_after;
    if (c.desc_after !== null) update.description = c.desc_after;
    if (Object.keys(update).length === 0) continue;

    if (apply) {
      const { error } = await supabase.from('recipe_translations').update(update).eq('id', c.id);
      if (error) {
        console.log(`  ERR ${c.slug} — ${error.message}`);
        errored++;
        continue;
      }
    }
    updated++;
  }

  console.log(`\n${apply ? 'Updated' : 'Would update'}: ${updated}, Errors: ${errored}`);
})();
