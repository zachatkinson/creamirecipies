/**
 * Recipe Seeding Script
 *
 * Normalizes scraped recipe data and inserts into Supabase.
 * Run with: npx tsx scripts/seed-recipes.ts
 *
 * Normalization handles:
 * - Base type standardization (ice-cream -> Ice Cream, sorbetEasy -> Sorbet)
 * - Ingredient group mapping to schema (Dairy/liquid/base -> base, Chocolate/solid -> mix-ins)
 * - Unit normalization (cups -> cup, tablespoons -> tablespoon)
 * - Difficulty inference from ingredient count + step complexity
 * - Slug generation with deduplication
 * - Pro tip generation for steps that lack hints
 */

import { createClient } from '@supabase/supabase-js';

// --- Config ---
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// --- Types ---
interface RawRecipe {
  title: string;
  description: string;
  base_type: string;
  prep_time_minutes?: number;
  freeze_time_hours?: number;
  servings?: number;
  creami_program?: string;
  difficulty?: string;
  compatible_models?: string[]; // model slugs
  flavor_profiles?: string[];  // category slugs
  dietary?: string[];           // category slugs
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
    group?: string;
  }[];
  steps: {
    instruction: string;
    hint?: string;
    duration_minutes?: number;
  }[];
  tips?: string[];
}

// --- Normalization Maps ---

const BASE_TYPE_MAP: Record<string, string> = {
  'ice cream': 'Ice Cream',
  'ice-cream': 'Ice Cream',
  'icecream': 'Ice Cream',
  'lite ice cream': 'Lite Ice Cream',
  'lite-ice-cream': 'Lite Ice Cream',
  'light ice cream': 'Lite Ice Cream',
  'sorbet': 'Sorbet',
  'sorbeteasy': 'Sorbet',
  'gelato': 'Gelato',
  'frozen yogurt': 'Frozen Yogurt',
  'frozen-yogurt': 'Frozen Yogurt',
  'froyo': 'Frozen Yogurt',
  'milkshake': 'Milkshake',
  'smoothie bowl': 'Smoothie Bowl',
  'smoothie-bowl': 'Smoothie Bowl',
  'italian ice': 'Italian Ice',
  'italian-ice': 'Italian Ice',
  'protein': 'Lite Ice Cream',
};

const UNIT_MAP: Record<string, string> = {
  'cups': 'cup',
  'tablespoons': 'tablespoon',
  'tbsp': 'tablespoon',
  'teaspoons': 'teaspoon',
  'tsp': 'teaspoon',
  'ounces': 'oz',
  'ounce': 'oz',
  'pounds': 'lb',
  'pound': 'lb',
  'grams': 'g',
  'gram': 'g',
  'milliliters': 'ml',
  'milliliter': 'ml',
  'pinch': 'pinch',
  'drops': 'drops',
  'unit': '',
};

// Map source ingredient groups to our schema groups
const INGREDIENT_GROUP_MAP: Record<string, 'base' | 'mix-ins' | 'topping' | 'swirl'> = {
  'base': 'base',
  'dairy': 'base',
  'liquid': 'base',
  'dry': 'base',
  'sweetener': 'base',
  'sweeteners': 'base',
  'sugar': 'base',
  'flavoring': 'base',
  'flavor': 'base',
  'extracts': 'base',
  'spices': 'base',
  'seasoning': 'base',
  'acid': 'base',
  'main': 'base',
  'coloring': 'base',
  'mix-ins': 'mix-ins',
  'mix-in': 'mix-ins',
  'mixin': 'mix-ins',
  'chocolate': 'mix-ins',
  'solid': 'mix-ins',
  'add-in': 'mix-ins',
  'condiments': 'base',
  'topping': 'topping',
  'toppings': 'topping',
  'swirl': 'swirl',
};

// Common Creami pro tips per step type
const STEP_HINTS: Record<string, string> = {
  'whisk': 'Whisk until completely smooth with no lumps — this ensures an even freeze and creamy texture.',
  'blend': 'Blend on high for 30-60 seconds until completely smooth. Any chunks will become icy spots.',
  'pour': 'Fill to the max fill line but not above — overfilling can cause the lid to pop off during processing.',
  'freeze': 'Place on a flat, level surface in the coldest part of your freezer. Uneven freezing leads to inconsistent texture.',
  'process': 'If the machine struggles or the pint spins freely, let it sit at room temperature for 5 minutes before retrying.',
  'respin': 'One re-spin usually does the trick. If still crumbly after two, let it soften for 2-3 minutes and try again.',
  'mix-in': 'Create a hole down to about halfway. Overfilling mix-ins can jam the blade — use 1/4 cup or less.',
  'serve': 'Ninja Creami treats are best enjoyed immediately. If refreezing, let it sit out 5-10 minutes before scooping.',
};

// --- Normalization Functions ---

function normalizeBaseType(raw: string): string {
  const key = raw.toLowerCase().trim();
  return BASE_TYPE_MAP[key] ?? 'Ice Cream';
}

function normalizeUnit(raw: string | undefined): string {
  if (!raw) return '';
  const key = raw.toLowerCase().trim();
  return UNIT_MAP[key] ?? key;
}

function normalizeIngredientGroup(raw: string | undefined): 'base' | 'mix-ins' | 'topping' | 'swirl' {
  if (!raw) return 'base';
  const key = raw.toLowerCase().trim();
  return INGREDIENT_GROUP_MAP[key] ?? 'base';
}

function inferDifficulty(recipe: RawRecipe): 'beginner' | 'intermediate' | 'advanced' {
  if (recipe.difficulty) {
    const d = recipe.difficulty.toLowerCase();
    if (d.includes('beginner') || d.includes('easy')) return 'beginner';
    if (d.includes('advanced') || d.includes('hard')) return 'advanced';
    return 'intermediate';
  }

  const ingredientCount = recipe.ingredients.length;
  const stepCount = recipe.steps.length;
  const hasMixIns = recipe.ingredients.some(
    (i) => normalizeIngredientGroup(i.group) === 'mix-ins'
  );
  const hasSwirl = recipe.ingredients.some(
    (i) => normalizeIngredientGroup(i.group) === 'swirl'
  );

  if (ingredientCount <= 4 && stepCount <= 4 && !hasMixIns) return 'beginner';
  if (ingredientCount >= 8 || hasSwirl || stepCount >= 7) return 'advanced';
  return 'intermediate';
}

function generateStepHint(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes('whisk') || lower.includes('stir')) return STEP_HINTS['whisk'];
  if (lower.includes('blend') || lower.includes('puree')) return STEP_HINTS['blend'];
  if (lower.includes('pour') || lower.includes('transfer')) return STEP_HINTS['pour'];
  if (lower.includes('freeze')) return STEP_HINTS['freeze'];
  if (lower.includes('process') || lower.includes('ice cream function') || lower.includes('sorbet function')) return STEP_HINTS['process'];
  if (lower.includes('re-spin') || lower.includes('respin')) return STEP_HINTS['respin'];
  if (lower.includes('mix-in') || lower.includes('mixin') || lower.includes('add') && lower.includes('hole')) return STEP_HINTS['mix-in'];
  if (lower.includes('serve') || lower.includes('scoop') || lower.includes('enjoy')) return STEP_HINTS['serve'];
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- Scraped + Curated Recipe Data ---
// Combining scraped data from thecreami.com, thebigmansworld.com, and
// additional Creami-specific recipes built from common community patterns.

const RAW_RECIPES: RawRecipe[] = [
  // === SCRAPED FROM THECREAMI.COM ===
  {
    title: 'Classic Vanilla Bean Ice Cream',
    description: 'Rich and creamy vanilla ice cream made with real vanilla bean. The perfect base recipe that showcases everything the Ninja Creami does best.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['vanilla'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'tablespoon', group: 'base' },
      { name: 'vanilla bean', amount: '1', unit: '', group: 'base' },
      { name: 'salt', amount: '1', unit: 'pinch', group: 'base' },
    ],
    steps: [
      { instruction: 'In a bowl, whisk together heavy cream, milk, and sugar until the sugar is fully dissolved.' },
      { instruction: 'Split the vanilla bean lengthwise and scrape the seeds into the mixture. Add vanilla extract and a pinch of salt, then mix well.' },
      { instruction: 'Pour the mixture into your Ninja Creami pint container up to the max fill line.' },
      { instruction: 'Secure the lid and freeze for 24 hours on a flat, level surface.' },
      { instruction: 'Remove the pint from the freezer, take off the lid, and place it in the outer bowl. Lock the assembly and select the Ice Cream program.' },
      { instruction: 'Once the cycle completes, check the texture. If it looks crumbly, select Re-Spin for a smoother result.' },
    ],
    tips: ['For the richest flavor, use a high-quality vanilla extract or paste.', 'Ensure the sugar is completely dissolved before freezing — undissolved sugar creates a grainy texture.'],
  },
  {
    title: 'Cookies and Cream Ice Cream',
    description: 'Classic cookies and cream loaded with crushed Oreo cookies. A crowd-pleasing favorite that kids and adults both love.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['candy-cookie'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'Oreo cookies, crushed', amount: '6', unit: '', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Whisk cream, milk, sugar, and vanilla together until the sugar dissolves.' },
      { instruction: 'Pour the base into your Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Create a hole in the center of the processed ice cream, add the crushed Oreos, and select the Mix-In function.' },
      { instruction: 'Serve immediately or refreeze for a firmer texture.' },
    ],
  },
  {
    title: 'Mint Chocolate Chip Ice Cream',
    description: 'Cool, refreshing mint ice cream studded with rich mini chocolate chips. A classic combination that never gets old.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['mint', 'chocolate'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'peppermint extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'mini chocolate chips', amount: '1/4', unit: 'cup', group: 'mix-ins' },
      { name: 'green food coloring (optional)', amount: '2', unit: 'drops', group: 'base' },
    ],
    steps: [
      { instruction: 'Whisk cream, milk, sugar, peppermint extract, and food coloring until sugar dissolves.' },
      { instruction: 'Pour into Ninja Creami pint container. Do not add chocolate chips yet.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Make a small hole in the center, add chocolate chips, and use the Mix-In function.' },
    ],
    tips: ['Start with less peppermint extract — you can always add more. It is very potent.'],
  },
  {
    title: 'Salted Caramel Ice Cream',
    description: 'Decadent salted caramel ice cream with the perfect balance of sweet and salty. Rich, indulgent, and absolutely addictive.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['caramel'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'caramel sauce', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'brown sugar', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'sea salt', amount: '1/2', unit: 'teaspoon', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Blend all ingredients until smooth and the brown sugar is fully dissolved.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours on a level surface.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Re-spin once for an extra creamy, smooth texture.' },
    ],
  },
  {
    title: 'Fresh Strawberry Sorbet',
    description: 'Bright and refreshing strawberry sorbet bursting with real berry flavor. Naturally dairy-free and vegan — perfect for hot summer days.',
    base_type: 'sorbet',
    prep_time_minutes: 15,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Sorbet',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'fresh strawberries', amount: '2', unit: 'cup', group: 'base' },
      { name: 'water', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'fresh lemon juice', amount: '1', unit: 'tablespoon', group: 'base' },
      { name: 'vanilla extract', amount: '1/2', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Hull and halve the strawberries. Blend with water, sugar, lemon juice, and vanilla until completely smooth.' },
      { instruction: 'Optionally strain through a fine mesh sieve for an ultra-smooth texture.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Sorbet function.' },
      { instruction: 'Enjoy immediately for the best, most scoopable texture.' },
    ],
    tips: ['Using frozen strawberries works too — just thaw slightly before blending.', 'The lemon juice brightens the flavor and helps the texture.'],
  },
  // === SCRAPED FROM THEBIGMANSWORLD.COM ===
  {
    title: 'Cream Cheese Base Ice Cream',
    description: 'A rich, ultra-creamy base recipe using cream cheese for an incredibly smooth and scoopable texture. Use it as-is for a New York cheesecake flavor, or add your favorite mix-ins.',
    base_type: 'ice cream',
    prep_time_minutes: 5,
    freeze_time_hours: 3,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['vanilla'],
    ingredients: [
      { name: 'cream cheese', amount: '0.5', unit: 'oz', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Microwave the cream cheese with 1 tablespoon of cream for 15 seconds until softened. Transfer to the Ninja Creami pint.' },
      { instruction: 'Add sugar and whisk vigorously until sugar is dissolved and mixture is smooth.' },
      { instruction: 'Slowly pour in the remaining cream and milk, whisking until fully combined.' },
      { instruction: 'Add vanilla extract and stir.' },
      { instruction: 'Seal the pint and freeze for at least 3 hours, or up to 24 hours.' },
      { instruction: 'Process using the Ice Cream or Lite Ice Cream function. Re-spin if the texture is crumbly.' },
    ],
    tips: [
      'Do not overfill — keep the mixture 1/2 inch below the max line.',
      'The cream cheese must be fully smooth before adding liquids or you will get lumps.',
      'Re-churn if needed. Only add mix-ins once the base is mostly smooth.',
    ],
  },
  // === ADDITIONAL CURATED CREAMI-SPECIFIC RECIPES ===
  {
    title: 'Chocolate Peanut Butter Cup Ice Cream',
    description: 'Decadent chocolate ice cream with swirls of peanut butter and chopped peanut butter cups. A rich, indulgent treat for PB lovers.',
    base_type: 'ice cream',
    prep_time_minutes: 15,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['chocolate', 'nutty'],
    ingredients: [
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'cocoa powder', amount: '3', unit: 'tablespoon', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'creamy peanut butter', amount: '2', unit: 'tablespoon', group: 'swirl' },
      { name: 'mini peanut butter cups, chopped', amount: '4', unit: '', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Whisk cocoa powder and sugar together first to prevent clumping.' },
      { instruction: 'Add heavy cream, milk, and vanilla. Whisk until smooth and sugar is dissolved.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Warm the peanut butter in the microwave for 10 seconds. Create a hole in the center, add the peanut butter and chopped PB cups, then use the Mix-In function.' },
    ],
    tips: ['Warming the peanut butter makes it drizzle better and creates beautiful swirls.'],
  },
  {
    title: 'Tropical Mango Sorbet',
    description: 'A vibrant, sunshine-bright mango sorbet that tastes like a tropical vacation. Naturally dairy-free and incredibly refreshing.',
    base_type: 'sorbet',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Sorbet',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['tropical', 'fruity'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'frozen mango chunks', amount: '2', unit: 'cup', group: 'base' },
      { name: 'coconut water', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'honey or agave', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'fresh lime juice', amount: '1', unit: 'tablespoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Thaw the mango chunks slightly (about 5 minutes at room temperature).' },
      { instruction: 'Blend mango, coconut water, honey, and lime juice until completely smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Sorbet function. Re-spin if needed.' },
    ],
    tips: ['Frozen mango chunks from the store work perfectly and save a ton of prep time.'],
  },
  {
    title: 'Vanilla Protein Ice Cream',
    description: 'Creamy vanilla protein ice cream with 20+ grams of protein per serving. Perfect for a post-workout treat or a guilt-free dessert.',
    base_type: 'lite ice cream',
    prep_time_minutes: 5,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Lite Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['vanilla'],
    dietary: ['high-protein', 'gluten-free'],
    ingredients: [
      { name: 'vanilla protein powder', amount: '1', unit: 'scoop', group: 'base' },
      { name: 'unsweetened almond milk', amount: '1', unit: 'cup', group: 'base' },
      { name: 'plain Greek yogurt', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'sweetener of choice', amount: '1', unit: 'tablespoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Combine protein powder, almond milk, Greek yogurt, vanilla extract, and sweetener in a bowl. Whisk until completely smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function.' },
      { instruction: 'Re-spin 1-2 times for the creamiest texture. Protein bases often need extra spins.' },
    ],
    tips: ['Protein ice cream almost always benefits from 2-3 re-spins. Be patient.', 'Adding a tablespoon of cream cheese to the base dramatically improves texture.'],
  },
  {
    title: 'Chocolate Protein Ice Cream',
    description: 'High-protein, low-calorie chocolate ice cream that tastes like a fudge brownie. Perfect for fitness enthusiasts who refuse to give up dessert.',
    base_type: 'lite ice cream',
    prep_time_minutes: 5,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Lite Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['chocolate'],
    dietary: ['high-protein', 'gluten-free'],
    ingredients: [
      { name: 'chocolate protein powder', amount: '1', unit: 'scoop', group: 'base' },
      { name: 'unsweetened almond milk', amount: '1', unit: 'cup', group: 'base' },
      { name: 'plain Greek yogurt', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'cocoa powder', amount: '1', unit: 'tablespoon', group: 'base' },
      { name: 'sweetener of choice', amount: '1', unit: 'tablespoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Whisk protein powder and cocoa powder together first to prevent clumps.' },
      { instruction: 'Add almond milk, Greek yogurt, and sweetener. Mix until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function. Re-spin 2-3 times for best results.' },
    ],
  },
  {
    title: 'Coffee Toffee Crunch Ice Cream',
    description: 'Bold espresso ice cream with buttery toffee bits folded in. A sophisticated flavor combination for coffee lovers.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['coffee', 'caramel'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'instant espresso powder', amount: '2', unit: 'teaspoon', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'toffee bits', amount: '1/4', unit: 'cup', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Dissolve espresso powder and sugar in a splash of warm milk.' },
      { instruction: 'Add heavy cream, remaining milk, and vanilla. Whisk until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Add toffee bits and use the Mix-In function.' },
    ],
  },
  {
    title: 'Banana Bread Ice Cream',
    description: 'Tastes exactly like warm banana bread but frozen. Sweet ripe banana ice cream with hints of cinnamon and brown sugar.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'ripe banana', amount: '2', unit: '', group: 'base' },
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'brown sugar', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'cinnamon', amount: '1/2', unit: 'teaspoon', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'chopped walnuts', amount: '2', unit: 'tablespoon', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Blend bananas, cream, milk, brown sugar, cinnamon, and vanilla until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Add chopped walnuts and use the Mix-In function.' },
    ],
    tips: ['The riper the bananas, the sweeter and more flavorful the ice cream. Brown-spotted bananas are ideal.'],
  },
  {
    title: 'Lemon Sorbet',
    description: 'Bright, tangy lemon sorbet that is the perfect palate cleanser. Light, refreshing, and incredibly easy to make.',
    base_type: 'sorbet',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Sorbet',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'fresh lemon juice', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'water', amount: '1', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'lemon zest', amount: '1', unit: 'tablespoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Heat water and sugar in a small saucepan until sugar dissolves to make a simple syrup. Let cool.' },
      { instruction: 'Mix the cooled syrup with fresh lemon juice and zest.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Sorbet function.' },
    ],
    tips: ['For the juiciest lemons, roll them on the counter with your palm before squeezing.'],
  },
  {
    title: 'Raspberry Sorbet',
    description: 'Vibrant raspberry sorbet with intense berry flavor. Naturally dairy-free and vegan, with a stunning deep pink color.',
    base_type: 'sorbet',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Sorbet',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'fresh or frozen raspberries', amount: '2', unit: 'cup', group: 'base' },
      { name: 'water', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'fresh lemon juice', amount: '1', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Blend raspberries, water, sugar, and lemon juice until smooth.' },
      { instruction: 'Strain through a fine mesh sieve to remove seeds.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Sorbet function.' },
    ],
    tips: ['Straining the seeds is optional but makes a much smoother sorbet.'],
  },
  {
    title: 'Pistachio Gelato',
    description: 'Authentic Italian-style pistachio gelato with real pistachios. Creamy, nutty, and absolutely luxurious.',
    base_type: 'gelato',
    prep_time_minutes: 15,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Gelato',
    compatible_models: ['deluxe', 'deluxe-11-in-1'],
    flavor_profiles: ['nutty'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'whole milk', amount: '1', unit: 'cup', group: 'base' },
      { name: 'heavy cream', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'roasted unsalted pistachios', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'almond extract', amount: '1/4', unit: 'teaspoon', group: 'base' },
      { name: 'salt', amount: '1', unit: 'pinch', group: 'base' },
    ],
    steps: [
      { instruction: 'Blend pistachios with a splash of milk until finely ground (some texture is fine).' },
      { instruction: 'Add remaining milk, cream, sugar, almond extract, and salt. Blend until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Gelato function (or Ice Cream on Original/Breeze models).' },
    ],
    tips: ['Gelato uses more milk and less cream than ice cream, giving it a denser, silkier texture.', 'A tiny bit of almond extract enhances the pistachio flavor without overpowering it.'],
  },
  {
    title: 'Peanut Butter Banana Protein Ice Cream',
    description: 'Creamy peanut butter and banana protein ice cream with 22g of protein per serving. Tastes like a PB banana smoothie in frozen form.',
    base_type: 'lite ice cream',
    prep_time_minutes: 5,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Lite Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['nutty', 'fruity'],
    dietary: ['high-protein', 'gluten-free'],
    ingredients: [
      { name: 'vanilla protein powder', amount: '1', unit: 'scoop', group: 'base' },
      { name: 'ripe banana', amount: '1', unit: '', group: 'base' },
      { name: 'unsweetened almond milk', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'powdered peanut butter', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'plain Greek yogurt', amount: '1/4', unit: 'cup', group: 'base' },
    ],
    steps: [
      { instruction: 'Blend all ingredients until completely smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function. Re-spin 2-3 times.' },
    ],
    tips: ['Powdered peanut butter (like PB2) gives peanut butter flavor with fewer calories and better texture than regular PB.'],
  },
  {
    title: 'Coconut Milk Ice Cream',
    description: 'Rich, dairy-free coconut ice cream with a lush tropical flavor. Uses full-fat coconut milk for the creamiest result.',
    base_type: 'ice cream',
    prep_time_minutes: 5,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['tropical'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'full-fat coconut milk', amount: '1', unit: 'can (13.5 oz)', group: 'base' },
      { name: 'granulated sugar', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'salt', amount: '1', unit: 'pinch', group: 'base' },
    ],
    steps: [
      { instruction: 'Shake the coconut milk can well, then pour into a bowl.' },
      { instruction: 'Add sugar, vanilla, and salt. Whisk until sugar dissolves.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
    ],
    tips: ['Full-fat coconut milk is essential — lite coconut milk will be icy. Shake the can very well before opening.'],
  },
  {
    title: 'Strawberry Cheesecake Ice Cream',
    description: 'Creamy cheesecake ice cream with a fresh strawberry swirl and graham cracker crumbles. Like a slice of strawberry cheesecake in frozen form.',
    base_type: 'ice cream',
    prep_time_minutes: 15,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    ingredients: [
      { name: 'cream cheese, softened', amount: '4', unit: 'oz', group: 'base' },
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'strawberry jam', amount: '2', unit: 'tablespoon', group: 'swirl' },
      { name: 'graham cracker crumbles', amount: '2', unit: 'tablespoon', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Microwave cream cheese for 15 seconds until very soft. Whisk in sugar until smooth.' },
      { instruction: 'Gradually whisk in cream, milk, and vanilla until completely smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Create a hole, add strawberry jam and graham cracker crumbles, then use Mix-In function.' },
    ],
    tips: ['Make sure the cream cheese is fully smooth before adding liquids — lumps will not blend out during processing.'],
  },
  {
    title: 'Pineapple Coconut Sorbet',
    description: 'A tropical escape in every bite. Creamy pineapple coconut sorbet that tastes like a frozen pina colada.',
    base_type: 'sorbet',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Sorbet',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['tropical', 'fruity'],
    dietary: ['dairy-free', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'frozen pineapple chunks', amount: '1.5', unit: 'cup', group: 'base' },
      { name: 'coconut cream', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'pineapple juice', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'honey or agave', amount: '1', unit: 'tablespoon', group: 'base' },
      { name: 'shredded coconut', amount: '2', unit: 'tablespoon', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Blend pineapple, coconut cream, pineapple juice, and honey until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Sorbet function.' },
      { instruction: 'Add shredded coconut and use Mix-In function.' },
    ],
  },
  {
    title: 'Frozen Yogurt with Mixed Berries',
    description: 'Tangy and sweet frozen yogurt with a mixed berry swirl. A lighter alternative to ice cream that still feels like a treat.',
    base_type: 'frozen yogurt',
    prep_time_minutes: 5,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Lite Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'plain Greek yogurt', amount: '1.5', unit: 'cup', group: 'base' },
      { name: 'honey', amount: '3', unit: 'tablespoon', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'mixed berry jam', amount: '2', unit: 'tablespoon', group: 'swirl' },
    ],
    steps: [
      { instruction: 'Mix Greek yogurt, honey, and vanilla until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function.' },
      { instruction: 'Add mixed berry jam and use the Mix-In function for a beautiful swirl.' },
    ],
    tips: ['Full-fat Greek yogurt gives the best texture. Non-fat will be icy.'],
  },
  {
    title: 'Fairlife Protein Shake Ice Cream',
    description: 'The easiest Ninja Creami recipe — just pour a Fairlife protein shake into the pint and freeze. Surprisingly creamy with no extra work.',
    base_type: 'lite ice cream',
    prep_time_minutes: 1,
    freeze_time_hours: 24,
    servings: 2,
    creami_program: 'Lite Ice Cream',
    difficulty: 'beginner',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['chocolate'],
    dietary: ['high-protein', 'gluten-free'],
    ingredients: [
      { name: 'Fairlife chocolate protein shake', amount: '1', unit: 'bottle (11.5 oz)', group: 'base' },
    ],
    steps: [
      { instruction: 'Pour the entire protein shake into the Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function.' },
      { instruction: 'Re-spin 2-3 times until smooth and creamy.' },
    ],
    tips: ['This works with any Fairlife flavor — chocolate, vanilla, salted caramel, and strawberry all work great.', 'You will likely need 2-3 re-spins. This is normal for protein-based recipes.'],
  },
  {
    title: 'Double Chocolate Brownie Ice Cream',
    description: 'Intensely chocolatey ice cream with brownie bites folded in. For serious chocolate lovers only.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['chocolate'],
    ingredients: [
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'cocoa powder', amount: '3', unit: 'tablespoon', group: 'base' },
      { name: 'chocolate chips, melted', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'brownie bites, chopped', amount: '1/4', unit: 'cup', group: 'mix-ins' },
    ],
    steps: [
      { instruction: 'Melt chocolate chips in the microwave in 15-second intervals, stirring between each.' },
      { instruction: 'Whisk cocoa powder and sugar into the melted chocolate.' },
      { instruction: 'Gradually add cream and milk, whisking until smooth.' },
      { instruction: 'Add vanilla and stir. Pour into Ninja Creami pint.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
      { instruction: 'Add brownie bites and use Mix-In function.' },
    ],
  },
  {
    title: 'Vanilla Bean Gelato',
    description: 'Silky smooth Italian-style vanilla gelato with a denser, more intense flavor than traditional ice cream. Made with more milk than cream for that authentic gelato texture.',
    base_type: 'gelato',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Gelato',
    compatible_models: ['deluxe', 'deluxe-11-in-1'],
    flavor_profiles: ['vanilla'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'whole milk', amount: '1.25', unit: 'cup', group: 'base' },
      { name: 'heavy cream', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'vanilla bean paste', amount: '1', unit: 'teaspoon', group: 'base' },
      { name: 'salt', amount: '1', unit: 'pinch', group: 'base' },
    ],
    steps: [
      { instruction: 'Whisk milk, cream, sugar, vanilla bean paste, and salt until sugar dissolves.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Gelato function.' },
    ],
    tips: ['Gelato has a higher milk-to-cream ratio than ice cream, creating a denser and silkier texture.'],
  },
  {
    title: 'Keto Vanilla Ice Cream',
    description: 'Rich and creamy keto-friendly vanilla ice cream with zero sugar. Uses allulose for the best texture and sweetness without the carbs.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['vanilla'],
    dietary: ['keto', 'sugar-free', 'gluten-free'],
    ingredients: [
      { name: 'heavy cream', amount: '1', unit: 'cup', group: 'base' },
      { name: 'unsweetened almond milk', amount: '1/2', unit: 'cup', group: 'base' },
      { name: 'allulose', amount: '1/4', unit: 'cup', group: 'base' },
      { name: 'vanilla extract', amount: '1', unit: 'tablespoon', group: 'base' },
      { name: 'cream cheese', amount: '1', unit: 'oz', group: 'base' },
    ],
    steps: [
      { instruction: 'Soften cream cheese in microwave for 10 seconds.' },
      { instruction: 'Whisk cream cheese and allulose together until smooth.' },
      { instruction: 'Gradually add cream, almond milk, and vanilla. Mix until combined.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
    ],
    tips: ['Allulose is the best keto sweetener for ice cream — it does not crystallize when frozen like erythritol does.'],
  },
  {
    title: 'Matcha Green Tea Ice Cream',
    description: 'Earthy, slightly sweet matcha ice cream with a beautiful vibrant green color. A Japanese-inspired frozen treat.',
    base_type: 'ice cream',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: [],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'heavy cream', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'whole milk', amount: '3/4', unit: 'cup', group: 'base' },
      { name: 'granulated sugar', amount: '1/3', unit: 'cup', group: 'base' },
      { name: 'matcha powder', amount: '2', unit: 'teaspoon', group: 'base' },
      { name: 'vanilla extract', amount: '1/2', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Sift matcha powder into a small bowl and add 2 tablespoons of warm milk. Whisk into a smooth paste.' },
      { instruction: 'Add sugar to the matcha paste and stir until dissolved.' },
      { instruction: 'Add remaining milk, cream, and vanilla. Whisk until fully combined.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Ice Cream function.' },
    ],
    tips: ['Sifting the matcha first prevents clumps. Making a paste with warm milk ensures even distribution.', 'Use ceremonial-grade matcha for the best flavor and color.'],
  },
  {
    title: 'Peach Frozen Yogurt',
    description: 'Sweet and tangy peach frozen yogurt made with fresh peaches and Greek yogurt. Light, refreshing, and perfect for summer.',
    base_type: 'frozen yogurt',
    prep_time_minutes: 10,
    freeze_time_hours: 24,
    servings: 4,
    creami_program: 'Lite Ice Cream',
    compatible_models: ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'],
    flavor_profiles: ['fruity'],
    dietary: ['gluten-free'],
    ingredients: [
      { name: 'ripe peaches, sliced', amount: '1.5', unit: 'cup', group: 'base' },
      { name: 'plain Greek yogurt', amount: '1', unit: 'cup', group: 'base' },
      { name: 'honey', amount: '2', unit: 'tablespoon', group: 'base' },
      { name: 'vanilla extract', amount: '1/2', unit: 'teaspoon', group: 'base' },
    ],
    steps: [
      { instruction: 'Blend peaches, Greek yogurt, honey, and vanilla until smooth.' },
      { instruction: 'Pour into Ninja Creami pint container.' },
      { instruction: 'Freeze for 24 hours.' },
      { instruction: 'Process using the Lite Ice Cream function.' },
    ],
    tips: ['Frozen peach slices work just as well — thaw slightly before blending.'],
  },
];

// --- Main Seeding Function ---

async function seed() {
  console.log('Starting recipe seeding...\n');

  // Get the editorial account (or create one)
  const EDITORIAL_EMAIL = 'editorial@creami.recipes';
  let authorId: string;

  // Check if editorial user exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'creami-recipes-team')
    .single();

  if (existingProfile) {
    authorId = existingProfile.id;
    console.log('Using existing editorial account:', authorId);
  } else {
    // Create the editorial user via admin API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: EDITORIAL_EMAIL,
      password: 'editorial-' + Date.now(),
      email_confirm: true,
      user_metadata: {
        username: 'creami-recipes-team',
        display_name: 'Creami Recipes Team',
      },
    });

    if (authError) {
      console.error('Failed to create editorial user:', authError.message);
      process.exit(1);
    }

    authorId = authUser.user.id;

    // Update role to admin
    await supabase
      .from('profiles')
      .update({ role: 'admin', display_name: 'Creami Recipes Team' })
      .eq('id', authorId);

    console.log('Created editorial account:', authorId);
  }

  // Fetch category and model IDs for linking
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const { data: models } = await supabase.from('creami_models').select('id, slug');

  const categoryMap = new Map((categories ?? []).map((c) => [c.slug, c.id]));
  const modelMap = new Map((models ?? []).map((m) => [m.slug, m.id]));

  // Track slugs for deduplication
  const usedSlugs = new Set<string>();

  let successCount = 0;
  let skipCount = 0;

  for (const raw of RAW_RECIPES) {
    // Generate unique slug
    let slug = slugify(raw.title);
    if (usedSlugs.has(slug)) {
      slug += '-' + Date.now().toString(36);
    }
    usedSlugs.add(slug);

    // Check if recipe already exists
    const { data: existing } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      console.log(`  SKIP (exists): ${raw.title}`);
      skipCount++;
      continue;
    }

    // Normalize
    const baseType = normalizeBaseType(raw.base_type);
    const difficulty = inferDifficulty(raw);

    // Insert recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        author_id: authorId,
        title: raw.title,
        slug,
        description: raw.description,
        difficulty,
        prep_time_minutes: raw.prep_time_minutes ?? null,
        freeze_time_hours: raw.freeze_time_hours ?? 24,
        churn_program: raw.creami_program ?? null,
        servings: raw.servings ?? 4,
        base_type: baseType,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (recipeError || !recipe) {
      console.error(`  ERROR: ${raw.title} — ${recipeError?.message}`);
      continue;
    }

    // Insert ingredients
    const validIngredients = raw.ingredients.filter((i) => i.name.trim());
    if (validIngredients.length > 0) {
      await supabase.from('ingredients').insert(
        validIngredients.map((ing, idx) => ({
          recipe_id: recipe.id,
          name: ing.name.trim(),
          amount: ing.amount.trim(),
          unit: normalizeUnit(ing.unit) || null,
          group_name: normalizeIngredientGroup(ing.group),
          sort_order: idx,
        }))
      );
    }

    // Insert steps with auto-generated hints
    const validSteps = raw.steps.filter((s) => s.instruction.trim());
    if (validSteps.length > 0) {
      await supabase.from('steps').insert(
        validSteps.map((step, idx) => ({
          recipe_id: recipe.id,
          step_number: idx + 1,
          instruction: step.instruction.trim(),
          hint: step.hint?.trim() || generateStepHint(step.instruction) || null,
          duration_minutes: step.duration_minutes ?? null,
        }))
      );
    }

    // Link categories
    const categoryIds: string[] = [];

    // Auto-link base type category
    const baseTypeSlug = slugify(baseType);
    if (categoryMap.has(baseTypeSlug)) {
      categoryIds.push(categoryMap.get(baseTypeSlug)!);
    }

    // Link flavor profiles
    for (const fp of raw.flavor_profiles ?? []) {
      if (categoryMap.has(fp)) categoryIds.push(categoryMap.get(fp)!);
    }

    // Link dietary
    for (const d of raw.dietary ?? []) {
      if (categoryMap.has(d)) categoryIds.push(categoryMap.get(d)!);
    }

    if (categoryIds.length > 0) {
      await supabase.from('recipe_categories').insert(
        [...new Set(categoryIds)].map((catId) => ({
          recipe_id: recipe.id,
          category_id: catId,
        }))
      );
    }

    // Link Creami models
    const modelIds = (raw.compatible_models ?? ['original', 'deluxe', 'breeze', 'deluxe-11-in-1'])
      .map((slug) => modelMap.get(slug))
      .filter(Boolean) as string[];

    if (modelIds.length > 0) {
      await supabase.from('recipe_models').insert(
        modelIds.map((modelId) => ({
          recipe_id: recipe.id,
          model_id: modelId,
        }))
      );
    }

    console.log(`  OK: ${raw.title} (${difficulty}, ${baseType})`);
    successCount++;
  }

  console.log(`\nSeeding complete: ${successCount} inserted, ${skipCount} skipped.`);
}

// Run
seed().catch(console.error);
