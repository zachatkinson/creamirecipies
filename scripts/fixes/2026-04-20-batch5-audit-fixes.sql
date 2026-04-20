-- Recipe audit batch 5 — 14 fixes for drafts publishing 2026-06-01 → 2026-06-26

-- 1. banana-walnut-greek-frozen-yogurt: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chopped walnuts', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'banana-walnut-greek-frozen-yogurt';
COMMIT;

-- 2. blackberry-sage-honey-ice-cream: missing sage + honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('honey', '3', 'tablespoon', 'base', 6),
  ('fresh sage leaves', '6', NULL, 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blackberry-sage-honey-ice-cream';

-- Add sage infusion step
UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'blackberry-sage-honey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the sage leaves over medium-low heat until steaming (do not boil). Remove from heat, cover, and steep for 15 minutes. Strain out the sage, then whisk in the sugar, honey, vanilla, and blackberry puree. Cool completely.',
  'Sage is earthy and can easily overpower fruit — keep the infusion to exactly 15 minutes and pull the leaves out.',
  20
FROM recipes WHERE slug = 'blackberry-sage-honey-ice-cream';
COMMIT;

-- 3. chocolate-peanut-butter-greek-frozen-yogurt: missing peanut butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'creamy peanut butter', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'chocolate-peanut-butter-greek-frozen-yogurt';
COMMIT;

-- 4. chocolate-raspberry-truffle-ice-cream: desc says raspberry swirl + truffle pieces; both missing as such
BEGIN;
-- Move raspberry puree from base to swirl
UPDATE ingredients SET group_name = 'swirl', sort_order = 7
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'chocolate-raspberry-truffle-ice-cream')
  AND name = 'raspberry puree';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate truffles, chopped', '1/4', 'cup', 'mix-ins', 8
FROM recipes WHERE slug = 'chocolate-raspberry-truffle-ice-cream';
COMMIT;

-- 5. coconut-lime-crunch-ice-cream: has lemon (should be lime), no coconut, no crunch
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-lime-crunch-ice-cream')
  AND name = 'lemon juice';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('lime zest', '1', 'teaspoon', 'base', 7),
  ('toasted coconut flakes', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-lime-crunch-ice-cream';
COMMIT;

-- 6. lavender-blueberry-cream-ice-cream: missing lavender
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'lavender-blueberry-cream-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'lavender-blueberry-cream-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the lavender buds over medium-low heat until steaming (do not boil). Remove from heat, cover, and steep for 10 minutes. Strain out the lavender, then whisk in the sugar, vanilla, and blueberry puree. Cool completely.',
  '10 minutes of steeping is the sweet spot — any longer and lavender goes soapy. Blueberry complements the florals perfectly.',
  15
FROM recipes WHERE slug = 'lavender-blueberry-cream-ice-cream';
COMMIT;

-- 7. lemon-blueberry-crumble-ice-cream: missing blueberry + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('blueberry compote', '1/3', 'cup', 'swirl', 6),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-blueberry-crumble-ice-cream';
COMMIT;

-- 8. mango-coconut-cream-ice-cream: missing coconut component
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'coconut cream', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'mango-coconut-cream-ice-cream';
COMMIT;

-- 9. mango-lime-coconut-ice-cream: has lemon (should be lime) + no coconut
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mango-lime-coconut-ice-cream')
  AND name = 'lemon juice';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/3', 'cup', 'base', 6),
  ('coconut cream', '1/4', 'cup', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-lime-coconut-ice-cream';
COMMIT;

-- 10. mango-lime-greek-frozen-yogurt: missing lime
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lime juice', '2', 'tablespoon', 'base', 5),
  ('lime zest', '1', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-lime-greek-frozen-yogurt';
COMMIT;

-- 11. peach-cobbler-protein-ice-cream: add cobbler crumble as mix-in
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'oat-almond streusel crumbles', '3', 'tablespoon', 'mix-ins', 7
FROM recipes WHERE slug = 'peach-cobbler-protein-ice-cream';
COMMIT;

-- 12. peach-vanilla-cream-gelato: missing vanilla extract
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla extract', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'peach-vanilla-cream-gelato';
COMMIT;

-- 13. tropical-sunrise-sorbet: replace vague "tropical fruit blend" with mango + pineapple + orange
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'tropical-sunrise-sorbet')
  AND name = 'tropical fruit blend';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '3/4', 'cup', 'base', 1),
  ('pineapple puree', '3/4', 'cup', 'base', 2),
  ('fresh orange juice', '1/2', 'cup', 'base', 3)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tropical-sunrise-sorbet';
COMMIT;

-- 14. vegan-mango-lime-ice-cream: missing lime
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lime juice', '2', 'tablespoon', 'base', 5),
  ('lime zest', '1', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vegan-mango-lime-ice-cream';
COMMIT;
