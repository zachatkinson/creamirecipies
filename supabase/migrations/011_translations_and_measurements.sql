-- =============================================
-- RECIPE TRANSLATIONS (per-locale content)
-- =============================================
CREATE TABLE recipe_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'fr', 'es')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  -- Steps and ingredients are stored as JSONB arrays for flexibility
  -- Steps: [{"instruction": "...", "hint": "..."}]
  -- Ingredients: [{"name": "...", "amount": "...", "unit": "..."}]
  steps JSONB,
  ingredients JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (recipe_id, locale)
);

CREATE INDEX idx_recipe_translations_recipe ON recipe_translations(recipe_id);
CREATE INDEX idx_recipe_translations_locale ON recipe_translations(locale);

ALTER TABLE recipe_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Translations are publicly readable" ON recipe_translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage translations" ON recipe_translations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- MEASUREMENT SYSTEM (unit conversions)
-- =============================================
CREATE TABLE measurement_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  us_unit TEXT NOT NULL,
  metric_unit TEXT NOT NULL,
  multiplier NUMERIC(10,4) NOT NULL,  -- multiply US amount by this to get metric
  display_format TEXT NOT NULL         -- e.g. "{amount} ml", "{amount} g"
);

INSERT INTO measurement_conversions (us_unit, metric_unit, multiplier, display_format) VALUES
-- Volume
('cup', 'ml', 240, '{amount} ml'),
('tablespoon', 'ml', 15, '{amount} ml'),
('teaspoon', 'ml', 5, '{amount} ml'),
('fl oz', 'ml', 29.5735, '{amount} ml'),
-- Weight
('oz', 'g', 28.3495, '{amount} g'),
('lb', 'g', 453.592, '{amount} g'),
-- Already metric
('ml', 'ml', 1, '{amount} ml'),
('g', 'g', 1, '{amount} g'),
-- Special
('pinch', 'pinch', 1, '{amount} pincée'),
('scoop', 'scoop', 1, '{amount} mesure'),
('drops', 'drops', 1, '{amount} gouttes');

ALTER TABLE measurement_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Measurements are publicly readable" ON measurement_conversions FOR SELECT USING (true);

-- =============================================
-- INGREDIENT TRANSLATIONS (master ingredient names per locale)
-- =============================================
ALTER TABLE master_ingredients ADD COLUMN name_fr TEXT;
ALTER TABLE master_ingredients ADD COLUMN name_es TEXT;

-- Translate common ingredients
UPDATE master_ingredients SET
  name_fr = CASE slug
    WHEN 'heavy-cream' THEN 'crème épaisse'
    WHEN 'whole-milk' THEN 'lait entier'
    WHEN 'granulated-sugar' THEN 'sucre en poudre'
    WHEN 'brown-sugar' THEN 'cassonade'
    WHEN 'vanilla-extract' THEN 'extrait de vanille'
    WHEN 'vanilla-bean' THEN 'gousse de vanille'
    WHEN 'salt' THEN 'sel'
    WHEN 'sea-salt' THEN 'sel de mer'
    WHEN 'cocoa-powder' THEN 'cacao en poudre'
    WHEN 'honey' THEN 'miel'
    WHEN 'cream-cheese' THEN 'fromage à la crème'
    WHEN 'greek-yogurt' THEN 'yaourt grec'
    WHEN 'almond-milk' THEN 'lait d''amande'
    WHEN 'coconut-milk-canned' THEN 'lait de coco'
    WHEN 'peanut-butter' THEN 'beurre de cacahuète'
    WHEN 'cinnamon' THEN 'cannelle'
    WHEN 'fresh-strawberries' THEN 'fraises fraîches'
    WHEN 'banana' THEN 'banane mûre'
    WHEN 'lemon-juice' THEN 'jus de citron frais'
    WHEN 'water' THEN 'eau'
    WHEN 'butter' THEN 'beurre'
    WHEN 'maple-syrup' THEN 'sirop d''érable'
    WHEN 'mini-chocolate-chips' THEN 'mini pépites de chocolat'
    WHEN 'peppermint-extract' THEN 'extrait de menthe poivrée'
    WHEN 'caramel-sauce' THEN 'sauce caramel'
    WHEN 'instant-espresso' THEN 'poudre d''espresso instantané'
    WHEN 'matcha-powder' THEN 'poudre de matcha'
    WHEN 'oat-milk' THEN 'lait d''avoine'
    WHEN 'coconut-cream' THEN 'crème de coco'
    WHEN 'coconut-water' THEN 'eau de coco'
    WHEN 'allulose' THEN 'allulose'
    WHEN 'stevia' THEN 'stévia'
    ELSE NULL
  END,
  name_es = CASE slug
    WHEN 'heavy-cream' THEN 'crema espesa'
    WHEN 'whole-milk' THEN 'leche entera'
    WHEN 'granulated-sugar' THEN 'azúcar granulada'
    WHEN 'brown-sugar' THEN 'azúcar morena'
    WHEN 'vanilla-extract' THEN 'extracto de vainilla'
    WHEN 'vanilla-bean' THEN 'vaina de vainilla'
    WHEN 'salt' THEN 'sal'
    WHEN 'sea-salt' THEN 'sal de mar'
    WHEN 'cocoa-powder' THEN 'cacao en polvo'
    WHEN 'honey' THEN 'miel'
    WHEN 'cream-cheese' THEN 'queso crema'
    WHEN 'greek-yogurt' THEN 'yogur griego'
    WHEN 'almond-milk' THEN 'leche de almendras'
    WHEN 'coconut-milk-canned' THEN 'leche de coco'
    WHEN 'peanut-butter' THEN 'mantequilla de maní'
    WHEN 'cinnamon' THEN 'canela'
    WHEN 'fresh-strawberries' THEN 'fresas frescas'
    WHEN 'banana' THEN 'plátano maduro'
    WHEN 'lemon-juice' THEN 'jugo de limón fresco'
    WHEN 'water' THEN 'agua'
    WHEN 'butter' THEN 'mantequilla'
    WHEN 'maple-syrup' THEN 'jarabe de arce'
    WHEN 'mini-chocolate-chips' THEN 'mini chispas de chocolate'
    WHEN 'peppermint-extract' THEN 'extracto de menta'
    WHEN 'caramel-sauce' THEN 'salsa de caramelo'
    WHEN 'instant-espresso' THEN 'café espresso instantáneo en polvo'
    WHEN 'matcha-powder' THEN 'polvo de matcha'
    WHEN 'oat-milk' THEN 'leche de avena'
    WHEN 'coconut-cream' THEN 'crema de coco'
    WHEN 'coconut-water' THEN 'agua de coco'
    WHEN 'allulose' THEN 'alulosa'
    WHEN 'stevia' THEN 'stevia'
    ELSE NULL
  END;
