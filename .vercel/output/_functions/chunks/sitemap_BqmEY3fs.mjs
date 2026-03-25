import { s as supabase } from './supabase_DxTYJlbZ.mjs';

const GET = async () => {
  const siteUrl = "https://creami.recipes";
  const { data: recipes } = await supabase.from("recipes").select("slug, updated_at").eq("status", "published").order("updated_at", { ascending: false });
  const { data: posts } = await supabase.from("posts").select("slug, updated_at").eq("status", "published").order("updated_at", { ascending: false });
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/recipes", priority: "0.9", changefreq: "daily" },
    { url: "/blog", priority: "0.7", changefreq: "weekly" },
    { url: "/about", priority: "0.5", changefreq: "monthly" }
  ];
  const urls = [
    ...staticPages.map((page) => `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`),
    ...(recipes ?? []).map((r) => `
    <url>
      <loc>${siteUrl}/recipes/${r.slug}</loc>
      <lastmod>${new Date(r.updated_at).toISOString().split("T")[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
    ...(posts ?? []).map((p) => `
    <url>
      <loc>${siteUrl}/blog/${p.slug}</loc>
      <lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`)
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("")}
</urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
