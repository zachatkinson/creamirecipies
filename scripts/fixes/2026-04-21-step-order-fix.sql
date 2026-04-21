-- Step-order fix — 2026-04-21
--
-- Bug I introduced in the recipe audit: when adding an infusion/roasting/toasting
-- step to a recipe, I inserted it as step 2, leaving the original "Whisk all
-- base ingredients together" as step 1. That order is wrong — the prep has to
-- happen first, not after.
--
-- Two repair patterns:
--   DELETE — for infusion/custard/brown-butter recipes, the inserted step 2
--     already describes the full base prep (e.g. "warm the milk + cream with
--     lavender... strain... whisk in sugar and vanilla... cool"), so the
--     "whisk all base ingredients" step 1 is redundant. Delete it and
--     renumber the remaining steps down by 1.
--   SWAP — for recipes whose step 2 toasts a mix-in ingredient (nuts, oats,
--     seeds, shredded coconut), base still needs a separate whisk-together
--     step. Swap steps 1 and 2.

-- ============================================================================
-- DELETE GROUP — 26 recipes where step 2 fully describes the base prep
-- ============================================================================
DO $$
DECLARE
  slugs TEXT[] := ARRAY[
    'vanilla-lavender-shortbread-ice-cream',
    'coconut-lime-leaf-ice-cream',
    'peach-lavender-honey-ice-cream',
    'lemon-lavender-cookie-ice-cream',
    'coconut-lavender-ice-cream',
    'blackberry-sage-cream-ice-cream',
    'pistachio-saffron-ice-cream',
    'london-fog-earl-grey-ice-cream',
    'lavender-earl-grey-ice-cream',
    'blueberry-lavender-ice-cream',
    'mango-basil-gelato',
    'brown-butter-cookie-dough-ice-cream',
    'vanilla-brown-butter-ice-cream',
    'white-chocolate-lavender-ice-cream',
    'lemon-basil-gelato',
    'blackberry-sage-honey-ice-cream',
    'brown-butter-sage-ice-cream',
    'lavender-blueberry-cream-ice-cream',
    'lavender-honey-vanilla-ice-cream',
    'lavender-lemon-cream-ice-cream',
    'saffron-rose-ice-cream',
    'persian-saffron-ice-cream',
    'strawberry-basil-gelato',
    'brown-butter-sage-pecan-ice-cream',
    'crema-gelato',
    'zabaglione-gelato'
  ];
  s TEXT;
  rid UUID;
BEGIN
  FOREACH s IN ARRAY slugs LOOP
    SELECT id INTO rid FROM recipes WHERE recipes.slug = s;
    IF rid IS NULL THEN
      RAISE WARNING 'Slug not found: %', s;
      CONTINUE;
    END IF;
    -- Delete the redundant "Whisk all base ingredients" step 1
    DELETE FROM steps WHERE recipe_id = rid AND step_number = 1;
    -- Shift remaining steps down by 1 (2→1, 3→2, 4→3, 5→4)
    UPDATE steps SET step_number = step_number - 1
    WHERE recipe_id = rid AND step_number > 1;
  END LOOP;
END $$;

-- ============================================================================
-- SWAP GROUP — 9 recipes where step 2 toasts a mix-in; base still needs whisk
-- ============================================================================
DO $$
DECLARE
  slugs TEXT[] := ARRAY[
    'toasted-oat-honey-ice-cream',
    'roasted-almond-fudge-ice-cream',
    'toasted-almond-coconut-ice-cream',
    'toasted-almond-honey-ice-cream',
    'toasted-sesame-honey-ice-cream',
    'toasted-sesame-ice-cream',
    'toasted-oat-brown-sugar-ice-cream',
    'coconut-macaroon-ice-cream',
    'toasted-coconut-cream-ice-cream'
  ];
  s TEXT;
  rid UUID;
BEGIN
  FOREACH s IN ARRAY slugs LOOP
    SELECT id INTO rid FROM recipes WHERE recipes.slug = s;
    IF rid IS NULL THEN
      RAISE WARNING 'Slug not found: %', s;
      CONTINUE;
    END IF;
    -- Swap step_number: 1↔2 via temporary negative value
    UPDATE steps SET step_number = -1 WHERE recipe_id = rid AND step_number = 1;
    UPDATE steps SET step_number = 1  WHERE recipe_id = rid AND step_number = 2;
    UPDATE steps SET step_number = 2  WHERE recipe_id = rid AND step_number = -1;
  END LOOP;
END $$;
