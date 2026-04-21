/**
 * Apply Tier A translation fixes to recipe_translations.
 *
 * Usage:
 *   # Dry run (default): show what would change, don't commit
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-tier-a-fixes.ts data/tier-a-fixes-de.json
 *
 *   # Apply for real
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/apply-tier-a-fixes.ts data/tier-a-fixes-de.json --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const fixesPath = process.argv[2];
const apply = process.argv.includes('--apply');
if (!fixesPath) {
  console.error('Usage: apply-tier-a-fixes.ts <fixes.json> [--apply]');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Fix = {
  id: string;
  slug: string;
  new_title: string | null;
  new_description: string | null;
  _skip_reason?: string;
};

(async () => {
  const fixes: Fix[] = JSON.parse(readFileSync(fixesPath, 'utf8'));
  console.log(`Loaded ${fixes.length} fix entries from ${fixesPath}`);
  console.log(`Mode: ${apply ? 'APPLY (will write to DB)' : 'DRY RUN'}\n`);

  let skipped = 0;
  let updated = 0;
  let errored = 0;

  for (const fix of fixes) {
    if (fix._skip_reason) {
      console.log(`  SKIP  ${fix.slug} — ${fix._skip_reason}`);
      skipped++;
      continue;
    }

    const update: { title?: string; description?: string } = {};
    if (fix.new_title !== null) update.title = fix.new_title;
    if (fix.new_description !== null) update.description = fix.new_description;

    if (Object.keys(update).length === 0) {
      console.log(`  NOOP  ${fix.slug} — nothing to update`);
      skipped++;
      continue;
    }

    // Show before/after
    const { data: before, error: e1 } = await supabase
      .from('recipe_translations')
      .select('title, description')
      .eq('id', fix.id)
      .single();
    if (e1 || !before) {
      console.log(`  ERR   ${fix.slug} — fetch failed: ${e1?.message}`);
      errored++;
      continue;
    }

    console.log(`  ${apply ? 'WRITE' : 'DIFF '} ${fix.slug}`);
    if (update.title !== undefined && update.title !== before.title) {
      console.log(`    title:  ${JSON.stringify(before.title)}`);
      console.log(`         -> ${JSON.stringify(update.title)}`);
    }
    if (update.description !== undefined && update.description !== before.description) {
      console.log(`    desc:   ${JSON.stringify(before.description)}`);
      console.log(`         -> ${JSON.stringify(update.description)}`);
    }

    if (apply) {
      const { error: e2 } = await supabase
        .from('recipe_translations')
        .update(update)
        .eq('id', fix.id);
      if (e2) {
        console.log(`    ERROR: ${e2.message}`);
        errored++;
        continue;
      }
      updated++;
    } else {
      updated++;
    }
  }

  console.log(`\nDone. ${apply ? 'Updated' : 'Would update'}: ${updated}, Skipped: ${skipped}, Errors: ${errored}`);
})();
