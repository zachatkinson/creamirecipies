-- Recipe audit batch 13 — 38 fixes for drafts publishing 2027-02
-- OK: birthday-cake-ice-cream, funfetti-ice-cream, pbj-smoothie-bowl,
--     red-velvet-ice-cream, sambuca-gelato, vanilla-protein-ice-cream-thecreami

-- 1. banana-almond-crunch: +almond extract + toasted almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-almond-crunch-ice-cream';
COMMIT;

-- 2. banana-chocolate-chip: swap cocoa for actual chips
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'banana-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'banana-chocolate-chip-ice-cream';
COMMIT;

-- 3. blackberry-lime-ginger-sorbet: +ginger
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh ginger, grated', '1', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'blackberry-lime-ginger-sorbet';
COMMIT;

-- 4. blackberry-peach: +peach
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'peach puree', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'blackberry-peach-ice-cream';
COMMIT;

-- 5. blueberry-pancake: +maple + butter flavor
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pure maple syrup', '2', 'tablespoon', 'base', 6),
  ('butter, melted', '1', 'tablespoon', 'base', 7),
  ('pancake crumbles (or graham crackers)', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-pancake-ice-cream';
COMMIT;

-- 6. caramel-coconut: +coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('toasted coconut flakes', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-coconut-ice-cream';
COMMIT;

-- 7. caramel-macadamia: +macadamias
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'roasted macadamia nuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'caramel-macadamia-ice-cream';
COMMIT;

-- 8. cherry-almond: +almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cherry-almond-ice-cream';
COMMIT;

-- 9. chocolate-almond-butter-crunch: +almond butter + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('creamy almond butter', '3', 'tablespoon', 'swirl', 7),
  ('chopped almond brittle', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-almond-butter-crunch-ice-cream';
COMMIT;

-- 10. chocolate-chip-cookie-sandwich: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/4', 'cup', 'mix-ins', 8
FROM recipes WHERE slug = 'chocolate-chip-cookie-sandwich-ice-cream';
COMMIT;

-- 11. chocolate-chip-espresso: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-chip-espresso-ice-cream';
COMMIT;

-- 12. chocolate-cookie-butter: +Biscoff
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Biscoff cookie butter', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'chocolate-cookie-butter-ice-cream';
COMMIT;

-- 13. chocolate-stout: +stout beer
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate stout beer (reduced to 2 tbsp)', '2', 'tablespoon', 'base', 7
FROM recipes WHERE slug = 'chocolate-stout-ice-cream';
COMMIT;

-- 14. coffee-chip-protein-lite: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '2', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'coffee-chip-protein-lite-ice-cream';
COMMIT;

-- 15. coffee-chocolate-chip-gelato: +dark chocolate chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dark chocolate chips', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coffee-chocolate-chip-gelato';
COMMIT;

-- 16. cookie-dough-fudge-brownie: +edible dough + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('edible cookie dough chunks', '1/3', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8),
  ('hot fudge sauce', '2', 'tablespoon', 'swirl', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cookie-dough-fudge-brownie-ice-cream';
COMMIT;

-- 17. cookies-and-cream-brownie-milkshake: +cookies + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('Oreo cookies, crushed', '1/4', 'cup', 'mix-ins', 5),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cookies-and-cream-brownie-milkshake';
COMMIT;

-- 18. dark-chocolate-avocado: +avocado
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe avocado, mashed smooth', '1/2', NULL, 'base', 7
FROM recipes WHERE slug = 'dark-chocolate-avocado-ice-cream';
COMMIT;

-- 19. dark-chocolate-espresso-chip: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'dark-chocolate-espresso-chip-ice-cream';
COMMIT;

-- 20. espresso-marshmallow: +marshmallow fluff
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'marshmallow fluff', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'espresso-marshmallow-ice-cream';
COMMIT;

-- 21. espresso-vanilla-bean: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'espresso-vanilla-bean-ice-cream';
COMMIT;

-- 22. gianduja-gelato: +chocolate (cocoa)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened cocoa powder', '2', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'gianduja-gelato';
COMMIT;

-- 23. honey-ginger: +ginger
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh ginger, grated', '1', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'honey-ginger-ice-cream';
COMMIT;

-- 24. lemon-raspberry: +raspberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'raspberry puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'lemon-raspberry-ice-cream';
COMMIT;

-- 25. mango-lime-chili-sorbet: +chili
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Tajin chili-lime seasoning (or cayenne)', '1/4', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'mango-lime-chili-sorbet';
COMMIT;

-- 26. oatmeal-raisin-cookie: +oats + raisins
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 5),
  ('golden raisins', '1/4', 'cup', 'mix-ins', 6),
  ('oat streusel crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'oatmeal-raisin-cookie-ice-cream';
COMMIT;

-- 27. orange-chocolate-chip: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('orange zest', '1', 'teaspoon', 'base', 7),
  ('mini chocolate chips', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'orange-chocolate-chip-ice-cream';
COMMIT;

-- 28. orange-ginger: +ginger
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh ginger, grated', '1', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'orange-ginger-ice-cream';
COMMIT;

-- 29. peanut-butter-cookie-dough-protein-lite: +protein dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'edible protein cookie dough chunks', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'peanut-butter-cookie-dough-protein-lite-ice-cream';
COMMIT;

-- 30. persian-saffron: +saffron
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('saffron threads', '1', 'pinch', 'base', 6),
  ('rose water', '1/2', 'teaspoon', 'base', 7),
  ('crushed pistachios', '2', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'persian-saffron-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'persian-saffron-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Bloom the saffron: warm 2 tablespoons of the milk in a small saucepan over low heat. Add saffron threads, steep 10 minutes. Stir the bloomed saffron (threads and all) + rose water into the rest of the base.',
  'Persian saffron ice cream (bastani) should be pale gold with visible saffron flecks. Do not strain.',
  12
FROM recipes WHERE slug = 'persian-saffron-ice-cream';
COMMIT;

-- 31. pistachio-olive-oil: +olive oil + salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('high-quality extra-virgin olive oil', '2', 'tablespoon', 'base', 6),
  ('flaky sea salt', '1/4', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pistachio-olive-oil-ice-cream';
COMMIT;

-- 32. red-velvet-milkshake: +cocoa + red food coloring
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '1', 'tablespoon', 'base', 5),
  ('cream cheese, softened', '2', 'tablespoon', 'base', 6),
  ('red food coloring', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'red-velvet-milkshake';
COMMIT;

-- 33. salted-peanut-fudge: +salted peanuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7),
  ('salted roasted peanuts, chopped', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-peanut-fudge-ice-cream';
COMMIT;

-- 34. smoked-chocolate: +smoked salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'smoked sea salt', '1/2', 'teaspoon', 'base', 7
FROM recipes WHERE slug = 'smoked-chocolate-ice-cream';
COMMIT;

-- 35. smores-cookie-dough: +marshmallow + graham + chocolate + dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('marshmallow fluff', '3', 'tablespoon', 'swirl', 6),
  ('graham cracker crumbles', '1/4', 'cup', 'mix-ins', 7),
  ('chocolate chunks', '1/4', 'cup', 'mix-ins', 8),
  ('edible cookie dough chunks', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'smores-cookie-dough-ice-cream';
COMMIT;

-- 36. tropical-fruit-punch-sorbet: replace vague blend
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'tropical-fruit-punch-sorbet')
  AND name = 'tropical fruit juice blend';

INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pineapple juice', '3/4', 'cup', 'base', 1),
  ('fresh orange juice', '1/2', 'cup', 'base', 2),
  ('passion fruit puree', '1/4', 'cup', 'base', 3)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tropical-fruit-punch-sorbet';
COMMIT;

-- 37. vanilla-pretzel: +pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'crushed pretzels', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'vanilla-pretzel-ice-cream';
COMMIT;

-- 38. vegan-birthday-cake: +sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'vegan-birthday-cake-ice-cream';
COMMIT;
