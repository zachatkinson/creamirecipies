import { s as supabase } from './supabase_DxTYJlbZ.mjs';

const GET = async () => {
  const { data: recipes } = await supabase.from("recipes").select("title, slug, description, published_at, base_type").eq("status", "published").order("published_at", { ascending: false }).limit(50);
  const siteUrl = "https://creami.recipes";
  const items = (recipes ?? []).map(
    (r) => `
    <item>
      <title><![CDATA[${r.title}]]></title>
      <link>${siteUrl}/recipes/${r.slug}</link>
      <description><![CDATA[${r.description}]]></description>
      <pubDate>${new Date(r.published_at ?? Date.now()).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/recipes/${r.slug}</guid>
      <category>${r.base_type}</category>
    </item>`
  ).join("");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Creami Recipes</title>
    <link>${siteUrl}</link>
    <description>Discover and share delicious Ninja Creami recipes with step-by-step guidance and pro tips.</description>
    <language>en-us</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
  return new Response(rss, {
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
