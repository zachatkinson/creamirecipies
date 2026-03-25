const INDEXNOW_API_KEY = "PLACEHOLDER_KEY";
const SITE_HOST = "creami.recipes";
const POST = async ({ request }) => {
  try {
    const { urls } = await request.json();
    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: "urls array required" }), { status: 400 });
    }
    const fullUrls = urls.map((u) => `https://${SITE_HOST}${u}`);
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_API_KEY,
        urlList: fullUrls
      })
    });
    return new Response(JSON.stringify({ ok: response.ok, status: response.status }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "IndexNow submission failed" }), { status: 500 });
  }
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
