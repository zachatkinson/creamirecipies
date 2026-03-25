/**
 * Publish Scheduled Recipes
 *
 * Finds all draft recipes whose scheduled_publish_at is in the past
 * and updates their status to 'published'.
 *
 * Intended to run as a daily cron job or Supabase Edge Function.
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/publish-scheduled.ts
 */

import { createClient } from '@supabase/supabase-js';

// --- Config ---
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Main ---

async function main(): Promise<void> {
  const now = new Date().toISOString();
  console.log(`[${now}] Checking for scheduled recipes ready to publish...`);

  // Find all draft recipes with scheduled_publish_at <= now
  const { data: readyRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, slug, base_type, scheduled_publish_at')
    .eq('status', 'draft')
    .not('scheduled_publish_at', 'is', null)
    .lte('scheduled_publish_at', now)
    .order('scheduled_publish_at', { ascending: true });

  if (fetchError) {
    console.error('Failed to fetch scheduled recipes:', fetchError.message);
    process.exit(1);
  }

  if (!readyRecipes || readyRecipes.length === 0) {
    console.log('No recipes ready to publish.');
    return;
  }

  console.log(`Found ${readyRecipes.length} recipe(s) ready to publish:\n`);

  // Publish each recipe
  let successCount = 0;
  let failCount = 0;

  for (const recipe of readyRecipes) {
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        status: 'published',
        scheduled_publish_at: null, // Clear the schedule
      })
      .eq('id', recipe.id);

    if (updateError) {
      console.error(`  FAIL: "${recipe.title}" (${recipe.slug}) - ${updateError.message}`);
      failCount++;
    } else {
      console.log(`  OK: "${recipe.title}" (${recipe.base_type}) - scheduled for ${recipe.scheduled_publish_at}`);
      successCount++;
    }
  }

  console.log(`\nPublished: ${successCount} | Failed: ${failCount} | Total: ${readyRecipes.length}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
