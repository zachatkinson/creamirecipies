-- Add Amazon ASIN column to master_ingredients for affiliate links
ALTER TABLE master_ingredients ADD COLUMN IF NOT EXISTS amazon_asin TEXT;

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_master_ingredients_asin ON master_ingredients(amazon_asin) WHERE amazon_asin IS NOT NULL;
