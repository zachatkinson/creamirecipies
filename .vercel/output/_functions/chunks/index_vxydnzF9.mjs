import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { $ as $$RecipeCard } from './RecipeCard_BxWbak1V.mjs';
import { $ as $$ScrollReveal } from './ScrollReveal_DvuQgtHV.mjs';
import { $ as $$AdUnit } from './AdUnit_BZmLqD-f.mjs';
import { jsx } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
import { Application, Container, Graphics } from 'pixi.js';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { g as getFeaturedRecipes, d as getCategories } from './recipes_7tIktda5.mjs';
import { D as DEFAULT_LOCALE, t } from './index_Bf_3aS85.mjs';

const COLORS = [16038081, 11065544, 12890580, 16640432, 16775408];
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
function HeroCanvas() {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [isMobile] = useState(
    () => typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    if (isMobile) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const container = containerRef.current;
    if (!container) return;
    let destroyed = false;
    const mousePos = { x: -9999, y: -9999 };
    const REPEL_RADIUS = 100;
    const REPEL_STRENGTH = 2;
    async function init() {
      const app = new Application();
      await app.init({
        resizeTo: container,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true
      });
      if (destroyed) {
        app.destroy(true);
        return;
      }
      appRef.current = app;
      container.appendChild(app.canvas);
      const particleContainer = new Container();
      app.stage.addChild(particleContainer);
      const width = app.screen.width;
      const height = app.screen.height;
      const particleCount = Math.min(60, Math.max(40, Math.floor(width * height / 15e3)));
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shape = Math.random() > 0.4 ? "rect" : "circle";
        const size = randomRange(3, 8);
        const g = new Graphics();
        if (shape === "circle") {
          g.circle(0, 0, size);
          g.fill({ color, alpha: randomRange(0.4, 0.8) });
        } else {
          g.roundRect(-size * 1.5, -size * 0.4, size * 3, size * 0.8, size * 0.3);
          g.fill({ color, alpha: randomRange(0.4, 0.8) });
        }
        const x = randomRange(0, width);
        const y = randomRange(0, height);
        g.x = x;
        g.y = y;
        g.rotation = randomRange(0, Math.PI * 2);
        particleContainer.addChild(g);
        particles.push({
          graphic: g,
          x,
          y,
          vx: randomRange(-0.3, 0.3),
          vy: randomRange(-0.4, -0.15),
          rotation: g.rotation,
          rotationSpeed: randomRange(-0.01, 0.01),
          shape,
          size
        });
      }
      if (prefersReducedMotion) return;
      const onMouseMove = (e) => {
        const rect = app.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
          mousePos.x = mx;
          mousePos.y = my;
        } else {
          mousePos.x = -9999;
          mousePos.y = -9999;
        }
      };
      document.addEventListener("mousemove", onMouseMove);
      app.ticker.add(() => {
        const w = app.screen.width;
        const h = app.screen.height;
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            p.x += dx / dist * force;
            p.y += dy / dist * force;
          }
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          p.graphic.x = p.x;
          p.graphic.y = p.y;
          p.graphic.rotation = p.rotation;
        }
      });
      const cleanup = () => {
        document.removeEventListener("mousemove", onMouseMove);
      };
      app.__cleanupListeners = cleanup;
    }
    init();
    return () => {
      destroyed = true;
      const app = appRef.current;
      if (app) {
        if (app.__cleanupListeners) {
          app.__cleanupListeners();
        }
        app.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);
  if (isMobile) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      style: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }
    }
  );
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const locale = Astro2.locals.locale;
  const recipes = await getFeaturedRecipes(supabase, 6);
  const categories = await getCategories(supabase);
  const baseTypes = categories.filter((c) => c.type === "base_type");
  if (locale !== DEFAULT_LOCALE && recipes.length > 0) {
    const { data: translations } = await supabase.from("recipe_translations").select("recipe_id, title, description").eq("locale", locale).in("recipe_id", recipes.map((r) => r.id)).limit(100);
    if (translations) {
      const transMap = new Map(translations.map((tr) => [tr.recipe_id, tr]));
      for (const recipe of recipes) {
        const tr = transMap.get(recipe.id);
        if (tr) {
          recipe.title = tr.title;
          recipe.description = tr.description;
        }
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Home" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-gradient-to-br from-cream via-blush/10 to-lavender/10"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"> <div class="max-w-2xl relative z-10"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up" }, { "default": async ($$result3) => renderTemplate` <span class="inline-block px-4 py-1.5 bg-blush/20 text-berry text-sm font-medium rounded-full mb-6"> ${t("home.badge", locale)} </span> ` })} ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": 0.1 }, { "default": async ($$result3) => renderTemplate` <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-chocolate leading-tight mb-6"> ${t("home.heroTitle", locale)} <span class="text-transparent bg-clip-text bg-gradient-to-r from-blush-dark to-berry"> ${t("home.heroTitleAccent", locale)} </span> </h1> ` })} ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": 0.2 }, { "default": async ($$result3) => renderTemplate` <p class="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed"> ${t("home.heroDescription", locale)} </p> ` })} ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": 0.3 }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-4"> <a href="/recipes" class="px-8 py-3.5 bg-berry text-white font-semibold rounded-full hover:bg-berry/90 transition-colors shadow-lg shadow-berry/25"> ${t("home.browseRecipes", locale)} </a> <a href="/about" class="px-8 py-3.5 bg-white text-chocolate font-semibold rounded-full hover:bg-cream-dark transition-colors border border-cream-dark">
Learn More
</a> </div> ` })} </div> <!-- Decorative elements --> <div class="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none" id="hero-canvas-container"> ${renderComponent($$result2, "HeroCanvas", HeroCanvas, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/zach/web-projects/creami/src/components/animations/HeroCanvas", "client:component-export": "default" })} </div> </div> </section>  <section class="py-12 bg-white/50"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "stagger" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap justify-center gap-3"> ${baseTypes.map((cat) => renderTemplate`<a${addAttribute(`/recipes?base=${cat.slug}`, "href")} class="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-slate-600 hover:text-berry hover:bg-blush/15 border border-slate-200 hover:border-blush transition-all"> ${cat.name} </a>`)} </div> ` })} </div> </section>  <section class="py-16 md:py-24"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, {}, { "default": async ($$result3) => renderTemplate` <div class="text-center mb-12"> <h2 class="font-display text-3xl md:text-4xl font-bold text-chocolate mb-4">
Featured Recipes
</h2> <p class="text-slate-500 max-w-lg mx-auto">
Top-rated frozen treats from our community, tested and loved.
</p> </div> ` })} ${recipes.length > 0 ? renderTemplate`${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "stagger", "staggerAmount": 0.08 }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"> ${recipes.map((recipe) => renderTemplate`${renderComponent($$result3, "RecipeCard", $$RecipeCard, { "recipe": recipe })}`)} </div> ` })}` : renderTemplate`<div class="text-center py-16 bg-white/50 rounded-2xl"> <span class="text-5xl mb-4 block">🍨</span> <h3 class="font-display text-xl font-bold text-chocolate mb-2">Recipes Coming Soon</h3> <p class="text-slate-500 mb-6">We're churning up something delicious. Check back soon!</p> <a href="/recipes" class="inline-block px-6 py-3 bg-berry text-white font-medium rounded-full hover:bg-berry/90 transition-colors">
Browse All Recipes
</a> </div>`} ${recipes.length > 0 && renderTemplate`<div class="text-center mt-10"> <a href="/recipes" class="inline-flex items-center gap-2 px-6 py-3 text-berry font-medium hover:bg-blush/10 rounded-full transition-colors">
View All Recipes
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div>`} </div> </section>  <div class="max-w-[var(--container-max)] mx-auto px-4 py-6"> ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "leaderboard", "slot": "home-mid" })} ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "mobile-banner", "slot": "home-mid-mobile" })} </div>  <section class="py-16 md:py-24 bg-gradient-to-b from-white/50 to-cream"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, {}, { "default": async ($$result3) => renderTemplate` <div class="text-center mb-14"> <h2 class="font-display text-3xl md:text-4xl font-bold text-chocolate mb-4">
How It Works
</h2> <p class="text-slate-500 max-w-lg mx-auto">
From freezer to first scoop, every recipe guides you through each step.
</p> </div> ` })} ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "stagger", "staggerAmount": 0.15 }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> <div class="text-center p-8 bg-white rounded-2xl shadow-sm"> <div class="w-16 h-16 bg-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-5"> <span class="text-3xl">📖</span> </div> <h3 class="font-display text-lg font-bold text-chocolate mb-2">Choose a Recipe</h3> <p class="text-sm text-slate-500">
Browse by flavor, difficulty, or Creami model. Every recipe includes ratings from the community.
</p> </div> <div class="text-center p-8 bg-white rounded-2xl shadow-sm"> <div class="w-16 h-16 bg-blush/20 rounded-2xl flex items-center justify-center mx-auto mb-5"> <span class="text-3xl">👨‍🍳</span> </div> <h3 class="font-display text-lg font-bold text-chocolate mb-2">Follow the Steps</h3> <p class="text-sm text-slate-500">
Step-by-step guidance with pro tips and hints. Use Cook Mode for hands-free, one-step-at-a-time view.
</p> </div> <div class="text-center p-8 bg-white rounded-2xl shadow-sm"> <div class="w-16 h-16 bg-lavender/20 rounded-2xl flex items-center justify-center mx-auto mb-5"> <span class="text-3xl">⭐</span> </div> <h3 class="font-display text-lg font-bold text-chocolate mb-2">Enjoy & Share</h3> <p class="text-sm text-slate-500">
Make delicious frozen treats and share your favorites with friends and family.
</p> </div> </div> ` })} </div> </section>  <section class="py-16 md:py-20"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, {}, { "default": async ($$result3) => renderTemplate` <div class="bg-gradient-to-r from-berry to-blush-dark rounded-3xl p-10 md:p-16 text-center text-white"> <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
Ready to Start Making?
</h2> <p class="text-white/80 max-w-lg mx-auto mb-8 text-lg">
Browse our curated collection of tested Ninja Creami recipes and find your next favorite treat.
</p> <a href="/recipes" class="inline-block px-8 py-3.5 bg-white text-berry font-semibold rounded-full hover:bg-cream transition-colors shadow-lg">
Explore Recipes
</a> </div> ` })} </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/index.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
