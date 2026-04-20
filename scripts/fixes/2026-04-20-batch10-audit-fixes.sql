-- Recipe audit batch 10 — 42 fixes for drafts publishing 2026-11

-- 1. apple-pie-a-la-mode-ice-cream: missing cinnamon + pie crust crumbles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('pie crust crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-pie-a-la-mode-ice-cream';
COMMIT;

-- 2. banana-miso-caramel-ice-cream: missing banana + miso
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('white miso paste', '2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-miso-caramel-ice-cream';
COMMIT;

-- 3. banana-walnut-cookie-ice-cream: missing walnuts + cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 6),
  ('vanilla sandwich cookies, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-walnut-cookie-ice-cream';
COMMIT;

-- 4. black-walnut-ice-cream: missing black walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('black walnut extract', '1/2', 'teaspoon', 'base', 6),
  ('chopped black walnuts', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'black-walnut-ice-cream';
COMMIT;

-- 5. bourbon-brown-sugar-ice-cream: missing bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bourbon whiskey', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'bourbon-brown-sugar-ice-cream';
COMMIT;

-- 6. bourbon-butterscotch-ice-cream: missing bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bourbon whiskey', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'bourbon-butterscotch-ice-cream';
COMMIT;

-- 7. brown-butter-sage-ice-cream: missing brown butter + sage + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('fresh sage leaves', '6', NULL, 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-butter-sage-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-sage-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Brown the butter and infuse the sage: melt butter over medium heat, swirling until amber and nutty-smelling (3 minutes). Drop in sage leaves off heat, steep 10 minutes, then strain. Whisk the brown butter (without sage) into the cooling base.',
  'Brown butter + sage is a classic savoury combo that works beautifully in cream-based ice creams.',
  15
FROM recipes WHERE slug = 'brown-butter-sage-ice-cream';
COMMIT;

-- 8. brown-sugar-boba-ice-cream: missing boba pearls
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cooked brown sugar boba pearls', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'brown-sugar-boba-ice-cream';
COMMIT;

-- 9. brown-sugar-bourbon-pecan-ice-cream: missing bourbon + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('bourbon whiskey', '2', 'tablespoon', 'base', 6),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-sugar-bourbon-pecan-ice-cream';
COMMIT;

-- 10. brown-sugar-pecan-pie-ice-cream: missing pecans + pie crust
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-sugar-pecan-pie-ice-cream';
COMMIT;

-- 11. brown-sugar-vanilla-bean-ice-cream: missing actual vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'brown-sugar-vanilla-bean-ice-cream';
COMMIT;

-- 12. caramel-apple-gelato: missing apple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened applesauce', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'caramel-apple-gelato';
COMMIT;

-- 13. caramel-apple-pie-crumble-ice-cream: missing apple + pie crumbles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened applesauce', '1/4', 'cup', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('pie crust crumbles', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-pie-crumble-ice-cream';
COMMIT;

-- 14. caramel-apple-pie-ice-cream: has apple butter, add caramel swirl
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('caramel sauce', '3', 'tablespoon', 'swirl', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-pie-ice-cream';
COMMIT;

-- 15. caramel-banana-crunch-ice-cream: missing banana + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('toffee bits', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-banana-crunch-ice-cream';
COMMIT;

-- 16. caramel-chocolate-chip-ice-cream: swap cocoa for actual chips
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'caramel-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'semi-sweet chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'caramel-chocolate-chip-ice-cream';
COMMIT;

-- 17. caramelized-pear-ice-cream: missing pear + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe pear, pureed', '1/3', 'cup', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramelized-pear-ice-cream';
COMMIT;

-- 18. chai-masala-crunch-ice-cream: missing chai spices + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('ground cardamom', '1/2', 'teaspoon', 'base', 8),
  ('ground ginger', '1/4', 'teaspoon', 'base', 9),
  ('ground cloves', '1/8', 'teaspoon', 'base', 10),
  ('shortbread cookie crumbles', '1/4', 'cup', 'mix-ins', 11)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-masala-crunch-ice-cream';
COMMIT;

-- 19. chocolate-almond-caramel-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 7),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-almond-caramel-ice-cream';
COMMIT;

-- 20. chocolate-caramel-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-caramel-pecan-ice-cream';
COMMIT;

-- 21. chocolate-pecan-cookie-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-pecan-cookie-ice-cream';
COMMIT;

-- 22. chocolate-walnut-crunch-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-walnut-crunch-ice-cream';
COMMIT;

-- 23. cinnamon-brown-sugar-pecan-ice-cream: missing brown sugar + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('brown sugar', '2', 'tablespoon', 'base', 6),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cinnamon-brown-sugar-pecan-ice-cream';
COMMIT;

-- 24. coffee-pecan-praline-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coffee-pecan-praline-ice-cream';
COMMIT;

-- 25. hazelnut-vanilla-gelato: missing vanilla extract
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla extract', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'hazelnut-vanilla-gelato';
COMMIT;

-- 26. maple-bacon-crunch-ice-cream: missing bacon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied bacon, crumbled', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'maple-bacon-crunch-ice-cream';
COMMIT;

-- 27. maple-cashew-ice-cream: missing cashews
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'roasted salted cashews, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'maple-cashew-ice-cream';
COMMIT;

-- 28. maple-cinnamon-swirl-ice-cream: missing cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 6),
  ('cinnamon-sugar swirl (2 tbsp sugar + 1 tsp cinnamon)', '3', 'tablespoon', 'swirl', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-cinnamon-swirl-ice-cream';
COMMIT;

-- 29. maple-pecan-praline-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'maple-pecan-praline-ice-cream';
COMMIT;

-- 30. pear-caramel-ice-cream: missing pear
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe pear, pureed', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'pear-caramel-ice-cream';
COMMIT;

-- 31. pecan-pie-crumble-ice-cream: missing pecans + pie crust
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pecan-pie-crumble-ice-cream';
COMMIT;

-- 32. pumpkin-brown-butter-ice-cream: missing brown butter + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-brown-butter-ice-cream';
COMMIT;

-- 33. pumpkin-ginger-snap-ice-cream: missing ginger + gingersnaps
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('ground ginger', '1/2', 'teaspoon', 'base', 7),
  ('gingersnap cookies, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-ginger-snap-ice-cream';
COMMIT;

-- 34. pumpkin-gingersnap-ice-cream: missing ginger + gingersnaps
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('ground ginger', '1/2', 'teaspoon', 'base', 7),
  ('gingersnap cookies, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-gingersnap-ice-cream';
COMMIT;

-- 35. roasted-banana-walnut-ice-cream: needs roasting step for bananas + walnuts
BEGIN;
UPDATE ingredients
SET name = 'fresh ripe banana, halved lengthwise', amount = '2', unit = NULL
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-banana-walnut-ice-cream')
  AND name = 'ripe banana, mashed';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'roasted-banana-walnut-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-banana-walnut-ice-cream');

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 1,
  'Roast the bananas: preheat oven to 400°F (200°C). Place halved bananas (skin-on) on a parchment-lined tray and roast for 15 minutes until the skin is blackened and the flesh is caramelized. Cool slightly, scoop out the flesh, and mash smooth before whisking into the base.',
  'Roasted bananas taste deeper and more caramel-like than raw — the sugars caramelize in the oven.',
  20
FROM recipes WHERE slug = 'roasted-banana-walnut-ice-cream';
COMMIT;

-- 36. salted-pistachio-caramel-ice-cream: missing salt + pistachios
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('crushed pistachios', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-pistachio-caramel-ice-cream';
COMMIT;

-- 37. smoked-salted-caramel-ice-cream: missing smoked salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'smoked sea salt', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'smoked-salted-caramel-ice-cream';
COMMIT;

-- 38. toasted-pecan-brown-butter-ice-cream: missing pecans + brown butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 7),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-pecan-brown-butter-ice-cream';
COMMIT;

-- 39. toasted-sesame-caramel-ice-cream: missing sesame
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('tahini', '2', 'tablespoon', 'base', 6),
  ('toasted sesame seeds', '1', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-sesame-caramel-ice-cream';
COMMIT;

-- 40. vanilla-caramel-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'vanilla-caramel-pecan-ice-cream';
COMMIT;

-- 41. vegan-apple-cinnamon-ice-cream: missing cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cinnamon', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'vegan-apple-cinnamon-ice-cream';
COMMIT;

-- 42. white-miso-caramel-ice-cream: missing miso
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white miso paste', '1', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'white-miso-caramel-ice-cream';
COMMIT;
