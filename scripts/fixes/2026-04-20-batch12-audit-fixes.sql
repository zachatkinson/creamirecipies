-- Recipe audit batch 12 — 36 fixes for drafts publishing 2027-01
-- (toasted-marshmallow-smores reviewed OK — has all smores components)

-- 1. apple-butter-crunch-ice-cream: swap applesauce for apple butter + add cinnamon + crunch
BEGIN;
UPDATE ingredients SET name = 'apple butter'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'apple-butter-crunch-ice-cream')
  AND name = 'applesauce';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-butter-crunch-ice-cream';
COMMIT;

-- 2. banana-cookie-butter-ice-cream: missing cookie butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Biscoff cookie butter', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'banana-cookie-butter-ice-cream';
COMMIT;

-- 3. black-forest-ice-cream: missing chocolate + cherries (Black Forest signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cocoa powder', '3', 'tablespoon', 'base', 6),
  ('cherry compote (whole cherries in syrup)', '1/4', 'cup', 'swirl', 7),
  ('kirsch (cherry brandy, optional)', '1', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'black-forest-ice-cream';
COMMIT;

-- 4. blueberry-maple-ice-cream: missing blueberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'blueberry puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'blueberry-maple-ice-cream';
COMMIT;

-- 5. chocolate-candy-bar-crunch-ice-cream: missing chopped candy bars
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'assorted candy bars, chopped (Snickers, Twix, etc.)', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-candy-bar-crunch-ice-cream';
COMMIT;

-- 6. chocolate-chip-cookie-milkshake: missing actual cookies + chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('chocolate chip cookies, crushed', '1/3', 'cup', 'mix-ins', 6),
  ('mini chocolate chips', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-cookie-milkshake';
COMMIT;

-- 7. chocolate-covered-almond-brittle-ice-cream: missing brittle
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'almond brittle, crushed', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-almond-brittle-ice-cream';
COMMIT;

-- 8. chocolate-covered-macadamia-crunch-ice-cream: missing macadamias
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered macadamia nuts, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-macadamia-crunch-ice-cream';
COMMIT;

-- 9. chocolate-covered-pretzel-ice-cream: dedupe cocoa + add pretzels
BEGIN;
DELETE FROM ingredients WHERE ctid IN (
  SELECT ctid FROM ingredients
  WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'chocolate-covered-pretzel-ice-cream')
    AND name = 'cocoa powder'
  ORDER BY sort_order DESC LIMIT 1
);
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered pretzels, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-pretzel-ice-cream';
COMMIT;

-- 10. chocolate-graham-cracker-ice-cream: missing graham
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'graham cracker crumbles', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-graham-cracker-ice-cream';
COMMIT;

-- 11. chocolate-macadamia-ice-cream: missing macadamias
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'roasted macadamia nuts, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-macadamia-ice-cream';
COMMIT;

-- 12. cinnamon-walnut-ice-cream: missing walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'cinnamon-walnut-ice-cream';
COMMIT;

-- 13. coconut-almond-crunch-ice-cream: missing almonds + toasted coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7),
  ('toasted coconut flakes', '2', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-almond-crunch-ice-cream';
COMMIT;

-- 14. coffee-almond-brownie-ice-cream: missing almonds + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8),
  ('toasted sliced almonds', '2', 'tablespoon', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-almond-brownie-ice-cream';
COMMIT;

-- 15. coffee-almond-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-almond-ice-cream';
COMMIT;

-- 16. crema-gelato: missing egg yolks (custard base)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'egg yolks, tempered', '3', NULL, 'base', 5
FROM recipes WHERE slug = 'crema-gelato';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'crema-gelato')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Make the custard: whisk egg yolks with sugar in a bowl. Warm milk and cream in a saucepan until steaming, then temper into yolks by whisking in a slow stream. Return to saucepan and cook over low heat, stirring, until it coats the back of a spoon (170–175°F / 77–79°C). Strain and cool completely.',
  'Do not boil — egg yolks curdle above 180°F. Pull off heat the moment the custard coats the spoon.',
  15
FROM recipes WHERE slug = 'crema-gelato';
COMMIT;

-- 17. dulce-de-leche-churro-ice-cream: missing explicit dulce de leche + churro elements
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dulce de leche', '1/4', 'cup', 'swirl', 6),
  ('cinnamon', '1', 'teaspoon', 'base', 7),
  ('churro pieces or cinnamon-sugar fried dough, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'dulce-de-leche-churro-ice-cream';
COMMIT;

-- 18. eggnog-cookie-ice-cream: missing eggnog flavor signature
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground nutmeg', '1/2', 'teaspoon', 'base', 5),
  ('cinnamon', '1/4', 'teaspoon', 'base', 6),
  ('dark rum (optional)', '1', 'tablespoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'eggnog-cookie-ice-cream';
COMMIT;

-- 19. espresso-chip-gelato: missing chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dark chocolate chips', '1/3', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'espresso-chip-gelato';
COMMIT;

-- 20. espresso-dulce-de-leche-ice-cream: missing dulce de leche
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dulce de leche', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'espresso-dulce-de-leche-ice-cream';
COMMIT;

-- 21. fairlife-birthday-cake-lite-ice-cream: missing sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'fairlife-birthday-cake-lite-ice-cream';
COMMIT;

-- 22. hazelnut-coffee-ice-cream: missing hazelnut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'hazelnut paste', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'hazelnut-coffee-ice-cream';
COMMIT;

-- 23. honey-almond-ice-cream: missing almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'honey-almond-ice-cream';
COMMIT;

-- 24. keto-almond-fudge-ice-cream: missing fudge (chocolate)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '2', 'tablespoon', 'base', 6),
  ('sugar-free chocolate chips', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'keto-almond-fudge-ice-cream';
COMMIT;

-- 25. lemon-meringue-pie-ice-cream: missing meringue + pie crust
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('lemon zest', '1', 'teaspoon', 'base', 6),
  ('crushed meringue cookies', '1/3', 'cup', 'mix-ins', 7),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-meringue-pie-ice-cream';
COMMIT;

-- 26. mango-graham-ice-cream: missing graham
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'graham cracker crumbles', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'mango-graham-ice-cream';
COMMIT;

-- 27. olive-oil-sea-salt-ice-cream: missing olive oil + salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('high-quality extra-virgin olive oil', '3', 'tablespoon', 'base', 6),
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'olive-oil-sea-salt-ice-cream';
COMMIT;

-- 28. peanut-butter-jelly-swirl-ice-cream: missing jelly
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'grape jelly', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'peanut-butter-jelly-swirl-ice-cream';
COMMIT;

-- 29. rocky-road-fudge-ice-cream: missing marshmallows + almonds + chocolate chunks
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini marshmallows', '1/3', 'cup', 'mix-ins', 7),
  ('chopped almonds', '1/4', 'cup', 'mix-ins', 8),
  ('chocolate chunks', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'rocky-road-fudge-ice-cream';
COMMIT;

-- 30. salted-tahini-ice-cream: missing salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'flaky sea salt', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'salted-tahini-ice-cream';
COMMIT;

-- 31. tahini-chocolate-chip-ice-cream: missing chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'tahini-chocolate-chip-ice-cream';
COMMIT;

-- 32. triple-berry-jam-ice-cream: missing actual berry jam
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mixed berry jam (strawberry, blueberry, raspberry)', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'triple-berry-jam-ice-cream';
COMMIT;

-- 33. vanilla-almond-gelato: missing almond pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted sliced almonds', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'vanilla-almond-gelato';
COMMIT;

-- 34. vanilla-chocolate-pretzel-ice-cream: remove cocoa, add choc-covered pretzels
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'vanilla-chocolate-pretzel-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered pretzels, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'vanilla-chocolate-pretzel-ice-cream';
COMMIT;

-- 35. vanilla-nougat-ice-cream: missing nougat
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'soft nougat candy, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'vanilla-nougat-ice-cream';
COMMIT;

-- 36. vegan-tahini-date-ice-cream: missing dates
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'medjool dates, pitted and chopped', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'vegan-tahini-date-ice-cream';
COMMIT;
