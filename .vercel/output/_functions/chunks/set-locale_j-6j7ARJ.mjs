import { S as SUPPORTED_LOCALES } from './index_Bf_3aS85.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const { locale } = await request.json();
  if (SUPPORTED_LOCALES.includes(locale)) {
    cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  const referer = request.headers.get("referer") ?? "/";
  return redirect(referer, 302);
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
