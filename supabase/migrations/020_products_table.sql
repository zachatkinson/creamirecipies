-- Products table for affiliate product cards
-- Stores product metadata so post bodies only need [product asin="..."]
CREATE TABLE IF NOT EXISTS products (
  asin TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product translations for name and description
CREATE TABLE IF NOT EXISTS product_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asin TEXT NOT NULL REFERENCES products(asin) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(asin, locale)
);

-- RLS: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Product translations are publicly readable" ON product_translations FOR SELECT USING (true);
