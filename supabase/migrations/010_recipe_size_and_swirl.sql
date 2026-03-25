-- Track recipe pint size and dispensing mode
ALTER TABLE recipes ADD COLUMN pint_size TEXT DEFAULT '16oz' CHECK (pint_size IN ('16oz', '24oz'));
ALTER TABLE recipes ADD COLUMN is_swirl_recipe BOOLEAN DEFAULT false;

-- Update existing recipes: default to 16oz, no swirl
-- (batch2 seed script should set these correctly for new recipes)

-- Create a view for easy model compatibility checking
CREATE OR REPLACE VIEW recipe_model_compatibility AS
SELECT
  r.id as recipe_id,
  r.title,
  r.pint_size,
  r.is_swirl_recipe,
  m.id as model_id,
  m.name as model_name,
  m.slug as model_slug,
  m.pint_size_oz,
  m.is_discontinued,
  CASE
    -- Swirl recipes only work on the Scoop & Swirl
    WHEN r.is_swirl_recipe AND m.slug != 'swirl' THEN false
    -- 24oz recipes only fit in 24oz models
    WHEN r.pint_size = '24oz' AND m.pint_size_oz = 16 THEN false
    -- Everything else is compatible
    ELSE true
  END as is_compatible,
  CASE
    WHEN r.is_swirl_recipe AND m.slug != 'swirl' THEN 'Requires Scoop & Swirl for dispensing'
    WHEN r.pint_size = '24oz' AND m.pint_size_oz = 16 THEN 'Recipe is 24oz — scale to 2/3 for 16oz models'
    ELSE NULL
  END as compatibility_note
FROM recipes r
CROSS JOIN creami_models m;
