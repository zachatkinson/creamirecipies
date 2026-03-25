import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute, b6 as unescapeHTML } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { $ as $$ScrollReveal } from './ScrollReveal_DvuQgtHV.mjs';
import { $ as $$AdUnit } from './AdUnit_BZmLqD-f.mjs';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { g as getAllPostSlugs, a as getPostBySlug } from './posts_BJooG7Vp.mjs';

async function getStaticPaths() {
  const slugs = await getAllPostSlugs(supabase);
  return slugs.map((slug) => ({ params: { slug } }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = await getPostBySlug(supabase, slug);
  if (!post) {
    return Astro2.redirect("/404");
  }
  const categoryLabels = {
    news: "News",
    tips: "Tips & Tricks",
    reviews: "Reviews",
    guides: "Guides"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": post.title, "description": post.excerpt ?? void 0, "image": post.hero_image_url ?? void 0, "type": "article" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="py-12 md:py-16"> <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-slate-500 mb-8"> <a href="/" class="hover:text-berry transition-colors">Home</a> <span>/</span> <a href="/blog" class="hover:text-berry transition-colors">Blog</a> <span>/</span> <span class="text-slate-600 truncate">${post.title}</span> </nav> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, {}, { "default": async ($$result3) => renderTemplate`  <div class="flex items-center gap-3 mb-4"> <span class="text-xs font-medium px-3 py-1 rounded-full bg-lavender/20 text-lavender-dark"> ${categoryLabels[post.category] ?? post.category} </span> <span class="text-sm text-slate-500"> ${new Date(post.published_at ?? post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })} </span> </div> <h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-chocolate mb-6"> ${post.title} </h1>  <div class="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100"> <div class="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center text-lavender-dark font-bold text-sm"> ${(post.author.display_name || post.author.username).charAt(0).toUpperCase()} </div> <div> <div class="text-sm font-medium text-chocolate"> ${post.author.display_name || post.author.username} </div> </div> </div> ` })} <!-- Hero Image --> ${post.hero_image_url && renderTemplate`${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": 0.1 }, { "default": async ($$result3) => renderTemplate` <div class="aspect-[16/9] rounded-2xl overflow-hidden mb-10"> <img${addAttribute(post.hero_image_url, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover"> </div> ` })}`} <!-- Body --> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": 0.15 }, { "default": async ($$result3) => renderTemplate` <div class="prose prose-lg max-w-none text-slate-600">${unescapeHTML(post.body)}</div> ` })} <!-- Ad: bottom of blog post --> ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "in-article", "slot": "post-bottom", "class": "mt-12" })} </div> </article> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/blog/[slug].astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
