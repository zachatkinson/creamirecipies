async function getPublishedPosts(client) {
  const { data, error } = await client.from("posts").select(`
      *,
      author:profiles!author_id (username, display_name, avatar_url)
    `).eq("status", "published").order("published_at", { ascending: false });
  if (error) {
    console.warn("Failed to fetch posts:", error.message);
    return [];
  }
  return data ?? [];
}
async function getPostBySlug(client, slug) {
  const { data, error } = await client.from("posts").select(`
      *,
      author:profiles!author_id (username, display_name, avatar_url)
    `).eq("slug", slug).eq("status", "published").single();
  if (error || !data) return null;
  return data;
}
async function getAllPostSlugs(client) {
  const { data, error } = await client.from("posts").select("slug").eq("status", "published");
  if (error) {
    console.warn("Failed to fetch post slugs:", error.message);
    return [];
  }
  return (data ?? []).map((p) => p.slug);
}

export { getPostBySlug as a, getPublishedPosts as b, getAllPostSlugs as g };
