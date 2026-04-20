-- Recipe audit batch 18 — 69 fixes for drafts publishing 2027-07
-- Patterns applied: missing hero additions, lime/lemon typo fixes,
-- white-chocolate template bug (cocoa removal), and inclusion of crunch/dough
-- elements titled but not present.

-- 1. apple-cider-donut: +cinnamon + donut crumbles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 6),
  ('apple cider donut crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'apple-cider-donut-ice-cream'; COMMIT;

-- 2. blueberry-almond-greek-fy: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-almond-greek-frozen-yogurt'; COMMIT;

-- 3. blueberry-cream-cheese: +cream cheese
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cream cheese, softened', '2', 'oz', 'base', 6
FROM recipes WHERE slug = 'blueberry-cream-cheese-ice-cream'; COMMIT;

-- 4. blueberry-lemon-cream: +blueberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'blueberry puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'blueberry-lemon-cream-ice-cream'; COMMIT;

-- 5. blueberry-lime-basil: lemon->lime, +blueberry + basil
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'blueberry-lime-basil-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('blueberry puree', '1/3', 'cup', 'base', 6),
  ('fresh basil leaves, finely minced', '1', 'tablespoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-lime-basil-ice-cream'; COMMIT;

-- 6. brown-sugar-pecan-cookie: +pecans + cookies
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 6),
  ('shortbread cookie crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'brown-sugar-pecan-cookie-ice-cream'; COMMIT;

-- 7. caramel-popcorn: +popcorn
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel corn pieces, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'caramel-popcorn-ice-cream'; COMMIT;

-- 8. caramelized-fig: +figs
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fig preserves', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'caramelized-fig-ice-cream'; COMMIT;

-- 9. caramelized-peach: +peaches
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'peach puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'caramelized-peach-ice-cream'; COMMIT;

-- 10. caramelized-pecan-butter: +pecans + brown butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('candied pecans, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramelized-pecan-butter-ice-cream'; COMMIT;

-- 11. chai-honey: +chai spices
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('ground cardamom', '1/2', 'teaspoon', 'base', 7),
  ('ground ginger', '1/4', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-honey-ice-cream'; COMMIT;

-- 12. chocolate-avocado-mousse: +avocado
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe avocado, mashed smooth', '1/2', NULL, 'base', 7
FROM recipes WHERE slug = 'chocolate-avocado-mousse-ice-cream'; COMMIT;

-- 13. chocolate-cashew-butter: +cashew butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'creamy cashew butter', '3', 'tablespoon', 'swirl', 7
FROM recipes WHERE slug = 'chocolate-cashew-butter-ice-cream'; COMMIT;

-- 14. chocolate-chip-banana-bread: +cinnamon + walnuts + actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 8),
  ('chopped walnuts', '2', 'tablespoon', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-banana-bread-ice-cream'; COMMIT;

-- 15. chocolate-covered-banana-chip: +banana chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried banana chips, crushed', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-banana-chip-ice-cream'; COMMIT;

-- 16. chocolate-mint-chip-protein-lite: +mini chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '2', 'tablespoon', 'mix-ins', 5
FROM recipes WHERE slug = 'chocolate-mint-chip-protein-lite-ice-cream'; COMMIT;

-- 17. chocolate-peanut-butter-banana-crunch: +banana + crunch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 7),
  ('chocolate-covered peanuts, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-peanut-butter-banana-crunch-ice-cream'; COMMIT;

-- 18. chocolate-peanut-crunch: +peanuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('creamy peanut butter', '2', 'tablespoon', 'swirl', 7),
  ('chopped roasted peanuts', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-peanut-crunch-ice-cream'; COMMIT;

-- 19. chocolate-pecan-cluster: +pecan clusters
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate pecan clusters, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-pecan-cluster-ice-cream'; COMMIT;

-- 20. chocolate-walnut-fudge: +walnuts + fudge sauce
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('hot fudge sauce', '3', 'tablespoon', 'swirl', 7),
  ('toasted walnuts, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-walnut-fudge-ice-cream'; COMMIT;

-- 21. cinnamon-banana: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'cinnamon-banana-ice-cream'; COMMIT;

-- 22. coconut-dulce-de-leche: +dulce de leche
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dulce de leche', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'coconut-dulce-de-leche-ice-cream'; COMMIT;

-- 23. coconut-mango-greek-fy: +coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted coconut flakes', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'coconut-mango-greek-frozen-yogurt'; COMMIT;

-- 24. coconut-mango-lime: lemon->lime, +coconut + mango
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-mango-lime-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('mango puree', '1/3', 'cup', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-mango-lime-ice-cream'; COMMIT;

-- 25. coconut-pecan-praline: +pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coconut-pecan-praline-ice-cream'; COMMIT;

-- 26. coffee-almond-milk: +almond milk (replace whole milk) + almond extract
BEGIN;
UPDATE ingredients SET name = 'unsweetened almond milk'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coffee-almond-milk-ice-cream')
  AND name = 'whole milk';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'almond extract', '1/4', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'coffee-almond-milk-ice-cream'; COMMIT;

-- 27. coffee-chocolate-chip: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'coffee-chocolate-chip-ice-cream'; COMMIT;

-- 28. coffee-cookie-dough: +edible cookie dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'edible cookie dough chunks', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coffee-cookie-dough-ice-cream'; COMMIT;

-- 29. coffee-walnut-crunch: +walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coffee-walnut-crunch-ice-cream'; COMMIT;

-- 30. cookie-butter-swirl: +cookie butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Biscoff cookie butter', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'cookie-butter-swirl-ice-cream'; COMMIT;

-- 31. dark-chocolate-caramel-pretzel: +pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered pretzels, chopped', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'dark-chocolate-caramel-pretzel-ice-cream'; COMMIT;

-- 32. dark-chocolate-mint-chip: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'mini chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'dark-chocolate-mint-chip-ice-cream'; COMMIT;

-- 33. hazelnut-praline-crunch: +praline pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'hazelnut praline pieces', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'hazelnut-praline-crunch-ice-cream'; COMMIT;

-- 34. honey-roasted-almond: +almonds + roasting
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'honey-roasted almonds, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'honey-roasted-almond-ice-cream'; COMMIT;

-- 35. key-lime-coconut: lemon->key lime + coconut
BEGIN;
UPDATE ingredients SET name = 'fresh key lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'key-lime-coconut-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('toasted coconut flakes', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'key-lime-coconut-ice-cream'; COMMIT;

-- 36. lemon-lavender-cookie: +lavender + shortbread
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dried culinary lavender buds', '1', 'teaspoon', 'base', 6),
  ('shortbread cookie crumbles', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-lavender-cookie-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'lemon-lavender-cookie-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm milk and cream with lavender buds over medium-low heat until steaming. Steep 10 minutes, strain, then whisk in sugar, vanilla, and lemon juice. Cool completely.',
  'Lavender over-steeped goes soapy — stick to 10 minutes.',
  15
FROM recipes WHERE slug = 'lemon-lavender-cookie-ice-cream'; COMMIT;

-- 37. mango-chili-lime: lemon->lime, +mango + chili
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mango-chili-lime-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/3', 'cup', 'base', 6),
  ('Tajin chili-lime seasoning', '1/4', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-chili-lime-ice-cream'; COMMIT;

-- 38. mango-passionfruit-swirl: +passion fruit
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'passion fruit puree', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'mango-passionfruit-swirl-ice-cream'; COMMIT;

-- 39. matcha-coconut: +matcha
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'matcha powder', '2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'matcha-coconut-ice-cream'; COMMIT;

-- 40. peach-almond: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-almond-ice-cream'; COMMIT;

-- 41. peach-bourbon: +bourbon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bourbon whiskey', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'peach-bourbon-ice-cream'; COMMIT;

-- 42. peach-cobbler-milkshake: +peaches + cobbler crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('peach puree', '1/3', 'cup', 'base', 5),
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-cobbler-milkshake'; COMMIT;

-- 43. peach-cobbler-swirl: +cobbler crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('oat cobbler crumbles', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-cobbler-swirl-ice-cream'; COMMIT;

-- 44. peach-ginger-greek-fy: +ginger
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh ginger, grated', '2', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'peach-ginger-greek-frozen-yogurt'; COMMIT;

-- 45. peach-melba: +raspberry (melba = peach + raspberry sauce)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'raspberry sauce', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'peach-melba-ice-cream'; COMMIT;

-- 46. peanut-butter-pretzel-brownie: +pretzels + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('crushed pretzels', '1/4', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peanut-butter-pretzel-brownie-ice-cream'; COMMIT;

-- 47. pear-vanilla-bean: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'pear-vanilla-bean-ice-cream'; COMMIT;

-- 48. pistachio-raspberry-swirl: +pistachio
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pistachio paste', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'pistachio-raspberry-swirl-ice-cream'; COMMIT;

-- 49. pistachio-saffron: +saffron + bloom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'saffron threads', '1', 'pinch', 'base', 6
FROM recipes WHERE slug = 'pistachio-saffron-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'pistachio-saffron-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Bloom the saffron: warm 2 tablespoons of the milk and saffron threads over low heat for 1 minute, then steep 10 minutes off heat. Stir bloomed saffron (threads and all) into the rest of the base with pistachio paste.',
  'Saffron needs heat to release its color and flavor — do not skip the bloom.',
  12
FROM recipes WHERE slug = 'pistachio-saffron-ice-cream'; COMMIT;

-- 50. raspberry-pistachio-gelato: +raspberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'raspberry puree', '1/3', 'cup', 'base', 5
FROM recipes WHERE slug = 'raspberry-pistachio-gelato'; COMMIT;

-- 51. roasted-grape: +grapes + roasting
BEGIN;
UPDATE ingredients SET name = 'fresh red grapes, halved', amount = '1', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-grape-ice-cream')
  AND name = 'sweetened condensed milk';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-grape-ice-cream');

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 1,
  'Roast the grapes: preheat oven to 425°F (220°C). Toss halved grapes with 1 tablespoon sugar on parchment, roast 20 minutes until jammy. Cool completely, then blend into puree (about 1/3 cup).',
  'Roasting grapes concentrates them into a jammy, almost wine-like puree.',
  25
FROM recipes WHERE slug = 'roasted-grape-ice-cream'; COMMIT;

-- 52. salted-dark-chocolate-almond: +salt + toasted almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-dark-chocolate-almond-ice-cream'; COMMIT;

-- 53. smores-fudge-brownie: +marshmallow + graham + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('marshmallow fluff', '3', 'tablespoon', 'swirl', 7),
  ('graham cracker crumbles', '1/4', 'cup', 'mix-ins', 8),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'smores-fudge-brownie-ice-cream'; COMMIT;

-- 54. snickerdoodle-cookie-butter: +cinnamon + Biscoff
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 5),
  ('Biscoff cookie butter', '3', 'tablespoon', 'swirl', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'snickerdoodle-cookie-butter-ice-cream'; COMMIT;

-- 55. spiced-apple-cider: +cider + spices
BEGIN;
UPDATE ingredients SET name = 'apple cider (reduced to 1/4 cup)', amount = '1/4', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'spiced-apple-cider-ice-cream')
  AND name = 'applesauce';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1', 'teaspoon', 'base', 6),
  ('ground nutmeg', '1/4', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'spiced-apple-cider-ice-cream'; COMMIT;

-- 56. strawberry-caramel-swirl: +strawberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'strawberry puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'strawberry-caramel-swirl-ice-cream'; COMMIT;

-- 57. strawberry-lime: lemon->lime
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'strawberry-lime-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('strawberry puree', '1/3', 'cup', 'base', 6),
  ('lime zest', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-lime-ice-cream'; COMMIT;

-- 58. strawberry-mint: +mint
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh mint leaves, chopped', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-mint-ice-cream'; COMMIT;

-- 59. strawberry-pistachio: +pistachio
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pistachio paste', '2', 'tablespoon', 'base', 6),
  ('crushed pistachios', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-pistachio-ice-cream'; COMMIT;

-- 60. strawberry-vanilla-bean: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'strawberry-vanilla-bean-ice-cream'; COMMIT;

-- 61. tahini-date: +dates
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'medjool dates, pitted and chopped', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'tahini-date-ice-cream'; COMMIT;

-- 62. tropical-punch: replace vague blend
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'tropical-punch-ice-cream')
  AND name = 'tropical fruit juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/4', 'cup', 'base', 5),
  ('pineapple puree', '2', 'tablespoon', 'base', 6),
  ('fresh lime juice', '1', 'tablespoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tropical-punch-ice-cream'; COMMIT;

-- 63. vanilla-almond-cookie: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-almond-cookie-ice-cream'; COMMIT;

-- 64. vanilla-bean-custard: +egg yolks + vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('egg yolks, tempered', '3', NULL, 'base', 6),
  ('vanilla bean, split and scraped', '1', NULL, 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-bean-custard-ice-cream'; COMMIT;

-- 65. vanilla-brown-butter: +brown butter + browning step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'browned butter, cooled', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'vanilla-brown-butter-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'vanilla-brown-butter-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Brown the butter: melt 3 tablespoons butter in a small saucepan over medium heat, swirling until amber and nutty-smelling (3 minutes). Pour into heatproof bowl, cool to room temperature, then whisk into the base.',
  'Brown butter is the star — do not skip. Include all the toasted milk solids at the bottom.',
  8
FROM recipes WHERE slug = 'vanilla-brown-butter-ice-cream'; COMMIT;

-- 66. vanilla-fudge-protein-lite: +fudge sauce
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'sugar-free hot fudge sauce', '2', 'tablespoon', 'swirl', 4
FROM recipes WHERE slug = 'vanilla-fudge-protein-lite-ice-cream'; COMMIT;

-- 67. vanilla-peach-cobbler: +cobbler crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 6),
  ('oat cobbler crumbles', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-peach-cobbler-ice-cream'; COMMIT;

-- 68. walnut-maple-crunch: +walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'walnut-maple-crunch-ice-cream'; COMMIT;

-- 69. white-chocolate-cranberry: remove cocoa, add cranberries
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'white-chocolate-cranberry-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cranberry sauce (whole-berry)', '1/3', 'cup', 'swirl', 7
FROM recipes WHERE slug = 'white-chocolate-cranberry-ice-cream'; COMMIT;
