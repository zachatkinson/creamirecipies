-- Recipe audit batch 6 — 21 fixes for drafts publishing throughout 2026-07

-- 1. apple-walnut-greek-frozen-yogurt: missing walnuts, needs cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 5),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-walnut-greek-frozen-yogurt';
COMMIT;

-- 2. banana-chocolate-chip-greek-frozen-yogurt: swap cocoa powder for actual chips + add banana
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'banana-chocolate-chip-greek-frozen-yogurt')
  AND name = 'cocoa powder';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 4),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-chocolate-chip-greek-frozen-yogurt';
COMMIT;

-- 3. blackberry-lemon-greek-frozen-yogurt: missing blackberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'blackberry puree', '1/3', 'cup', 'base', 5
FROM recipes WHERE slug = 'blackberry-lemon-greek-frozen-yogurt';
COMMIT;

-- 4. blueberry-cardamom-ice-cream: missing cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ground cardamom', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'blueberry-cardamom-ice-cream';
COMMIT;

-- 5. blueberry-coconut-greek-frozen-yogurt: missing coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted coconut flakes', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'blueberry-coconut-greek-frozen-yogurt';
COMMIT;

-- 6. blueberry-honey-ice-cream: missing honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'wildflower honey', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'blueberry-honey-ice-cream';
COMMIT;

-- 7. blueberry-lavender-greek-frozen-yogurt: missing lavender
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'blueberry-lavender-greek-frozen-yogurt';
-- Frozen yogurt is cold-processed; we just ground-mix the lavender rather than infuse.
COMMIT;

-- 8. blueberry-lavender-ice-cream: missing lavender + infusion step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'blueberry-lavender-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'blueberry-lavender-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the lavender buds over medium-low heat until steaming (do not boil). Steep 10 minutes off heat, then strain. Whisk in the sugar, vanilla, and blueberry puree. Cool completely.',
  '10 minutes is the sweet spot — longer and lavender goes soapy.',
  15
FROM recipes WHERE slug = 'blueberry-lavender-ice-cream';
COMMIT;

-- 9. coconut-caramel-crunch-ice-cream: missing coconut cream + toasted coconut flakes
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('flaky sea salt', '1/4', 'teaspoon', 'base', 7),
  ('toasted coconut flakes', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-caramel-crunch-ice-cream';
COMMIT;

-- 10. coconut-lime-leaf-ice-cream: lemon→lime, missing coconut, missing kaffir lime leaves
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-lime-leaf-ice-cream')
  AND name = 'lemon juice';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('kaffir lime leaves, torn', '6', NULL, 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-lime-leaf-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-lime-leaf-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk, cream, and coconut cream with the torn kaffir lime leaves until steaming (do not boil). Remove from heat, cover, and steep for 20 minutes. Strain out the leaves, then whisk in the sugar, vanilla, and lime juice. Cool completely.',
  'Kaffir lime leaves release their distinctive citrus aroma only with heat. Tear the leaves before steeping to expose more surface area.',
  25
FROM recipes WHERE slug = 'coconut-lime-leaf-ice-cream';
COMMIT;

-- 11. coconut-macaroon-ice-cream: missing toasting step + chocolate drizzle
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('sweetened shredded coconut', '1/3', 'cup', 'mix-ins', 6),
  ('chocolate sauce for drizzle', '2', 'tablespoon', 'topping', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-macaroon-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-macaroon-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the shredded coconut: spread shredded coconut on a dry skillet over medium heat, stirring frequently, for 3–4 minutes until golden. Transfer to a plate to cool.',
  'Coconut goes from golden to burnt fast — stir the whole time and pull it off while still pale.',
  5
FROM recipes WHERE slug = 'coconut-macaroon-ice-cream';
COMMIT;

-- 12. coconut-mango-turmeric-ice-cream: missing coconut + turmeric
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('ground turmeric', '1/2', 'teaspoon', 'base', 7),
  ('freshly ground black pepper', '1', 'pinch', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-mango-turmeric-ice-cream';
COMMIT;

-- 13. lemon-raspberry-greek-frozen-yogurt: missing lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lemon juice', '2', 'tablespoon', 'base', 5),
  ('lemon zest', '1', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-raspberry-greek-frozen-yogurt';
COMMIT;

-- 14. mango-basil-gelato: missing basil + infusion step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh basil leaves', '8', NULL, 'base', 5
FROM recipes WHERE slug = 'mango-basil-gelato';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mango-basil-gelato')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Gently warm the milk and cream with the basil leaves over medium-low heat until steaming (do not boil). Steep 15 minutes off heat, then strain. Whisk the mango puree and sugar into the infused dairy. Cool completely.',
  'Mango + basil is a surprisingly classic pairing — both have bright, almost peppery notes.',
  20
FROM recipes WHERE slug = 'mango-basil-gelato';
COMMIT;

-- 15. mango-lime-chili-ice-cream: lemon→lime, missing mango + chili
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mango-lime-chili-ice-cream')
  AND name = 'lemon juice';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/3', 'cup', 'base', 6),
  ('lime zest', '1', 'teaspoon', 'base', 7),
  ('Tajin chili-lime seasoning (or cayenne)', '1/4', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-lime-chili-ice-cream';
COMMIT;

-- 16. mango-lime-mint-sorbet: missing mint
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh mint leaves, chopped', '2', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'mango-lime-mint-sorbet';
COMMIT;

-- 17. raspberry-chocolate-chip-ice-cream: missing actual chocolate chips (has cocoa, but not chips)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'raspberry-chocolate-chip-ice-cream';
COMMIT;

-- 18. raspberry-lemonade-ice-cream: missing raspberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'raspberry puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'raspberry-lemonade-ice-cream';
COMMIT;

-- 19. salted-caramel-frozen-yogurt: missing salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'flaky sea salt', '1/4', 'teaspoon', 'base', 4
FROM recipes WHERE slug = 'salted-caramel-frozen-yogurt';
COMMIT;

-- 20. tropical-mango-pineapple-greek-frozen-yogurt: missing pineapple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pineapple puree', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'tropical-mango-pineapple-greek-frozen-yogurt';
COMMIT;

-- 21. turmeric-mango-ice-cream: missing turmeric
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground turmeric', '1/2', 'teaspoon', 'base', 6),
  ('freshly ground black pepper', '1', 'pinch', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'turmeric-mango-ice-cream';
COMMIT;
