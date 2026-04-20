-- Recipe audit batch 3 — fixes for published recipes flagged during the full
-- 119-recipe review. Only 2 recipes needed adjustment.

-- 1. banana-split-frozen-yogurt: title promises the banana-split treatment
--    (banana + strawberry + chocolate + pineapple) but only has a plain
--    banana-yogurt base. Add the split components as swirls + mix-in.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, name, amount, unit, group_name, sort_order FROM recipes, (VALUES
  ('strawberry jam', '2', 'tablespoon', 'swirl', 5),
  ('chocolate sauce', '2', 'tablespoon', 'swirl', 6),
  ('crushed pineapple, drained', '3', 'tablespoon', 'mix-ins', 7)
) AS v(name, amount, unit, group_name, sort_order)
WHERE slug = 'banana-split-frozen-yogurt';
COMMIT;

-- 2. frozen-yogurt-with-mixed-berries: title says "with mixed berries" —
--    add actual frozen mixed berries as a mix-in alongside the existing jam.
BEGIN;
INSERT INTO ingredients (recipe_id, name, amount, unit, group_name, sort_order)
SELECT id, 'frozen mixed berries, partially thawed', '1/3', 'cup', 'mix-ins', 5
FROM recipes WHERE slug = 'frozen-yogurt-with-mixed-berries';
COMMIT;
