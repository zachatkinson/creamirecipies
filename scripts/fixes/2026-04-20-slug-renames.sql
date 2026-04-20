-- Slug renames + redirect rows — 2026-04-20
--
-- The recipe_slug_redirects table (migration 029) is in place, and
-- src/pages/recipes/[slug].astro emits a 301 when the requested slug matches
-- an old_slug. Order matters: insert the redirect row FIRST so that if the
-- rename commits before a crawler re-hits the old URL, the redirect is
-- already live. Using transactions ensures all-or-nothing.

BEGIN;

-- 1. aai-berry-sorbet -> acai-berry-sorbet
--    Slug lost the 'c' when 'açai' was ASCII-stripped during ingestion.
INSERT INTO recipe_slug_redirects (old_slug, new_slug)
VALUES ('aai-berry-sorbet', 'acai-berry-sorbet')
ON CONFLICT (old_slug) DO NOTHING;

UPDATE recipes
SET slug = 'acai-berry-sorbet',
    updated_at = now()
WHERE slug = 'aai-berry-sorbet';

COMMIT;


BEGIN;

-- 2. strawberry-jalapeo-ice-cream -> strawberry-jalapeno-ice-cream
--    Slug lost the 'n' when 'jalapeño' was ASCII-stripped.
INSERT INTO recipe_slug_redirects (old_slug, new_slug)
VALUES ('strawberry-jalapeo-ice-cream', 'strawberry-jalapeno-ice-cream')
ON CONFLICT (old_slug) DO NOTHING;

UPDATE recipes
SET slug = 'strawberry-jalapeno-ice-cream',
    updated_at = now()
WHERE slug = 'strawberry-jalapeo-ice-cream';

COMMIT;


-- Verification queries:
-- SELECT * FROM recipe_slug_redirects ORDER BY created_at DESC;
-- SELECT slug, status FROM recipes WHERE slug IN (
--   'acai-berry-sorbet', 'strawberry-jalapeno-ice-cream'
-- );
