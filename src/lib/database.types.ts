export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accessories: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price_cents: number | null
          purchase_label: string | null
          purchase_url: string | null
          slug: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_cents?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_cents?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
          slug: string
          type: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          slug: string
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          slug?: string
          type?: string
        }
        Relationships: []
      }
      creami_models: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          is_discontinued: boolean | null
          model_number: string | null
          name: string
          num_programs: number | null
          pint_size_oz: number | null
          purchase_label: string | null
          purchase_url: string | null
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          is_discontinued?: boolean | null
          model_number?: string | null
          name: string
          num_programs?: number | null
          pint_size_oz?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          is_discontinued?: boolean | null
          model_number?: string | null
          name?: string
          num_programs?: number | null
          pint_size_oz?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          amount: string
          group_name: string | null
          id: string
          master_ingredient_id: string | null
          name: string
          recipe_id: string
          sort_order: number
          unit: string | null
        }
        Insert: {
          amount: string
          group_name?: string | null
          id?: string
          master_ingredient_id?: string | null
          name: string
          recipe_id: string
          sort_order?: number
          unit?: string | null
        }
        Update: {
          amount?: string
          group_name?: string | null
          id?: string
          master_ingredient_id?: string | null
          name?: string
          recipe_id?: string
          sort_order?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_master_ingredient_id_fkey"
            columns: ["master_ingredient_id"]
            isOneToOne: false
            referencedRelation: "master_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      master_ingredients: {
        Row: {
          aliases: string[] | null
          allergens: string[] | null
          calories_per_100g: number | null
          carbs_per_100g: number | null
          category: string
          created_at: string
          description: string | null
          fat_per_100g: number | null
          fiber_per_100g: number | null
          id: string
          image_url: string | null
          is_dairy_free: boolean | null
          is_gluten_free: boolean | null
          is_keto_friendly: boolean | null
          is_vegan: boolean | null
          name: string
          name_de: string | null
          name_es: string | null
          name_fr: string | null
          name_pt: string | null
          protein_per_100g: number | null
          purchase_label: string | null
          purchase_url: string | null
          slug: string
          sugar_per_100g: number | null
        }
        Insert: {
          aliases?: string[] | null
          allergens?: string[] | null
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          category?: string
          created_at?: string
          description?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_keto_friendly?: boolean | null
          is_vegan?: boolean | null
          name: string
          name_de?: string | null
          name_es?: string | null
          name_fr?: string | null
          name_pt?: string | null
          protein_per_100g?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug: string
          sugar_per_100g?: number | null
        }
        Update: {
          aliases?: string[] | null
          allergens?: string[] | null
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          category?: string
          created_at?: string
          description?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          is_dairy_free?: boolean | null
          is_gluten_free?: boolean | null
          is_keto_friendly?: boolean | null
          is_vegan?: boolean | null
          name?: string
          name_de?: string | null
          name_es?: string | null
          name_fr?: string | null
          name_pt?: string | null
          protein_per_100g?: number | null
          purchase_label?: string | null
          purchase_url?: string | null
          slug?: string
          sugar_per_100g?: number | null
        }
        Relationships: []
      }
      measurement_conversions: {
        Row: {
          display_format: string
          id: string
          metric_unit: string
          multiplier: number
          us_unit: string
        }
        Insert: {
          display_format: string
          id?: string
          metric_unit: string
          multiplier: number
          us_unit: string
        }
        Update: {
          display_format?: string
          id?: string
          metric_unit?: string
          multiplier?: number
          us_unit?: string
        }
        Relationships: []
      }
      post_translations: {
        Row: {
          body: string
          created_at: string | null
          excerpt: string | null
          id: string
          locale: string
          post_id: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale: string
          post_id: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          locale?: string
          post_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_translations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          body: string
          category: string
          created_at: string
          excerpt: string | null
          hero_image_url: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          category?: string
          created_at?: string
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          category?: string
          created_at?: string
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      recipe_categories: {
        Row: {
          category_id: string
          recipe_id: string
        }
        Insert: {
          category_id: string
          recipe_id: string
        }
        Update: {
          category_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_categories_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_categories_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_models: {
        Row: {
          model_id: string
          recipe_id: string
        }
        Insert: {
          model_id: string
          recipe_id: string
        }
        Update: {
          model_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "creami_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["model_id"]
          },
          {
            foreignKeyName: "recipe_models_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_models_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
        }
        Insert: {
          recipe_id: string
          tag_id: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_translations: {
        Row: {
          created_at: string
          description: string
          id: string
          ingredients: Json | null
          locale: string
          recipe_id: string
          steps: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          ingredients?: Json | null
          locale: string
          recipe_id: string
          steps?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          ingredients?: Json | null
          locale?: string
          recipe_id?: string
          steps?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_translations_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_translations_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          author_id: string
          avg_rating: number | null
          base_type: string
          churn_program: string | null
          created_at: string
          description: string
          difficulty: string
          featured_order: number | null
          freeze_time_hours: number | null
          hero_image_url: string | null
          id: string
          is_featured: boolean | null
          is_sponsored: boolean | null
          is_swirl_recipe: boolean | null
          meta_description: string | null
          meta_title: string | null
          pint_size: string | null
          prep_time_minutes: number | null
          published_at: string | null
          rating_count: number | null
          rejection_reason: string | null
          scheduled_publish_at: string | null
          servings: number | null
          slug: string
          sponsor_logo_url: string | null
          sponsor_name: string | null
          sponsor_url: string | null
          status: string
          title: string
          updated_at: string
          video_thumbnail_url: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          avg_rating?: number | null
          base_type: string
          churn_program?: string | null
          created_at?: string
          description: string
          difficulty: string
          featured_order?: number | null
          freeze_time_hours?: number | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_sponsored?: boolean | null
          is_swirl_recipe?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          pint_size?: string | null
          prep_time_minutes?: number | null
          published_at?: string | null
          rating_count?: number | null
          rejection_reason?: string | null
          scheduled_publish_at?: string | null
          servings?: number | null
          slug: string
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
          status?: string
          title: string
          updated_at?: string
          video_thumbnail_url?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          avg_rating?: number | null
          base_type?: string
          churn_program?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          featured_order?: number | null
          freeze_time_hours?: number | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_sponsored?: boolean | null
          is_swirl_recipe?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          pint_size?: string | null
          prep_time_minutes?: number | null
          published_at?: string | null
          rating_count?: number | null
          rejection_reason?: string | null
          scheduled_publish_at?: string | null
          servings?: number | null
          slug?: string
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          video_thumbnail_url?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          photo_urls: string[] | null
          rating: number
          recipe_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          photo_urls?: string[] | null
          rating: number
          recipe_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          photo_urls?: string[] | null
          rating?: number
          recipe_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "reviews_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_recipes: {
        Row: {
          created_at: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      step_translations: {
        Row: {
          hint_de: string | null
          hint_en: string | null
          hint_es: string | null
          hint_fr: string | null
          hint_pt: string | null
          id: string
          instruction_de: string | null
          instruction_en: string
          instruction_es: string | null
          instruction_fr: string | null
          instruction_pt: string | null
        }
        Insert: {
          hint_de?: string | null
          hint_en?: string | null
          hint_es?: string | null
          hint_fr?: string | null
          hint_pt?: string | null
          id?: string
          instruction_de?: string | null
          instruction_en: string
          instruction_es?: string | null
          instruction_fr?: string | null
          instruction_pt?: string | null
        }
        Update: {
          hint_de?: string | null
          hint_en?: string | null
          hint_es?: string | null
          hint_fr?: string | null
          hint_pt?: string | null
          id?: string
          instruction_de?: string | null
          instruction_en?: string
          instruction_es?: string | null
          instruction_fr?: string | null
          instruction_pt?: string | null
        }
        Relationships: []
      }
      steps: {
        Row: {
          duration_minutes: number | null
          hint: string | null
          id: string
          image_url: string | null
          instruction: string
          recipe_id: string
          step_number: number
        }
        Insert: {
          duration_minutes?: number | null
          hint?: string | null
          id?: string
          image_url?: string | null
          instruction: string
          recipe_id: string
          step_number: number
        }
        Update: {
          duration_minutes?: number | null
          hint?: string | null
          id?: string
          image_url?: string | null
          instruction?: string
          recipe_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe_model_compatibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      recipe_model_compatibility: {
        Row: {
          compatibility_note: string | null
          is_compatible: boolean | null
          is_discontinued: boolean | null
          is_swirl_recipe: boolean | null
          model_id: string | null
          model_name: string | null
          model_slug: string | null
          pint_size: string | null
          pint_size_oz: number | null
          recipe_id: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_filtered_recipe_ids: {
        Args: {
          p_base_types?: string[]
          p_category_slugs?: string[]
          p_difficulties?: string[]
          p_limit?: number
          p_min_rating?: number
          p_model_slugs?: string[]
          p_offset?: number
          p_search_ids?: string[]
          p_sort?: string
          p_status?: string
        }
        Returns: {
          recipe_id: string
          total_count: number
        }[]
      }
      link_ingredients_to_master: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
