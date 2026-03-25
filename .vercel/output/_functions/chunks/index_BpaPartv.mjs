import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { $ as $$ScrollReveal } from './ScrollReveal_DvuQgtHV.mjs';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { b as getPublishedPosts } from './posts_BJooG7Vp.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getPublishedPosts(supabase);
  const categoryLabels = {
    news: "News",
    tips: "Tips & Tricks",
    reviews: "Reviews",
    guides: "Guides"
  };
  const categoryColors = {
    news: "bg-lavender/20 text-lavender-dark",
    tips: "bg-mint/20 text-mint-dark",
    reviews: "bg-vanilla/20 text-chocolate-light",
    guides: "bg-blush/20 text-berry"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog", "description": "News, tips, reviews, and guides for Ninja Creami owners." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12 md:py-16"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, {}, { "default": async ($$result3) => renderTemplate` <div class="text-center mb-12"> <h1 class="font-display text-4xl md:text-5xl font-bold text-chocolate mb-4">
Blog
</h1> <p class="text-slate-500 max-w-lg mx-auto">
News, tips, machine reviews, and guides for Ninja Creami enthusiasts.
</p> </div> ` })} ${posts.length > 0 ? renderTemplate`${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "stagger", "staggerAmount": 0.08 }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${posts.map((post) => renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"> <div class="aspect-[16/9] bg-cream-dark overflow-hidden"> ${post.hero_image_url ? renderTemplate`<img${addAttribute(post.hero_image_url, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-lavender/20 to-mint/20">
📝
</div>`} </div> <div class="p-5"> <div class="flex items-center gap-2 mb-2"> <span${addAttribute(["text-xs font-medium px-2.5 py-0.5 rounded-full", categoryColors[post.category] ?? "bg-slate-100 text-slate-600"], "class:list")}> ${categoryLabels[post.category] ?? post.category} </span> <span class="text-xs text-slate-500"> ${new Date(post.published_at ?? post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} </span> </div> <h2 class="font-display text-lg font-bold text-chocolate group-hover:text-berry transition-colors line-clamp-2 mb-2"> ${post.title} </h2> ${post.excerpt && renderTemplate`<p class="text-sm text-slate-500 line-clamp-3">${post.excerpt}</p>`} </div> </a>`)} </div> ` })}` : renderTemplate`<div class="text-center py-20 bg-white/50 rounded-2xl"> <span class="text-5xl mb-4 block">📝</span> <h2 class="font-display text-2xl font-bold text-chocolate mb-2">Articles Coming Soon</h2> <p class="text-slate-500">We're working on tips, guides, and news for the Creami community.</p> </div>`} </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/blog/index.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
