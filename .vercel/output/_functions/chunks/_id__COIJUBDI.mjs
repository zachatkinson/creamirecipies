import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, L as renderTemplate, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import 'clsx';
import { $ as $$StepCard } from './StepCard_MmDk2mXr.mjs';

const $$IngredientList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$IngredientList;
  const { ingredients } = Astro2.props;
  const groups = ingredients.reduce((acc, ing) => {
    const group = ing.group_name || "base";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ing);
    return acc;
  }, {});
  const groupLabels = {
    base: "Base Ingredients",
    "mix-ins": "Mix-Ins",
    topping: "Toppings",
    swirl: "Swirl"
  };
  const groupOrder = ["base", "mix-ins", "swirl", "topping"];
  const sortedGroups = groupOrder.filter((g) => groups[g]);
  return renderTemplate`${maybeRenderHead()}<div class="space-y-6"> ${sortedGroups.map((groupName) => renderTemplate`<div> ${sortedGroups.length > 1 && renderTemplate`<h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3"> ${groupLabels[groupName] ?? groupName} </h4>`} <ul class="space-y-2"> ${groups[groupName].map((ingredient) => renderTemplate`<li class="ingredient-item flex items-start gap-3 py-2 border-b border-slate-50 last:border-0"> <span class="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 border-blush/40"></span> <div class="flex-1"> <span class="font-medium text-slate-700">${ingredient.name}</span> <span class="ml-2 text-sm text-slate-500"> ${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ""} </span> </div> </li>`)} </ul> </div>`)} </div>`;
}, "/Users/zach/web-projects/creami/src/components/recipe/IngredientList.astro", void 0);

const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { user, profile, supabase } = Astro2.locals;
  if (!user || !profile || !["admin", "moderator"].includes(profile.role)) {
    return Astro2.redirect("/");
  }
  const { id } = Astro2.params;
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = formData.get("action");
    const reason = formData.get("reason");
    if (action === "publish") {
      await supabase.from("recipes").update({ status: "published", published_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
      return Astro2.redirect("/admin/recipes?status=pending");
    } else if (action === "reject") {
      await supabase.from("recipes").update({ status: "rejected", rejection_reason: reason || null }).eq("id", id);
      return Astro2.redirect("/admin/recipes?status=pending");
    }
  }
  const { data: recipe } = await supabase.from("recipes").select(`
    *,
    author:profiles!author_id (*),
    ingredients (*),
    steps (*)
  `).eq("id", id).single();
  if (!recipe) {
    return Astro2.redirect("/admin/recipes");
  }
  const { data: recipeCats } = await supabase.from("recipe_categories").select("category:categories (*)").eq("recipe_id", id);
  const { data: recipeModels } = await supabase.from("recipe_models").select("model:creami_models (*)").eq("recipe_id", id);
  const sortedIngredients = (recipe.ingredients ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const sortedSteps = (recipe.steps ?? []).sort((a, b) => a.step_number - b.step_number);
  const categories = (recipeCats ?? []).map((r) => r.category).filter(Boolean);
  const models = (recipeModels ?? []).map((r) => r.model).filter(Boolean);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Review: ${recipe.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between mb-8"> <a href="/admin/recipes" class="text-sm text-berry hover:underline">&larr; Back to Queue</a> <span${addAttribute([
    "text-xs font-medium px-3 py-1 rounded-full",
    recipe.status === "pending" ? "bg-vanilla/40 text-[#5C3D2E]" : recipe.status === "published" ? "bg-mint/40 text-[#1a6b4f]" : recipe.status === "rejected" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
  ], "class:list")}> ${recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)} </span> </div> <!-- Recipe Preview --> <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8"> <h1 class="font-display text-3xl font-bold text-chocolate mb-3">${recipe.title}</h1> <p class="text-slate-600 mb-4">${recipe.description}</p> <div class="flex flex-wrap gap-2 mb-6"> <span class="text-xs px-3 py-1 rounded-full bg-mint/20 text-mint-dark">${recipe.difficulty}</span> <span class="text-xs px-3 py-1 rounded-full bg-lavender/20 text-lavender-dark">${recipe.base_type}</span> ${models.map((m) => renderTemplate`<span class="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">${m.name}</span>`)} ${categories.map((c) => renderTemplate`<span class="text-xs px-3 py-1 rounded-full bg-blush/15 text-berry">${c.name}</span>`)} </div> <div class="grid grid-cols-4 gap-4 p-4 bg-cream rounded-xl mb-8 text-center text-sm"> <div> <div class="text-xs text-slate-500">Prep</div> <div class="font-semibold text-chocolate">${recipe.prep_time_minutes ?? "-"}m</div> </div> <div> <div class="text-xs text-slate-500">Freeze</div> <div class="font-semibold text-chocolate">${recipe.freeze_time_hours ?? 24}h</div> </div> <div> <div class="text-xs text-slate-500">Servings</div> <div class="font-semibold text-chocolate">${recipe.servings ?? 4}</div> </div> <div> <div class="text-xs text-slate-500">Program</div> <div class="font-semibold text-chocolate">${recipe.churn_program ?? "-"}</div> </div> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <div> <h2 class="font-display text-lg font-bold text-chocolate mb-4">Ingredients</h2> ${renderComponent($$result2, "IngredientList", $$IngredientList, { "ingredients": sortedIngredients })} </div> <div class="md:col-span-2"> <h2 class="font-display text-lg font-bold text-chocolate mb-4">Steps</h2> <div class="space-y-2"> ${sortedSteps.map((step) => renderTemplate`${renderComponent($$result2, "StepCard", $$StepCard, { "step": step, "totalSteps": sortedSteps.length })}`)} </div> </div> </div> <div class="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-500">
Submitted by <strong>${recipe.author?.display_name || recipe.author?.username}</strong>
on ${new Date(recipe.created_at).toLocaleDateString()} </div> </div> <!-- Actions --> ${recipe.status === "pending" && renderTemplate`<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"> <h2 class="font-display text-lg font-bold text-chocolate mb-4">Moderation Actions</h2> <div class="flex gap-4"> <form method="POST" class="flex-1"> <input type="hidden" name="action" value="publish"> <button type="submit" class="w-full py-3 bg-mint-dark text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
Publish Recipe
</button> </form> <form method="POST" class="flex-1 space-y-3"> <input type="hidden" name="action" value="reject"> <input type="text" name="reason" placeholder="Rejection reason (optional)" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-300 outline-none"> <button type="submit" class="w-full py-3 bg-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
Reject
</button> </form> </div> </div>`} </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/admin/recipes/[id].astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/admin/recipes/[id].astro";
const $$url = "/admin/recipes/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
