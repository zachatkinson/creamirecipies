-- Recipe audit batch 11 — 20 fixes for drafts publishing 2026-12
-- (snickerdoodle-protein, vegan-snickerdoodle reviewed OK: cinnamon+sugar is the flavor)

-- 1. banana-foster-rum-ice-cream: missing rum + brown sugar + butter + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dark rum (or 1/4 tsp rum extract)', '2', 'tablespoon', 'base', 6),
  ('brown sugar', '2', 'tablespoon', 'base', 7),
  ('butter, melted', '1', 'tablespoon', 'base', 8),
  ('cinnamon', '1/2', 'teaspoon', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-foster-rum-ice-cream';
COMMIT;

-- 2. butter-rum-ice-cream: missing rum + butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dark rum', '2', 'tablespoon', 'base', 6),
  ('butter, melted', '2', 'tablespoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'butter-rum-ice-cream';
COMMIT;

-- 3. caramel-snickerdoodle-ice-cream: missing cinnamon + snickerdoodle cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 6),
  ('snickerdoodle cookies, crumbled', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-snickerdoodle-ice-cream';
COMMIT;

-- 4. cardamom-pistachio-rose-ice-cream: missing cardamom + rose water
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground cardamom', '1/2', 'teaspoon', 'base', 6),
  ('rose water', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cardamom-pistachio-rose-ice-cream';
COMMIT;

-- 5. cardamom-rose-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'cardamom-rose-ice-cream';
COMMIT;

-- 6. coffee-cardamom-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'coffee-cardamom-ice-cream';
COMMIT;

-- 7. cranberry-white-chocolate-ice-cream: remove cocoa (template bug), add cranberry
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'cranberry-white-chocolate-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cranberry sauce (whole-berry)', '1/3', 'cup', 'swirl', 7
FROM recipes WHERE slug = 'cranberry-white-chocolate-ice-cream';
COMMIT;

-- 8. dark-chocolate-peppermint-bark-ice-cream: missing peppermint bark pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'peppermint bark, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'dark-chocolate-peppermint-bark-ice-cream';
COMMIT;

-- 9. ginger-cardamom-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'ginger-cardamom-ice-cream';
COMMIT;

-- 10. gingerbread-cookie-dough-ice-cream: missing gingerbread spices + cookie dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('molasses', '1', 'tablespoon', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('ground cloves', '1/8', 'teaspoon', 'base', 8),
  ('gingerbread cookie dough chunks, edible', '1/3', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'gingerbread-cookie-dough-ice-cream';
COMMIT;

-- 11. mango-cardamom-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'mango-cardamom-ice-cream';
COMMIT;

-- 12. mocha-chip-milkshake: missing cocoa + chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '2', 'tablespoon', 'base', 6),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mocha-chip-milkshake';
COMMIT;

-- 13. peppermint-oreo-ice-cream: missing Oreos
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Oreo cookies, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'peppermint-oreo-ice-cream';
COMMIT;

-- 14. rosewater-cardamom-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'rosewater-cardamom-ice-cream';
COMMIT;

-- 15. tiramisu-cookie-crunch-ice-cream: missing mascarpone + espresso (tiramisu signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mascarpone cheese', '1/4', 'cup', 'base', 6),
  ('instant espresso powder', '1', 'teaspoon', 'base', 7),
  ('cocoa powder for dusting', '1', 'teaspoon', 'topping', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tiramisu-cookie-crunch-ice-cream';
COMMIT;

-- 16. toasted-marshmallow-mocha-ice-cream: missing espresso + marshmallow
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 7),
  ('toasted marshmallow fluff', '3', 'tablespoon', 'swirl', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-marshmallow-mocha-ice-cream';
COMMIT;

-- 17. white-chocolate-cookie-dough-ice-cream: remove cocoa (template bug), swap cookies for dough
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-cookie-dough-ice-cream')
  AND name = 'cocoa powder';

UPDATE ingredients
SET name = 'edible cookie dough chunks', amount = '1/3', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-cookie-dough-ice-cream')
  AND name = 'crushed cookies';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white chocolate chips, melted', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'white-chocolate-cookie-dough-ice-cream';
COMMIT;

-- 18. white-chocolate-lavender-ice-cream: remove cocoa (template bug), add lavender + infusion
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-lavender-ice-cream')
  AND name = 'cocoa powder';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'white-chocolate-lavender-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-lavender-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the lavender buds over medium-low heat until steaming. Steep 10 minutes off heat, then strain. Stir the melted white chocolate into the warm dairy until smooth, then whisk in sugar and vanilla. Cool completely.',
  'Melt the white chocolate gently — white chocolate seizes fast on high heat.',
  15
FROM recipes WHERE slug = 'white-chocolate-lavender-ice-cream';
COMMIT;

-- 19. white-chocolate-macadamia-ice-cream: remove cocoa (template bug), add macadamias
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-macadamia-ice-cream')
  AND name = 'cocoa powder';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'roasted macadamia nuts, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'white-chocolate-macadamia-ice-cream';
COMMIT;

-- 20. white-chocolate-raspberry-truffle-ice-cream: remove cocoa, add white chocolate
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-raspberry-truffle-ice-cream')
  AND name = 'cocoa powder';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white chocolate chips, melted', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'white-chocolate-raspberry-truffle-ice-cream';

-- Move raspberry puree to swirl
UPDATE ingredients SET group_name = 'swirl'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-raspberry-truffle-ice-cream')
  AND name = 'raspberry puree';
COMMIT;
