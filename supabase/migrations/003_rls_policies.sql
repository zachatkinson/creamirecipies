-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RECIPES
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published recipes are public" ON recipes FOR SELECT USING (
  status = 'published' OR author_id = auth.uid()
);
CREATE POLICY "Authenticated users can insert recipes" ON recipes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own recipes" ON recipes FOR UPDATE USING (
  auth.uid() = author_id
);
CREATE POLICY "Moderators can update any recipe" ON recipes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "Authors can delete own draft recipes" ON recipes FOR DELETE USING (
  auth.uid() = author_id AND status IN ('draft', 'rejected')
);

-- RECIPE_MODELS
ALTER TABLE recipe_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipe models are publicly readable" ON recipe_models FOR SELECT USING (true);
CREATE POLICY "Authors can manage recipe models" ON recipe_models FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND author_id = auth.uid())
);

-- INGREDIENTS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ingredients follow recipe visibility" ON ingredients FOR SELECT USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND (status = 'published' OR author_id = auth.uid()))
);
CREATE POLICY "Authors can manage ingredients" ON ingredients FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND author_id = auth.uid())
);

-- STEPS
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Steps follow recipe visibility" ON steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND (status = 'published' OR author_id = auth.uid()))
);
CREATE POLICY "Authors can manage steps" ON steps FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND author_id = auth.uid())
);

-- CATEGORIES (public read, admin write)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CREAMI_MODELS (public read, admin write)
ALTER TABLE creami_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creami models are publicly readable" ON creami_models FOR SELECT USING (true);
CREATE POLICY "Admins can manage creami models" ON creami_models FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RECIPE_CATEGORIES
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipe categories are publicly readable" ON recipe_categories FOR SELECT USING (true);
CREATE POLICY "Authors can manage recipe categories" ON recipe_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND author_id = auth.uid())
);

-- TAGS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable" ON tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON tags FOR INSERT TO authenticated WITH CHECK (true);

-- RECIPE_TAGS
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipe tags are publicly readable" ON recipe_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage recipe tags" ON recipe_tags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND author_id = auth.uid())
);

-- REVIEWS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- SAVED_RECIPES
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own saved recipes" ON saved_recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save recipes" ON saved_recipes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave recipes" ON saved_recipes FOR DELETE USING (auth.uid() = user_id);
