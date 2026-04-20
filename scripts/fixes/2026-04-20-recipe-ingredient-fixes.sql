-- Recipe ingredient/step fixes — 2026-04-20
--
-- Context: audit of 119 published recipes found 2 published recipes with
-- titles that don't match their ingredients, plus 6 upcoming drafts (2026-04-21
-- through 2026-04-26) that are missing their hero ingredients. This file
-- patches all 8 recipes by adding the missing ingredients/steps to the EN
-- source tables (ingredients, steps).
--
-- Translation follow-up (NOT in this file):
--   - recipe_translations.ingredients + steps are currently NULL for these
--     recipes; translated ingredient names come from master_ingredients.name_*
--     and translated step instructions come from step_translations (keyed by
--     instruction_en text match). New step instructions added here will fall
--     back to English for fr/es/de/pt users until step_translations rows are
--     added. Ingredient names chosen here match existing master_ingredients
--     entries where translations exist.
--
-- Scope of THIS file:
--   Part 1 — ingredient additions / changes (EN)
--   Part 2 — step additions / renumbering (EN)
--
-- NOT IN THIS FILE:
--   - Slug renames for aai-berry-sorbet and strawberry-jalapeo-ice-cream
--     (see scripts/fixes/2026-04-20-slug-renames.sql — needs redirect
--     infrastructure before running)
--   - Translation JSONB / step_translations / master_ingredients top-up
--     (follow-up ticket — run scripts/translate-recipes-ai.ts afterward)
--
-- Run order: each recipe is wrapped in a transaction. You can run them
-- individually or all at once. Review each block before committing.

-- ============================================================================
-- 1. roasted-strawberry-basil-ice-cream (PUBLISHED — id=4f66e3d2-33f1-405c-87ed-71f7a0d90f1e)
-- Issue: title promises roasted strawberries but ingredient is plain puree
-- Fix: replace "strawberry puree" with "fresh strawberries, hulled and halved"
--      and insert a roasting step before whisking
-- ============================================================================

BEGIN;

-- Replace the puree with whole fresh strawberries (amount scaled so you end up
-- with ~1/3 cup puree after roasting)
UPDATE ingredients
SET name = 'fresh strawberries, hulled and halved',
    amount = '1',
    unit = 'cup'
WHERE recipe_id = '4f66e3d2-33f1-405c-87ed-71f7a0d90f1e'::uuid
  AND name = 'strawberry puree';

-- Shift all existing steps up by 1 to make room for the new roasting step
UPDATE steps
SET step_number = step_number + 1
WHERE recipe_id = '4f66e3d2-33f1-405c-87ed-71f7a0d90f1e'::uuid;

-- Insert the roasting step as step 1
INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
VALUES (
  '4f66e3d2-33f1-405c-87ed-71f7a0d90f1e'::uuid,
  1,
  'Roast the strawberries: preheat oven to 400°F (200°C). Toss halved strawberries with 1 teaspoon of the granulated sugar on a parchment-lined tray and roast for 20 minutes until jammy and slightly caramelized. Cool completely, then blend into a smooth puree. You should have about 1/3 cup.',
  'Roasting concentrates the strawberry flavor and adds a subtle caramelized note that raw puree can''t give you. You can roast a day ahead and chill overnight.',
  25
);

COMMIT;

-- ============================================================================
-- 2. strawberry-lemon-drop-ice-cream (PUBLISHED — id=011a44b4-9927-4549-a0fb-929bdd644635)
-- Issue: title says strawberry but there is no strawberry in the recipe
-- Fix: add strawberry puree as a base ingredient
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES (
  '011a44b4-9927-4549-a0fb-929bdd644635'::uuid,
  'strawberry puree',
  '1/3',
  'cup',
  'base',
  6  -- after existing sort_order 5 (lemon juice)
);

-- Optional: add lemon zest for that true lemon-drop character (uncomment if wanted)
-- INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order) VALUES
-- ('011a44b4-9927-4549-a0fb-929bdd644635'::uuid, 'lemon zest', '1', 'teaspoon', 'base', 7);

COMMIT;

-- ============================================================================
-- 3. strawberry-oreo-ice-cream (DRAFT — id=7bd5c1a6-f5c3-4c03-9a62-a6b6fcff53ae)
-- Issue: title says Oreo but no cookies in ingredients
-- Fix: add crushed Oreos as a mix-in (chunky, added post-spin per Creami spec)
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES (
  '7bd5c1a6-f5c3-4c03-9a62-a6b6fcff53ae'::uuid,
  'crushed Oreo cookies',
  '1/2',
  'cup',
  'mix-ins',
  6
);

COMMIT;

-- ============================================================================
-- 4. lemon-basil-gelato (DRAFT — id=aae9e78e-c6b2-4770-9202-8be1d2e4df6b)
-- Issue: title says basil but no basil in ingredients
-- Fix: add fresh basil leaves to the base (muddled/blended for flavor infusion)
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES (
  'aae9e78e-c6b2-4770-9202-8be1d2e4df6b'::uuid,
  'fresh basil leaves',
  '8',
  NULL,
  'base',
  5  -- after lemon juice at 4
);

-- Add a warming/infusion step before freezing (basil needs heat to release oil)
-- First, shift existing steps 2,3,4 up by 1
UPDATE steps
SET step_number = step_number + 1
WHERE recipe_id = 'aae9e78e-c6b2-4770-9202-8be1d2e4df6b'::uuid
  AND step_number >= 2;

-- Insert a new step 2 that handles basil infusion
INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
VALUES (
  'aae9e78e-c6b2-4770-9202-8be1d2e4df6b'::uuid,
  2,
  'Gently warm the milk and cream with the basil leaves in a small saucepan over medium-low heat until steaming (do not boil). Remove from heat, cover, and let steep for 15 minutes. Strain out the basil, stir in the sugar and lemon juice, and cool completely before pouring into the pint.',
  'Warming the dairy extracts the aromatic oils from basil that cold blending misses. Save 2–3 small basil leaves as a garnish for serving.',
  25
);

COMMIT;

-- ============================================================================
-- 5. ginger-turmeric-honey-ice-cream (DRAFT — id=582af0d7-0409-406f-8633-f348b8ab1710)
-- Issue: title promises ginger + turmeric, recipe is plain honey ice cream
-- Fix: add both to the base
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES
  ('582af0d7-0409-406f-8633-f348b8ab1710'::uuid, 'fresh ginger, grated', '1', 'tablespoon', 'base', 6),
  ('582af0d7-0409-406f-8633-f348b8ab1710'::uuid, 'ground turmeric', '1/2', 'teaspoon', 'base', 7),
  ('582af0d7-0409-406f-8633-f348b8ab1710'::uuid, 'freshly ground black pepper', '1', 'pinch', 'base', 8);
-- Pinch of black pepper is intentional: it boosts curcumin bioavailability and
-- is classic in turmeric-based preparations (golden milk, etc.)

COMMIT;

-- ============================================================================
-- 6. mint-matcha-ice-cream (DRAFT — id=ff7c2e51-3e32-47b7-8260-2f80b04410c6)
-- Issue: title says mint but no mint/peppermint in ingredients
-- Fix: add peppermint extract to the base
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES (
  'ff7c2e51-3e32-47b7-8260-2f80b04410c6'::uuid,
  'peppermint extract',
  '1/2',
  'teaspoon',
  'base',
  6
);

COMMIT;

-- ============================================================================
-- 7. strawberry-graham-cracker-ice-cream (DRAFT — id=8eff3b1e-f522-4ef2-8b45-b30bff494b76)
-- Issue: title says graham cracker but ingredient list is base-only
-- Fix: add graham cracker crumbles as a mix-in
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES (
  '8eff3b1e-f522-4ef2-8b45-b30bff494b76'::uuid,
  'graham cracker crumbles',
  '1/2',
  'cup',
  'mix-ins',
  6
);

COMMIT;

-- ============================================================================
-- 8. toasted-sesame-honey-ice-cream (DRAFT — id=a6eb6ec4-207c-4d3a-9555-0354395ec19f)
-- Issue: title promises toasted sesame, recipe is plain honey ice cream
-- Fix: add tahini to base (primary sesame flavor) plus toasted sesame seeds
--      as a mix-in for texture; add a toasting step for the seeds
-- ============================================================================

BEGIN;

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
VALUES
  ('a6eb6ec4-207c-4d3a-9555-0354395ec19f'::uuid, 'tahini', '3', 'tablespoon', 'base', 6),
  ('a6eb6ec4-207c-4d3a-9555-0354395ec19f'::uuid, 'toasted sesame seeds', '2', 'tablespoon', 'mix-ins', 7);

-- Shift existing steps 2,3,4 up to make room for a toasting step
UPDATE steps
SET step_number = step_number + 1
WHERE recipe_id = 'a6eb6ec4-207c-4d3a-9555-0354395ec19f'::uuid
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
VALUES (
  'a6eb6ec4-207c-4d3a-9555-0354395ec19f'::uuid,
  2,
  'Toast the sesame seeds: place sesame seeds in a dry skillet over medium heat. Stir constantly for 2–3 minutes until fragrant and golden. Transfer immediately to a plate to stop the cooking and cool.',
  'Sesame seeds burn in seconds once they colour. Pull them off heat when they''re a shade lighter than you want — they keep cooking on the plate.',
  5
);

COMMIT;


-- ============================================================================
-- VERIFICATION — run these after committing to confirm the fix
-- ============================================================================
-- SELECT r.slug, i.sort_order, i.group_name, i.name, i.amount, i.unit
-- FROM recipes r JOIN ingredients i ON i.recipe_id = r.id
-- WHERE r.slug IN (
--   'roasted-strawberry-basil-ice-cream',
--   'strawberry-lemon-drop-ice-cream',
--   'strawberry-oreo-ice-cream',
--   'lemon-basil-gelato',
--   'ginger-turmeric-honey-ice-cream',
--   'mint-matcha-ice-cream',
--   'strawberry-graham-cracker-ice-cream',
--   'toasted-sesame-honey-ice-cream'
-- )
-- ORDER BY r.slug, i.sort_order;
