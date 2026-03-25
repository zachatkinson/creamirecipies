-- =============================================
-- CONTENT DRIP SCHEDULING
-- =============================================
-- Adds scheduled publishing support for gradual content release.
-- Recipes with scheduled_publish_at will auto-publish when a cron
-- job or edge function runs the publish-scheduled script.

ALTER TABLE recipes
  ADD COLUMN scheduled_publish_at TIMESTAMPTZ;

-- Index for efficient cron queries: find drafts ready to publish
CREATE INDEX idx_recipes_scheduled_publish
  ON recipes (scheduled_publish_at)
  WHERE status = 'draft' AND scheduled_publish_at IS NOT NULL;
