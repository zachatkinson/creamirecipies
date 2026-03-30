-- Anonymous ratings table (no auth required)
CREATE TABLE anonymous_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One rating per recipe per IP
CREATE UNIQUE INDEX idx_anon_ratings_recipe_ip ON anonymous_ratings(recipe_id, ip_hash);
CREATE INDEX idx_anon_ratings_recipe ON anonymous_ratings(recipe_id);

-- RLS: anyone can insert, no one can read raw data
ALTER TABLE anonymous_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can rate" ON anonymous_ratings
  FOR INSERT WITH CHECK (true);

-- Trigger: update recipes.avg_rating and rating_count from BOTH tables
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
DECLARE
  auth_avg NUMERIC;
  auth_count INT;
  anon_avg NUMERIC;
  anon_count INT;
  combined_avg NUMERIC;
  combined_count INT;
  target_recipe_id UUID;
BEGIN
  target_recipe_id := COALESCE(NEW.recipe_id, OLD.recipe_id);

  -- Authenticated reviews
  SELECT COALESCE(AVG(rating), 0), COUNT(*) INTO auth_avg, auth_count
  FROM reviews WHERE recipe_id = target_recipe_id;

  -- Anonymous ratings
  SELECT COALESCE(AVG(rating), 0), COUNT(*) INTO anon_avg, anon_count
  FROM anonymous_ratings WHERE recipe_id = target_recipe_id;

  combined_count := auth_count + anon_count;
  IF combined_count > 0 THEN
    combined_avg := ((auth_avg * auth_count) + (anon_avg * anon_count)) / combined_count;
  ELSE
    combined_avg := 0;
  END IF;

  UPDATE recipes SET
    avg_rating = ROUND(combined_avg::NUMERIC, 2),
    rating_count = combined_count,
    updated_at = now()
  WHERE id = target_recipe_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on anonymous_ratings
CREATE TRIGGER trigger_anon_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON anonymous_ratings
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

-- Ensure the existing reviews trigger also uses the updated function
DROP TRIGGER IF EXISTS trigger_review_update ON reviews;
CREATE TRIGGER trigger_review_update
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();
