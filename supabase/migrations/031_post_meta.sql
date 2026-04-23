-- =============================================
-- Per-locale SEO meta for blog posts
-- =============================================
-- Parity with recipes (migration 030). Without these columns, blog pages use
-- title + excerpt as their <title> / description — acceptable but not tuned
-- for CTR. Per-locale meta lets non-EN pages match the rendered language.
--
-- Nullable so existing rows stay valid. Rendering layer prefers locale meta
-- -> falls back to posts.meta_* -> falls back to title / excerpt.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;

ALTER TABLE post_translations ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE post_translations ADD COLUMN IF NOT EXISTS meta_description TEXT;
