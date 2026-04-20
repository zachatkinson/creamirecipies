-- Recipe audit batch 17 — 54 fixes for drafts publishing 2027-06
-- OK: blackberry-cobbler, mango-lassi-frozen-yogurt, pineapple-upside-down-cake, rainbow-italian-ice

-- 1. baklava-honey-walnut: +walnuts + phyllo
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('chopped walnuts', '1/4', 'cup', 'mix-ins', 6),
  ('crushed phyllo pieces (baked)', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'baklava-honey-walnut-ice-cream'; COMMIT;

-- 2. birthday-cake-soft-serve: +sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 6
FROM recipes WHERE slug = 'birthday-cake-soft-serve'; COMMIT;

-- 3. blackberry-honey-goat-cheese: +honey + goat cheese
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('honey', '3', 'tablespoon', 'base', 6),
  ('soft goat cheese (chevre)', '2', 'oz', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blackberry-honey-goat-cheese-ice-cream'; COMMIT;

-- 4. blackberry-lime-sorbet: lemon->lime
BEGIN;
UPDATE ingredients SET name = 'fresh lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'blackberry-lime-sorbet')
  AND name = 'fresh lemon juice';
COMMIT;

-- 5. blackberry-sage-cream: +sage + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh sage leaves', '6', NULL, 'base', 6
FROM recipes WHERE slug = 'blackberry-sage-cream-ice-cream';
UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'blackberry-sage-cream-ice-cream')
  AND step_number >= 2;
INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm milk and cream with sage leaves over medium-low heat until steaming. Steep 15 minutes off heat, strain, then whisk in sugar, vanilla, and blackberry puree. Cool completely.',
  'Sage brings an earthy-savory counterpoint to the sweet blackberry.',
  20
FROM recipes WHERE slug = 'blackberry-sage-cream-ice-cream'; COMMIT;

-- 6. blackberry-vanilla-bean: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'blackberry-vanilla-bean-ice-cream'; COMMIT;

-- 7. blueberry-pecan: +pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'blueberry-pecan-ice-cream'; COMMIT;

-- 8. blueberry-walnut: +walnuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'blueberry-walnut-ice-cream'; COMMIT;

-- 9. bourbon-salted-caramel: +bourbon + salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('bourbon whiskey', '2', 'tablespoon', 'base', 6),
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'bourbon-salted-caramel-ice-cream'; COMMIT;

-- 10. butterscotch-blondie: +blondie pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'blondie bites, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'butterscotch-blondie-ice-cream'; COMMIT;

-- 11. caramelized-banana-foster: +banana + rum + brown sugar
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 6),
  ('dark rum', '2', 'tablespoon', 'base', 7),
  ('brown sugar', '2', 'tablespoon', 'base', 8),
  ('cinnamon', '1/2', 'teaspoon', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramelized-banana-foster-ice-cream'; COMMIT;

-- 12. cherry-almond-greek-frozen-yogurt: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 5),
  ('toasted sliced almonds', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cherry-almond-greek-frozen-yogurt'; COMMIT;

-- 13. chocolate-coconut-almond: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/4', 'teaspoon', 'base', 7),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-coconut-almond-ice-cream'; COMMIT;

-- 14. chocolate-coconut-caramel: +coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 7),
  ('toasted coconut flakes', '2', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-coconut-caramel-ice-cream'; COMMIT;

-- 15. chocolate-peanut-butter-frozen-yogurt: +cocoa
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cocoa powder', '2', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'chocolate-peanut-butter-frozen-yogurt'; COMMIT;

-- 16. cinnamon-apple-frozen-yogurt: +cinnamon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cinnamon', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'cinnamon-apple-frozen-yogurt'; COMMIT;

-- 17. coconut-lemon-curd: +coconut + lemon curd
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('coconut cream', '1/4', 'cup', 'base', 6),
  ('lemon curd', '3', 'tablespoon', 'swirl', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-lemon-curd-ice-cream'; COMMIT;

-- 18. coffee-caramel-greek-frozen-yogurt: +caramel
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'caramel sauce', '2', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'coffee-caramel-greek-frozen-yogurt'; COMMIT;

-- 19. cornbread-honey-butter: +cornmeal + butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('browned butter, cooled', '2', 'tablespoon', 'base', 6),
  ('fine cornmeal, toasted', '2', 'tablespoon', 'base', 7),
  ('cornbread crumbles', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cornbread-honey-butter-ice-cream'; COMMIT;

-- 20. dulce-de-leche-banana: +dulce de leche
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dulce de leche', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'dulce-de-leche-banana-ice-cream'; COMMIT;

-- 21. espresso-caramel-chip: +espresso + chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('instant espresso powder', '1', 'teaspoon', 'base', 6),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'espresso-caramel-chip-ice-cream'; COMMIT;

-- 22. goji-berry-vanilla: +goji berries
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried goji berries, soaked + drained', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'goji-berry-vanilla-ice-cream'; COMMIT;

-- 23. graham-cracker-cookie-dough: +graham + dough
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('graham cracker crumbles', '1/4', 'cup', 'mix-ins', 6),
  ('edible cookie dough chunks', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'graham-cracker-cookie-dough-ice-cream'; COMMIT;

-- 24. grapefruit-honey: +grapefruit
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh pink grapefruit juice', '1/4', 'cup', 'base', 6),
  ('grapefruit zest', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'grapefruit-honey-ice-cream'; COMMIT;

-- 25. irish-cream: +Irish cream liqueur
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Baileys Irish Cream liqueur', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'irish-cream-ice-cream'; COMMIT;

-- 26. lemon-poppy-seed-cake: +poppy seeds + zest
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('lemon zest', '1', 'teaspoon', 'base', 6),
  ('poppy seeds', '1', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-poppy-seed-cake-ice-cream'; COMMIT;

-- 27. london-fog-earl-grey: +earl grey + lavender + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('loose earl grey tea (or 2 teabags)', '1', 'tablespoon', 'base', 6),
  ('dried culinary lavender buds', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'london-fog-earl-grey-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'london-fog-earl-grey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm milk and cream with earl grey and lavender over medium-low until steaming. Steep 8 minutes off heat (no longer — tea turns bitter), strain, then whisk in sugar, vanilla, and condensed milk. Cool completely.',
  'London Fog is Earl Grey + vanilla + a hint of lavender. Keep tea steep short.',
  15
FROM recipes WHERE slug = 'london-fog-earl-grey-ice-cream'; COMMIT;

-- 28. matcha-white-chocolate-chip: remove cocoa, add white chocolate
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'matcha-white-chocolate-chip-ice-cream')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'white chocolate chips', '1/3', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'matcha-white-chocolate-chip-ice-cream'; COMMIT;

-- 29. mixed-tropical-italian-ice: replace vague blend
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'mixed-tropical-italian-ice')
  AND name = 'tropical fruit blend';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/2', 'cup', 'base', 3),
  ('pineapple puree', '1/2', 'cup', 'base', 4),
  ('passion fruit puree', '1/4', 'cup', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mixed-tropical-italian-ice'; COMMIT;

-- 30. oat-milk-vanilla: replace heavy cream/whole milk with oat milk
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'oat-milk-vanilla-ice-cream')
  AND name IN ('heavy cream', 'whole milk');
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('oat milk', '1', 'cup', 'base', 1),
  ('coconut cream', '1/2', 'cup', 'base', 2)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'oat-milk-vanilla-ice-cream'; COMMIT;

-- 31. pineapple-brown-sugar: applesauce -> pineapple
BEGIN;
UPDATE ingredients SET name = 'crushed pineapple, drained', amount = '1/3', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'pineapple-brown-sugar-ice-cream')
  AND name = 'applesauce';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dark brown sugar', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'pineapple-brown-sugar-ice-cream'; COMMIT;

-- 32. pistachio-lemon: +pistachio
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pistachio paste', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'pistachio-lemon-ice-cream'; COMMIT;

-- 33. pumpkin-pecan-pie: +pecans + pie crust + spice
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 7),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-pecan-pie-ice-cream'; COMMIT;

-- 34. raspberry-almond: +almond
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('almond extract', '1/2', 'teaspoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'raspberry-almond-ice-cream'; COMMIT;

-- 35. raspberry-coconut-cream: +coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'coconut cream', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'raspberry-coconut-cream-ice-cream'; COMMIT;

-- 36. raspberry-lemon-curd: +raspberry + lemon curd
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('raspberry puree', '1/3', 'cup', 'base', 6),
  ('lemon curd', '3', 'tablespoon', 'swirl', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'raspberry-lemon-curd-ice-cream'; COMMIT;

-- 37. raspberry-lemon-greek-frozen-yogurt: +lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lemon juice', '2', 'tablespoon', 'base', 5),
  ('lemon zest', '1', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'raspberry-lemon-greek-frozen-yogurt'; COMMIT;

-- 38. raspberry-peach-greek-frozen-yogurt: +peach
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'peach puree', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'raspberry-peach-greek-frozen-yogurt'; COMMIT;

-- 39. roasted-marshmallow-chocolate: +marshmallow
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted marshmallow fluff', '1/4', 'cup', 'swirl', 7),
  ('mini marshmallows', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'roasted-marshmallow-chocolate-ice-cream'; COMMIT;

-- 40. rum-punch-tropical: +rum + tropical fruit
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/4', 'cup', 'base', 6),
  ('pineapple juice', '2', 'tablespoon', 'base', 7),
  ('dark rum', '2', 'tablespoon', 'base', 8),
  ('fresh lime juice', '1', 'tablespoon', 'base', 9)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'rum-punch-tropical-ice-cream'; COMMIT;

-- 41. salted-caramel-pretzel-soft-serve: +salt + pretzels
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('crushed pretzels', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-caramel-pretzel-soft-serve'; COMMIT;

-- 42. salted-peanut-caramel: +salt + peanuts
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('salted roasted peanuts, chopped', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-peanut-caramel-ice-cream'; COMMIT;

-- 43. samoa-cookie: +coconut + caramel + chocolate (Samoa/Caramel deLite signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted coconut flakes', '1/4', 'cup', 'mix-ins', 6),
  ('caramel sauce', '3', 'tablespoon', 'swirl', 7),
  ('chocolate drizzle', '1', 'tablespoon', 'topping', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'samoa-cookie-ice-cream'; COMMIT;

-- 44. spiced-rum-raisin: +rum + raisins + spices
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dark spiced rum', '3', 'tablespoon', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('rum-soaked raisins', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'spiced-rum-raisin-ice-cream'; COMMIT;

-- 45. strawberry-mint-greek-frozen-yogurt: +mint
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh mint leaves, chopped', '2', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'strawberry-mint-greek-frozen-yogurt'; COMMIT;

-- 46. strawberry-rose-water: +rose water
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rose water', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-rose-water-ice-cream'; COMMIT;

-- 47. strawberry-shortbread: +shortbread
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'shortbread cookies, crumbled', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'strawberry-shortbread-ice-cream'; COMMIT;

-- 48. tigers-blood-italian-ice: +coconut + watermelon (Tiger's Blood trio)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('watermelon puree', '1/3', 'cup', 'base', 4),
  ('coconut cream', '2', 'tablespoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'tigers-blood-italian-ice'; COMMIT;

-- 49. toasted-oat-brown-sugar: +toasted oats + toasting step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted rolled oats', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'toasted-oat-brown-sugar-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-oat-brown-sugar-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the oats: spread rolled oats in a dry skillet over medium heat, stirring frequently, 4–5 minutes until fragrant and golden. Cool before adding as a mix-in.',
  'Toasted oats add a nutty, granola-like depth.',
  6
FROM recipes WHERE slug = 'toasted-oat-brown-sugar-ice-cream'; COMMIT;

-- 50. toasted-pecan-pie: +pecans + pie crust
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-pecan-pie-ice-cream'; COMMIT;

-- 51. toasted-sesame: +tahini + sesame seeds + toasting
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('tahini', '3', 'tablespoon', 'base', 6),
  ('toasted sesame seeds', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-sesame-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-sesame-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the sesame seeds: in a dry skillet over medium heat, stir sesame seeds constantly for 2–3 minutes until fragrant and pale gold. Cool on a plate before using as mix-in.',
  'Sesame seeds burn in seconds once they color. Pull early; residual heat continues toasting.',
  5
FROM recipes WHERE slug = 'toasted-sesame-ice-cream'; COMMIT;

-- 52. triple-chocolate-truffle: +chips + truffles + white chocolate
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cocoa powder', '2', 'tablespoon', 'base', 7),
  ('dark chocolate chunks', '1/4', 'cup', 'mix-ins', 8),
  ('white chocolate chips', '2', 'tablespoon', 'mix-ins', 9),
  ('chocolate truffles, chopped', '1/4', 'cup', 'mix-ins', 10)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'triple-chocolate-truffle-ice-cream'; COMMIT;

-- 53. ube-coconut: +ube
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ube paste (purple yam)', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'ube-coconut-ice-cream'; COMMIT;

-- 54. vietnamese-coffee: +condensed milk (Vietnamese coffee signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'sweetened condensed milk', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'vietnamese-coffee-ice-cream'; COMMIT;
