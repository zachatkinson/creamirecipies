-- Recipe audit batch 9 — 34 fixes for drafts publishing 2026-10
-- (caramel-macchiato-ice-cream, vegan-caramel-pecan-ice-cream reviewed OK)

-- 1. banana-caramel-crunch-ice-cream: missing banana + toffee bits
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('toffee bits', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-caramel-crunch-ice-cream';
COMMIT;

-- 2. banana-foster-caramel-ice-cream: missing banana + rum + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('dark rum (or 1/4 tsp rum extract)', '2', 'tablespoon', 'base', 7),
  ('cinnamon', '1/2', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-foster-caramel-ice-cream';
COMMIT;

-- 3. banana-toffee-ice-cream: missing toffee
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toffee bits', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'banana-toffee-ice-cream';
COMMIT;

-- 4. bourbon-cherry-ice-cream: missing bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bourbon whiskey', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'bourbon-cherry-ice-cream';
COMMIT;

-- 5. brown-butter-cookie-dough-ice-cream: missing brown butter + actual dough chunks
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('edible cookie dough chunks', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-butter-cookie-dough-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-cookie-dough-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Brown the butter: melt butter in a small saucepan over medium heat, swirling until it turns amber and smells nutty (about 3 minutes). Pour into a heatproof bowl (including the brown bits at the bottom) and cool to room temperature before whisking into the base.',
  'The brown bits at the bottom carry most of the nutty flavor — do not strain them out.',
  8
FROM recipes WHERE slug = 'brown-butter-cookie-dough-ice-cream';
COMMIT;

-- 6. brown-butter-hazelnut-ice-cream: missing brown butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'browned butter, cooled', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'brown-butter-hazelnut-ice-cream';
COMMIT;

-- 7. caramel-apple-milkshake: missing apple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened applesauce', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'caramel-apple-milkshake';
COMMIT;

-- 8. caramel-apple-walnut-ice-cream: missing apple + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened applesauce', '1/4', 'cup', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-walnut-ice-cream';
COMMIT;

-- 9. caramel-brownie-milkshake: missing brownie pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'brownie bites, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'caramel-brownie-milkshake';
COMMIT;

-- 10. caramel-pecan-cookie-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'caramel-pecan-cookie-ice-cream';
COMMIT;

-- 11. caramelized-pecan-praline-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'caramelized-pecan-praline-ice-cream';
COMMIT;

-- 12. chocolate-banana-walnut-protein-lite-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '3', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'chocolate-banana-walnut-protein-lite-ice-cream';
COMMIT;

-- 13. chocolate-chip-caramel-cookie-ice-cream: missing chocolate chips + caramel swirl
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('caramel sauce', '3', 'tablespoon', 'swirl', 7),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-caramel-cookie-ice-cream';
COMMIT;

-- 14. chocolate-chip-walnut-ice-cream: missing chips + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-walnut-ice-cream';
COMMIT;

-- 15. chocolate-hazelnut-cookie-ice-cream: missing hazelnut spread
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'hazelnut spread (Nutella)', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'chocolate-hazelnut-cookie-ice-cream';
COMMIT;

-- 16. chocolate-pecan-caramel-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-pecan-caramel-ice-cream';
COMMIT;

-- 17. cinnamon-chocolate-chip-ice-cream: swap cocoa for actual chips
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'cinnamon-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'cinnamon-chocolate-chip-ice-cream';
COMMIT;

-- 18. cinnamon-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'cinnamon-pecan-ice-cream';
COMMIT;

-- 19. cinnamon-toast-ice-cream: missing cereal mix-in (desc references Cinnamon Toast Crunch)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Cinnamon Toast Crunch cereal, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'cinnamon-toast-ice-cream';
COMMIT;

-- 20. espresso-toffee-ice-cream: missing toffee
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toffee bits', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'espresso-toffee-ice-cream';
COMMIT;

-- 21. fig-walnut-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'fig-walnut-ice-cream';
COMMIT;

-- 22. hazelnut-praline-ice-cream: missing praline element
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'hazelnut praline pieces', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'hazelnut-praline-ice-cream';
COMMIT;

-- 23. honey-walnut-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'honey-walnut-ice-cream';
COMMIT;

-- 24. maple-ginger-snap-ice-cream: missing ginger + gingersnap cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground ginger', '1/2', 'teaspoon', 'base', 6),
  ('cinnamon', '1/4', 'teaspoon', 'base', 7),
  ('gingersnap cookies, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-ginger-snap-ice-cream';
COMMIT;

-- 25. miso-caramel-ice-cream: missing miso
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white miso paste', '1', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'miso-caramel-ice-cream';
COMMIT;

-- 26. salted-caramel-almond-ice-cream: missing salt + almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-almond-ice-cream';
COMMIT;

-- 27. salted-caramel-pretzel-crunch-ice-cream: missing salt + pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('crushed pretzels', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-pretzel-crunch-ice-cream';
COMMIT;

-- 28. salted-caramel-pretzel-ice-cream: missing salt + pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('crushed pretzels', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-pretzel-ice-cream';
COMMIT;

-- 29. salted-peanut-caramel-crunch-ice-cream: missing salt + peanuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('salted roasted peanuts, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-peanut-caramel-crunch-ice-cream';
COMMIT;

-- 30. smoked-butterscotch-ice-cream: missing smoke element
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'smoked sea salt', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'smoked-butterscotch-ice-cream';
COMMIT;

-- 31. sweet-potato-marshmallow-ice-cream: missing marshmallow + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('marshmallow fluff', '3', 'tablespoon', 'swirl', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'sweet-potato-marshmallow-ice-cream';
COMMIT;

-- 32. vanilla-almond-toffee-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-almond-toffee-ice-cream';
COMMIT;

-- 33. vanilla-chai-crumble-ice-cream: missing chai spices + shortbread crumbles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('ground cardamom', '1/4', 'teaspoon', 'base', 8),
  ('ground ginger', '1/4', 'teaspoon', 'base', 9),
  ('shortbread cookie crumbles', '1/4', 'cup', 'mix-ins', 10)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-chai-crumble-ice-cream';
COMMIT;

-- 34. vanilla-fig-gelato: missing vanilla extract
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla extract', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'vanilla-fig-gelato';
COMMIT;
