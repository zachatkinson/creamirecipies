/** Database types — auto-generated via `supabase gen types typescript` */
export type { Database } from './database.types';

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
  is_discontinued?: boolean | null;
}

/** Lightweight model reference for recipe components */
export interface ModelRef {
  slug: string;
  name: string;
  pint_size_oz: number;
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
  /** Set at runtime when locale translations are applied */
  translated_name?: string;
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
