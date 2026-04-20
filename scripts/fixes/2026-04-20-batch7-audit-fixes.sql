-- Recipe audit batch 7 — 23 fixes for drafts publishing 2026-08
-- (berry-protein-power-smoothie-bowl reviewed OK — flagged on filler word "power")

-- 1. blackberry-lemon-ice-cream: missing blackberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('blackberry puree', '1/3', 'cup', 'base', 6),
  ('lemon zest', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blackberry-lemon-ice-cream';
COMMIT;

-- 2. blueberry-almond-crumble-ice-cream: missing almond + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('almond streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-almond-crumble-ice-cream';
COMMIT;

-- 3. caramel-apple-frozen-yogurt: missing caramel + warm spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 5),
  ('caramel sauce', '3', 'tablespoon', 'swirl', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-frozen-yogurt';
COMMIT;

-- 4. cherry-chocolate-greek-frozen-yogurt: missing chocolate
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cocoa powder', '2', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'cherry-chocolate-greek-frozen-yogurt';
COMMIT;

-- 5. chocolate-chip-mint-cookie-ice-cream: missing mini choc chips + Thin Mint cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7),
  ('Thin Mint cookies, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-mint-cookie-ice-cream';
COMMIT;

-- 6. chocolate-coconut-greek-frozen-yogurt: missing coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'shredded coconut, toasted', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'chocolate-coconut-greek-frozen-yogurt';
COMMIT;

-- 7. coffee-coconut-cream-ice-cream: missing coconut cream
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'coconut cream', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'coffee-coconut-cream-ice-cream';
COMMIT;

-- 8. mango-lime-italian-ice: missing lime
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lime juice', '2', 'tablespoon', 'base', 4),
  ('lime zest', '1', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-lime-italian-ice';
COMMIT;

-- 9. mango-vanilla-bean-ice-cream: has vanilla extract, needs actual vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'mango-vanilla-bean-ice-cream';
COMMIT;

-- 10. mint-cookie-dough-ice-cream: missing cookie dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('edible chocolate chip cookie dough, chopped', '1/3', 'cup', 'mix-ins', 6),
  ('mini chocolate chips', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mint-cookie-dough-ice-cream';
COMMIT;

-- 11. peach-cobbler-crunch-ice-cream: missing oat cobbler crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/4', 'teaspoon', 'base', 6),
  ('oat cobbler crumbles (baked + cooled)', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-cobbler-crunch-ice-cream';
COMMIT;

-- 12. peach-cobbler-ice-cream: has peach preserves, missing cobbler element
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('oat cobbler crumbles (baked + cooled)', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-cobbler-ice-cream';
COMMIT;

-- 13. peach-ginger-crumble-ice-cream: missing ginger + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh ginger, grated', '2', 'teaspoon', 'base', 6),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-ginger-crumble-ice-cream';
COMMIT;

-- 14. peach-prosecco-ice-cream: missing prosecco
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'prosecco (or dry sparkling wine)', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'peach-prosecco-ice-cream';
COMMIT;

-- 15. raspberry-chocolate-chip-greek-frozen-yogurt: missing chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'raspberry-chocolate-chip-greek-frozen-yogurt';
COMMIT;

-- 16. raspberry-pistachio-ice-cream: missing pistachios
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'crushed pistachios', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'raspberry-pistachio-ice-cream';
COMMIT;

-- 17. raspberry-rose-cream-ice-cream: missing rose water
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rose water', '3/4', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'raspberry-rose-cream-ice-cream';
COMMIT;

-- 18. raspberry-vanilla-bean-ice-cream: missing vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'raspberry-vanilla-bean-ice-cream';
COMMIT;

-- 19. strawberry-balsamic-greek-frozen-yogurt: missing balsamic
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'aged balsamic vinegar', '2', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'strawberry-balsamic-greek-frozen-yogurt';
COMMIT;

-- 20. strawberry-kiwi-greek-frozen-yogurt: missing kiwi
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'kiwi, pureed', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'strawberry-kiwi-greek-frozen-yogurt';
COMMIT;

-- 21. toasted-coconut-cream-ice-cream: missing toasted coconut flakes + toasting step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted coconut flakes', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'toasted-coconut-cream-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-coconut-cream-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the coconut flakes: spread coconut flakes in a dry skillet over medium heat, stirring frequently, for 3–4 minutes until golden and fragrant. Transfer to a plate to cool.',
  'Coconut browns quickly — pull it off while still pale-gold; residual heat deepens the color on the plate.',
  5
FROM recipes WHERE slug = 'toasted-coconut-cream-ice-cream';
COMMIT;

-- 22. tropical-pineapple-coconut-ice-cream: missing pineapple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pineapple puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'tropical-pineapple-coconut-ice-cream';
COMMIT;

-- 23. vanilla-honey-almond-greek-frozen-yogurt: missing almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '3', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-honey-almond-greek-frozen-yogurt';
COMMIT;
