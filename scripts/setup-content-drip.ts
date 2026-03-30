/**
 * Content Drip Setup Script
 *
 * Configures gradual recipe publishing for SEO content velocity:
 * - 50 diverse recipes stay published (launch batch)
 * - 434 recipes set to draft with staggered scheduled_publish_at dates
 * - 2 recipes per day starting from 2026-03-31
 * - Daily batches are diversified by base_type and difficulty
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/setup-content-drip.ts
 */

import { createClient } from '@supabase/supabase-js';

// --- Config ---
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const LAUNCH_BATCH_SIZE = 50;
const RECIPES_PER_DAY = 2;
const START_DATE = '2026-03-26';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Types ---
interface Recipe {
  id: string;
  title: string;
  base_type: string;
  difficulty: string;
}

interface CategoryInfo {
  recipe_id: string;
  category: { name: string; type: string };
}

// --- Helpers ---

/**
 * Selects 50 diverse launch recipes by picking proportionally from each
 * base_type + difficulty combination, then filling remaining slots round-robin.
 */
function selectLaunchBatch(
  recipes: Recipe[],
  dietaryMap: Map<string, Set<string>>
): Recipe[] {
  // Group recipes by base_type
  const byBaseType = new Map<string, Recipe[]>();
  for (const r of recipes) {
    const group = byBaseType.get(r.base_type) ?? [];
    group.push(r);
    byBaseType.set(r.base_type, group);
  }

  const selected: Recipe[] = [];
  const selectedIds = new Set<string>();

  // Calculate proportional allocation per base_type
  const totalRecipes = recipes.length;
  const baseTypes = [...byBaseType.keys()].sort();
  const allocations = new Map<string, number>();

  for (const bt of baseTypes) {
    const count = byBaseType.get(bt)!.length;
    const allocation = Math.max(1, Math.round((count / totalRecipes) * LAUNCH_BATCH_SIZE));
    allocations.set(bt, allocation);
  }

  // Pick from each base_type, ensuring difficulty diversity
  for (const bt of baseTypes) {
    const pool = byBaseType.get(bt)!;
    const allocation = allocations.get(bt)!;

    // Sort pool so we get a mix of difficulties
    const byDifficulty = new Map<string, Recipe[]>();
    for (const r of pool) {
      const group = byDifficulty.get(r.difficulty) ?? [];
      group.push(r);
      byDifficulty.set(r.difficulty, group);
    }

    // Round-robin across difficulties
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    let picked = 0;
    let round = 0;
    while (picked < allocation && picked < pool.length) {
      for (const diff of difficulties) {
        if (picked >= allocation) break;
        const diffPool = byDifficulty.get(diff) ?? [];
        if (round < diffPool.length) {
          // Prefer recipes with dietary tags (keto, vegan) for diversity
          const candidate = diffPool[round];
          selected.push(candidate);
          selectedIds.add(candidate.id);
          picked++;
        }
      }
      round++;
    }
  }

  // If we have more than 50, trim; if fewer, add more
  while (selected.length > LAUNCH_BATCH_SIZE) {
    selected.pop();
  }

  // Fill remaining slots with recipes that have interesting dietary categories
  if (selected.length < LAUNCH_BATCH_SIZE) {
    const remaining = recipes.filter((r) => !selectedIds.has(r.id));
    // Prioritize recipes with dietary tags (keto, vegan, etc.)
    remaining.sort((a, b) => {
      const aDiet = dietaryMap.get(a.id)?.size ?? 0;
      const bDiet = dietaryMap.get(b.id)?.size ?? 0;
      return bDiet - aDiet; // more dietary tags first
    });
    for (const r of remaining) {
      if (selected.length >= LAUNCH_BATCH_SIZE) break;
      selected.push(r);
      selectedIds.add(r.id);
    }
  }

  return selected;
}

/**
 * Shuffles recipes for drip scheduling while ensuring each daily batch
 * of 5 has maximum diversity in base_type.
 */
function createDiverseDripOrder(recipes: Recipe[]): Recipe[] {
  // Group by base_type
  const buckets = new Map<string, Recipe[]>();
  for (const r of recipes) {
    const group = buckets.get(r.base_type) ?? [];
    group.push(r);
    buckets.set(r.base_type, group);
  }

  // Shuffle within each bucket
  for (const [, arr] of buckets) {
    shuffleArray(arr);
  }

  // Interleave: round-robin across base_types so adjacent recipes differ
  const result: Recipe[] = [];
  const keys = [...buckets.keys()].sort();
  const iterators = new Map<string, number>();
  for (const k of keys) iterators.set(k, 0);

  let remaining = recipes.length;
  while (remaining > 0) {
    for (const k of keys) {
      const arr = buckets.get(k)!;
      const idx = iterators.get(k)!;
      if (idx < arr.length) {
        result.push(arr[idx]);
        iterators.set(k, idx + 1);
        remaining--;
      }
    }
  }

  return result;
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T09:00:00Z'); // Publish at 9 AM UTC
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

// --- Main ---

async function main(): Promise<void> {
  console.log('Fetching all published recipes...');

  // Fetch all currently published recipes
  const { data: allRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, base_type, difficulty')
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  if (fetchError || !allRecipes) {
    console.error('Failed to fetch recipes:', fetchError?.message);
    process.exit(1);
  }

  console.log(`Found ${allRecipes.length} published recipes`);

  // Fetch dietary categories for diversity scoring
  const { data: categoryData } = await supabase
    .from('recipe_categories')
    .select('recipe_id, category:categories!category_id (name, type)')
    .returns<CategoryInfo[]>();

  const dietaryMap = new Map<string, Set<string>>();
  if (categoryData) {
    for (const row of categoryData) {
      if (row.category?.type === 'dietary') {
        const set = dietaryMap.get(row.recipe_id) ?? new Set();
        set.add(row.category.name);
        dietaryMap.set(row.recipe_id, set);
      }
    }
  }

  // Select the 50 launch recipes
  const launchBatch = selectLaunchBatch(allRecipes as Recipe[], dietaryMap);
  const launchIds = new Set(launchBatch.map((r) => r.id));
  const dripRecipes = (allRecipes as Recipe[]).filter((r) => !launchIds.has(r.id));

  console.log(`\nLaunch batch: ${launchBatch.length} recipes`);
  console.log('Launch batch base_type distribution:');
  const launchDist = new Map<string, number>();
  for (const r of launchBatch) {
    launchDist.set(r.base_type, (launchDist.get(r.base_type) ?? 0) + 1);
  }
  for (const [bt, count] of [...launchDist.entries()].sort()) {
    console.log(`  ${bt}: ${count}`);
  }

  console.log(`\nDrip recipes: ${dripRecipes.length} recipes`);
  console.log(`  ${RECIPES_PER_DAY} per day = ${Math.ceil(dripRecipes.length / RECIPES_PER_DAY)} days of content`);
  console.log(`  Starting from ${START_DATE}`);

  // Create diverse drip order
  const orderedDrip = createDiverseDripOrder(dripRecipes);

  // Step 1: Set drip recipes to draft with scheduled dates
  console.log('\nSetting drip recipes to draft with scheduled dates...');
  let dayIndex = 0;
  let dayCount = 0;
  let updateCount = 0;

  for (const recipe of orderedDrip) {
    const publishDate = addDays(START_DATE, dayIndex);

    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        status: 'draft',
        scheduled_publish_at: publishDate,
        published_at: publishDate,
      })
      .eq('id', recipe.id);

    if (updateError) {
      console.error(`  Failed to update "${recipe.title}": ${updateError.message}`);
    } else {
      updateCount++;
    }

    dayCount++;
    if (dayCount >= RECIPES_PER_DAY) {
      dayCount = 0;
      dayIndex++;
    }
  }

  console.log(`  Updated ${updateCount}/${orderedDrip.length} drip recipes`);

  // Step 2: Ensure launch batch stays published (update published_at to now)
  console.log('\nConfirming launch batch as published...');
  const launchIdArray = launchBatch.map((r) => r.id);

  const { error: launchError } = await supabase
    .from('recipes')
    .update({
      status: 'published',
      scheduled_publish_at: null,
      published_at: new Date().toISOString(),
    })
    .in('id', launchIdArray);

  if (launchError) {
    console.error('Failed to update launch batch:', launchError.message);
  } else {
    console.log(`  Confirmed ${launchIdArray.length} recipes as published`);
  }

  // Verify final state
  const { data: publishedCount } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  const { data: draftCount } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft');

  const { data: scheduledCount } = await supabase
    .from('recipes')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')
    .not('scheduled_publish_at', 'is', null);

  console.log('\n--- Final State ---');
  console.log(`Published: ${publishedCount?.length ?? '(count unavailable)'}`);
  console.log(`Draft: ${draftCount?.length ?? '(count unavailable)'}`);
  console.log(`Scheduled: ${scheduledCount?.length ?? '(count unavailable)'}`);
  console.log('\nContent drip setup complete!');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
