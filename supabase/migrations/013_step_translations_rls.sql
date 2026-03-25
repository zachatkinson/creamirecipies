-- Add public read access to step_translations table
-- (RLS was enabled but no SELECT policy existed, blocking anon key access)

ALTER TABLE IF EXISTS step_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read step_translations"
  ON step_translations
  FOR SELECT
  USING (true);

-- Also ensure recipe_translations has public read access
CREATE POLICY "Public read recipe_translations"
  ON recipe_translations
  FOR SELECT
  USING (true);
