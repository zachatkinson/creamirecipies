-- Recipe audit batch 19 — 35 fixes for drafts publishing 2027-08 and 2027-09
-- OK: caramel-pecan-turtle-ice-cream (has all turtle components)
-- This closes the audit backlog — all 1,494 recipes have been reviewed.

-- 1. apple-caramel-crumble: +apple + crumble + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened applesauce', '1/4', 'cup', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-caramel-crumble-ice-cream'; COMMIT;

-- 2. berry-cobbler-crumble: +mixed berries + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mixed berry compote', '1/3', 'cup', 'swirl', 6),
  ('oat cobbler crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'berry-cobbler-crumble-ice-cream'; COMMIT;

-- 3. brown-butter-toffee: +brown butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'browned butter, cooled', '3', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'brown-butter-toffee-ice-cream'; COMMIT;

-- 4. brown-butter-walnut: +brown butter + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-butter-walnut-ice-cream'; COMMIT;

-- 5. caramel-espresso-gelato: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel sauce', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'caramel-espresso-gelato'; COMMIT;

-- 6. caramel-pecan-brownie: +pecans + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-pecan-brownie-ice-cream'; COMMIT;

-- 7. caramel-white-chocolate-chip: remove cocoa, add white chocolate chips
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'caramel-white-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'caramel-white-chocolate-chip-ice-cream'; COMMIT;

-- 8. chai-caramel-swirl: +chai spices
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('ground cardamom', '1/2', 'teaspoon', 'base', 7),
  ('ground ginger', '1/4', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-caramel-swirl-ice-cream'; COMMIT;

-- 9. chai-spice-latte: +chai + espresso
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('ground cardamom', '1/2', 'teaspoon', 'base', 8),
  ('ground ginger', '1/4', 'teaspoon', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-spice-latte-ice-cream'; COMMIT;

-- 10. chocolate-almond-toffee: +almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-almond-toffee-ice-cream'; COMMIT;

-- 11. chocolate-banana-walnut: +walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-banana-walnut-ice-cream'; COMMIT;

-- 12. chocolate-caramel-cookie: +caramel swirl
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel sauce', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'chocolate-caramel-cookie-ice-cream'; COMMIT;

-- 13. chocolate-caramel-sea-salt: +salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'flaky sea salt', '1/2', 'teaspoon', 'base', 7
FROM recipes WHERE slug = 'chocolate-caramel-sea-salt-ice-cream'; COMMIT;

-- 14. chocolate-chip-cookie-crumble: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/4', 'cup', 'mix-ins', 8
FROM recipes WHERE slug = 'chocolate-chip-cookie-crumble-ice-cream'; COMMIT;

-- 15. chocolate-marshmallow-cookie: +marshmallow
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'marshmallow fluff', '3', 'tablespoon', 'swirl', 8
FROM recipes WHERE slug = 'chocolate-marshmallow-cookie-ice-cream'; COMMIT;

-- 16. cinnamon-raisin-bread: +raisins + bread crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('brown sugar', '2', 'tablespoon', 'base', 6),
  ('raisin bread crumbles, toasted', '1/4', 'cup', 'mix-ins', 7),
  ('raisins', '3', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cinnamon-raisin-bread-ice-cream'; COMMIT;

-- 17. coffee-caramel-crunch: +coffee + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 6),
  ('toffee bits', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-caramel-crunch-ice-cream'; COMMIT;

-- 18. coffee-caramel-pecan: +coffee + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 6),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-caramel-pecan-ice-cream'; COMMIT;

-- 19. coffee-chocolate-caramel: +coffee
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'instant espresso powder', '1', 'teaspoon', 'base', 7
FROM recipes WHERE slug = 'coffee-chocolate-caramel-ice-cream'; COMMIT;

-- 20. coffee-maple-walnut: +maple + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pure maple syrup', '2', 'tablespoon', 'base', 6),
  ('toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-maple-walnut-ice-cream'; COMMIT;

-- 21. hazelnut-caramel-gelato: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel sauce', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'hazelnut-caramel-gelato'; COMMIT;

-- 22. maple-bacon-bourbon: +bacon + bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('bourbon whiskey', '2', 'tablespoon', 'base', 6),
  ('candied bacon, crumbled', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-bacon-bourbon-ice-cream'; COMMIT;

-- 23. maple-brown-butter: +brown butter + browning step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'browned butter, cooled', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'maple-brown-butter-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'maple-brown-butter-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Brown the butter: melt 3 tablespoons butter in a small saucepan over medium heat, swirling until amber and nutty-smelling. Cool to room temperature before whisking into the base (include the toasted milk solids — that is where the flavor is).',
  'Maple + brown butter is a classic fall pairing — both amber, both deeply caramelized.',
  8
FROM recipes WHERE slug = 'maple-brown-butter-ice-cream'; COMMIT;

-- 24. pumpkin-butter-pecan: +brown butter + pecans + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('browned butter, cooled', '2', 'tablespoon', 'base', 7),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-butter-pecan-ice-cream'; COMMIT;

-- 25. pumpkin-pecan-protein-lite: +pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 5),
  ('toasted pecans, chopped', '3', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-pecan-protein-lite-ice-cream'; COMMIT;

-- 26. pumpkin-praline: +praline pecans + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('candied pecans, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-praline-ice-cream'; COMMIT;

-- 27. rum-raisin-walnut: +rum + raisins + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dark rum', '3', 'tablespoon', 'base', 6),
  ('rum-soaked raisins', '1/3', 'cup', 'mix-ins', 7),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'rum-raisin-walnut-ice-cream'; COMMIT;

-- 28. salted-caramel-macaron: +salt + macaron pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('French macaron shells, crumbled', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-macaron-ice-cream'; COMMIT;

-- 29. salted-caramel-pretzel-milkshake: +salt + pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('crushed pretzels', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-pretzel-milkshake'; COMMIT;

-- 30. salted-maple-pecan: +salt + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('candied pecans, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-maple-pecan-ice-cream'; COMMIT;

-- 31. strawberry-coconut-cream: +coconut cream
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'coconut cream', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'strawberry-coconut-cream-ice-cream'; COMMIT;

-- 32. strawberry-lemon-meringue: +strawberry + meringue
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('strawberry puree', '1/3', 'cup', 'base', 6),
  ('crushed meringue cookies', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-lemon-meringue-ice-cream'; COMMIT;

-- 33. strawberry-pretzel-crumble: +pretzels + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('crushed pretzels', '1/4', 'cup', 'mix-ins', 6),
  ('shortbread cookie crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-pretzel-crumble-ice-cream'; COMMIT;

-- 34. toasted-almond-coconut: +almonds + toasting step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-almond-coconut-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-almond-coconut-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the almonds: spread sliced almonds in a dry skillet over medium heat, stirring constantly, 3–4 minutes until golden and fragrant. Cool before adding as mix-in.',
  'Toasted almonds pair beautifully with coconut for an Almond Joy-adjacent flavor.',
  5
FROM recipes WHERE slug = 'toasted-almond-coconut-ice-cream'; COMMIT;

-- 35. whiskey-caramel-pecan: +whiskey + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('whiskey (bourbon or Irish)', '2', 'tablespoon', 'base', 6),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'whiskey-caramel-pecan-ice-cream'; COMMIT;
