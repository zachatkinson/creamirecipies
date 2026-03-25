import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';

const prerender = false;
const $$Recipes = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Recipes;
  const { user, profile, supabase } = Astro2.locals;
  if (!user || !profile || !["admin", "moderator"].includes(profile.role)) {
    return Astro2.redirect("/");
  }
  const statusFilter = Astro2.url.searchParams.get("status") ?? "pending";
  const { data: rawRecipes } = await supabase.from("recipes").select(`
    id, title, slug, description, difficulty, base_type, status, created_at,
    author:profiles!author_id (username, display_name)
  `).eq("status", statusFilter).order("created_at", { ascending: false });
  const recipes = rawRecipes ?? [];
  const statusTabs = ["pending", "published", "rejected", "draft"];
  const statusColors = {
    pending: "bg-vanilla/40 text-[#5C3D2E]",
    published: "bg-mint/40 text-[#1a6b4f]",
    rejected: "bg-red-50 text-red-600",
    draft: "bg-slate-100 text-slate-600"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Review Recipes" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between mb-8"> <h1 class="font-display text-3xl font-bold text-chocolate">Review Recipes</h1> <a href="/admin" class="text-sm text-berry hover:underline">Back to Dashboard</a> </div> <!-- Status Tabs --> <div class="flex gap-2 mb-8"> ${statusTabs.map((s) => renderTemplate`<a${addAttribute(`/admin/recipes?status=${s}`, "href")}${addAttribute([
    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
    s === statusFilter ? "bg-berry text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-blush"
  ], "class:list")}> ${s.charAt(0).toUpperCase() + s.slice(1)} </a>`)} </div> <!-- Recipe List --> ${recipes.length > 0 ? renderTemplate`<div class="space-y-4"> ${recipes.map((recipe) => renderTemplate`<div class="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-slate-100"> <div class="flex-1"> <div class="flex items-center gap-2 mb-1"> <h3 class="font-display font-bold text-chocolate">${recipe.title}</h3> <span${addAttribute(["text-xs px-2 py-0.5 rounded-full", statusColors[recipe.status] ?? ""], "class:list")}> ${recipe.status} </span> </div> <p class="text-sm text-slate-500 line-clamp-1 mb-1">${recipe.description}</p> <div class="text-xs text-slate-500">
by ${recipe.author?.display_name || recipe.author?.username}
&middot; ${new Date(recipe.created_at).toLocaleDateString()}
&middot; ${recipe.difficulty} &middot; ${recipe.base_type} </div> </div> <a${addAttribute(`/admin/recipes/${recipe.id}`, "href")} class="ml-4 px-4 py-2 bg-berry text-white text-sm font-medium rounded-full hover:bg-berry/90 transition-colors">
Review
</a> </div>`)} </div>` : renderTemplate`<div class="text-center py-16 bg-white/50 rounded-2xl"> <p class="text-slate-500">No ${statusFilter} recipes.</p> </div>`} </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/admin/recipes.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/admin/recipes.astro";
const $$url = "/admin/recipes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Recipes,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
