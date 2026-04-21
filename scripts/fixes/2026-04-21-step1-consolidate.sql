-- Step-1 consolidation — 2026-04-21 (follow-up)
--
-- Six recipes in the earlier DELETE group ended up with step 1 = prep, but no
-- step 2 that whisks the base together. The previous wording polish pointed
-- to "the next step" which does not exist. Fix: rewrite step 1 to contain
-- both the prep action AND the final whisk, so the base is fully ready to
-- pour when step 2 (pour + freeze) starts.

-- 1. pistachio-saffron-ice-cream — saffron bloom + whisk everything
UPDATE steps
SET instruction = 'Bloom the saffron: warm 2 tablespoons of the milk and the saffron threads over low heat for 1 minute, then steep 10 minutes off heat. Whisk the bloomed saffron (threads and all) with the pistachio paste, remaining milk, cream, sugar, and vanilla extract until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'pistachio-saffron-ice-cream')
  AND step_number = 1;

-- 2. brown-butter-cookie-dough-ice-cream — brown butter + whisk
UPDATE steps
SET instruction = 'Brown the butter: melt butter in a small saucepan over medium heat, swirling until it turns amber and smells nutty (about 3 minutes). Pour into a heatproof bowl (including the brown bits at the bottom) and cool to room temperature. Whisk the cooled brown butter with the cream, milk, sugar, and vanilla extract until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-cookie-dough-ice-cream')
  AND step_number = 1;

-- 3. vanilla-brown-butter-ice-cream — brown butter + whisk
UPDATE steps
SET instruction = 'Brown the butter: melt 3 tablespoons butter in a small saucepan over medium heat, swirling until amber and nutty-smelling (3 minutes). Pour into a heatproof bowl (including the brown bits) and cool to room temperature. Whisk the cooled brown butter with the cream, milk, sugar, vanilla extract, and sweetened condensed milk until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'vanilla-brown-butter-ice-cream')
  AND step_number = 1;

-- 4. brown-butter-sage-ice-cream — brown butter + sage infuse + whisk
UPDATE steps
SET instruction = 'Brown the butter and infuse the sage: melt butter over medium heat, swirling until amber and nutty-smelling (3 minutes). Off heat, drop in the sage leaves and steep for 10 minutes, then strain out the leaves. Cool the sage-infused brown butter to room temperature. Whisk it with the cream, milk, sugar, vanilla extract, and sweetened condensed milk until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'brown-butter-sage-ice-cream')
  AND step_number = 1;

-- 5. saffron-rose-ice-cream — saffron bloom + whisk
UPDATE steps
SET instruction = 'Warm 2 tablespoons of the milk with the saffron threads in a small saucepan over low heat for 1 minute. Remove from heat and let steep for 10 minutes to bloom the saffron. Whisk the bloomed saffron (threads and all) with the rose water, remaining milk, cream, sugar, and vanilla extract until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'saffron-rose-ice-cream')
  AND step_number = 1;

-- 6. persian-saffron-ice-cream — saffron bloom + whisk
UPDATE steps
SET instruction = 'Bloom the saffron: warm 2 tablespoons of the milk in a small saucepan over low heat. Add the saffron threads and steep 10 minutes off heat. Whisk the bloomed saffron (threads and all) with the rose water, sweetened condensed milk, remaining milk, cream, sugar, and vanilla extract until smooth and the sugar dissolves.'
WHERE recipe_id = (SELECT id FROM recipes WHERE slug = 'persian-saffron-ice-cream')
  AND step_number = 1;
