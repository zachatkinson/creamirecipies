-- RPC function for filtered, paginated recipe queries
-- Handles category/model junction table joins server-side to avoid URL length limits

CREATE OR REPLACE FUNCTION get_filtered_recipe_ids(
  p_status TEXT DEFAULT 'published',
  p_base_types TEXT[] DEFAULT NULL,
  p_difficulties TEXT[] DEFAULT NULL,
  p_category_slugs TEXT[] DEFAULT NULL,
  p_model_slugs TEXT[] DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL,
  p_search_ids UUID[] DEFAULT NULL,
  p_sort TEXT DEFAULT 'newest',
  p_limit INT DEFAULT 24,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  recipe_id UUID,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cat_recipe_ids UUID[];
  model_recipe_ids UUID[];
BEGIN
  -- Resolve category filters via junction table
  IF p_category_slugs IS NOT NULL AND array_length(p_category_slugs, 1) > 0 THEN
    SELECT ARRAY(
      SELECT DISTINCT rc.recipe_id
      FROM recipe_categories rc
      JOIN categories c ON c.id = rc.category_id
      WHERE c.slug = ANY(p_category_slugs)
    ) INTO cat_recipe_ids;
  END IF;

  -- Resolve model filters via junction table
  IF p_model_slugs IS NOT NULL AND array_length(p_model_slugs, 1) > 0 THEN
    SELECT ARRAY(
      SELECT DISTINCT rm.recipe_id
      FROM recipe_models rm
      JOIN creami_models m ON m.id = rm.model_id
      WHERE m.slug = ANY(p_model_slugs)
    ) INTO model_recipe_ids;
  END IF;

  RETURN QUERY
  WITH filtered AS (
    SELECT r.id
    FROM recipes r
    WHERE r.status = p_status
      -- Base type filter
      AND (p_base_types IS NULL OR r.base_type = ANY(p_base_types))
      -- Difficulty filter
      AND (p_difficulties IS NULL OR r.difficulty = ANY(p_difficulties))
      -- Rating filter
      AND (p_min_rating IS NULL OR r.avg_rating >= p_min_rating)
      -- Search filter (pre-computed IDs from text search)
      AND (p_search_ids IS NULL OR r.id = ANY(p_search_ids))
      -- Category filter (junction table resolved above)
      AND (cat_recipe_ids IS NULL OR r.id = ANY(cat_recipe_ids))
      -- Model filter (junction table resolved above)
      AND (model_recipe_ids IS NULL OR r.id = ANY(model_recipe_ids))
  )
  SELECT f.id AS recipe_id,
         (SELECT COUNT(*) FROM filtered)::BIGINT AS total_count
  FROM filtered f
  ORDER BY
    CASE WHEN p_sort = 'rating' THEN (SELECT avg_rating FROM recipes WHERE id = f.id) END DESC NULLS LAST,
    CASE WHEN p_sort = 'reviews' THEN (SELECT rating_count FROM recipes WHERE id = f.id) END DESC NULLS LAST,
    CASE WHEN p_sort = 'prep-time' THEN (SELECT prep_time_minutes FROM recipes WHERE id = f.id) END ASC NULLS LAST,
    CASE WHEN p_sort = 'newest' OR p_sort IS NULL THEN (SELECT published_at FROM recipes WHERE id = f.id) END DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
