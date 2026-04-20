-- Recipe audit batch 8 — 32 fixes for drafts publishing 2026-09
-- (caramel-flan, caramelized-banana, fairlife-vanilla-caramel-lite reviewed OK)

-- 1. almond-toffee-crunch-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'almond-toffee-crunch-ice-cream';
COMMIT;

-- 2. banana-pecan-crunch-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'banana-pecan-crunch-ice-cream';
COMMIT;

-- 3. brown-butter-sage-pecan-ice-cream: missing brown butter, sage, AND pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('fresh sage leaves', '6', NULL, 'base', 7),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-butter-sage-pecan-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-sage-pecan-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Brown the butter and infuse the sage: melt butter in a small saucepan over medium heat, swirling until it turns amber and smells nutty (3–4 minutes). Remove from heat, drop in sage leaves, and let steep 10 minutes. Strain out the sage.',
  'Brown butter burns fast — pull it off heat the instant it smells like hazelnuts. Residual heat will darken it another shade.',
  15
FROM recipes WHERE slug = 'brown-butter-sage-pecan-ice-cream';
COMMIT;

-- 4. butter-pecan-brownie-ice-cream: missing butter + pecans + brownie pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 7),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 8),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'butter-pecan-brownie-ice-cream';
COMMIT;

-- 5. butterscotch-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'butterscotch-pecan-ice-cream';
COMMIT;

-- 6. caramel-apple-cider-ice-cream: missing apple cider + warm spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('apple cider (reduced to 1/4 cup)', '1/4', 'cup', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-cider-ice-cream';
COMMIT;

-- 7. caramel-coffee-crunch-ice-cream: missing coffee + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 6),
  ('toffee bits', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-coffee-crunch-ice-cream';
COMMIT;

-- 8. caramel-pumpkin-pecan-ice-cream: missing pumpkin + pecans + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin puree', '1/3', 'cup', 'base', 6),
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 7),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-pumpkin-pecan-ice-cream';
COMMIT;

-- 9. caramelized-fig-walnut-ice-cream: missing figs + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fig preserves', '1/4', 'cup', 'swirl', 6),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramelized-fig-walnut-ice-cream';
COMMIT;

-- 10. cashew-caramel-ice-cream: missing cashews
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('creamy cashew butter', '2', 'tablespoon', 'base', 6),
  ('roasted salted cashews, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cashew-caramel-ice-cream';
COMMIT;

-- 11. chai-chocolate-chip-ice-cream: missing chai spices + actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground cardamom', '1/2', 'teaspoon', 'base', 7),
  ('cinnamon', '1/2', 'teaspoon', 'base', 8),
  ('ground ginger', '1/4', 'teaspoon', 'base', 9),
  ('mini chocolate chips', '1/3', 'cup', 'mix-ins', 10)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-chocolate-chip-ice-cream';
COMMIT;

-- 12. cherry-bourbon-ice-cream: missing bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bourbon whiskey', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'cherry-bourbon-ice-cream';
COMMIT;

-- 13. cinnamon-dulce-de-leche-ice-cream: missing dulce de leche
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dulce de leche', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'cinnamon-dulce-de-leche-ice-cream';
COMMIT;

-- 14. coffee-hazelnut-praline-ice-cream: missing hazelnut + praline
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('hazelnut extract', '1/2', 'teaspoon', 'base', 6),
  ('hazelnut praline pieces', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-hazelnut-praline-ice-cream';
COMMIT;

-- 15. coffee-toffee-brownie-ice-cream: missing toffee + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toffee bits', '1/4', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-toffee-brownie-ice-cream';
COMMIT;

-- 16. fig-balsamic-walnut-ice-cream: missing balsamic + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('aged balsamic vinegar', '2', 'teaspoon', 'base', 6),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'fig-balsamic-walnut-ice-cream';
COMMIT;

-- 17. fig-mascarpone-gelato: missing mascarpone
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mascarpone cheese', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'fig-mascarpone-gelato';
COMMIT;

-- 18. keto-caramel-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'keto-caramel-pecan-ice-cream';
COMMIT;

-- 19. keto-chocolate-hazelnut-ice-cream: missing cocoa
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened cocoa powder', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'keto-chocolate-hazelnut-ice-cream';
COMMIT;

-- 20. maple-almond-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-almond-ice-cream';
COMMIT;

-- 21. oat-milk-caramel-ice-cream: add explicit caramel sauce swirl
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vegan caramel sauce', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'oat-milk-caramel-ice-cream';
COMMIT;

-- 22. pecan-cookie-butter-ice-cream: missing pecans + cookie butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('Biscoff cookie butter', '3', 'tablespoon', 'swirl', 6),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pecan-cookie-butter-ice-cream';
COMMIT;

-- 23. pumpkin-caramel-pecan-ice-cream: missing pumpkin + pecans + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin puree', '1/3', 'cup', 'base', 6),
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 7),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-caramel-pecan-ice-cream';
COMMIT;

-- 24. pumpkin-chocolate-chip-ice-cream: swap cocoa for actual chocolate chips
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'pumpkin-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('mini chocolate chips', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-chocolate-chip-ice-cream';
COMMIT;

-- 25. salted-caramel-brownie-ice-cream: missing salt + brownie pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7),
  ('brownie bites, chopped', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-brownie-ice-cream';
COMMIT;

-- 26. salted-caramel-cookie-butter-ice-cream: missing salt + caramel + cookie butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('caramel sauce', '2', 'tablespoon', 'swirl', 7),
  ('Biscoff cookie butter', '2', 'tablespoon', 'swirl', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-cookie-butter-ice-cream';
COMMIT;

-- 27. toffee-heath-bar-crunch-ice-cream: missing Heath bar pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Heath bars, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'toffee-heath-bar-crunch-ice-cream';
COMMIT;

-- 28. vanilla-bean-toffee-ice-cream: missing actual vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'vanilla-bean-toffee-ice-cream';
COMMIT;

-- 29. vanilla-chai-cookie-ice-cream: missing chai spices
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('ground cardamom', '1/4', 'teaspoon', 'base', 7),
  ('ground ginger', '1/4', 'teaspoon', 'base', 8),
  ('ground cloves', '1/8', 'teaspoon', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-chai-cookie-ice-cream';
COMMIT;

-- 30. vanilla-pecan-cookie-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'vanilla-pecan-cookie-ice-cream';
COMMIT;

-- 31. vegan-caramel-ice-cream: add explicit vegan caramel sauce for authenticity
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vegan caramel sauce', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'vegan-caramel-ice-cream';
COMMIT;

-- 32. vegan-maple-walnut-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'vegan-maple-walnut-ice-cream';
COMMIT;
