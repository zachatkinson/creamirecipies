/**
 * Recipe Ingestion Pipeline
 *
 * Processes raw scraped recipe data through a 6-step pipeline:
 *   1. Normalize & validate
 *   2. Tag & categorize
 *   3. Translate (via Anthropic Claude API)
 *   4. Link Creami models
 *   5. Set publishing schedule
 *   6. Verify data quality
 *
 * Usage:
 *   source .env && npx tsx scripts/ingest-recipes.ts ./data/new-recipes.json
 *
 * Requires: PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';

// ─── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const RECIPES_PER_DAY = 5;
const LOCALES = ['fr', 'es', 'de', 'pt'] as const;
type TargetLocale = (typeof LOCALES)[number];

const LANGUAGE_NAMES: Record<TargetLocale, string> = {
  fr: 'French', es: 'Spanish', de: 'German', pt: 'Brazilian Portuguese',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawRecipeInput {
  title: string;
  description: string;
  base_type: string;
  prep_time_minutes?: number;
  freeze_time_hours?: number;
  servings?: number;
  difficulty?: string;
  is_swirl_recipe?: boolean;
  ingredients: { name: string; amount: string; unit?: string; group?: string }[];
  steps: { instruction: string; hint?: string; duration_minutes?: number }[];
}

interface PipelineIngredient {
  name: string;
  amount: string;
  unit: string | null;
  group_name: 'base' | 'mix-ins' | 'topping' | 'swirl';
  sort_order: number;
  master_ingredient_id: string | null;
}

interface PipelineStep {
  instruction: string;
  hint: string | null;
  step_number: number;
  duration_minutes: number | null;
}

interface TranslationSet {
  locale: TargetLocale;
  title: string;
  description: string;
}

interface StepTranslation {
  instruction_en: string;
  hint_en: string | null;
  instruction_fr: string | null;
  instruction_es: string | null;
  instruction_de: string | null;
  instruction_pt: string | null;
  hint_fr: string | null;
  hint_es: string | null;
  hint_de: string | null;
  hint_pt: string | null;
  [key: string]: string | null;
}

interface PipelineRecipe {
  slug: string;
  title: string;
  description: string;
  base_type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  churn_program: string;
  pint_size: '16oz';
  prep_time_minutes: number | null;
  freeze_time_hours: number;
  servings: number;
  is_swirl_recipe: boolean;
  ingredients: PipelineIngredient[];
  steps: PipelineStep[];
  categoryIds: string[];
  modelIds: string[];
  translations: TranslationSet[];
  stepTranslations: StepTranslation[];
  ingredientTranslations: { id: string; name_fr?: string; name_es?: string; name_de?: string; name_pt?: string }[];
  status: 'draft';
  scheduled_publish_at: string;
}

// ─── Normalization Maps ──────────────────────────────────────────────────────

const BASE_TYPE_MAP: Record<string, string> = {
  'ice cream': 'Ice Cream', 'ice-cream': 'Ice Cream', 'icecream': 'Ice Cream',
  'lite ice cream': 'Lite Ice Cream', 'lite-ice-cream': 'Lite Ice Cream', 'light ice cream': 'Lite Ice Cream',
  'sorbet': 'Sorbet', 'gelato': 'Gelato',
  'frozen yogurt': 'Frozen Yogurt', 'frozen-yogurt': 'Frozen Yogurt', 'froyo': 'Frozen Yogurt',
  'milkshake': 'Milkshake', 'smoothie bowl': 'Smoothie Bowl', 'smoothie-bowl': 'Smoothie Bowl',
  'italian ice': 'Italian Ice', 'italian-ice': 'Italian Ice', 'protein': 'Lite Ice Cream',
};

const CHURN_PROGRAM_MAP: Record<string, string> = {
  'Ice Cream': 'Ice Cream', 'Lite Ice Cream': 'Lite Ice Cream', 'Sorbet': 'Sorbet',
  'Gelato': 'Gelato', 'Frozen Yogurt': 'Ice Cream', 'Milkshake': 'Milkshake',
  'Smoothie Bowl': 'Smoothie Bowl', 'Italian Ice': 'Italian Ice',
};

const UNIT_MAP: Record<string, string> = {
  'cups': 'cup', 'tablespoons': 'tablespoon', 'tbsp': 'tablespoon',
  'teaspoons': 'teaspoon', 'tsp': 'teaspoon', 'ounces': 'oz', 'ounce': 'oz',
  'pounds': 'lb', 'pound': 'lb', 'grams': 'g', 'gram': 'g',
};

const GROUP_MAP: Record<string, 'base' | 'mix-ins' | 'topping' | 'swirl'> = {
  'base': 'base', 'dairy': 'base', 'liquid': 'base', 'dry': 'base', 'sweetener': 'base',
  'flavoring': 'base', 'flavor': 'base', 'extracts': 'base', 'spices': 'base', 'main': 'base',
  'coloring': 'base', 'condiments': 'base', 'acid': 'base',
  'mix-ins': 'mix-ins', 'mix-in': 'mix-ins', 'mixin': 'mix-ins', 'chocolate': 'mix-ins',
  'solid': 'mix-ins', 'add-in': 'mix-ins',
  'topping': 'topping', 'toppings': 'topping',
  'swirl': 'swirl',
};

const STEP_HINTS: Record<string, string> = {
  whisk: 'Whisk until completely smooth with no lumps — this ensures an even freeze and creamy texture.',
  blend: 'Blend on high for 30-60 seconds until completely smooth. Any chunks will become icy spots.',
  pour: 'Fill to the max fill line but not above — overfilling can cause the lid to pop off during processing.',
  freeze: 'Place on a flat, level surface in the coldest part of your freezer. Uneven freezing leads to inconsistent texture.',
  process: 'If the machine struggles or the pint spins freely, let it sit at room temperature for 5 minutes before retrying.',
  respin: 'One re-spin usually does the trick. If still crumbly after two, let it soften for 2-3 minutes and try again.',
  'mix-in': 'Create a hole down to about halfway. Overfilling mix-ins can jam the blade — use 1/4 cup or less.',
  serve: 'Ninja Creami treats are best enjoyed immediately. If refreezing, let it sit out 5-10 minutes before scooping.',
};

// Brand names allowed in translations
const BRAND_NAMES = new Set([
  'ninja creami', 'ninja', 'creami', 'biscoff', 'oreo', 'nutella', 'reese',
  'kit kat', 'm&m', 'twix', 'butterfinger', 'snickers', 'nilla', 'lotus',
  'fairlife', 'greek', 'thai kitchen', 'aroy-d',
]);

// Common English words that should NOT appear in translations
const ENGLISH_FOOD_WORDS = [
  'cream', 'milk', 'sugar', 'butter', 'vanilla', 'chocolate', 'strawberry',
  'blueberry', 'raspberry', 'cherry', 'mango', 'banana', 'pineapple', 'coconut',
  'honey', 'yogurt', 'cheese', 'cookie', 'brownie', 'caramel', 'cinnamon',
  'whisk', 'blend', 'pour', 'freeze', 'process', 'stir', 'mix', 'add',
  'until smooth', 'combined', 'dissolved', 'tablespoon', 'teaspoon', 'cup',
  'peanut', 'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut',
];

// ─── Utility Functions ───────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function normalizeBaseType(raw: string): string {
  return BASE_TYPE_MAP[raw.toLowerCase().trim()] ?? 'Ice Cream';
}

function normalizeUnit(raw?: string): string | null {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  return UNIT_MAP[key] ?? (key || null);
}

function normalizeGroup(raw?: string): 'base' | 'mix-ins' | 'topping' | 'swirl' {
  if (!raw) return 'base';
  return GROUP_MAP[raw.toLowerCase().trim()] ?? 'base';
}

function inferDifficulty(raw: RawRecipeInput): 'beginner' | 'intermediate' | 'advanced' {
  if (raw.difficulty) {
    const d = raw.difficulty.toLowerCase();
    if (d.includes('beginner') || d.includes('easy')) return 'beginner';
    if (d.includes('advanced') || d.includes('hard')) return 'advanced';
    return 'intermediate';
  }
  const ic = raw.ingredients.length;
  const sc = raw.steps.length;
  const hasMixIns = raw.ingredients.some(i => normalizeGroup(i.group) === 'mix-ins');
  if (ic <= 4 && sc <= 4 && !hasMixIns) return 'beginner';
  if (ic >= 8 || sc >= 7) return 'advanced';
  return 'intermediate';
}

function generateHint(instruction: string): string | null {
  const lower = instruction.toLowerCase();
  if (lower.includes('whisk') || lower.includes('stir')) return STEP_HINTS.whisk;
  if (lower.includes('blend') || lower.includes('puree')) return STEP_HINTS.blend;
  if (lower.includes('pour') || lower.includes('transfer')) return STEP_HINTS.pour;
  if (lower.includes('freeze')) return STEP_HINTS.freeze;
  if (lower.includes('process') || lower.includes('function')) return STEP_HINTS.process;
  if (lower.includes('re-spin') || lower.includes('respin')) return STEP_HINTS.respin;
  if (lower.includes('mix-in') || (lower.includes('add') && lower.includes('hole'))) return STEP_HINTS['mix-in'];
  if (lower.includes('serve') || lower.includes('enjoy')) return STEP_HINTS.serve;
  return null;
}

function containsEnglish(text: string): boolean {
  const lower = text.toLowerCase();
  // Remove brand names before checking
  let cleaned = lower;
  for (const brand of BRAND_NAMES) {
    cleaned = cleaned.split(brand).join('');
  }
  // Check for English food/cooking words
  let matches = 0;
  for (const word of ENGLISH_FOOD_WORDS) {
    if (cleaned.includes(word)) matches++;
  }
  return matches >= 2; // 2+ English words = likely untranslated
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Step 1: Normalize & Validate ────────────────────────────────────────────

async function normalizeAndValidate(
  raw: RawRecipeInput,
  supabase: SupabaseClient,
  existingSlugs: Set<string>,
  masterCache: Map<string, { id: string }>,
): Promise<PipelineRecipe> {
  // Validate required fields
  if (!raw.title?.trim()) throw new Error('Missing title');
  if (!raw.description?.trim()) throw new Error('Missing description');
  if (!raw.ingredients?.length) throw new Error('No ingredients');
  if (!raw.steps?.length) throw new Error('No steps');

  const slug = slugify(raw.title);
  if (existingSlugs.has(slug)) throw new Error(`Duplicate slug: ${slug}`);

  const baseType = normalizeBaseType(raw.base_type);

  // Normalize ingredients and link to master_ingredients
  const ingredients: PipelineIngredient[] = [];
  const ingredientTranslations: PipelineRecipe['ingredientTranslations'] = [];

  for (let i = 0; i < raw.ingredients.length; i++) {
    const ing = raw.ingredients[i];
    const normalizedName = ing.name.trim();
    const lookupKey = normalizedName.toLowerCase().replace(/[,.].*$/, '').trim();

    let masterId: string | null = null;
    const cached = masterCache.get(lookupKey) || masterCache.get(normalizedName.toLowerCase());
    if (cached) {
      masterId = cached.id;
    } else {
      // Try DB lookup
      const { data } = await supabase
        .from('master_ingredients')
        .select('id')
        .ilike('name', lookupKey)
        .limit(1);
      if (data && data.length > 0) {
        masterId = (data[0] as { id: string }).id;
        masterCache.set(lookupKey, { id: masterId });
      }
      // If still not found, create a new master ingredient
      if (!masterId) {
        const { data: newMi } = await supabase
          .from('master_ingredients')
          .insert({
            name: normalizedName.replace(/[,.].*$/, '').trim(),
            slug: slugify(normalizedName),
            category: normalizeGroup(ing.group) === 'base' ? 'dairy' : 'other',
          })
          .select('id')
          .single();
        if (newMi) {
          masterId = (newMi as { id: string }).id;
          masterCache.set(lookupKey, { id: masterId });
        }
      }
    }

    ingredients.push({
      name: normalizedName,
      amount: ing.amount?.trim() ?? '1',
      unit: normalizeUnit(ing.unit),
      group_name: normalizeGroup(ing.group),
      sort_order: i + 1,
      master_ingredient_id: masterId,
    });
  }

  // Normalize steps
  const steps: PipelineStep[] = raw.steps.map((s, i) => ({
    instruction: s.instruction.trim(),
    hint: s.hint?.trim() || generateHint(s.instruction),
    step_number: i + 1,
    duration_minutes: s.duration_minutes ?? null,
  }));

  return {
    slug,
    title: raw.title.trim(),
    description: raw.description.trim(),
    base_type: baseType,
    difficulty: inferDifficulty(raw),
    churn_program: CHURN_PROGRAM_MAP[baseType] ?? 'Ice Cream',
    pint_size: '16oz',
    prep_time_minutes: raw.prep_time_minutes ?? 10,
    freeze_time_hours: raw.freeze_time_hours ?? 24,
    servings: raw.servings ?? 4,
    is_swirl_recipe: raw.is_swirl_recipe ?? false,
    ingredients,
    steps,
    categoryIds: [],
    modelIds: [],
    translations: [],
    stepTranslations: [],
    ingredientTranslations,
    status: 'draft',
    scheduled_publish_at: '',
  };
}

// ─── Step 2: Tag & Categorize ────────────────────────────────────────────────

function tagAndCategorize(recipe: PipelineRecipe, categoryMap: Map<string, string>): void {
  const ids = new Set<string>();

  // Base type category
  const baseSlug = slugify(recipe.base_type);
  const baseId = categoryMap.get(baseSlug);
  if (baseId) ids.add(baseId);

  const title = recipe.title.toLowerCase();
  const ingNames = recipe.ingredients.map(i => i.name.toLowerCase());
  const allText = title + ' ' + ingNames.join(' ');

  // Flavor profiles
  const FLAVOR_RULES: [string, RegExp][] = [
    ['chocolate', /chocolate|cocoa|brownie|fudge/],
    ['vanilla', /vanilla/],
    ['caramel', /caramel|butterscotch|toffee|dulce/],
    ['coffee', /coffee|espresso|mocha|latte|cappuccino|tiramisu/],
    ['mint', /mint|peppermint/],
    ['nutty', /peanut|almond|pecan|walnut|hazelnut|pistachio|cashew|macadamia/],
    ['tropical', /mango|pineapple|coconut|passion|guava|papaya/],
    ['fruity', /strawberry|blueberry|raspberry|cherry|peach|banana|apple|lemon|lime|orange|berry|watermelon|grape|kiwi|fig|cranberry|pomegranate/],
    ['candy-cookie', /cookie|oreo|biscoff|brownie|candy|s'more|gummy|snicker|reese/],
  ];

  for (const [slug, pattern] of FLAVOR_RULES) {
    if (pattern.test(allText)) {
      const id = categoryMap.get(slug);
      if (id) ids.add(id);
    }
  }

  // Dietary tags
  const DAIRY = /cream|milk|yogurt|cheese|butter|whey|casein|condensed/;
  const PLANT_ALT = /almond milk|oat milk|coconut milk|coconut cream|soy milk|cashew milk/;
  const hasDairy = ingNames.some(n => DAIRY.test(n) && !PLANT_ALT.test(n));
  const hasGluten = ingNames.some(n => /cookie|cracker|graham|biscoff|brownie|cake|pretzel|wafer|flour|oreo/.test(n));
  const hasProtein = ingNames.some(n => /protein powder|protein shake/.test(n));
  const hasAllulose = ingNames.some(n => /allulose/.test(n));
  const isVegan = !hasDairy && !ingNames.some(n => /egg|honey|gelatin/.test(n));

  if (!hasDairy) { const id = categoryMap.get('dairy-free'); if (id) ids.add(id); }
  if (isVegan) { const id = categoryMap.get('vegan'); if (id) ids.add(id); }
  if (!hasGluten) { const id = categoryMap.get('gluten-free'); if (id) ids.add(id); }
  if (hasProtein) { const id = categoryMap.get('high-protein'); if (id) ids.add(id); }
  if (hasAllulose || /keto/i.test(title)) { const id = categoryMap.get('keto'); if (id) ids.add(id); }
  if (hasAllulose || /sugar.?free/i.test(allText)) { const id = categoryMap.get('sugar-free'); if (id) ids.add(id); }

  recipe.categoryIds = [...ids];
}

// ─── Step 3: Translate ───────────────────────────────────────────────────────

interface TranslationApiResult {
  title: string;
  description: string;
  ingredients: { original: string; translated: string }[];
  steps: { original: string; translated: string; hint_original: string | null; hint_translated: string | null }[];
}

async function translateToLocale(
  recipe: PipelineRecipe,
  locale: TargetLocale,
  anthropic: Anthropic,
): Promise<TranslationApiResult> {
  const langName = LANGUAGE_NAMES[locale];

  const ingredientList = recipe.ingredients.map((i, idx) => `${idx + 1}. ${i.name}`).join('\n');
  const stepList = recipe.steps.map((s, idx) => {
    let line = `${idx + 1}. ${s.instruction}`;
    if (s.hint) line += `\n   Hint: ${s.hint}`;
    return line;
  }).join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0.3,
    system: `You are a professional culinary translator specializing in frozen dessert recipes. You translate Ninja Creami ice cream recipes into natural, fluent ${langName}. Your translations must read naturally to a native ${langName} speaker — never word-by-word. Use standard culinary vocabulary of the target language. Keep brand names exactly as-is: Ninja Creami, Biscoff, Oreo, Nutella, etc. Keep measurement units in original form (cup, tablespoon, teaspoon, oz). Respond ONLY with valid JSON matching the exact schema provided.`,
    messages: [{
      role: 'user',
      content: `Translate this Ninja Creami recipe into ${langName} (${locale}).

Recipe:
- Title: ${recipe.title}
- Description: ${recipe.description}
- Type: ${recipe.base_type}

Ingredients:
${ingredientList}

Steps:
${stepList}

Respond with ONLY this JSON (no markdown, no explanation):
{
  "title": "translated title",
  "description": "translated description",
  "ingredients": [
    {"original": "ingredient name in English", "translated": "ingredient name in ${langName}"}
  ],
  "steps": [
    {"original": "English instruction", "translated": "${langName} instruction", "hint_original": "English hint or null", "hint_translated": "${langName} hint or null"}
  ]
}

CRITICAL: Every string must be complete, natural ${langName}. Do NOT leave any English words except brand names (Ninja Creami, Biscoff, Oreo, Nutella, etc).`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    return JSON.parse(cleaned) as TranslationApiResult;
  } catch {
    throw new Error(`Failed to parse ${locale} translation JSON: ${cleaned.slice(0, 200)}`);
  }
}

async function translateRecipe(recipe: PipelineRecipe, anthropic: Anthropic, existingStepTrans: Map<string, StepTranslation>): Promise<void> {
  // Collect translations for all 4 locales
  const stepTransMap = new Map<string, StepTranslation>();

  // Pre-populate with any existing step translations
  for (const step of recipe.steps) {
    const existing = existingStepTrans.get(step.instruction);
    if (existing) {
      stepTransMap.set(step.instruction, { ...existing });
    } else {
      stepTransMap.set(step.instruction, {
        instruction_en: step.instruction,
        hint_en: step.hint,
        instruction_fr: null, instruction_es: null, instruction_de: null, instruction_pt: null,
        hint_fr: null, hint_es: null, hint_de: null, hint_pt: null,
      });
    }
  }

  for (const locale of LOCALES) {
    // Check if this step already has translations for this locale
    const allStepsTranslated = recipe.steps.every(s => {
      const st = stepTransMap.get(s.instruction);
      return st && st[`instruction_${locale}`];
    });

    // Check if recipe translation exists (we always need title/desc)
    console.log(`    Translating to ${LANGUAGE_NAMES[locale]}...`);

    let result: TranslationApiResult;
    let retries = 0;
    while (true) {
      try {
        result = await translateToLocale(recipe, locale, anthropic);
        break;
      } catch (err) {
        retries++;
        if (retries > 2) throw err;
        console.log(`    Retry ${retries}/2 for ${locale}...`);
        await sleep(1000);
      }
    }

    // Validate translation quality
    if (containsEnglish(result.title)) {
      console.warn(`    WARNING: ${locale} title may contain English: ${result.title}`);
    }
    if (containsEnglish(result.description)) {
      console.warn(`    WARNING: ${locale} description may contain English: ${result.description}`);
    }

    // Store recipe translation
    recipe.translations.push({
      locale,
      title: result.title,
      description: result.description,
    });

    // Store step translations
    for (const stepTrans of result.steps) {
      const st = stepTransMap.get(stepTrans.original);
      if (st) {
        (st as Record<string, unknown>)[`instruction_${locale}`] = stepTrans.translated;
        (st as Record<string, unknown>)[`hint_${locale}`] = stepTrans.hint_translated;
      }
    }

    // Store ingredient translations
    for (const ingTrans of result.ingredients) {
      const ing = recipe.ingredients.find(i => i.name === ingTrans.original);
      if (ing?.master_ingredient_id) {
        let existing = recipe.ingredientTranslations.find(t => t.id === ing.master_ingredient_id);
        if (!existing) {
          existing = { id: ing.master_ingredient_id };
          recipe.ingredientTranslations.push(existing);
        }
        (existing as Record<string, unknown>)[`name_${locale}`] = ingTrans.translated;
      }
    }

    // Rate limit
    await sleep(500);
  }

  recipe.stepTranslations = [...stepTransMap.values()];
}

// ─── Step 4: Link Models ─────────────────────────────────────────────────────

function linkModels(recipe: PipelineRecipe, modelMap: Map<string, string>): void {
  const allSlugs = [...modelMap.keys()];
  if (recipe.is_swirl_recipe) {
    const swirlId = modelMap.get('swirl');
    recipe.modelIds = swirlId ? [swirlId] : [];
  } else {
    recipe.modelIds = allSlugs
      .map(slug => modelMap.get(slug))
      .filter((id): id is string => id !== undefined);
  }
}

// ─── Step 5: Set Publishing Status ───────────────────────────────────────────

let publishCounter = 0;
let currentScheduleDate: Date;

function setPublishingStatus(recipe: PipelineRecipe): void {
  recipe.status = 'draft';
  if (publishCounter >= RECIPES_PER_DAY) {
    currentScheduleDate.setDate(currentScheduleDate.getDate() + 1);
    publishCounter = 0;
  }
  recipe.scheduled_publish_at = currentScheduleDate.toISOString().split('T')[0] + 'T10:00:00Z';
  publishCounter++;
}

// ─── Step 6: Verify Data Quality ─────────────────────────────────────────────

function verifyDataQuality(recipe: PipelineRecipe): string[] {
  const errors: string[] = [];

  if (!recipe.slug) errors.push('Empty slug');
  if (recipe.steps.some(s => !s.instruction.trim())) errors.push('Empty step instruction');
  if (recipe.ingredients.some(i => !i.name.trim())) errors.push('Empty ingredient name');
  if (recipe.categoryIds.length === 0) errors.push('No categories assigned');
  if (recipe.modelIds.length === 0) errors.push('No models linked');

  // Check all translations present
  for (const locale of LOCALES) {
    const t = recipe.translations.find(tr => tr.locale === locale);
    if (!t) { errors.push(`Missing ${locale} translation`); continue; }
    if (!t.title.trim()) errors.push(`Empty ${locale} title`);
    if (!t.description.trim()) errors.push(`Empty ${locale} description`);
    if (containsEnglish(t.title)) errors.push(`${locale} title contains English: "${t.title.slice(0, 50)}"`);
    if (containsEnglish(t.description)) errors.push(`${locale} description contains English: "${t.description.slice(0, 50)}"`);
  }

  // Check step translations
  for (const st of recipe.stepTranslations) {
    for (const locale of LOCALES) {
      const val = (st as Record<string, unknown>)[`instruction_${locale}`] as string | null;
      if (!val) errors.push(`Missing ${locale} step translation for: "${st.instruction_en.slice(0, 40)}"`);
    }
  }

  return errors;
}

// ─── Database Writer ─────────────────────────────────────────────────────────

async function insertRecipe(recipe: PipelineRecipe, authorId: string, supabase: SupabaseClient): Promise<void> {
  // 1. Insert recipe
  const { data: newRecipe, error: recipeErr } = await supabase
    .from('recipes')
    .insert({
      title: recipe.title,
      slug: recipe.slug,
      description: recipe.description,
      base_type: recipe.base_type,
      difficulty: recipe.difficulty,
      churn_program: recipe.churn_program,
      pint_size: recipe.pint_size,
      prep_time_minutes: recipe.prep_time_minutes,
      freeze_time_hours: recipe.freeze_time_hours,
      servings: recipe.servings,
      is_swirl_recipe: recipe.is_swirl_recipe,
      author_id: authorId,
      status: recipe.status,
      scheduled_publish_at: recipe.scheduled_publish_at,
    })
    .select('id')
    .single();

  if (recipeErr || !newRecipe) throw new Error(`Failed to insert recipe: ${recipeErr?.message}`);
  const recipeId = (newRecipe as { id: string }).id;

  // 2. Insert ingredients
  const { error: ingErr } = await supabase.from('ingredients').insert(
    recipe.ingredients.map(i => ({
      recipe_id: recipeId,
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      group_name: i.group_name,
      sort_order: i.sort_order,
      master_ingredient_id: i.master_ingredient_id,
    }))
  );
  if (ingErr) throw new Error(`Failed to insert ingredients: ${ingErr.message}`);

  // 3. Insert steps
  const { error: stepErr } = await supabase.from('steps').insert(
    recipe.steps.map(s => ({
      recipe_id: recipeId,
      instruction: s.instruction,
      hint: s.hint,
      step_number: s.step_number,
      duration_minutes: s.duration_minutes,
    }))
  );
  if (stepErr) throw new Error(`Failed to insert steps: ${stepErr.message}`);

  // 4. Insert recipe_categories
  if (recipe.categoryIds.length > 0) {
    const { error: catErr } = await supabase.from('recipe_categories').insert(
      recipe.categoryIds.map(cid => ({ recipe_id: recipeId, category_id: cid }))
    );
    if (catErr) throw new Error(`Failed to insert categories: ${catErr.message}`);
  }

  // 5. Insert recipe_models
  if (recipe.modelIds.length > 0) {
    const { error: modelErr } = await supabase.from('recipe_models').insert(
      recipe.modelIds.map(mid => ({ recipe_id: recipeId, model_id: mid }))
    );
    if (modelErr) throw new Error(`Failed to insert models: ${modelErr.message}`);
  }

  // 6. Insert recipe_translations
  for (const t of recipe.translations) {
    const { error: transErr } = await supabase.from('recipe_translations').insert({
      recipe_id: recipeId,
      locale: t.locale,
      title: t.title,
      description: t.description,
    });
    if (transErr) console.warn(`  Warning: translation ${t.locale}: ${transErr.message}`);
  }

  // 7. Upsert step_translations (keyed by instruction_en)
  for (const st of recipe.stepTranslations) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('step_translations')
      .select('id')
      .eq('instruction_en', st.instruction_en)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update only null columns
      const updates: Record<string, string | null> = {};
      for (const locale of LOCALES) {
        const instrKey = `instruction_${locale}`;
        const hintKey = `hint_${locale}`;
        if ((st as Record<string, unknown>)[instrKey]) updates[instrKey] = (st as Record<string, unknown>)[instrKey] as string;
        if ((st as Record<string, unknown>)[hintKey]) updates[hintKey] = (st as Record<string, unknown>)[hintKey] as string;
      }
      if (Object.keys(updates).length > 0) {
        await supabase.from('step_translations')
          .update(updates)
          .eq('instruction_en', st.instruction_en);
      }
    } else {
      await supabase.from('step_translations').insert({
        instruction_en: st.instruction_en,
        hint_en: st.hint_en,
        ...Object.fromEntries(LOCALES.flatMap(l => [
          [`instruction_${l}`, (st as Record<string, unknown>)[`instruction_${l}`] ?? null],
          [`hint_${l}`, (st as Record<string, unknown>)[`hint_${l}`] ?? null],
        ])),
      });
    }
  }

  // 8. Update master_ingredients translations (only where null)
  for (const mit of recipe.ingredientTranslations) {
    const updates: Record<string, string> = {};
    for (const locale of LOCALES) {
      const key = `name_${locale}`;
      const val = (mit as Record<string, unknown>)[key] as string | undefined;
      if (val) updates[key] = val;
    }
    if (Object.keys(updates).length > 0) {
      // Only update null columns
      for (const [key, val] of Object.entries(updates)) {
        await supabase
          .from('master_ingredients')
          .update({ [key]: val })
          .eq('id', mit.id)
          .is(key, null);
      }
    }
  }
}

// ─── Main Pipeline ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: npx tsx scripts/ingest-recipes.ts <path-to-recipes.json>');
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE env vars. Run: source .env');
    process.exit(1);
  }
  const skipTranslations = process.argv.includes('--skip-translations') || !ANTHROPIC_API_KEY;
  if (skipTranslations) {
    console.log('NOTE: Skipping translations (--skip-translations or no ANTHROPIC_API_KEY)');
  }

  // Read input
  const rawRecipes: RawRecipeInput[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`Loaded ${rawRecipes.length} recipes from ${inputPath}`);

  // Init clients
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anthropic = skipTranslations ? null : new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  // Pre-fetch lookup data
  console.log('Loading lookup data...');
  const [catRes, modelRes, slugRes, miRes, schedRes, profileRes] = await Promise.all([
    supabase.from('categories').select('id, slug').order('name'),
    supabase.from('creami_models').select('id, slug').order('name'),
    supabase.from('recipes').select('slug'),
    supabase.from('master_ingredients').select('id, name').limit(10000),
    supabase.from('recipes').select('scheduled_publish_at').not('scheduled_publish_at', 'is', null).order('scheduled_publish_at', { ascending: false }).limit(1),
    supabase.from('profiles').select('id').eq('role', 'admin').limit(1),
  ]);

  const categoryMap = new Map((catRes.data ?? []).map((c: { id: string; slug: string }) => [c.slug, c.id]));
  const modelMap = new Map((modelRes.data ?? []).map((m: { id: string; slug: string }) => [m.slug, m.id]));
  const existingSlugs = new Set((slugRes.data ?? []).map((r: { slug: string }) => r.slug));
  const masterCache = new Map((miRes.data ?? []).map((m: { id: string; name: string }) => [m.name.toLowerCase(), { id: m.id }]));

  // Get last scheduled date
  const lastSched = (schedRes.data ?? [])[0] as { scheduled_publish_at: string } | undefined;
  currentScheduleDate = lastSched ? new Date(lastSched.scheduled_publish_at) : new Date();
  currentScheduleDate.setDate(currentScheduleDate.getDate() + 1);

  // Get author ID
  const authorId = ((profileRes.data ?? [])[0] as { id: string } | undefined)?.id;
  if (!authorId) {
    console.error('No admin profile found. Create one first.');
    process.exit(1);
  }

  // Pre-fetch existing step translations
  console.log('Loading existing step translations...');
  const existingStepTrans = new Map<string, StepTranslation>();
  let stPage = 0;
  while (true) {
    const { data } = await supabase
      .from('step_translations')
      .select('*')
      .range(stPage * 1000, (stPage + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    for (const row of data as unknown as StepTranslation[]) {
      existingStepTrans.set(row.instruction_en, row);
    }
    if (data.length < 1000) break;
    stPage++;
  }
  console.log(`  ${existingStepTrans.size} existing step translations loaded`);

  console.log(`\nCategories: ${categoryMap.size}, Models: ${modelMap.size}, Existing recipes: ${existingSlugs.size}, Master ingredients: ${masterCache.size}`);
  console.log(`Schedule starts: ${currentScheduleDate.toISOString().split('T')[0]}\n`);

  // Process recipes
  const summary = { added: [] as string[], skipped: [] as string[], errored: [] as { title: string; error: string }[] };

  for (let i = 0; i < rawRecipes.length; i++) {
    const raw = rawRecipes[i];
    console.log(`\n[${i + 1}/${rawRecipes.length}] ${raw.title}`);

    try {
      // Idempotency check
      const slug = slugify(raw.title);
      if (existingSlugs.has(slug)) {
        console.log('  SKIP (already exists)');
        summary.skipped.push(raw.title);
        continue;
      }

      // Step 1
      console.log('  1. Normalizing...');
      const recipe = await normalizeAndValidate(raw, supabase, existingSlugs, masterCache);

      // Step 2
      console.log('  2. Categorizing...');
      tagAndCategorize(recipe, categoryMap);
      console.log(`     Tags: ${recipe.categoryIds.length} categories`);

      // Step 3
      if (!skipTranslations && anthropic) {
        console.log('  3. Translating (4 languages)...');
        await translateRecipe(recipe, anthropic, existingStepTrans);
      } else {
        console.log('  3. Skipping translations');
      }

      // Step 4
      console.log('  4. Linking models...');
      linkModels(recipe, modelMap);

      // Step 5
      console.log('  5. Scheduling...');
      setPublishingStatus(recipe);

      // Step 6
      console.log('  6. Verifying quality...');
      const errors = verifyDataQuality(recipe);
      if (errors.length > 0) {
        console.warn(`  Quality issues (${errors.length}):`);
        for (const e of errors) console.warn(`    - ${e}`);
        // Only fail on critical errors, warn on translation issues
        const critical = errors.filter(e => !e.includes('contains English') && !(skipTranslations && (e.includes('Missing') && e.includes('translation'))));
        if (critical.length > 0) throw new Error(`Quality check failed: ${critical.join('; ')}`);
      }

      // Write to DB
      console.log('  Writing to database...');
      await insertRecipe(recipe, authorId, supabase);
      existingSlugs.add(recipe.slug);
      summary.added.push(raw.title);
      console.log(`  OK: ${recipe.slug} (publish: ${recipe.scheduled_publish_at.split('T')[0]})`);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: ${msg}`);
      summary.errored.push({ title: raw.title, error: msg });
    }
  }

  // Summary
  console.log('\n══════════════════════════════════════');
  console.log(`  Added:   ${summary.added.length}`);
  console.log(`  Skipped: ${summary.skipped.length}`);
  console.log(`  Errored: ${summary.errored.length}`);
  if (summary.errored.length > 0) {
    console.log('\n  Errors:');
    for (const e of summary.errored) console.log(`    - ${e.title}: ${e.error}`);
  }
  console.log('══════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
