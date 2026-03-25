async function getPublishedRecipes(client) {
  const { data, error } = await client.from("recipes").select(`
      id, title, slug, description, difficulty, base_type,
      hero_image_url, avg_rating, rating_count,
      prep_time_minutes, freeze_time_hours,
      author:profiles!author_id (username, display_name, avatar_url)
    `).eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    console.warn("Failed to fetch recipes:", error.message);
    return [];
  }
  return data ?? [];
}
async function getRecipeBySlug(client, slug) {
  const { data: recipe, error } = await client.from("recipes").select(`
      *,
      author:profiles!author_id (*),
      ingredients (*),
      steps (*)
    `).eq("slug", slug).eq("status", "published").single();
  if (error || !recipe) return null;
  const [categoriesRes, tagsRes, modelsRes] = await Promise.all([
    client.from("recipe_categories").select("category:categories (*)").eq("recipe_id", recipe.id),
    client.from("recipe_tags").select("tag:tags (*)").eq("recipe_id", recipe.id),
    client.from("recipe_models").select("model:creami_models (*)").eq("recipe_id", recipe.id)
  ]);
  return {
    ...recipe,
    ingredients: (recipe.ingredients ?? []).sort((a, b) => a.sort_order - b.sort_order),
    steps: (recipe.steps ?? []).sort((a, b) => a.step_number - b.step_number),
    categories: (categoriesRes.data ?? []).map((r) => r.category).filter(Boolean),
    tags: (tagsRes.data ?? []).map((r) => r.tag).filter(Boolean),
    models: (modelsRes.data ?? []).map((r) => r.model).filter(Boolean)
  };
}
async function getFeaturedRecipes(client, limit = 6) {
  const { data, error } = await client.from("recipes").select(`
      id, title, slug, description, difficulty, base_type,
      hero_image_url, avg_rating, rating_count,
      prep_time_minutes, freeze_time_hours,
      author:profiles!author_id (username, display_name, avatar_url)
    `).eq("status", "published").order("avg_rating", { ascending: false }).order("rating_count", { ascending: false }).limit(limit);
  if (error) {
    console.warn("Supabase query error:", error.message);
    return [];
  }
  return data ?? [];
}
async function getCategories(client) {
  const { data, error } = await client.from("categories").select("*").order("name");
  if (error) {
    console.warn("Supabase query error:", error.message);
    return [];
  }
  return data ?? [];
}
async function getCreamiModels(client) {
  const { data, error } = await client.from("creami_models").select("*").order("name");
  if (error) {
    console.warn("Supabase query error:", error.message);
    return [];
  }
  return data ?? [];
}

export { getRecipeBySlug as a, getCreamiModels as b, getPublishedRecipes as c, getCategories as d, getFeaturedRecipes as g };
