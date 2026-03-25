import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { user, profile, supabase } = Astro2.locals;
  if (!user || !profile || !["admin", "moderator"].includes(profile.role)) {
    return Astro2.redirect("/");
  }
  const { count: pendingCount } = await supabase.from("recipes").select("*", { count: "exact", head: true }).eq("status", "pending");
  const { count: publishedCount } = await supabase.from("recipes").select("*", { count: "exact", head: true }).eq("status", "published");
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: postCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Admin Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <h1 class="font-display text-3xl font-bold text-chocolate mb-8">Admin Dashboard</h1> <!-- Stats --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"> <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100"> <div class="text-3xl font-bold text-berry">${pendingCount ?? 0}</div> <div class="text-sm text-slate-500">Pending Recipes</div> </div> <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100"> <div class="text-3xl font-bold text-mint-dark">${publishedCount ?? 0}</div> <div class="text-sm text-slate-500">Published Recipes</div> </div> <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100"> <div class="text-3xl font-bold text-lavender-dark">${userCount ?? 0}</div> <div class="text-sm text-slate-500">Users</div> </div> <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100"> <div class="text-3xl font-bold text-chocolate">${postCount ?? 0}</div> <div class="text-sm text-slate-500">Blog Posts</div> </div> </div> <!-- Quick Actions --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <a href="/admin/recipes" class="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blush hover:shadow-md transition-all"> <div class="w-12 h-12 bg-blush/20 rounded-xl flex items-center justify-center text-2xl">📋</div> <div> <h2 class="font-display text-lg font-bold text-chocolate">Review Recipes</h2> <p class="text-sm text-slate-500">${pendingCount ?? 0} recipes awaiting review</p> </div> </a> <a href="/admin/posts" class="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blush hover:shadow-md transition-all"> <div class="w-12 h-12 bg-lavender/20 rounded-xl flex items-center justify-center text-2xl">📝</div> <div> <h2 class="font-display text-lg font-bold text-chocolate">Manage Posts</h2> <p class="text-sm text-slate-500">Create and manage blog articles</p> </div> </a> </div> </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/admin/index.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
