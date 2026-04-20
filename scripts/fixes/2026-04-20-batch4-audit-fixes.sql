-- Recipe audit batch 4 — 14 fixes for drafts publishing 2026-05-20 → 2026-06-02

-- 1. dark-chocolate-cherry-cordial-ice-cream: "cordial" implies liqueur-soaked cherries
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('kirsch (cherry brandy)', '2', 'teaspoon', 'base', 7),
  ('maraschino cherries, chopped', '1/4', 'cup', 'mix-ins', 8)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'dark-chocolate-cherry-cordial-ice-cream';
COMMIT;

-- 2. honey-bee-pollen-ice-cream: missing bee pollen
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'bee pollen granules', '1', 'tablespoon', 'mix-ins', 6
FROM recipes WHERE slug = 'honey-bee-pollen-ice-cream';
COMMIT;

-- 3. honeycomb-crunch-ice-cream: missing honeycomb candy pieces
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'honeycomb candy, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'honeycomb-crunch-ice-cream';
COMMIT;

-- 4. lavender-honey-vanilla-ice-cream: missing lavender. Add dried buds + infusion step.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'dried culinary lavender buds', '1', 'teaspoon', 'base', 6
FROM recipes WHERE slug = 'lavender-honey-vanilla-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'lavender-honey-vanilla-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Warm the milk and honey with the lavender buds over medium-low heat until steaming (do not boil). Remove from heat, cover, and steep for 10 minutes. Strain out the lavender, then whisk in the cream, sugar, and vanilla. Cool completely before pouring into the pint.',
  'Honey dissolves faster into warm milk than cold — let it come to steaming with the milk to save whisking later.',
  15
FROM recipes WHERE slug = 'lavender-honey-vanilla-ice-cream';
COMMIT;

-- 5. mascarpone-honey-gelato: missing honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'wildflower honey', '3', 'tablespoon', 'base', 5
FROM recipes WHERE slug = 'mascarpone-honey-gelato';
COMMIT;

-- 6. matcha-almond-butter-ice-cream: missing almond butter
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'creamy almond butter', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'matcha-almond-butter-ice-cream';
COMMIT;

-- 7. peanut-butter-honey-ice-cream: missing honey
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'honey', '3', 'tablespoon', 'base', 6
FROM recipes WHERE slug = 'peanut-butter-honey-ice-cream';
COMMIT;

-- 8. roasted-cherry-vanilla-ice-cream: no roasting. Swap puree for fresh cherries + roast step.
BEGIN;
UPDATE ingredients
SET name = 'fresh cherries, pitted and halved', amount = '1', unit = 'cup'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-cherry-vanilla-ice-cream')
  AND name = 'cherry puree';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-cherry-vanilla-ice-cream');

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 1,
  'Roast the cherries: preheat oven to 400°F (200°C). Toss pitted halved cherries with 1 teaspoon of the granulated sugar on a parchment-lined tray and roast for 20 minutes until jammy. Cool completely, then blend into a smooth puree. You should have about 1/3 cup.',
  'Roasting concentrates the cherry flavor and brings out an almost wine-like depth you cannot get from raw fruit.',
  25
FROM recipes WHERE slug = 'roasted-cherry-vanilla-ice-cream';
COMMIT;

-- 9. rosewater-pistachio-crunch-ice-cream: missing rose water + no "crunch" element
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('rose water', '1', 'teaspoon', 'base', 6),
  ('crushed pistachios', '3', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'rosewater-pistachio-crunch-ice-cream';
COMMIT;

-- 10. strawberry-almond-butter-ice-cream: missing almond butter (desc says "almond butter swirl")
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'creamy almond butter', '3', 'tablespoon', 'swirl', 6
FROM recipes WHERE slug = 'strawberry-almond-butter-ice-cream';
COMMIT;

-- 11. strawberry-pecan-ice-cream: missing pecans
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted pecans, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'strawberry-pecan-ice-cream';
COMMIT;

-- 12. strawberry-rhubarb-ice-cream: missing rhubarb + crumble (description says "crumble")
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('stewed rhubarb compote', '1/3', 'cup', 'swirl', 6),
  ('oat streusel crumbles', '1/4', 'cup', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'strawberry-rhubarb-ice-cream';
COMMIT;

-- 13. strawberry-walnut-ice-cream: missing walnuts (desc says "toasted walnut pieces")
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted walnuts, chopped', '1/3', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'strawberry-walnut-ice-cream';
COMMIT;

-- 14. toasted-almond-honey-ice-cream: no almonds, no toasting step
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'toasted sliced almonds', '1/4', 'cup', 'mix-ins', 6
FROM recipes WHERE slug = 'toasted-almond-honey-ice-cream';

UPDATE steps SET step_number = step_number + 1
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'toasted-almond-honey-ice-cream')
  AND step_number >= 2;

INSERT INTO steps (recipe_id, step_number, instruction, hint, duration_minutes)
SELECT id, 2,
  'Toast the almonds: spread sliced almonds in a dry skillet over medium heat, stirring constantly, for 3–4 minutes until golden and fragrant. Transfer to a plate to cool completely.',
  'Sliced almonds go from golden to burnt in 30 seconds. Pull them off heat slightly early — residual heat keeps toasting them on the plate.',
  5
FROM recipes WHERE slug = 'toasted-almond-honey-ice-cream';
COMMIT;
