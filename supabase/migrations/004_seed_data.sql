-- =============================================
-- SEED: Creami Models
-- =============================================
INSERT INTO creami_models (name, slug, pint_size_oz, description) VALUES
  ('Ninja Creami Original', 'original', 16, 'The original Ninja Creami with 16oz pint capacity'),
  ('Ninja Creami Deluxe', 'deluxe', 24, 'Larger 24oz capacity with additional programs like Italian Ice'),
  ('Ninja Creami Breeze', 'breeze', 16, 'Budget-friendly 16oz model with core programs'),
  ('Ninja Creami Deluxe 11-in-1', 'deluxe-11-in-1', 24, '24oz with 11 programs including Creamiccino and Frozen Drink');

-- =============================================
-- SEED: Categories - Base Types
-- =============================================
INSERT INTO categories (name, slug, description, type) VALUES
  ('Ice Cream', 'ice-cream', 'Classic dairy-based ice cream', 'base_type'),
  ('Lite Ice Cream', 'lite-ice-cream', 'Lower calorie ice cream alternatives', 'base_type'),
  ('Sorbet', 'sorbet', 'Dairy-free fruit-based frozen dessert', 'base_type'),
  ('Gelato', 'gelato', 'Italian-style frozen dessert with denser texture', 'base_type'),
  ('Frozen Yogurt', 'frozen-yogurt', 'Tangy yogurt-based frozen treat', 'base_type'),
  ('Milkshake', 'milkshake', 'Thick blended milkshake', 'base_type'),
  ('Smoothie Bowl', 'smoothie-bowl', 'Thick blended fruit smoothie bowl', 'base_type'),
  ('Italian Ice', 'italian-ice', 'Deluxe-only fine-grained fruit ice', 'base_type');

-- =============================================
-- SEED: Categories - Flavor Profiles
-- =============================================
INSERT INTO categories (name, slug, description, type) VALUES
  ('Chocolate', 'chocolate', 'Cocoa and chocolate-forward flavors', 'flavor_profile'),
  ('Vanilla', 'vanilla', 'Classic vanilla and vanilla bean', 'flavor_profile'),
  ('Fruity', 'fruity', 'Fresh fruit and berry flavors', 'flavor_profile'),
  ('Nutty', 'nutty', 'Nut butter and nut-based flavors', 'flavor_profile'),
  ('Coffee', 'coffee', 'Coffee, espresso, and mocha flavors', 'flavor_profile'),
  ('Candy & Cookie', 'candy-cookie', 'Inspired by popular candies and cookies', 'flavor_profile'),
  ('Tropical', 'tropical', 'Mango, coconut, pineapple, and other tropical fruits', 'flavor_profile'),
  ('Caramel', 'caramel', 'Caramel, butterscotch, and toffee flavors', 'flavor_profile'),
  ('Mint', 'mint', 'Mint and peppermint flavors', 'flavor_profile');

-- =============================================
-- SEED: Categories - Dietary
-- =============================================
INSERT INTO categories (name, slug, description, type) VALUES
  ('Dairy-Free', 'dairy-free', 'No dairy ingredients', 'dietary'),
  ('Vegan', 'vegan', 'No animal products', 'dietary'),
  ('Sugar-Free', 'sugar-free', 'No added sugar, uses sugar alternatives', 'dietary'),
  ('Keto', 'keto', 'Low carb, high fat friendly', 'dietary'),
  ('High Protein', 'high-protein', 'Boosted with protein powder or high-protein bases', 'dietary'),
  ('Gluten-Free', 'gluten-free', 'No gluten-containing ingredients', 'dietary');
