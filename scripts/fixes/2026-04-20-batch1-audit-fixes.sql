-- Recipe audit batch 1 — 7 fixes for drafts publishing 2026-04-22 through 2026-05-04
-- Each recipe was reviewed individually; only title/flavor mismatches are fixed here.

-- ---------------------------------------------------------------------------
-- 1. kiwi-strawberry-sorbet: strawberry is 1 tablespoon (a splash), title
--    implies a real co-lead. Bump to 1/4 cup.
-- ---------------------------------------------------------------------------
BEGIN;
UPDATE ingredients
SET amount = '1/4', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'kiwi-strawberry-sorbet')
  AND name = 'strawberry puree';
COMMIT;

-- ---------------------------------------------------------------------------
-- 2. lavender-lemon-cream-ice-cream: no lavender in ingredients.
--    Add dried culinary lavender + a warm-milk infusion step.
-- ---------------------------------------------------------------------------
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'lavender-lemon-cream-ice-cream';

-- Shift existing steps 2-4 up by one
UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'lavender-lemon-cream-ice-cream')
  AND step_number >= 2;

-- Insert lavender infusion as new step 2
INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk in a small saucepan with the lavender buds over medium-low heat until steaming (do not boil). Remove from heat, cover, and let steep for 10 minutes. Strain out the lavender, then whisk in the cream, sugar, vanilla, and lemon juice. Cool completely before pouring into the pint.',
  'Lavender infusion should taste floral but never soapy. 10 minutes is the sweet spot — any longer and it turns perfumey.',
  20
FROM recipes WHERE slug = 'lavender-lemon-cream-ice-cream';
COMMIT;

-- ---------------------------------------------------------------------------
-- 3. strawberry-cream-cheese-ice-cream: no cream cheese in ingredients.
--    Add 2 oz softened cream cheese to base.
-- ---------------------------------------------------------------------------
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cream cheese, softened', '2', 'oz', 'base', 6
FROM recipes WHERE slug = 'strawberry-cream-cheese-ice-cream';
COMMIT;

-- ---------------------------------------------------------------------------
-- 4. strawberry-crunch-cookie-ice-cream: "Strawberry Crunch" is the classic
--    Good Humor strawberry shortcake bar flavor — needs freeze-dried
--    strawberries + Golden Oreo (vanilla cookie) crumbs as mix-ins.
-- ---------------------------------------------------------------------------
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order
FROM recipes, (VALUES
  ('freeze-dried strawberries, crushed', '2', 'tablespoon', 'mix-ins', 6),
  ('Golden Oreo cookies, crushed', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE recipes.slug = 'strawberry-crunch-cookie-ice-cream';
COMMIT;

-- ---------------------------------------------------------------------------
-- 5. strawberry-lemonade-milkshake: no lemon at all. Add lemon juice + zest.
-- ---------------------------------------------------------------------------
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order
FROM recipes, (VALUES
  ('fresh lemon juice', '2', 'tablespoon', 'base', 6),
  ('lemon zest', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE recipes.slug = 'strawberry-lemonade-milkshake';
COMMIT;

-- ---------------------------------------------------------------------------
-- 6. strawberry-pink-pepper-ice-cream: no pink pepper.
--    Add crushed pink peppercorns to base.
-- ---------------------------------------------------------------------------
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pink peppercorns, lightly crushed', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-pink-pepper-ice-cream';
COMMIT;

-- ---------------------------------------------------------------------------
-- 7. strawberry-watermelon-italian-ice: replace ambiguous "strawberry-watermelon
--    blend" with actual split ingredients users can shop for.
-- ---------------------------------------------------------------------------
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'strawberry-watermelon-italian-ice')
  AND name = 'strawberry-watermelon blend';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order
FROM recipes, (VALUES
  ('watermelon puree (seedless, blended)', '3/4', 'cup', 'base', 3),
  ('strawberry puree', '1/4', 'cup', 'base', 4),
  ('fresh lemon juice', '1', 'tablespoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE recipes.slug = 'strawberry-watermelon-italian-ice';
COMMIT;
