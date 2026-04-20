-- Recipe audit batch 14 — 42 fixes for drafts publishing 2027-03
-- OK: fior-di-latte-gelato, lemon-meringue-ice-cream, tropical-green-power-smoothie-bowl

-- 1. almond-butter-honey-crunch: +almond butter + toasted almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('creamy almond butter', '3', 'tablespoon', 'swirl', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'almond-butter-honey-crunch-ice-cream';
COMMIT;

-- 2. apple-cinnamon-greek-frozen-yogurt: +apple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'unsweetened applesauce', '1/3', 'cup', 'base', 4
FROM recipes WHERE slug = 'apple-cinnamon-greek-frozen-yogurt';
COMMIT;

-- 3. bacio-gelato: +hazelnut
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('hazelnut paste', '2', 'tablespoon', 'base', 6),
  ('chopped whole hazelnuts', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'bacio-gelato';
COMMIT;

-- 4. blueberry-lemon-greek-frozen-yogurt: +lemon
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('fresh lemon juice', '2', 'tablespoon', 'base', 5),
  ('lemon zest', '1', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'blueberry-lemon-greek-frozen-yogurt';
COMMIT;

-- 5. caramel-apple-greek-frozen-yogurt: +apple
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('unsweetened applesauce', '1/4', 'cup', 'base', 5),
  ('cinnamon', '1/2', 'teaspoon', 'base', 6)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'caramel-apple-greek-frozen-yogurt';
COMMIT;

-- 6. cherry-balsamic-swirl: +balsamic
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'aged balsamic vinegar', '2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'cherry-balsamic-swirl-ice-cream';
COMMIT;

-- 7. cherry-vanilla-italian-ice: +vanilla
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla extract', '1', 'teaspoon', 'base', 4
FROM recipes WHERE slug = 'cherry-vanilla-italian-ice';
COMMIT;

-- 8. chocolate-banana-greek-frozen-yogurt: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'chocolate-banana-greek-frozen-yogurt';
COMMIT;

-- 9. chocolate-fondente-gelato: +dark chocolate chunks
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dark chocolate (70%+), finely chopped', '1/4', 'cup', 'base', 6
FROM recipes WHERE slug = 'chocolate-fondente-gelato';
COMMIT;

-- 10. chocolate-malted-milk: +malt powder
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'malted milk powder (Ovaltine or Horlicks)', '3', 'tablespoon', 'base', 7
FROM recipes WHERE slug = 'chocolate-malted-milk-ice-cream';
COMMIT;

-- 11. coconut-lavender: +lavender + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'coconut-lavender-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'coconut-lavender-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk, cream, and coconut cream with the lavender buds over medium-low heat until steaming. Steep 10 minutes off heat, strain, then whisk in sugar and vanilla. Cool completely.',
  'Coconut + lavender is surprisingly complementary — both have floral notes.',
  15
FROM recipes WHERE slug = 'coconut-lavender-ice-cream';
COMMIT;

-- 12. coconut-passion-fruit: +passion fruit
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'passion fruit puree', '1/3', 'cup', 'base', 6
FROM recipes WHERE slug = 'coconut-passion-fruit-ice-cream';
COMMIT;

-- 13. honey-cashew-vanilla: +cashews
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'roasted salted cashews, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'honey-cashew-vanilla-ice-cream';
COMMIT;

-- 14. honey-pecan-crunch: +pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'honey-pecan-crunch-ice-cream';
COMMIT;

-- 15. honey-vanilla-bean-milkshake: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 6
FROM recipes WHERE slug = 'honey-vanilla-bean-milkshake';
COMMIT;

-- 16. key-lime-greek-frozen-yogurt: lemon->lime
BEGIN;
UPDATE ingredients SET name = 'fresh key lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'key-lime-greek-frozen-yogurt')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'lime zest', '1', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'key-lime-greek-frozen-yogurt';
COMMIT;

-- 17. key-lime-pie-crumble: lemon->lime + pie crust
BEGIN;
UPDATE ingredients SET name = 'fresh key lime juice'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'key-lime-pie-crumble-ice-cream')
  AND name = 'lemon juice';
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('lime zest', '1', 'teaspoon', 'base', 6),
  ('graham cracker crumbles', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'key-lime-pie-crumble-ice-cream';
COMMIT;

-- 18. lavender-earl-grey: +lavender + earl grey + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('loose earl grey tea (or 2 teabags)', '1', 'tablespoon', 'base', 6),
  ('dried culinary lavender buds', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lavender-earl-grey-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'lavender-earl-grey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the earl grey tea and lavender until steaming. Steep off heat 8 minutes (no longer — tea turns bitter), then strain thoroughly. Whisk in sugar, vanilla, and condensed milk. Cool completely.',
  'Strain through a fine-mesh sieve lined with cheesecloth to catch every fleck.',
  15
FROM recipes WHERE slug = 'lavender-earl-grey-ice-cream';
COMMIT;

-- 19. lemon-olive-oil: +olive oil
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('high-quality extra-virgin olive oil', '3', 'tablespoon', 'base', 6),
  ('flaky sea salt', '1/4', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'lemon-olive-oil-ice-cream';
COMMIT;

-- 20. mascarpone-fig-honey: +mascarpone + honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('mascarpone cheese', '1/4', 'cup', 'base', 6),
  ('honey', '2', 'tablespoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'mascarpone-fig-honey-ice-cream';
COMMIT;

-- 21. matcha-honey-almond: +honey + almonds
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('honey', '3', 'tablespoon', 'base', 6),
  ('toasted sliced almonds', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'matcha-honey-almond-ice-cream';
COMMIT;

-- 22. matcha-oreo: +Oreos
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Oreo cookies, crushed', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'matcha-oreo-ice-cream';
COMMIT;

-- 23. nocciola-praline-gelato: +praline
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'candied hazelnut praline, chopped', '1/3', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'nocciola-praline-gelato';
COMMIT;

-- 24. nutella-banana: +Nutella
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'Nutella (hazelnut-chocolate spread)', '1/4', 'cup', 'swirl', 6
FROM recipes WHERE slug = 'nutella-banana-ice-cream';
COMMIT;

-- 25. peach-lavender-honey: +lavender + honey + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('honey', '2', 'tablespoon', 'base', 6),
  ('dried culinary lavender buds', '1', 'teaspoon', 'base', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'peach-lavender-honey-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'peach-lavender-honey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and cream with the lavender buds over medium-low heat until steaming. Steep 10 minutes off heat, strain, then whisk in the honey, sugar, vanilla, and peach puree. Cool completely.',
  'Peach + lavender is an Herbs de Provence-adjacent pairing that reads sophisticated-summer.',
  15
FROM recipes WHERE slug = 'peach-lavender-honey-ice-cream';
COMMIT;

-- 26. peach-mango-greek-frozen-yogurt: +peach
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'peach puree', '1/4', 'cup', 'base', 5
FROM recipes WHERE slug = 'peach-mango-greek-frozen-yogurt';
COMMIT;

-- 27. peanut-butter-banana-greek-frozen-yogurt: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'peanut-butter-banana-greek-frozen-yogurt';
COMMIT;

-- 28. peanut-butter-chocolate-greek-frozen-yogurt: +peanut butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'creamy peanut butter', '3', 'tablespoon', 'swirl', 5
FROM recipes WHERE slug = 'peanut-butter-chocolate-greek-frozen-yogurt';
COMMIT;

-- 29. pink-peppercorn-strawberry: +pink peppercorns
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pink peppercorns, lightly crushed', '1/2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'pink-peppercorn-strawberry-ice-cream';
COMMIT;

-- 30. pistachio-chocolate-chip-gelato: +actual chips
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dark chocolate chips', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'pistachio-chocolate-chip-gelato';
COMMIT;

-- 31. pistachio-lemon-cream: +pistachio
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'pistachio paste', '2', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'pistachio-lemon-cream-ice-cream';
COMMIT;

-- 32. pistachio-rose-water: +rose water
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'rose water', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'pistachio-rose-water-ice-cream';
COMMIT;

-- 33. salted-caramel-greek-frozen-yogurt: +salt
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'flaky sea salt', '1/4', 'teaspoon', 'base', 5
FROM recipes WHERE slug = 'salted-caramel-greek-frozen-yogurt';
COMMIT;

-- 34. salted-honey-butter-pecan: +salt + butter + pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('flaky sea salt', '1/2', 'teaspoon', 'base', 6),
  ('browned butter, cooled', '2', 'tablespoon', 'base', 7),
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'salted-honey-butter-pecan-ice-cream';
COMMIT;

-- 35. strawberry-banana-greek-frozen-yogurt: +banana
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'ripe banana, mashed', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'strawberry-banana-greek-frozen-yogurt';
COMMIT;

-- 36. strawberry-chocolate-truffle: +truffle pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'chocolate truffles, chopped', '1/4', 'cup', 'mix-ins', 7
FROM recipes WHERE slug = 'strawberry-chocolate-truffle-ice-cream';
COMMIT;

-- 37. strawberry-matcha: +matcha
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'matcha powder', '2', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'strawberry-matcha-ice-cream';
COMMIT;

-- 38. strawberry-mint-italian-ice: +mint
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'fresh mint leaves, chopped', '2', 'tablespoon', 'base', 4
FROM recipes WHERE slug = 'strawberry-mint-italian-ice';
COMMIT;

-- 39. strawberry-pecan-crumble: +pecans + crumble
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('toasted pecans, chopped', '1/4', 'cup', 'mix-ins', 6),
  ('oat streusel crumbles', '2', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-pecan-crumble-ice-cream';
COMMIT;

-- 40. vanilla-bean-greek-frozen-yogurt: +vanilla bean
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'vanilla bean, split and scraped', '1', NULL, 'base', 5
FROM recipes WHERE slug = 'vanilla-bean-greek-frozen-yogurt';
COMMIT;

-- 41. vanilla-lavender-shortbread: +lavender + shortbread + infusion
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('dried culinary lavender buds', '1', 'teaspoon', 'base', 6),
  ('shortbread cookies, crumbled', '1/3', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'vanilla-lavender-shortbread-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'vanilla-lavender-shortbread-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm milk and cream with lavender buds over medium-low heat until steaming. Steep 10 minutes off heat, strain, then whisk in sugar, vanilla, and condensed milk. Cool completely.',
  'Steep exactly 10 minutes — lavender over-steeping tastes like soap.',
  15
FROM recipes WHERE slug = 'vanilla-lavender-shortbread-ice-cream';
COMMIT;

-- 42. zabaglione-gelato: +egg yolks + tempering
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'egg yolks', '4', NULL, 'base', 5
FROM recipes WHERE slug = 'zabaglione-gelato';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'zabaglione-gelato')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Make the zabaglione custard: whisk egg yolks with sugar in a heatproof bowl set over simmering water. Slowly drizzle in Marsala wine while whisking constantly. Whisk for 5–7 minutes until the mixture triples in volume and holds a ribbon. Remove from heat, whisk in warm milk and cream, and cool completely.',
  'Traditional zabaglione is a warm Italian custard with Marsala — don''t rush the whisking or it will be thin. The ribbon stage means the mixture falls from the whisk in a slow, thick stream.',
  10
FROM recipes WHERE slug = 'zabaglione-gelato';
COMMIT;
