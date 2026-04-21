-- Step-1 wording polish — 2026-04-21
--
-- After the earlier step-order fix moved prep steps to step 1, the wording in
-- 7 recipes still contained forward-looking phrases ("into the base", "into
-- the cooling base", "into the rest of the base") that assumed a prior base
-- had been prepared. With the prep now in step 1, those phrases are confusing.
-- Fix: reword each to refer to the next step instead, OR remove the trailing
-- cross-reference entirely (step 2 handles the whisk).

-- 1. pistachio-saffron-ice-cream — step 1 references "the rest of the base"
UPDATE steps
SET instruction = 'Bloom the saffron: warm 2 tablespoons of the milk and saffron threads over low heat for 1 minute, then steep 10 minutes off heat. Set aside with the pistachio paste — you will whisk this into the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'pistachio-saffron-ice-cream')
  AND step_number = 1;

-- 2. roasted-banana-walnut-ice-cream
UPDATE steps
SET instruction = 'Roast the bananas: preheat oven to 400°F (200°C). Place halved bananas (skin-on) on a parchment-lined tray and roast for 15 minutes until the skin is blackened and the flesh is caramelized. Cool slightly, scoop out the flesh, and mash smooth. Set aside — you will whisk the mashed banana with the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'roasted-banana-walnut-ice-cream')
  AND step_number = 1;

-- 3. brown-butter-cookie-dough-ice-cream
UPDATE steps
SET instruction = 'Brown the butter: melt butter in a small saucepan over medium heat, swirling until it turns amber and smells nutty (about 3 minutes). Pour into a heatproof bowl (including the brown bits at the bottom) and cool to room temperature. The cooled brown butter gets whisked in with the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-cookie-dough-ice-cream')
  AND step_number = 1;

-- 4. vanilla-brown-butter-ice-cream
UPDATE steps
SET instruction = 'Brown the butter: melt 3 tablespoons butter in a small saucepan over medium heat, swirling until amber and nutty-smelling (3 minutes). Pour into a heatproof bowl, cool to room temperature. The cooled brown butter gets whisked in with the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'vanilla-brown-butter-ice-cream')
  AND step_number = 1;

-- 5. brown-butter-sage-ice-cream
UPDATE steps
SET instruction = 'Brown the butter and infuse the sage: melt butter over medium heat, swirling until amber and nutty-smelling (3 minutes). Drop in sage leaves off heat, steep 10 minutes, then strain out the leaves. Cool to room temperature. The sage-infused brown butter gets whisked in with the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-sage-ice-cream')
  AND step_number = 1;

-- 6. saffron-rose-ice-cream
UPDATE steps
SET instruction = 'Warm 2 tablespoons of the milk with the saffron threads in a small saucepan over low heat for 1 minute. Remove from heat and let steep for 10 minutes to bloom the saffron. Set aside with the rose water — you will whisk both into the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'saffron-rose-ice-cream')
  AND step_number = 1;

-- 7. persian-saffron-ice-cream
UPDATE steps
SET instruction = 'Bloom the saffron: warm 2 tablespoons of the milk in a small saucepan over low heat. Add saffron threads and steep 10 minutes off heat. Set aside (threads and all) with the rose water — you will whisk both into the other base ingredients in the next step.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'persian-saffron-ice-cream')
  AND step_number = 1;
