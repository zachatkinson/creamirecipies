-- Recipe audit batch 15 — 53 fixes for drafts publishing 2027-04
-- OK: birthday-cake-protein-ice-cream, creme-brulee-ice-cream,
--     high-protein-chocolate-ice-cream, panna-cotta-gelato, toasted-marshmallow-ice-cream

-- 1. almond-butter-cup: +almond butter + chocolate cups
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('creamy almond butter', '3', 'tablespoon', 'swirl', 6),
  ('mini chocolate-almond butter cups, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'almond-butter-cup-ice-cream'; COMMIT;

-- 2. apple-pie-protein-lite: +apple + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened applesauce', '1/3', 'cup', 'base', 4),
  ('cinnamon', '1/2', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-pie-protein-lite-ice-cream'; COMMIT;

-- 3. banana-cream-cheese: +cream cheese
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cream cheese, softened', '2', 'oz', 'base', 6
FROM recipes WHERE slug = 'banana-cream-cheese-ice-cream'; COMMIT;

-- 4. banana-nut-protein-lite: +banana flavor + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 4),
  ('chopped walnuts', '1/4', 'cup', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-nut-protein-lite-ice-cream'; COMMIT;

-- 5. birthday-cake-protein-lite: +cake batter + sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cake batter extract', '1/2', 'teaspoon', 'base', 4),
  ('rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'birthday-cake-protein-lite-ice-cream'; COMMIT;

-- 6. blueberry-muffin-protein-lite: +blueberries
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('frozen blueberries, partially thawed', '1/4', 'cup', 'mix-ins', 4),
  ('lemon zest', '1/2', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-muffin-protein-lite-ice-cream'; COMMIT;

-- 7. campfire-smores-swirl: +marshmallow + graham + chocolate
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('marshmallow fluff', '1/4', 'cup', 'swirl', 6),
  ('hot fudge sauce', '2', 'tablespoon', 'swirl', 7),
  ('graham cracker crumbles', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'campfire-smores-swirl-ice-cream'; COMMIT;

-- 8. candied-ginger: +candied ginger pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied ginger, finely chopped', '3', 'tablespoon', 'mix-ins', 6
FROM recipes WHERE slug = 'candied-ginger-ice-cream'; COMMIT;

-- 9. caramel-hazelnut-gelato: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel sauce', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'caramel-hazelnut-gelato'; COMMIT;

-- 10. caramel-macchiato-protein-lite: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'sugar-free caramel sauce', '2', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'caramel-macchiato-protein-lite-ice-cream'; COMMIT;

-- 11. charcoal-vanilla: +activated charcoal
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'food-grade activated charcoal powder', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'charcoal-vanilla-ice-cream'; COMMIT;

-- 12. chocolate-banana-protein-lite: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 4
FROM recipes WHERE slug = 'chocolate-banana-protein-lite-ice-cream'; COMMIT;

-- 13. chocolate-chip-brownie-batter: +actual chips + brownie pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-brownie-batter-ice-cream'; COMMIT;

-- 14. chocolate-chip-cannoli: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7),
  ('broken cannoli shells', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-cannoli-ice-cream'; COMMIT;

-- 15. chocolate-chip-cookie-protein-lite: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '2', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'chocolate-chip-cookie-protein-lite-ice-cream'; COMMIT;

-- 16. chocolate-chip-pancake: +chips + maple + butter flavor
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pure maple syrup', '2', 'tablespoon', 'base', 7),
  ('butter, melted', '1', 'tablespoon', 'base', 8),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-pancake-ice-cream'; COMMIT;

-- 17. chocolate-covered-pretzel-crunch: +pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered pretzels, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-pretzel-crunch-ice-cream'; COMMIT;

-- 18. chocolate-crinkle-cookie: +powdered sugar topping
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'powdered sugar for dusting', '1', 'tablespoon', 'topping', 7
FROM recipes WHERE slug = 'chocolate-crinkle-cookie-ice-cream'; COMMIT;

-- 19. chocolate-hazelnut-protein-lite: +hazelnut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'hazelnut spread (sugar-free if needed)', '2', 'tablespoon', 'swirl', 4
FROM recipes WHERE slug = 'chocolate-hazelnut-protein-lite-ice-cream'; COMMIT;

-- 20. chocolate-nougat: +nougat
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'soft nougat candy, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-nougat-ice-cream'; COMMIT;

-- 21. chocolate-peanut-butter-pretzel: +pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'crushed pretzels', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-peanut-butter-pretzel-ice-cream'; COMMIT;

-- 22. chocolate-peanut-butter-protein-lite: +peanut butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'powdered peanut butter', '2', 'tablespoon', 'base', 4
FROM recipes WHERE slug = 'chocolate-peanut-butter-protein-lite-ice-cream'; COMMIT;

-- 23. chocolate-truffle-gelato: +truffle pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate truffles, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'chocolate-truffle-gelato'; COMMIT;

-- 24. cinnamon-toast-protein-lite: +cinnamon + cereal
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 4),
  ('Cinnamon Toast Crunch cereal, crushed', '1/4', 'cup', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cinnamon-toast-protein-lite-ice-cream'; COMMIT;

-- 25. coconut-cream-protein-lite: +coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut extract', '1/2', 'teaspoon', 'base', 4),
  ('toasted coconut flakes', '2', 'tablespoon', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-cream-protein-lite-ice-cream'; COMMIT;

-- 26. coffee-almond-crunch: +almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coffee-almond-crunch-ice-cream'; COMMIT;

-- 27. creme-brulee-gelato: +burnt sugar element
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('brown sugar', '2', 'tablespoon', 'base', 5),
  ('caramelized sugar shards', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'creme-brulee-gelato'; COMMIT;

-- 28. espresso-chip-cookie: +chips + cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 6),
  ('espresso-flavored cookies, crumbled', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'espresso-chip-cookie-ice-cream'; COMMIT;

-- 29. fairlife-chocolate-caramel-lite: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'sugar-free caramel sauce', '2', 'tablespoon', 'swirl', 4
FROM recipes WHERE slug = 'fairlife-chocolate-caramel-lite-ice-cream'; COMMIT;

-- 30. fairlife-mocha-chip-lite: +cocoa + chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '1', 'tablespoon', 'base', 5),
  ('mini chocolate chips', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'fairlife-mocha-chip-lite-ice-cream'; COMMIT;

-- 31. greek-yogurt-vanilla-bean-lite: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'greek-yogurt-vanilla-bean-lite-ice-cream'; COMMIT;

-- 32. key-lime-pie-protein-lite: +lime + graham
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh key lime juice', '2', 'tablespoon', 'base', 4),
  ('lime zest', '1', 'teaspoon', 'base', 5),
  ('graham cracker crumbles', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'key-lime-pie-protein-lite-ice-cream'; COMMIT;

-- 33. lemon-cake-protein-lite: +lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lemon juice', '2', 'tablespoon', 'base', 4),
  ('lemon zest', '1', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-cake-protein-lite-ice-cream'; COMMIT;

-- 34. maple-walnut-protein-lite: +maple + walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pure maple syrup', '2', 'tablespoon', 'base', 4),
  ('chopped walnuts', '1/4', 'cup', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-walnut-protein-lite-ice-cream'; COMMIT;

-- 35. mint-chocolate-chip-protein-lite: +mint + chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('peppermint extract', '1/2', 'teaspoon', 'base', 4),
  ('mini chocolate chips', '2', 'tablespoon', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mint-chocolate-chip-protein-lite-ice-cream'; COMMIT;

-- 36. peanut-butter-banana-fluff: +banana + marshmallow
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('marshmallow fluff', '3', 'tablespoon', 'swirl', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peanut-butter-banana-fluff-ice-cream'; COMMIT;

-- 37. peanut-butter-banana-protein-lite: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'peanut-butter-banana-protein-lite-ice-cream'; COMMIT;

-- 38. peanut-butter-marshmallow: +marshmallow
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'marshmallow fluff', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'peanut-butter-marshmallow-ice-cream'; COMMIT;

-- 39. pumpkin-spice-protein-lite: +pumpkin + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin puree', '1/4', 'cup', 'base', 4),
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-spice-protein-lite-ice-cream'; COMMIT;

-- 40. red-velvet-protein-lite: +cocoa + red coloring
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '1', 'tablespoon', 'base', 4),
  ('red food coloring', '1', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'red-velvet-protein-lite-ice-cream'; COMMIT;

-- 41. ricotta-honey-gelato: +honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'honey', '3', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'ricotta-honey-gelato'; COMMIT;

-- 42. roasted-almond-fudge: add toasted almonds + toasting step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted sliced almonds', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'roasted-almond-fudge-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-almond-fudge-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the almonds: spread sliced almonds on a dry skillet over medium heat, stirring constantly, until golden and fragrant (3 minutes). Transfer to a plate to cool.',
  'Toasted almonds deepen the "roasted" flavor the title promises.',
  5
FROM recipes WHERE slug = 'roasted-almond-fudge-ice-cream'; COMMIT;

-- 43. roasted-plum-vanilla: swap condensed milk for fresh plums + roast step
BEGIN;
UPDATE ingredients SET name = 'fresh plums, pitted and halved', amount = '1', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-plum-vanilla-ice-cream')
  AND name = 'sweetened condensed milk';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-plum-vanilla-ice-cream');

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 1,
  'Roast the plums: preheat oven to 400°F (200°C). Toss halved plums with 1 tablespoon of the granulated sugar on parchment and roast for 20 minutes until jammy. Cool, then blend into a smooth puree (about 1/3 cup).',
  'Roasting concentrates plum flavor and adds a slight caramelized depth raw fruit cannot.',
  25
FROM recipes WHERE slug = 'roasted-plum-vanilla-ice-cream'; COMMIT;

-- 44. salted-caramel-hazelnut-gelato: +caramel + salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 5),
  ('caramel sauce', '3', 'tablespoon', 'swirl', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-hazelnut-gelato'; COMMIT;

-- 45. salted-caramel-protein-lite: +caramel + salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/4', 'teaspoon', 'base', 4),
  ('sugar-free caramel sauce', '2', 'tablespoon', 'swirl', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-protein-lite-ice-cream'; COMMIT;

-- 46. snickers-bar: +Snickers ingredients (peanut + caramel + cocoa + nougat)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened cocoa powder', '2', 'tablespoon', 'base', 6),
  ('caramel sauce', '3', 'tablespoon', 'swirl', 7),
  ('salted roasted peanuts, chopped', '1/4', 'cup', 'mix-ins', 8),
  ('Snickers bars, chopped', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'snickers-bar-ice-cream'; COMMIT;

-- 47. strawberry-banana-protein-lite: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 4
FROM recipes WHERE slug = 'strawberry-banana-protein-lite-ice-cream'; COMMIT;

-- 48. tiramisu-mascarpone-gelato: +mascarpone + ladyfingers
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mascarpone cheese', '1/4', 'cup', 'base', 5),
  ('crushed ladyfingers', '1/4', 'cup', 'mix-ins', 6),
  ('cocoa powder for dusting', '1', 'teaspoon', 'topping', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tiramisu-mascarpone-gelato'; COMMIT;

-- 49. torrone-gelato: +almonds + egg whites (nougat signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('egg whites, beaten stiff', '2', NULL, 'base', 5),
  ('toasted whole almonds, chopped', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'torrone-gelato'; COMMIT;

-- 50. turmeric-golden-milk: +turmeric + ginger + cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ground turmeric', '1', 'teaspoon', 'base', 6),
  ('ground ginger', '1/2', 'teaspoon', 'base', 7),
  ('cinnamon', '1/4', 'teaspoon', 'base', 8),
  ('freshly ground black pepper', '1', 'pinch', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'turmeric-golden-milk-ice-cream'; COMMIT;

-- 51. vanilla-bean-protein-lite: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 4
FROM recipes WHERE slug = 'vanilla-bean-protein-lite-ice-cream'; COMMIT;

-- 52. vanilla-caramel-crunch-protein-lite: +vanilla extract + caramel + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('vanilla extract', '1', 'teaspoon', 'base', 4),
  ('sugar-free caramel sauce', '2', 'tablespoon', 'swirl', 5),
  ('toffee bits', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-caramel-crunch-protein-lite-ice-cream'; COMMIT;

-- 53. vanilla-hazelnut-gelato: +vanilla extract
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla extract', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'vanilla-hazelnut-gelato'; COMMIT;
