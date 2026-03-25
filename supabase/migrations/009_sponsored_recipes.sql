-- Sponsored recipe support
ALTER TABLE recipes ADD COLUMN is_sponsored BOOLEAN DEFAULT false;
ALTER TABLE recipes ADD COLUMN sponsor_name TEXT;
ALTER TABLE recipes ADD COLUMN sponsor_logo_url TEXT;
ALTER TABLE recipes ADD COLUMN sponsor_url TEXT;
ALTER TABLE recipes ADD COLUMN is_featured BOOLEAN DEFAULT false;
ALTER TABLE recipes ADD COLUMN featured_order INT;

-- Index for quick featured/sponsored queries
CREATE INDEX idx_recipes_sponsored ON recipes(is_sponsored) WHERE is_sponsored = true;
CREATE INDEX idx_recipes_featured ON recipes(is_featured, featured_order) WHERE is_featured = true;
