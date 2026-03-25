-- =============================================
-- MASTER INGREDIENTS (canonical ingredient database)
-- =============================================
CREATE TABLE master_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,                    -- canonical name: "heavy cream"
  slug TEXT UNIQUE NOT NULL,
  aliases TEXT[] DEFAULT '{}',                  -- alternate names: {"heavy whipping cream", "whipping cream"}
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN (
    'dairy', 'milk', 'cream', 'cheese',
    'sweetener', 'sugar',
    'flour', 'grain',
    'fruit', 'vegetable',
    'nut', 'seed',
    'chocolate', 'cocoa',
    'extract', 'spice', 'seasoning',
    'oil', 'fat',
    'protein_powder', 'supplement',
    'frozen', 'canned',
    'condiment', 'sauce',
    'other'
  )),
  -- Allergens (common top 9 allergens)
  allergens TEXT[] DEFAULT '{}',                -- {"dairy", "gluten", "nuts", "peanuts", "soy", "eggs", "shellfish", "fish", "sesame"}
  -- Nutrition per 100g (USDA standard)
  calories_per_100g NUMERIC(7,2),
  protein_per_100g NUMERIC(7,2),
  fat_per_100g NUMERIC(7,2),
  carbs_per_100g NUMERIC(7,2),
  fiber_per_100g NUMERIC(7,2),
  sugar_per_100g NUMERIC(7,2),
  -- Flags
  is_dairy_free BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT true,
  is_keto_friendly BOOLEAN DEFAULT false,
  -- Metadata
  image_url TEXT,
  description TEXT,
  purchase_url TEXT,                             -- Amazon affiliate or buy link
  purchase_label TEXT,                           -- e.g. "Buy on Amazon"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_master_ingredients_slug ON master_ingredients(slug);
CREATE INDEX idx_master_ingredients_name ON master_ingredients(name);
CREATE INDEX idx_master_ingredients_category ON master_ingredients(category);

-- Text search on name (simple trigram index for fuzzy matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_master_ingredients_trgm ON master_ingredients USING gin(name gin_trgm_ops);

-- RLS
ALTER TABLE master_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Master ingredients are publicly readable" ON master_ingredients FOR SELECT USING (true);
CREATE POLICY "Admins can manage master ingredients" ON master_ingredients FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- ADD purchase URLs to creami_models
-- =============================================
ALTER TABLE creami_models ADD COLUMN purchase_url TEXT;
ALTER TABLE creami_models ADD COLUMN purchase_label TEXT DEFAULT 'Buy on Amazon';
ALTER TABLE creami_models ADD COLUMN image_url TEXT;

-- =============================================
-- ACCESSORIES (pint containers, lids, tools, etc.)
-- =============================================
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('container', 'lid', 'tool', 'storage', 'book', 'other')),
  purchase_url TEXT,
  purchase_label TEXT DEFAULT 'Buy on Amazon',
  image_url TEXT,
  price_cents INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accessories are publicly readable" ON accessories FOR SELECT USING (true);
CREATE POLICY "Admins can manage accessories" ON accessories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed common accessories
INSERT INTO accessories (name, slug, description, category) VALUES
  ('Extra Ninja Creami Pint Containers (4-pack)', 'extra-pint-containers', 'Extra pint containers so you can have multiple flavors freezing at once.', 'container'),
  ('Ninja Creami Deluxe 24oz Containers', 'deluxe-containers', 'Larger 24oz containers for the Deluxe models.', 'container'),
  ('Ninja Creami Lids', 'creami-lids', 'Replacement lids for Ninja Creami pint containers.', 'lid'),
  ('Ice Cream Scoop', 'ice-cream-scoop', 'Heavy-duty ice cream scoop for serving Creami treats.', 'tool'),
  ('Silicone Spatula Set', 'silicone-spatula', 'Flexible silicone spatulas for mixing bases and scraping pints clean.', 'tool'),
  ('Kitchen Scale', 'kitchen-scale', 'Digital kitchen scale for precise ingredient measurements.', 'tool'),
  ('Pint Storage Sleeve', 'pint-sleeve', 'Insulated sleeve to keep pints cold while serving.', 'storage');

-- =============================================
-- ADD master_ingredient_id reference to ingredients table
-- =============================================
ALTER TABLE ingredients ADD COLUMN master_ingredient_id UUID REFERENCES master_ingredients(id) ON DELETE SET NULL;
CREATE INDEX idx_ingredients_master ON ingredients(master_ingredient_id);

-- =============================================
-- SEED: Common Creami ingredients
-- =============================================
INSERT INTO master_ingredients (name, slug, aliases, category, allergens, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, sugar_per_100g, is_dairy_free, is_vegan, is_gluten_free, is_keto_friendly) VALUES
-- Dairy
('heavy cream', 'heavy-cream', '{"heavy whipping cream","whipping cream","double cream"}', 'cream', '{"dairy"}', 340, 2.05, 36.08, 2.74, 2.74, false, false, true, true),
('whole milk', 'whole-milk', '{"full fat milk","vitamin D milk"}', 'milk', '{"dairy"}', 61, 3.15, 3.25, 4.78, 5.05, false, false, true, false),
('half and half', 'half-and-half', '{"half & half"}', 'cream', '{"dairy"}', 130, 2.96, 11.50, 4.30, 4.30, false, false, true, true),
('cream cheese', 'cream-cheese', '{"neufchatel"}', 'cheese', '{"dairy"}', 342, 5.93, 34.24, 4.07, 3.21, false, false, true, true),
('sweetened condensed milk', 'sweetened-condensed-milk', '{"condensed milk"}', 'dairy', '{"dairy"}', 321, 7.91, 8.70, 54.40, 54.40, false, false, true, false),
('plain Greek yogurt', 'greek-yogurt', '{"Greek yogurt","plain yogurt","strained yogurt"}', 'dairy', '{"dairy"}', 59, 10.19, 0.39, 3.60, 3.24, false, false, true, false),
('cottage cheese', 'cottage-cheese', '{}', 'cheese', '{"dairy"}', 98, 11.12, 4.30, 3.38, 2.67, false, false, true, true),

-- Plant milks
('unsweetened almond milk', 'almond-milk', '{"almond milk","almond beverage"}', 'milk', '{"nuts"}', 15, 0.59, 1.10, 0.58, 0.00, true, true, true, true),
('coconut milk (canned)', 'coconut-milk-canned', '{"full fat coconut milk","coconut cream"}', 'milk', '{}', 197, 2.02, 21.33, 2.81, 1.14, true, true, true, true),
('oat milk', 'oat-milk', '{"oat beverage"}', 'milk', '{"gluten"}', 43, 1.00, 1.50, 7.00, 4.00, true, true, false, false),

-- Sweeteners
('granulated sugar', 'granulated-sugar', '{"white sugar","cane sugar","table sugar"}', 'sweetener', '{}', 387, 0, 0, 99.98, 99.98, true, true, true, false),
('brown sugar', 'brown-sugar', '{"light brown sugar","dark brown sugar"}', 'sweetener', '{}', 380, 0, 0, 98.09, 97.02, true, true, true, false),
('honey', 'honey', '{"raw honey","clover honey"}', 'sweetener', '{}', 304, 0.30, 0, 82.40, 82.12, true, false, true, false),
('maple syrup', 'maple-syrup', '{"pure maple syrup"}', 'sweetener', '{}', 260, 0.04, 0.06, 67.04, 60.46, true, true, true, false),
('allulose', 'allulose', '{"D-allulose","rare sugar"}', 'sweetener', '{}', 20, 0, 0, 100, 0, true, true, true, true),
('agave nectar', 'agave-nectar', '{"agave syrup","agave"}', 'sweetener', '{}', 310, 0, 0, 76.00, 68.00, true, true, true, false),
('stevia', 'stevia', '{"stevia extract"}', 'sweetener', '{}', 0, 0, 0, 0, 0, true, true, true, true),

-- Extracts & Flavorings
('vanilla extract', 'vanilla-extract', '{"pure vanilla extract","vanilla"}', 'extract', '{}', 288, 0.06, 0.06, 12.65, 12.65, true, true, true, true),
('vanilla bean paste', 'vanilla-bean-paste', '{"vanilla paste"}', 'extract', '{}', 288, 0.06, 0.06, 12.65, 12.65, true, true, true, true),
('vanilla bean', 'vanilla-bean', '{"vanilla pod"}', 'extract', '{}', 288, 0.06, 0.06, 12.65, 12.65, true, true, true, true),
('peppermint extract', 'peppermint-extract', '{"mint extract"}', 'extract', '{}', 0, 0, 0, 0, 0, true, true, true, true),
('almond extract', 'almond-extract', '{}', 'extract', '{"nuts"}', 0, 0, 0, 0, 0, true, true, true, true),
('instant espresso powder', 'instant-espresso', '{"espresso powder","instant coffee"}', 'spice', '{}', 2, 0.12, 0, 0.36, 0, true, true, true, true),
('matcha powder', 'matcha-powder', '{"green tea powder","matcha"}', 'spice', '{}', 324, 30.60, 5.30, 38.90, 0, true, true, true, true),

-- Chocolate & Cocoa
('cocoa powder', 'cocoa-powder', '{"unsweetened cocoa","Dutch process cocoa","cacao powder"}', 'cocoa', '{}', 228, 19.60, 13.70, 57.90, 1.75, true, true, true, true),
('mini chocolate chips', 'mini-chocolate-chips', '{"chocolate chips","mini chips"}', 'chocolate', '{"dairy"}', 502, 4.88, 29.22, 59.40, 47.90, false, false, true, false),
('dark chocolate chips', 'dark-chocolate-chips', '{"dark chocolate"}', 'chocolate', '{}', 546, 5.54, 31.28, 62.34, 47.56, true, true, true, false),
('white chocolate chips', 'white-chocolate-chips', '{"white chocolate"}', 'chocolate', '{"dairy"}', 539, 5.87, 32.09, 59.24, 59.00, false, false, true, false),
('caramel sauce', 'caramel-sauce', '{"caramel syrup","caramel topping"}', 'sauce', '{"dairy"}', 270, 1.00, 4.00, 58.00, 48.00, false, false, true, false),

-- Fruits
('fresh strawberries', 'fresh-strawberries', '{"strawberries"}', 'fruit', '{}', 32, 0.67, 0.30, 7.68, 4.89, true, true, true, true),
('frozen mango chunks', 'frozen-mango', '{"mango chunks","mango","frozen mango"}', 'frozen', '{}', 60, 0.82, 0.38, 14.98, 13.66, true, true, true, false),
('ripe banana', 'banana', '{"banana","ripe bananas"}', 'fruit', '{}', 89, 1.09, 0.33, 22.84, 12.23, true, true, true, false),
('fresh raspberries', 'raspberries', '{"raspberries","frozen raspberries"}', 'fruit', '{}', 52, 1.20, 0.65, 11.94, 4.42, true, true, true, true),
('ripe peaches', 'peaches', '{"peaches","peach slices","frozen peaches"}', 'fruit', '{}', 39, 0.91, 0.25, 9.54, 8.39, true, true, true, false),
('frozen pineapple chunks', 'pineapple', '{"pineapple","pineapple chunks"}', 'frozen', '{}', 50, 0.54, 0.12, 13.12, 9.85, true, true, true, false),
('fresh lemon juice', 'lemon-juice', '{"lemon juice"}', 'fruit', '{}', 22, 0.35, 0.24, 6.90, 2.52, true, true, true, true),
('lime juice', 'lime-juice', '{"fresh lime juice"}', 'fruit', '{}', 25, 0.42, 0.07, 8.42, 1.69, true, true, true, true),
('lemon zest', 'lemon-zest', '{}', 'fruit', '{}', 47, 1.50, 0.30, 16.00, 4.17, true, true, true, true),

-- Nuts & Nut Butters
('creamy peanut butter', 'peanut-butter', '{"peanut butter","natural peanut butter"}', 'nut', '{"peanuts"}', 588, 25.09, 50.39, 19.56, 9.22, true, false, true, true),
('powdered peanut butter', 'powdered-peanut-butter', '{"PB2","peanut butter powder","PBfit"}', 'nut', '{"peanuts"}', 380, 42.00, 10.00, 32.00, 12.00, true, false, true, true),
('roasted pistachios', 'pistachios', '{"pistachios","pistachio nuts","roasted unsalted pistachios"}', 'nut', '{"nuts"}', 560, 20.16, 45.32, 27.17, 7.66, true, true, true, true),
('chopped walnuts', 'walnuts', '{"walnuts","walnut pieces"}', 'nut', '{"nuts"}', 654, 15.23, 65.21, 13.71, 2.61, true, true, true, true),

-- Protein Powders
('vanilla protein powder', 'vanilla-protein-powder', '{"vanilla whey protein","vanilla protein"}', 'protein_powder', '{"dairy"}', 375, 75.00, 3.57, 14.29, 3.57, false, false, true, true),
('chocolate protein powder', 'chocolate-protein-powder', '{"chocolate whey protein","chocolate protein"}', 'protein_powder', '{"dairy"}', 375, 71.43, 3.57, 17.86, 7.14, false, false, true, true),

-- Cookies & Mix-ins
('Oreo cookies', 'oreo-cookies', '{"Oreos","chocolate sandwich cookies"}', 'other', '{"gluten","dairy","soy"}', 437, 4.00, 18.00, 67.00, 36.00, false, false, false, false),
('mini peanut butter cups', 'mini-pb-cups', '{"peanut butter cups","Reeses minis"}', 'other', '{"peanuts","dairy","soy"}', 500, 10.00, 29.00, 56.00, 47.00, false, false, true, false),
('brownie bites', 'brownie-bites', '{"brownie pieces","brownie chunks"}', 'other', '{"gluten","dairy","eggs"}', 405, 4.73, 16.89, 60.81, 39.19, false, false, false, false),
('graham cracker crumbles', 'graham-cracker', '{"graham crackers","graham crumbs"}', 'other', '{"gluten"}', 430, 6.50, 10.10, 77.00, 30.00, false, false, false, false),
('toffee bits', 'toffee-bits', '{"heath bar bits","toffee pieces"}', 'other', '{"dairy","soy"}', 480, 1.00, 24.00, 68.00, 60.00, false, false, true, false),
('shredded coconut', 'shredded-coconut', '{"coconut flakes","desiccated coconut"}', 'other', '{}', 660, 6.88, 64.53, 23.65, 7.35, true, true, true, true),

-- Other
('coconut water', 'coconut-water', '{}', 'other', '{}', 19, 0.72, 0.20, 3.71, 2.61, true, true, true, true),
('coconut cream', 'coconut-cream', '{}', 'cream', '{}', 330, 3.63, 34.68, 4.18, 1.14, true, true, true, true),
('pineapple juice', 'pineapple-juice', '{}', 'other', '{}', 53, 0.36, 0.12, 12.87, 9.98, true, true, true, false),
('mixed berry jam', 'mixed-berry-jam', '{"berry jam","mixed berry preserves"}', 'condiment', '{}', 250, 0.30, 0.07, 65.00, 49.00, true, true, true, false),
('strawberry jam', 'strawberry-jam', '{"strawberry preserves","strawberry jelly"}', 'condiment', '{}', 250, 0.37, 0.07, 65.00, 49.00, true, true, true, false),
('salt', 'salt', '{"sea salt","kosher salt","table salt","pinch of salt"}', 'seasoning', '{}', 0, 0, 0, 0, 0, true, true, true, true),
('sea salt', 'sea-salt', '{"flaky sea salt","Maldon salt"}', 'seasoning', '{}', 0, 0, 0, 0, 0, true, true, true, true),
('cinnamon', 'cinnamon', '{"ground cinnamon"}', 'spice', '{}', 247, 3.99, 1.24, 80.59, 2.17, true, true, true, true),
('green food coloring', 'green-food-coloring', '{"food coloring"}', 'other', '{}', 0, 0, 0, 0, 0, true, true, true, true),
('water', 'water', '{"filtered water","cold water"}', 'other', '{}', 0, 0, 0, 0, 0, true, true, true, true),

-- Protein Shakes (pre-made)
('Fairlife chocolate protein shake', 'fairlife-chocolate-shake', '{"Fairlife shake","Fairlife chocolate"}', 'protein_powder', '{"dairy"}', 58, 5.22, 1.30, 5.22, 0.87, false, false, true, true);

-- =============================================
-- FUNCTION: Link existing recipe ingredients to master ingredients
-- =============================================
CREATE OR REPLACE FUNCTION link_ingredients_to_master()
RETURNS void AS $$
DECLARE
  ing RECORD;
  master_id UUID;
BEGIN
  FOR ing IN SELECT id, name FROM ingredients WHERE master_ingredient_id IS NULL LOOP
    -- Try exact match
    SELECT mi.id INTO master_id
    FROM master_ingredients mi
    WHERE lower(mi.name) = lower(trim(ing.name))
       OR lower(trim(ing.name)) = ANY(SELECT lower(unnest(mi.aliases)));

    IF master_id IS NOT NULL THEN
      UPDATE ingredients SET master_ingredient_id = master_id WHERE id = ing.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the linking function
SELECT link_ingredients_to_master();
