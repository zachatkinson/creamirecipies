-- Recipe audit batch 2 — 16 fixes for drafts publishing 2026-05-05 through 2026-05-18
-- Reviewed 28 recipes; these are the ones whose title/flavor didn't match ingredients.

-- 1. cherry-almond-chip-ice-cream: missing almond extract + mini chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('mini chocolate chips', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cherry-almond-chip-ice-cream';
COMMIT;

-- 2. cherry-pomegranate-sorbet: pomegranate is only 1 tbsp of 2 cups cherry — rebalance
BEGIN;
UPDATE ingredients SET amount = '1/2', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'cherry-pomegranate-sorbet')
  AND name = 'pomegranate juice';
UPDATE ingredients SET amount = '1 1/2'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'cherry-pomegranate-sorbet')
  AND name = 'cherry juice';
COMMIT;

-- 3. chocolate-cherry-ice-cream: duplicate cocoa row + no cherry. Remove dup, add cherry swirl.
BEGIN;
DELETE FROM ingredients WHERE ctid IN (
  SELECT ctid FROM ingredients
  WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'chocolate-cherry-ice-cream')
    AND name = 'cocoa powder'
  ORDER BY sort_order DESC LIMIT 1
);
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cherry preserves', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'chocolate-cherry-ice-cream';
COMMIT;

-- 4. lemon-almond-gelato: no almonds. Add almond extract to base + toasted sliced almonds mix-in.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-almond-gelato';
COMMIT;

-- 5. saffron-rose-ice-cream: title + desc promise saffron AND pistachios; neither present.
--    Add both, and an infusion step for saffron.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('saffron threads', '1', 'pinch', 'base', 6),
  ('crushed pistachios', '3', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'saffron-rose-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'saffron-rose-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm 2 tablespoons of the milk with the saffron threads in a small saucepan over low heat for 1 minute. Remove from heat and let steep for 10 minutes to bloom the saffron. Stir the saffron-infused milk (threads and all) into the rest of the base along with the rose water.',
  'Saffron needs heat to release its aroma and color. Do not skip this bloom step — cold saffron tastes like nothing.',
  12
FROM recipes WHERE slug = 'saffron-rose-ice-cream';
COMMIT;

-- 6. salted-honey-almond-ice-cream: has honey but no salt, no almonds.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-honey-almond-ice-cream';
COMMIT;

-- 7. strawberry-basil-cream-ice-cream: no basil.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh basil leaves, finely minced', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-basil-cream-ice-cream';
COMMIT;

-- 8. strawberry-basil-gelato: no basil. Add fresh basil + warming step for infusion.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh basil leaves', '8', NULL, 'base', 5
FROM recipes WHERE slug = 'strawberry-basil-gelato';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'strawberry-basil-gelato')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Gently warm the milk and cream with the basil leaves in a small saucepan over medium-low heat until steaming (do not boil). Remove from heat, cover, and steep for 15 minutes. Strain out the basil, then whisk the strawberry puree into the infused dairy. Cool completely before pouring into the pint.',
  'Strawberry and basil are a classic summer pairing; warm-dairy infusion pulls the aromatic oils out of the leaves the way cold blending cannot.',
  25
FROM recipes WHERE slug = 'strawberry-basil-gelato';
COMMIT;

-- 9. strawberry-champagne-ice-cream: no champagne. Add champagne (or sparkling wine).
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'champagne (or dry sparkling wine)', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-champagne-ice-cream';
COMMIT;

-- 10. strawberry-cookie-butter-ice-cream: no cookie butter. Add Biscoff as swirl.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Biscoff cookie butter', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'strawberry-cookie-butter-ice-cream';
COMMIT;

-- 11. strawberry-shortcake-crunch-ice-cream: no shortcake pieces. Add vanilla cookie crumbles.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('freeze-dried strawberries, crushed', '2', 'tablespoon', 'mix-ins', 6),
  ('vanilla shortbread cookies, crumbled', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-shortcake-crunch-ice-cream';
COMMIT;

-- 12. strawberry-vanilla-cookie-ice-cream: no cookies. Add vanilla sandwich cookies as mix-in.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla sandwich cookies, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'strawberry-vanilla-cookie-ice-cream';
COMMIT;

-- 13. toasted-oat-honey-ice-cream: no oats, no toasting step.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted rolled oats', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'toasted-oat-honey-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-oat-honey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the oats: spread rolled oats on a dry skillet over medium heat, stirring frequently, for 4–5 minutes until fragrant and golden. Transfer to a plate to cool completely before adding as a mix-in.',
  'Toasted oats give this flavor a warm, granola-like depth that plain oats cannot. Do not skip — untoasted oats go soggy in the pint.',
  6
FROM recipes WHERE slug = 'toasted-oat-honey-ice-cream';
COMMIT;

-- 14. vanilla-passion-fruit-swirl-ice-cream: no passion fruit. Add passion fruit swirl.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'passion fruit puree', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'vanilla-passion-fruit-swirl-ice-cream';
COMMIT;

-- 15. vegan-lemon-poppy-seed-ice-cream: no poppy seeds.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('lemon zest', '1', 'teaspoon', 'base', 5),
  ('poppy seeds', '1', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vegan-lemon-poppy-seed-ice-cream';
COMMIT;

-- 16. vegan-strawberry-banana-ice-cream: no banana.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'vegan-strawberry-banana-ice-cream';
COMMIT;
