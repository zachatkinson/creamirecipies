/**
 * Seasonal Reschedule Script
 *
 * Reassigns scheduled_publish_at dates for all draft recipes based on
 * seasonal relevance rather than alphabetical/round-robin order.
 *
 * Seasonal logic:
 * - Spring (Mar-May): strawberry, lemon, lavender, honey, cherry, rhubarb, citrus
 * - Summer (Jun-Aug): mango, watermelon, peach, berry, tropical, pineapple, coconut, lime, mint
 * - Fall (Sep-Nov): pumpkin, apple, cinnamon, caramel, maple, spice, chai, fig, pear, pecan
 * - Winter (Dec-Feb): peppermint, gingerbread, eggnog, candy cane, mocha, hot chocolate, nutmeg
 * - Evergreen (any time): chocolate, vanilla, cookies, coffee, cookie dough, oreo, banana
 *
 * Holiday anchoring:
 * - Thanksgiving week: pumpkin pie, pecan, cranberry
 * - Christmas week: peppermint, gingerbread, eggnog, candy cane
 * - 4th of July: red white and blue, berry, watermelon
 * - Valentine's Day: chocolate, strawberry, red velvet
 *
 * Maintains 2 recipes/day cadence, ensures base_type diversity within each day.
 *
 * Run with:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/reschedule-seasonal.ts
 */

import { createClient } from '@supabase/supabase-js';

// --- Config ---
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RECIPES_PER_DAY = 2;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Types ---
interface DraftRecipe {
  id: string;
  title: string;
  base_type: string;
  difficulty: string;
  scheduled_publish_at: string;
}

type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'evergreen';

// --- Seasonal keyword mappings ---
// Each keyword maps to a primary season. Recipes can match multiple seasons.
const SEASONAL_KEYWORDS: Record<string, Season[]> = {
  // Spring
  'strawberry': ['spring', 'summer'],
  'lemon': ['spring'],
  'lavender': ['spring'],
  'honey': ['spring'],
  'cherry': ['spring', 'summer'],
  'rhubarb': ['spring'],
  'citrus': ['spring'],
  'orange blossom': ['spring'],
  'lychee': ['spring'],
  'passionfruit': ['spring', 'summer'],
  'passion fruit': ['spring', 'summer'],
  'hibiscus': ['spring'],
  'rose': ['spring'],
  'earl grey': ['spring'],
  'matcha': ['spring'],
  'key lime': ['spring', 'summer'],

  // Summer
  'mango': ['summer'],
  'watermelon': ['summer'],
  'peach': ['summer'],
  'berry': ['summer'],
  'blueberry': ['summer'],
  'raspberry': ['summer'],
  'blackberry': ['summer'],
  'tropical': ['summer'],
  'pineapple': ['summer'],
  'coconut': ['summer'],
  'lime': ['summer'],
  'mint': ['summer'],
  'sorbet': ['summer'],
  'margarita': ['summer'],
  'pina colada': ['summer'],
  'piña colada': ['summer'],
  'guava': ['summer'],
  'papaya': ['summer'],
  'acai': ['summer'],
  'açaí': ['summer'],
  'melon': ['summer'],
  'cantaloupe': ['summer'],
  'honeydew': ['summer'],
  'frozen yogurt': ['summer'],
  'lemonade': ['summer'],

  // Fall
  'pumpkin': ['fall'],
  'apple': ['fall'],
  'cinnamon': ['fall'],
  'caramel': ['fall'],
  'maple': ['fall'],
  'spice': ['fall'],
  'chai': ['fall'],
  'fig': ['fall'],
  'pear': ['fall'],
  'pecan': ['fall'],
  'walnut': ['fall'],
  'hazelnut': ['fall'],
  'brown butter': ['fall'],
  'sweet potato': ['fall'],
  'cranberry': ['fall', 'winter'],
  'harvest': ['fall'],
  'butterscotch': ['fall'],
  'toffee': ['fall'],
  'bourbon': ['fall'],
  'brown sugar': ['fall'],

  // Winter
  'peppermint': ['winter'],
  'gingerbread': ['winter'],
  'eggnog': ['winter'],
  'candy cane': ['winter'],
  'mocha': ['winter'],
  'hot chocolate': ['winter'],
  'nutmeg': ['winter'],
  'nog': ['winter'],
  'white chocolate': ['winter'],
  'snickerdoodle': ['winter'],
  'sugar cookie': ['winter'],
  'rum': ['winter'],
  'coquito': ['winter'],
  'chestnut': ['winter'],
  'clove': ['winter'],
  'cardamom': ['winter'],
  'tiramisu': ['winter'],

  // Evergreen (can be published any time)
  'chocolate': ['evergreen'],
  'vanilla': ['evergreen'],
  'coffee': ['evergreen'],
  'cookie dough': ['evergreen'],
  'cookies and cream': ['evergreen'],
  'cookies & cream': ['evergreen'],
  'oreo': ['evergreen'],
  'banana': ['evergreen'],
  'peanut butter': ['evergreen'],
  'brownie': ['evergreen'],
  'cheesecake': ['evergreen'],
  'dulce de leche': ['evergreen'],
  'pistachio': ['evergreen'],
  'almond': ['evergreen'],
  'birthday cake': ['evergreen'],
  'funfetti': ['evergreen'],
  'salted caramel': ['evergreen'],
  's\'mores': ['evergreen'],
  'smores': ['evergreen'],
};

// Holiday-specific recipes get anchored near their holiday
interface HolidayAnchor {
  keywords: string[];
  // Month (0-indexed) and day range
  month: number;
  dayStart: number;
  dayEnd: number;
}

const HOLIDAY_ANCHORS: HolidayAnchor[] = [
  // Valentine's Day - Feb 7-14
  { keywords: ['red velvet', 'valentine'], month: 1, dayStart: 7, dayEnd: 14 },
  // St. Patrick's Day - Mar 10-17
  { keywords: ['irish', 'shamrock', 'green', 'st. patrick', 'baileys'], month: 2, dayStart: 10, dayEnd: 17 },
  // Easter - flexible, target late March/early April
  { keywords: ['easter', 'cadbury', 'carrot cake', 'malted'], month: 2, dayStart: 25, dayEnd: 31 },
  // 4th of July - Jun 28 - Jul 4
  { keywords: ['red white and blue', 'firecracker', 'patriot', 'americana'], month: 5, dayStart: 28, dayEnd: 30 },
  // Halloween - Oct 20-31
  { keywords: ['halloween', 'monster', 'witch', 'pumpkin spice', 'candy corn', 'spooky'], month: 9, dayStart: 20, dayEnd: 31 },
  // Thanksgiving - Nov 15-27
  { keywords: ['pumpkin pie', 'pecan pie', 'thanksgiving', 'cranberry sauce'], month: 10, dayStart: 15, dayEnd: 27 },
  // Christmas/Holiday - Dec 10-25
  { keywords: ['peppermint bark', 'gingerbread', 'eggnog', 'candy cane', 'christmas', 'holiday'], month: 11, dayStart: 10, dayEnd: 25 },
];

// --- Helpers ---

function getSeasons(recipe: DraftRecipe): Season[] {
  const title = recipe.title.toLowerCase();
  const matched = new Set<Season>();

  // Check longest keywords first to avoid partial matches
  const sortedKeywords = Object.keys(SEASONAL_KEYWORDS).sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeywords) {
    if (title.includes(keyword)) {
      for (const season of SEASONAL_KEYWORDS[keyword]) {
        matched.add(season);
      }
    }
  }

  // If no match, treat as evergreen
  if (matched.size === 0) {
    matched.add('evergreen');
  }

  return [...matched];
}

function getHolidayAnchor(recipe: DraftRecipe): HolidayAnchor | null {
  const title = recipe.title.toLowerCase();
  for (const anchor of HOLIDAY_ANCHORS) {
    for (const keyword of anchor.keywords) {
      if (title.includes(keyword)) {
        return anchor;
      }
    }
  }
  return null;
}

/**
 * Maps seasons to month ranges (0-indexed months)
 */
const SEASON_MONTHS: Record<Season, number[]> = {
  spring: [2, 3, 4],      // Mar, Apr, May
  summer: [5, 6, 7],      // Jun, Jul, Aug
  fall: [8, 9, 10],       // Sep, Oct, Nov
  winter: [11, 0, 1],     // Dec, Jan, Feb
  evergreen: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

/**
 * Given a date, returns its season
 */
function dateToSeason(date: Date): Season {
  const month = date.getUTCMonth();
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  if ([8, 9, 10].includes(month)) return 'fall';
  return 'winter';
}

/**
 * Build the publish calendar:
 * 1. Find the date range (from tomorrow through ~217 more days)
 * 2. For each day slot, assign recipes that match that day's season
 * 3. Holiday-anchored recipes get placed near their holiday
 * 4. Evergreen recipes fill gaps
 * 5. Ensure base_type diversity within each day
 */
function buildSeasonalSchedule(
  recipes: DraftRecipe[],
  startDate: Date
): Map<string, string> {
  const schedule = new Map<string, string>(); // recipe_id -> ISO date

  // Separate holiday-anchored recipes
  const holidayRecipes: { recipe: DraftRecipe; anchor: HolidayAnchor }[] = [];
  const seasonalRecipes = new Map<Season, DraftRecipe[]>();
  const evergreenRecipes: DraftRecipe[] = [];

  for (const season of ['spring', 'summer', 'fall', 'winter'] as Season[]) {
    seasonalRecipes.set(season, []);
  }

  for (const recipe of recipes) {
    const anchor = getHolidayAnchor(recipe);
    if (anchor) {
      holidayRecipes.push({ recipe, anchor });
      continue;
    }

    const seasons = getSeasons(recipe);
    if (seasons.length === 1 && seasons[0] === 'evergreen') {
      evergreenRecipes.push(recipe);
    } else {
      // Add to primary season (first non-evergreen)
      const primarySeason = seasons.find(s => s !== 'evergreen') ?? 'evergreen';
      if (primarySeason === 'evergreen') {
        evergreenRecipes.push(recipe);
      } else {
        seasonalRecipes.get(primarySeason)!.push(recipe);
      }
    }
  }

  // Shuffle within each bucket for variety
  for (const [, arr] of seasonalRecipes) shuffleArray(arr);
  shuffleArray(evergreenRecipes);

  // Build day slots for the full schedule range
  const totalDays = Math.ceil(recipes.length / RECIPES_PER_DAY) + 30; // extra buffer
  const daySlots: { date: Date; season: Season; recipes: DraftRecipe[] }[] = [];

  for (let d = 0; d < totalDays; d++) {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + d);
    daySlots.push({
      date,
      season: dateToSeason(date),
      recipes: [],
    });
  }

  // Step 1: Place holiday-anchored recipes first
  for (const { recipe, anchor } of holidayRecipes) {
    // Find the next occurrence of the holiday within our schedule range
    let placed = false;
    for (const slot of daySlots) {
      const m = slot.date.getUTCMonth();
      const d = slot.date.getUTCDate();
      if (m === anchor.month && d >= anchor.dayStart && d <= anchor.dayEnd) {
        if (slot.recipes.length < RECIPES_PER_DAY) {
          slot.recipes.push(recipe);
          schedule.set(recipe.id, slot.date.toISOString());
          placed = true;
          break;
        }
      }
    }
    // If holiday slot is full, place nearby
    if (!placed) {
      for (const slot of daySlots) {
        const m = slot.date.getUTCMonth();
        if (m === anchor.month && slot.recipes.length < RECIPES_PER_DAY) {
          slot.recipes.push(recipe);
          schedule.set(recipe.id, slot.date.toISOString());
          placed = true;
          break;
        }
      }
    }
    // Last resort: treat as seasonal
    if (!placed) {
      evergreenRecipes.push(recipe);
    }
  }

  // Step 2: Fill seasonal slots
  for (const season of ['spring', 'summer', 'fall', 'winter'] as Season[]) {
    const pool = seasonalRecipes.get(season)!;
    let poolIdx = 0;

    for (const slot of daySlots) {
      if (poolIdx >= pool.length) break;
      if (slot.season !== season) continue;
      while (slot.recipes.length < RECIPES_PER_DAY && poolIdx < pool.length) {
        // Try to pick a recipe with a different base_type than what's already in the slot
        let picked = false;
        const existingTypes = new Set(slot.recipes.map(r => r.base_type));

        for (let search = poolIdx; search < Math.min(poolIdx + 10, pool.length); search++) {
          if (!existingTypes.has(pool[search].base_type)) {
            const recipe = pool.splice(search, 1)[0];
            slot.recipes.push(recipe);
            schedule.set(recipe.id, slot.date.toISOString());
            picked = true;
            break;
          }
        }

        if (!picked) {
          // Just take the next one
          const recipe = pool[poolIdx];
          poolIdx++;
          slot.recipes.push(recipe);
          schedule.set(recipe.id, slot.date.toISOString());
        }
      }
    }

    // Any remaining seasonal recipes that didn't fit go to evergreen
    while (poolIdx < pool.length) {
      evergreenRecipes.push(pool[poolIdx]);
      poolIdx++;
    }
  }

  // Step 3: Fill remaining slots with evergreen recipes
  let evergreenIdx = 0;
  for (const slot of daySlots) {
    while (slot.recipes.length < RECIPES_PER_DAY && evergreenIdx < evergreenRecipes.length) {
      const existingTypes = new Set(slot.recipes.map(r => r.base_type));
      let picked = false;

      // Try for base_type diversity
      for (let search = evergreenIdx; search < Math.min(evergreenIdx + 10, evergreenRecipes.length); search++) {
        if (!existingTypes.has(evergreenRecipes[search].base_type)) {
          const recipe = evergreenRecipes.splice(search, 1)[0];
          slot.recipes.push(recipe);
          schedule.set(recipe.id, slot.date.toISOString());
          picked = true;
          break;
        }
      }

      if (!picked) {
        const recipe = evergreenRecipes[evergreenIdx];
        evergreenIdx++;
        slot.recipes.push(recipe);
        schedule.set(recipe.id, slot.date.toISOString());
      }
    }
  }

  return schedule;
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// --- Main ---

async function main(): Promise<void> {
  console.log('Fetching draft recipes with scheduled publish dates...\n');

  const { data: draftRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, base_type, difficulty, scheduled_publish_at')
    .eq('status', 'draft')
    .not('scheduled_publish_at', 'is', null)
    .order('scheduled_publish_at', { ascending: true });

  if (fetchError || !draftRecipes) {
    console.error('Failed to fetch recipes:', fetchError?.message);
    process.exit(1);
  }

  console.log(`Found ${draftRecipes.length} draft recipes to reschedule\n`);

  if (draftRecipes.length === 0) {
    console.log('No draft recipes to reschedule. Exiting.');
    return;
  }

  // Start from tomorrow (or the earliest scheduled date, whichever is later)
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(9, 0, 0, 0);

  const startDate = tomorrow;
  console.log(`Scheduling from: ${startDate.toISOString().split('T')[0]}\n`);

  // Categorize recipes
  const seasonCounts = { spring: 0, summer: 0, fall: 0, winter: 0, evergreen: 0 };
  for (const recipe of draftRecipes as DraftRecipe[]) {
    const seasons = getSeasons(recipe);
    const primary = seasons.find(s => s !== 'evergreen') ?? 'evergreen';
    seasonCounts[primary]++;
  }

  console.log('Recipe seasonal distribution:');
  for (const [season, count] of Object.entries(seasonCounts)) {
    console.log(`  ${season}: ${count}`);
  }

  const holidayCount = (draftRecipes as DraftRecipe[]).filter(r => getHolidayAnchor(r) !== null).length;
  console.log(`  holiday-anchored: ${holidayCount}\n`);

  // Build schedule
  const schedule = buildSeasonalSchedule(draftRecipes as DraftRecipe[], startDate);

  console.log(`Scheduled ${schedule.size}/${draftRecipes.length} recipes\n`);

  // Preview: show first 30 days
  const preview: { date: string; title: string; season: string }[] = [];
  for (const recipe of draftRecipes as DraftRecipe[]) {
    const newDate = schedule.get(recipe.id);
    if (newDate) {
      preview.push({
        date: newDate.split('T')[0],
        title: recipe.title,
        season: getSeasons(recipe).join(', '),
      });
    }
  }
  preview.sort((a, b) => a.date.localeCompare(b.date));

  console.log('Preview (first 30 days):');
  const previewDays = new Set<string>();
  for (const entry of preview) {
    previewDays.add(entry.date);
    if (previewDays.size > 30) break;
    console.log(`  ${entry.date}  [${entry.season}]  ${entry.title}`);
  }

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: No changes made ---');
    console.log('Run without --dry-run to apply changes.');
    return;
  }

  // Apply updates
  console.log('\nApplying schedule updates...');
  let updated = 0;
  let failed = 0;

  for (const [recipeId, publishDate] of schedule) {
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        scheduled_publish_at: publishDate,
        published_at: publishDate,
      })
      .eq('id', recipeId);

    if (updateError) {
      console.error(`  Failed to update recipe ${recipeId}: ${updateError.message}`);
      failed++;
    } else {
      updated++;
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nSeasonal reschedule complete!`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
