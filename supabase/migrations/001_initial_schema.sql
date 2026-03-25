-- =============================================
-- PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- CREAMI MODELS
-- =============================================
CREATE TABLE creami_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  pint_size_oz INT,
  description TEXT
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('base_type', 'flavor_profile', 'dietary'))
);

-- =============================================
-- RECIPES
-- =============================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prep_time_minutes INT,
  freeze_time_hours INT DEFAULT 24,
  churn_program TEXT,
  servings INT DEFAULT 4,
  base_type TEXT NOT NULL,
  hero_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  rejection_reason TEXT,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- =============================================
-- RECIPE <-> CREAMI MODEL (many-to-many)
-- =============================================
CREATE TABLE recipe_models (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES creami_models(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, model_id)
);

-- =============================================
-- INGREDIENTS
-- =============================================
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  unit TEXT,
  group_name TEXT DEFAULT 'base' CHECK (group_name IN ('base', 'mix-ins', 'topping', 'swirl')),
  sort_order INT NOT NULL DEFAULT 0
);

-- =============================================
-- STEPS (with optional hints/pro tips)
-- =============================================
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  hint TEXT,
  image_url TEXT,
  duration_minutes INT
);

-- =============================================
-- RECIPE <-> CATEGORY (many-to-many)
-- =============================================
CREATE TABLE recipe_categories (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

-- =============================================
-- TAGS (freeform, user-generated)
-- =============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE recipe_tags (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- =============================================
-- REVIEWS
-- =============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

-- =============================================
-- SAVED RECIPES (bookmarks)
-- =============================================
CREATE TABLE saved_recipes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_recipes_base_type ON recipes(base_type);
CREATE INDEX idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX idx_ingredients_recipe ON ingredients(recipe_id);
CREATE INDEX idx_steps_recipe ON steps(recipe_id, step_number);
CREATE INDEX idx_reviews_recipe ON reviews(recipe_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_tags_slug ON tags(slug);
