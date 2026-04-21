-- Phase 2d: backfill master_ingredient_id on any unlinked ingredient row whose
-- name matches an existing master_ingredients entry (by canonical name or alias).
-- Most of these are rows I inserted during the recipe audit without setting
-- master_ingredient_id — the master rows already exist.

-- Match by exact canonical name
UPDATE ingredients i SET master_ingredient_id = m.id
FROM master_ingredients m
WHERE LOWER(i.name) = LOWER(m.name) AND i.master_ingredient_id IS NULL;

-- Match by alias
UPDATE ingredients i SET master_ingredient_id = m.id
FROM master_ingredients m
WHERE i.master_ingredient_id IS NULL
  AND LOWER(i.name) = ANY(SELECT LOWER(unnest(m.aliases)));
