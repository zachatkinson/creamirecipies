-- =============================================
-- Per-locale SEO meta for recipes
-- =============================================
-- recipes.meta_title / meta_description exist but are EN-only. International
-- pages need locale-specific meta or Google serves the EN copy to non-EN users
-- (or falls back to generated text from recipe title/description).
--
-- Nullable columns so existing rows remain valid until backfilled. Rendering
-- layer prefers locale meta -> falls back to recipes.meta_* -> falls back to
-- a generated string from recipe_translations.title / .description.

ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE recipe_translations ADD COLUMN IF NOT EXISTS meta_description TEXT;
