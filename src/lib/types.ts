/** Database types - replace with generated types from `supabase gen types typescript` once connected */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      creami_models: {
        Row: CreamiModel;
        Insert: Omit<CreamiModel, 'id'>;
        Update: Partial<Omit<CreamiModel, 'id'>>;
      };
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'avg_rating' | 'rating_count' | 'view_count' | 'created_at' | 'updated_at' | 'published_at'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>;
      };
      ingredients: {
        Row: Ingredient;
        Insert: Omit<Ingredient, 'id'>;
        Update: Partial<Omit<Ingredient, 'id'>>;
      };
      steps: {
        Row: Step;
        Insert: Omit<Step, 'id'>;
        Update: Partial<Omit<Step, 'id'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id'>;
        Update: Partial<Omit<Tag, 'id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
      saved_recipes: {
        Row: SavedRecipe;
        Insert: Omit<SavedRecipe, 'created_at'>;
        Update: never;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'published_at'>;
        Update: Partial<Omit<Post, 'id' | 'created_at'>>;
      };
      recipe_models: {
        Row: RecipeModel;
        Insert: RecipeModel;
        Update: never;
      };
      recipe_categories: {
        Row: RecipeCategory;
        Insert: RecipeCategory;
        Update: never;
      };
      recipe_tags: {
        Row: RecipeTag;
        Insert: RecipeTag;
        Update: never;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ---- Row types ----

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'moderator' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CreamiModel {
  id: string;
  name: string;
  slug: string;
  pint_size_oz: number | null;
  description: string | null;
}

export interface Recipe {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prep_time_minutes: number | null;
  freeze_time_hours: number | null;
  churn_program: string | null;
  servings: number | null;
  base_type: string;
  hero_image_url: string | null;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  rejection_reason: string | null;
  avg_rating: number;
  rating_count: number;
  view_count: number;
  video_url: string | null;
  video_thumbnail_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
  sponsor_logo_url: string | null;
  sponsor_url: string | null;
  is_featured: boolean;
  featured_order: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string | null;
  group_name: 'base' | 'mix-ins' | 'topping' | 'swirl';
  sort_order: number;
  master_ingredient_id: string | null;
}

export interface MasterIngredient {
  id: string;
  name: string;
  slug: string;
  aliases: string[];
  category: string;
  allergens: string[];
  calories_per_100g: number | null;
  protein_per_100g: number | null;
  fat_per_100g: number | null;
  carbs_per_100g: number | null;
  fiber_per_100g: number | null;
  sugar_per_100g: number | null;
  is_dairy_free: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_keto_friendly: boolean;
  image_url: string | null;
  description: string | null;
  purchase_url: string | null;
  purchase_label: string | null;
  created_at: string;
}

export interface Accessory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: 'container' | 'lid' | 'tool' | 'storage' | 'book' | 'other';
  purchase_url: string | null;
  purchase_label: string | null;
  image_url: string | null;
  price_cents: number | null;
  created_at: string;
}

export interface Step {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  hint: string | null;
  image_url: string | null;
  duration_minutes: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'base_type' | 'flavor_profile' | 'dietary';
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface SavedRecipe {
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  hero_image_url: string | null;
  status: 'draft' | 'published';
  category: 'news' | 'tips' | 'reviews' | 'guides';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface RecipeModel {
  recipe_id: string;
  model_id: string;
}

export interface RecipeCategory {
  recipe_id: string;
  category_id: string;
}

export interface RecipeTag {
  recipe_id: string;
  tag_id: string;
}

// ---- Composite types for API responses ----

export interface RecipeWithDetails extends Recipe {
  author: Profile;
  ingredients: Ingredient[];
  steps: Step[];
  categories: Category[];
  tags: Tag[];
  models: CreamiModel[];
}

export interface RecipeCard {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Recipe['difficulty'];
  base_type: string;
  hero_image_url: string | null;
  avg_rating: number;
  rating_count: number;
  prep_time_minutes: number | null;
  freeze_time_hours: number | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
  sponsor_logo_url: string | null;
  author: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>;
}
