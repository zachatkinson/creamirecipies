-- Recipe audit batch 16 — 46 fixes for drafts publishing 2027-05
-- OK: pb-chocolate-banana-smoothie-bowl (all 3 named ingredients present)

-- 1. banana-nutella-milkshake: +banana + Nutella
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('ripe banana, mashed', '1', NULL, 'base', 5),
  ('Nutella', '3', 'tablespoon', 'swirl', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-nutella-milkshake'; COMMIT;

-- 2. banana-nutella-swirl: +Nutella
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Nutella', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'banana-nutella-swirl-ice-cream'; COMMIT;

-- 3. birthday-cake-milkshake: +cake batter + sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cake batter extract', '1/2', 'teaspoon', 'base', 5),
  ('rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'birthday-cake-milkshake'; COMMIT;

-- 4. blueberry-cheesecake-milkshake: +cream cheese + blueberry + graham
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cream cheese, softened', '2', 'oz', 'base', 5),
  ('blueberry jam', '3', 'tablespoon', 'swirl', 6),
  ('graham cracker crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-cheesecake-milkshake'; COMMIT;

-- 5. butterscotch-milkshake: +butterscotch
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'butterscotch sauce', '3', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'butterscotch-milkshake'; COMMIT;

-- 6. chai-spice-milkshake: +chai spices
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '1/2', 'teaspoon', 'base', 5),
  ('ground cardamom', '1/2', 'teaspoon', 'base', 6),
  ('ground ginger', '1/4', 'teaspoon', 'base', 7),
  ('ground cloves', '1/8', 'teaspoon', 'base', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chai-spice-milkshake'; COMMIT;

-- 7. cherry-limeade-italian-ice: +lime
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lime juice', '2', 'tablespoon', 'base', 4),
  ('lime zest', '1', 'teaspoon', 'base', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'cherry-limeade-italian-ice'; COMMIT;

-- 8. chocolate-avocado: +avocado
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe avocado, mashed smooth', '1/2', NULL, 'base', 7
FROM recipes WHERE slug = 'chocolate-avocado-ice-cream'; COMMIT;

-- 9. chocolate-cherry-milkshake: +cherry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'cherry puree', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'chocolate-cherry-milkshake'; COMMIT;

-- 10. chocolate-chip-brownie: +chips + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7),
  ('brownie bites, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-brownie-ice-cream'; COMMIT;

-- 11. chocolate-chip-brownie-protein-lite: +chips + brownie
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mini chocolate chips', '2', 'tablespoon', 'mix-ins', 4),
  ('brownie bites, chopped', '2', 'tablespoon', 'mix-ins', 5)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-chip-brownie-protein-lite-ice-cream'; COMMIT;

-- 12. chocolate-covered-espresso-bean: +actual beans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate-covered espresso beans, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'chocolate-covered-espresso-bean-ice-cream'; COMMIT;

-- 13. chocolate-orange-truffle: +truffle pieces + orange zest
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('orange zest', '1', 'teaspoon', 'base', 7),
  ('chocolate orange truffles, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'chocolate-orange-truffle-ice-cream'; COMMIT;

-- 14. coconut-lime-italian-ice: +lime + coconut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lime juice', '2', 'tablespoon', 'base', 4),
  ('lime zest', '1', 'teaspoon', 'base', 5),
  ('shredded coconut', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'coconut-lime-italian-ice'; COMMIT;

-- 15. coffee-biscotti: +biscotti pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'almond biscotti, crumbled', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'coffee-biscotti-ice-cream'; COMMIT;

-- 16. french-toast-crunch: +cinnamon + maple + cereal
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cinnamon', '3/4', 'teaspoon', 'base', 6),
  ('pure maple syrup', '2', 'tablespoon', 'base', 7),
  ('French Toast Crunch cereal, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'french-toast-crunch-ice-cream'; COMMIT;

-- 17. german-chocolate: dedup cocoa + add coconut + pecans (German chocolate signature)
BEGIN;
DELETE FROM ingredients WHERE ctid IN (
  SELECT ctid FROM ingredients
  WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'german-chocolate-ice-cream')
    AND name = 'cocoa powder'
  ORDER BY sort_order DESC LIMIT 1
);
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('shredded coconut, toasted', '1/4', 'cup', 'mix-ins', 6),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'german-chocolate-ice-cream'; COMMIT;

-- 18. ginger-snap: +gingersnap cookies + molasses
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('molasses', '1', 'tablespoon', 'base', 6),
  ('cinnamon', '1/2', 'teaspoon', 'base', 7),
  ('gingersnap cookies, crushed', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'ginger-snap-ice-cream'; COMMIT;

-- 19. keto-birthday-cake: +keto sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('sugar-free sprinkles', '2', 'tablespoon', 'mix-ins', 6),
  ('cake batter extract', '1/2', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'keto-birthday-cake-ice-cream'; COMMIT;

-- 20. kiwi-strawberry-italian-ice: +strawberry
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'strawberry puree', '1/4', 'cup', 'base', 4
FROM recipes WHERE slug = 'kiwi-strawberry-italian-ice'; COMMIT;

-- 21. mango-chili-italian-ice: +chili
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Tajin chili-lime seasoning (or cayenne)', '1/4', 'teaspoon', 'base', 4
FROM recipes WHERE slug = 'mango-chili-italian-ice'; COMMIT;

-- 22. mango-lassi-milkshake: +mango + yogurt + cardamom
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mango puree', '1/3', 'cup', 'base', 5),
  ('plain Greek yogurt', '1/4', 'cup', 'base', 6),
  ('ground cardamom', '1/4', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mango-lassi-milkshake'; COMMIT;

-- 23. maple-pecan-milkshake: +maple + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pure maple syrup', '3', 'tablespoon', 'base', 5),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'maple-pecan-milkshake'; COMMIT;

-- 24. mint-chocolate-chip-milkshake: +mint + chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('peppermint extract', '1/2', 'teaspoon', 'base', 6),
  ('mini chocolate chips', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mint-chocolate-chip-milkshake'; COMMIT;

-- 25. peanut-brittle: +peanut brittle
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'crushed peanut brittle', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'peanut-brittle-ice-cream'; COMMIT;

-- 26. peanut-butter-crunch-candy: +candy pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chopped peanut butter candy (Reeses Pieces or PB Cups)', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'peanut-butter-crunch-candy-ice-cream'; COMMIT;

-- 27. pistachio-milkshake: +pistachio
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pistachio paste', '2', 'tablespoon', 'base', 5),
  ('crushed pistachios', '2', 'tablespoon', 'mix-ins', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pistachio-milkshake'; COMMIT;

-- 28. pumpkin-pie-milkshake: +pumpkin + spices + pie crust
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('pumpkin puree', '1/3', 'cup', 'base', 5),
  ('pumpkin pie spice', '1', 'teaspoon', 'base', 6),
  ('pie crust crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'pumpkin-pie-milkshake'; COMMIT;

-- 29. raspberry-lemon-italian-ice: +lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh lemon juice', '2', 'tablespoon', 'base', 4
FROM recipes WHERE slug = 'raspberry-lemon-italian-ice'; COMMIT;

-- 30. raspberry-white-chocolate-milkshake: remove cocoa, add white choc + raspberry
BEGIN;
DELETE FROM ingredients
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'raspberry-white-chocolate-milkshake')
  AND name = 'cocoa powder';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('raspberry puree', '1/3', 'cup', 'base', 5),
  ('white chocolate chips, melted', '1/4', 'cup', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'raspberry-white-chocolate-milkshake'; COMMIT;

-- 31. roasted-apricot-vanilla: swap condensed milk for apricot + roast step
BEGIN;
UPDATE ingredients SET name = 'fresh apricots, pitted and halved', amount = '1', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-apricot-vanilla-ice-cream')
  AND name = 'sweetened condensed milk';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-apricot-vanilla-ice-cream');

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 1,
  'Roast the apricots: preheat oven to 400°F (200°C). Toss halved apricots with 1 tablespoon sugar on parchment, roast 20 minutes until jammy. Cool and blend smooth (you need ~1/3 cup puree).',
  'Roasting concentrates apricot flavor and tempers the tartness.',
  25
FROM recipes WHERE slug = 'roasted-apricot-vanilla-ice-cream'; COMMIT;

-- 32. salted-caramel-milkshake: +salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'flaky sea salt', '1/4', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'salted-caramel-milkshake'; COMMIT;

-- 33. salted-dark-chocolate: +salt + dark chocolate chunks
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 7),
  ('dark chocolate chunks (70%+)', '1/3', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-dark-chocolate-ice-cream'; COMMIT;

-- 34. sesame-halva: +tahini + halva
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('tahini', '3', 'tablespoon', 'base', 6),
  ('halva, crumbled', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'sesame-halva-ice-cream'; COMMIT;

-- 35. smores-milkshake: +marshmallow + graham + chocolate
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('marshmallow fluff', '1/4', 'cup', 'swirl', 5),
  ('hot fudge sauce', '2', 'tablespoon', 'swirl', 6),
  ('graham cracker crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'smores-milkshake'; COMMIT;

-- 36. strawberry-banana-milkshake: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'strawberry-banana-milkshake'; COMMIT;

-- 37. strawberry-lemonade-italian-ice: +lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh lemon juice', '2', 'tablespoon', 'base', 4
FROM recipes WHERE slug = 'strawberry-lemonade-italian-ice'; COMMIT;

-- 38. toasted-almond-amaretto: +amaretto + toasted almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('amaretto liqueur', '2', 'tablespoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'toasted-almond-amaretto-ice-cream'; COMMIT;

-- 39. triple-vanilla-bean: +vanilla bean + vanilla paste (3 forms of vanilla)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('vanilla bean, split and scraped', '1', NULL, 'base', 6),
  ('vanilla bean paste', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'triple-vanilla-bean-ice-cream'; COMMIT;

-- 40. vanilla-almond-brittle: +almond brittle pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'almond brittle, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'vanilla-almond-brittle-ice-cream'; COMMIT;

-- 41. vanilla-bean-milkshake: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'vanilla-bean-milkshake'; COMMIT;

-- 42. vanilla-birthday-sprinkle: +sprinkles
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('cake batter extract', '1/2', 'teaspoon', 'base', 6),
  ('rainbow sprinkles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-birthday-sprinkle-ice-cream'; COMMIT;

-- 43. vanilla-oreo-milkshake: +Oreos
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Oreo cookies, crushed', '1/4', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'vanilla-oreo-milkshake'; COMMIT;

-- 44. vegan-banana-chocolate: +cocoa
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened cocoa powder', '3', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'vegan-banana-chocolate-ice-cream'; COMMIT;

-- 45. vietnamese-iced-coffee: +sweetened condensed milk (signature)
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'sweetened condensed milk', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'vietnamese-iced-coffee-ice-cream'; COMMIT;

-- 46. watermelon-lime-italian-ice: +lime
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh lime juice', '2', 'tablespoon', 'base', 4
FROM recipes WHERE slug = 'watermelon-lime-italian-ice'; COMMIT;
