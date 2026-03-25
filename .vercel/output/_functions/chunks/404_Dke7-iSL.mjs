import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { $ as $$RecipeCard } from './RecipeCard_BxWbak1V.mjs';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { g as getFeaturedRecipes } from './recipes_7tIktda5.mjs';

const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const recommendations = await getFeaturedRecipes(supabase, 3);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Page Not Found" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-24 text-center"> <div class="max-w-md mx-auto px-4"> <span class="text-7xl mb-6 block">🍦</span> <h1 class="font-display text-4xl font-bold text-chocolate mb-4">Page Not Found</h1> <p class="text-slate-500 mb-8">Looks like this recipe melted away. Let's get you back on track.</p> <div class="flex justify-center gap-4"> <a href="/" class="px-6 py-3 bg-berry text-white font-medium rounded-full hover:bg-berry/90 transition-colors">
Go Home
</a> <a href="/recipes" class="px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 transition-colors">
Browse Recipes
</a> </div> </div> </section> ${recommendations.length > 0 && renderTemplate`<section class="pb-16"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="font-display text-2xl font-bold text-chocolate mb-6 text-center">
Try These Instead
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${recommendations.map((recipe) => renderTemplate`${renderComponent($$result2, "RecipeCard", $$RecipeCard, { "recipe": recipe })}`)} </div> </div> </section>`}` })}`;
}, "/Users/zach/web-projects/creami/src/pages/404.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
