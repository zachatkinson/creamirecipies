import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { P as createRenderInstruction, x as maybeRenderHead, a2 as addAttribute, L as renderTemplate, b8 as renderSlot, b9 as renderHead, b6 as unescapeHTML, F as Fragment } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import 'clsx';
import { L as LOCALES, t, g as getAlternateUrls } from './index_Bf_3aS85.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$LanguageSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LanguageSwitcher;
  const currentLocale = Astro2.locals.locale;
  const localeEntries = Object.entries(LOCALES);
  return renderTemplate`${maybeRenderHead()}<div class="relative" id="lang-switcher"> <button id="lang-btn" class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-chocolate rounded-full border border-slate-200 hover:border-blush transition-colors" aria-label="Change language" aria-expanded="false"> <span>${LOCALES[currentLocale].flag}</span> <span class="hidden sm:inline">${LOCALES[currentLocale].label}</span> <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="lang-dropdown" class="hidden absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 min-w-[160px]"> ${localeEntries.map(([code, { label, flag }]) => renderTemplate`<button${addAttribute([
    "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-cream transition-colors",
    code === currentLocale ? "text-berry font-medium bg-blush/10" : "text-slate-600"
  ], "class:list")}${addAttribute(code, "data-locale")}> <span>${flag}</span> <span>${label}</span> ${code === currentLocale && renderTemplate`<svg class="w-3.5 h-3.5 ml-auto text-berry" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg>`} </button>`)} </div> </div> ${renderScript($$result, "/Users/zach/web-projects/creami/src/components/layout/LanguageSwitcher.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/zach/web-projects/creami/src/components/layout/LanguageSwitcher.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const locale = Astro2.locals.locale;
  const navLinks = [
    { href: "/recipes", label: t("nav.recipes", locale) },
    { href: "/blog", label: t("nav.blog", locale) },
    { href: "/about", label: t("nav.about", locale) }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-cream-dark"> <nav class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16"> <!-- Logo --> <a href="/" class="flex items-center gap-2 group"> <span class="text-3xl" aria-hidden="true">🍦</span> <span class="font-display text-xl font-bold text-chocolate group-hover:text-berry transition-colors">
Creami Recipes
</span> </a> <!-- Search Bar --> <form action="/recipes" method="GET" role="search" class="hidden sm:flex flex-1 max-w-md mx-4"> <div class="relative w-full"> <label for="header-search" class="sr-only">${t("nav.searchPlaceholder", locale)}</label> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <input type="search" id="header-search" name="q" placeholder="{t('nav.searchPlaceholder', locale)}..." aria-label="{t('nav.searchPlaceholder', locale)}" class="w-full pl-10 pr-12 py-2 rounded-full bg-white/80 border border-slate-200 text-sm placeholder:text-slate-500 focus:border-blush focus:ring-1 focus:ring-blush outline-none transition-colors"> <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-500 hover:text-berry hover:bg-blush/10 transition-colors" aria-label="Submit search"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path> </svg> </button> </div> </form> <!-- Desktop Nav --> <div class="hidden md:flex items-center gap-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
    currentPath.startsWith(link.href) ? "bg-blush/40 text-berry" : "text-slate-600 hover:bg-blush/15 hover:text-chocolate"
  ], "class:list")}> ${link.label} </a>`)} </div> <!-- Language Switcher --> <div class="hidden md:block"> ${renderComponent($$result, "LanguageSwitcher", $$LanguageSwitcher, {})} </div> <!-- Mobile Menu Button --> <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-cream-dark transition-colors" aria-label="Toggle menu" aria-expanded="false"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path id="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> <!-- Mobile Nav --> <div id="mobile-menu" class="hidden md:hidden pb-4"> <div class="flex flex-col gap-1 pt-2 border-t border-cream-dark"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute([
    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
    currentPath.startsWith(link.href) ? "bg-blush/40 text-berry" : "text-slate-600 hover:bg-cream-dark"
  ], "class:list")}> ${link.label} </a>`)} </div> </div> </nav> </header> ${renderScript($$result, "/Users/zach/web-projects/creami/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/zach/web-projects/creami/src/components/layout/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Footer;
  const locale = Astro2.locals.locale;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-chocolate text-cream/80 mt-auto"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <!-- Brand --> <div class="md:col-span-1"> <a href="/" class="flex items-center gap-2 mb-4"> <span class="text-2xl">🍦</span> <span class="font-display text-lg font-bold text-cream">Creami Recipes</span> </a> <p class="text-sm text-cream/80">
Discover and share delicious Ninja Creami recipes with step-by-step guidance and pro tips.
</p> </div> <!-- Recipes --> <div> <h2 class="font-display text-sm font-bold text-white mb-4 uppercase tracking-wider">${t("footer.recipes", locale)}</h2> <ul class="space-y-2 text-sm"> <li><a href="/recipes" class="hover:text-cream transition-colors">${t("footer.allRecipes", locale)}</a></li> <li><a href="/recipes?base=ice-cream" class="hover:text-cream transition-colors">Ice Cream</a></li> <li><a href="/recipes?base=sorbet" class="hover:text-cream transition-colors">Sorbet</a></li> <li><a href="/recipes?base=gelato" class="hover:text-cream transition-colors">Gelato</a></li> <li><a href="/recipes?base=frozen-yogurt" class="hover:text-cream transition-colors">Frozen Yogurt</a></li> </ul> </div> <!-- Community --> <div> <h2 class="font-display text-sm font-bold text-white mb-4 uppercase tracking-wider">${t("footer.community", locale)}</h2> <ul class="space-y-2 text-sm"> <li><a href="/about" class="hover:text-cream transition-colors">${t("footer.aboutUs", locale)}</a></li> <li><a href="/blog" class="hover:text-cream transition-colors">Blog</a></li> </ul> </div> <!-- Legal --> <div> <h2 class="font-display text-sm font-bold text-white mb-4 uppercase tracking-wider">${t("footer.legal", locale)}</h2> <ul class="space-y-2 text-sm"> <li><a href="/privacy" class="hover:text-cream transition-colors">${t("footer.privacyPolicy", locale)}</a></li> <li><a href="/terms" class="hover:text-cream transition-colors">${t("footer.termsOfUse", locale)}</a></li> </ul> </div> </div> <div class="mt-10 pt-8 border-t border-cream/10 text-center text-sm text-cream/70"> <p>&copy; ${currentYear} ${t("site.name", locale)}. ${t("footer.disclaimer", locale)}</p> </div> </div> </footer>`;
}, "/Users/zach/web-projects/creami/src/components/layout/Footer.astro", void 0);

function buildRecipeJsonLd(recipe, siteUrl) {
  const totalMinutes = (recipe.prep_time_minutes ?? 0) + (recipe.freeze_time_hours ?? 24) * 60;
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.hero_image_url ? [recipe.hero_image_url] : [],
    author: {
      "@type": "Person",
      name: recipe.author.display_name || recipe.author.username
    },
    datePublished: recipe.published_at,
    prepTime: recipe.prep_time_minutes ? `PT${recipe.prep_time_minutes}M` : void 0,
    cookTime: recipe.freeze_time_hours ? `PT${recipe.freeze_time_hours}H` : void 0,
    totalTime: `PT${totalMinutes}M`,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : void 0,
    recipeCategory: recipe.base_type,
    recipeCuisine: "American",
    cookingMethod: "Ninja Creami",
    keywords: [
      "ninja creami",
      recipe.base_type,
      ...recipe.categories.map((c) => c.name),
      ...recipe.tags.map((t) => t.name)
    ].join(", "),
    recipeIngredient: recipe.ingredients.map(
      (i) => `${i.amount}${i.unit ? " " + i.unit : ""} ${i.name}`
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      "@type": "HowToStep",
      position: step.step_number,
      name: `Step ${step.step_number}`,
      text: step.instruction,
      ...step.hint ? { tip: { "@type": "HowToTip", text: step.hint } } : {},
      ...step.image_url ? { image: step.image_url } : {}
    })),
    ...recipe.rating_count > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: recipe.avg_rating.toFixed(1),
        ratingCount: recipe.rating_count.toString(),
        bestRating: "5",
        worstRating: "1"
      }
    } : {},
    tool: [
      { "@type": "HowToTool", name: "Ninja Creami" },
      ...(recipe.models ?? []).map((m) => ({ "@type": "HowToTool", name: m.name }))
    ],
    url: `${siteUrl}/recipes/${recipe.slug}`,
    ...recipe.video_url ? {
      video: {
        "@type": "VideoObject",
        name: `How to Make ${recipe.title}`,
        description: recipe.description,
        thumbnailUrl: recipe.video_thumbnail_url || recipe.hero_image_url || "",
        contentUrl: recipe.video_url,
        uploadDate: recipe.published_at
      }
    } : {}
  };
}
function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}
function buildWebSiteJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Creami Recipes",
    url: siteUrl,
    description: "Discover and share delicious Ninja Creami recipes with step-by-step guidance and pro tips.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/recipes?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}
function buildOrganizationJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Creami Recipes",
    url: siteUrl,
    logo: `${siteUrl}/logo.avif`,
    sameAs: []
  };
}
function generateRecipeFaqs(recipe) {
  const faqs = [];
  faqs.push({
    question: `How long does ${recipe.title} last in the freezer?`,
    answer: `Once processed in the Ninja Creami, ${recipe.title} is best enjoyed immediately for the creamiest texture. You can refreeze it for up to 2 weeks — just let it sit at room temperature for 5-10 minutes before re-processing with the Re-Spin function.`
  });
  const isSwirl = recipe.base_type === "Swirl" || recipe.title.toLowerCase().includes("swirl");
  if (isSwirl) {
    faqs.push({
      question: `Which Ninja Creami models can make ${recipe.title}?`,
      answer: `This recipe uses the swirl dispensing feature, which is exclusive to the Ninja CREAMi Scoop & Swirl (NC701). Other models can make the base recipe but cannot dispense it as a swirl.`
    });
  } else {
    faqs.push({
      question: `Which Ninja Creami models can make ${recipe.title}?`,
      answer: `This recipe works with all Ninja CREAMi models — the 7-in-1 (NC301), Deluxe, XL Deluxe 11-in-1 (NC501), and Scoop & Swirl (NC701). It also works with discontinued models like the Breeze (NC100) and original 5-in-1 (NC300). The ingredients are sized for a standard 16oz pint. If you have a 24oz Deluxe or XL Deluxe model, use our built-in ingredient scaler to adjust the quantities up.`
    });
  }
  if (recipe.difficulty === "beginner") {
    faqs.push({
      question: `Is ${recipe.title} easy to make?`,
      answer: `Yes! This is a beginner-friendly recipe with just ${recipe.ingredients.length} ingredients and ${recipe.steps.length} simple steps. It's a great recipe if you're new to the Ninja Creami.`
    });
  }
  const dietaryCategories = recipe.categories?.filter((c) => c.type === "dietary").map((c) => c.name) ?? [];
  if (dietaryCategories.length > 0) {
    faqs.push({
      question: `Is ${recipe.title} suitable for special diets?`,
      answer: `Yes, this recipe is: ${dietaryCategories.join(", ")}. Always check individual ingredient labels to confirm they meet your specific dietary requirements.`
    });
  }
  faqs.push({
    question: `What if my ${recipe.base_type.toLowerCase()} comes out crumbly?`,
    answer: `This is normal after the first spin. Select the Re-Spin function for a smoother, creamier result. If it's still crumbly after two re-spins, let the pint sit at room temperature for 3-5 minutes, then try again.`
  });
  const ingredientNames = recipe.ingredients.map((i) => i.name.toLowerCase());
  const allIngredients = ingredientNames.join(" ");
  if (allIngredients.match(/extract|peppermint|almond extract|vanilla extract/)) {
    faqs.push({
      question: `How much extract should I use? Can I add more for stronger flavor?`,
      answer: `Extracts are highly concentrated — a little goes a long way. Start with the amount listed and taste the base before freezing. You can always add more, but you can't remove it. Peppermint extract is especially potent — even 1/4 teaspoon extra can make it overpowering.`
    });
  }
  if (allIngredients.match(/protein powder|protein shake/)) {
    faqs.push({
      question: `Why does my protein ice cream need more re-spins?`,
      answer: `Protein-based recipes are denser and harder when frozen. It's completely normal to need 2-3 re-spins to achieve a creamy texture. Adding a tablespoon of cream cheese to the base can dramatically improve the texture of protein recipes.`
    });
  }
  if (allIngredients.match(/peanut butter|almond butter|cashew butter|hazelnut spread|biscoff/)) {
    faqs.push({
      question: `Should I warm the nut butter before adding it?`,
      answer: `For mix-ins and swirls, yes — microwave the nut butter for 10-15 seconds so it's drizzleable. This creates beautiful swirl ribbons. For the base, blend it cold with the other ingredients until completely smooth.`
    });
  }
  if (allIngredients.match(/bourbon|rum|kahlua|amaretto|wine|liqueur/)) {
    faqs.push({
      question: `Will the alcohol prevent this from freezing?`,
      answer: `Small amounts of alcohol (1-2 tablespoons) actually improve texture by slightly lowering the freezing point. However, too much will prevent the base from freezing solid, which is required for the Ninja Creami to process it. Stick to the amount listed in the recipe.`
    });
  }
  if (allIngredients.match(/frozen.*berr|frozen.*fruit|frozen.*mango|frozen.*peach/)) {
    faqs.push({
      question: `Can I use fresh fruit instead of frozen?`,
      answer: `Yes! Fresh fruit works great — just blend it smooth before pouring into the Creami pint. The frozen fruit in this recipe is for convenience and sometimes creates a thicker base. Either way, the Creami will freeze and process it the same way.`
    });
  }
  if (ingredientNames.some((n) => n.includes("cream cheese"))) {
    faqs.push({
      question: `Why does this recipe use cream cheese?`,
      answer: `Cream cheese is a Ninja Creami secret weapon — it acts as a natural stabilizer, preventing icy texture and creating an incredibly smooth, scoopable result. Make sure to soften it completely (microwave 10-15 seconds) and whisk until smooth before adding other liquids.`
    });
  }
  if (allIngredients.match(/coconut milk|coconut cream/)) {
    faqs.push({
      question: `Do I need full-fat coconut milk?`,
      answer: `Yes — full-fat coconut milk (17-22% fat) is essential for a creamy result. Lite coconut milk (5-7% fat) has too much water and will produce an icy, hard texture. Look for canned coconut milk (not the carton kind meant for drinking, which is only 2-4% fat). Shake the can vigorously before opening to combine the separated cream and water layers. Brands like Thai Kitchen and Aroy-D are popular choices.`
    });
  }
  if (allIngredients.match(/whole milk/)) {
    faqs.push({
      question: `What kind of milk should I use? Is whole milk the same as homo milk?`,
      answer: `Yes — whole milk, homogenized milk (homo milk), vitamin D milk, and full-fat milk are all the same thing: 3.25% milk fat (MF). Do NOT substitute with 2% (too lean), 1% (way too lean), or skim/0% (will be rock-hard and icy). The fat is critical for creamy texture. International equivalents: UK "full-fat milk" (3.5%), Australia "full cream milk" (3.4%), France "lait entier" (3.5%). All work perfectly.`
    });
  }
  if (allIngredients.match(/heavy cream/)) {
    faqs.push({
      question: `What's the difference between heavy cream, heavy whipping cream, and whipping cream?`,
      answer: `Heavy cream and heavy whipping cream are the same thing: 36% milk fat (MF). Use either interchangeably. Here's the full breakdown: Heavy/heavy whipping cream (36% MF) — best results, richest texture. Whipping cream (30-35% MF) — works well, slightly lighter. Half-and-half (10-12% MF) — do NOT use as a substitute, not enough fat. Coffee creamer — do NOT use. International equivalents: UK "double cream" (48% MF — use 3/4 the amount), Australia "thickened cream" (35% MF), France "crème entière" (30-40% MF). The higher the fat percentage, the creamier and smoother your result.`
    });
  }
  if (allIngredients.match(/granulated sugar/)) {
    faqs.push({
      question: `Can I substitute a different sweetener for granulated sugar?`,
      answer: `Sugar does more than sweeten — it lowers the freezing point and prevents icy texture. You can substitute with: allulose (best for keto — doesn't crystallize when frozen), coconut sugar (1:1 swap but darker color), or monk fruit blend (1:1 swap). Avoid liquid sweeteners like honey or maple syrup as a full replacement — they change the liquid ratio.`
    });
  }
  if (ingredientNames.some((n) => n.includes("greek yogurt"))) {
    faqs.push({
      question: `Does the brand of Greek yogurt matter? Full-fat or non-fat?`,
      answer: `Use full-fat (whole milk) Greek yogurt (8-10% MF) for the best, creamiest results. 2% Greek yogurt will work but produces a slightly icier texture — add a tablespoon of cream cheese to compensate. Non-fat/0% Greek yogurt is not recommended — it will be icy without stabilizers. Any brand works, but thicker brands like Fage (10% MF) or Chobani tend to give better results than runnier ones. Regular yogurt (non-Greek) is too liquid — don't substitute it 1:1.`
    });
  }
  if (allIngredients.match(/condensed milk|sweetened condensed/)) {
    faqs.push({
      question: `Can I use evaporated milk instead of sweetened condensed milk?`,
      answer: `No — they are very different. Sweetened condensed milk is thick, sweet, and acts as both sweetener and stabilizer. Evaporated milk is unsweetened and thin. Using evaporated milk instead would result in a much less sweet, icier texture. Stick with sweetened condensed milk for this recipe.`
    });
  }
  if (allIngredients.match(/food coloring/)) {
    faqs.push({
      question: `Is the food coloring necessary?`,
      answer: `No — food coloring is purely optional and cosmetic. It has no effect on flavor or texture. Skip it if you prefer a natural look.`
    });
  }
  return faqs;
}
function buildRecipeFaqJsonLd(recipe) {
  return buildFaqJsonLd(generateRecipeFaqs(recipe));
}
function buildFaqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c, _d;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "Discover and share delicious Ninja Creami recipes. Step-by-step guidance, ratings, and pro tips for perfect frozen treats every time.",
    image = "/og-default.avif",
    type = "website",
    jsonLd,
    breadcrumbs,
    noindex = false
  } = Astro2.props;
  const siteUrl = Astro2.site?.toString().replace(/\/$/, "") ?? "";
  const isHome = title === "Home";
  const currentPath = Astro2.url.pathname;
  const canonicalUrl = new URL(currentPath, Astro2.site);
  const fullTitle = title === "Home" ? "Creami Recipes" : `${title} | Creami Recipes`;
  const alternateUrls = getAlternateUrls(siteUrl, currentPath);
  return renderTemplate(_d || (_d = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', ">", '<link rel="canonical"', "><!-- Hreflang (i18n: en, fr, es) -->", '<link rel="alternate" hreflang="x-default"', '><!-- Webmaster Verification (PLACEHOLDER: replace with real codes) --><meta name="google-site-verification" content="PLACEHOLDER_GOOGLE_VERIFICATION"><meta name="msvalidate.01" content="PLACEHOLDER_BING_VERIFICATION"><meta name="p:domain_verify" content="PLACEHOLDER_PINTEREST_VERIFICATION"><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet"><!-- Open Graph --><meta property="og:title"', '><meta property="og:description"', '><meta property="og:type"', '><meta property="og:url"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:site_name" content="Creami Recipes"><meta property="og:locale" content="en_US"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Pinterest Rich Pins --><meta name="pinterest-rich-pin" content="true"><!-- Favicon + PWA --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.json"><!-- Preconnect to Supabase for faster API calls --><link rel="preconnect"', `><!-- RSS Feed --><link rel="alternate" type="application/rss+xml" title="Creami Recipes" href="/rss.xml"><!-- Mobile / PWA --><meta name="theme-color" content="#FFF8F0"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Creami Recipes"><meta name="application-name" content="Creami Recipes"><meta name="msapplication-TileColor" content="#FFF8F0"><!-- Google Analytics (PLACEHOLDER: replace with real GA4 ID) --><!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PLACEHOLDER');
    </script> --><title>`, "</title>", "", "", "", '</head> <body class="min-h-screen flex flex-col"> <!-- Skip to main content (WCAG 2.4.1) --> <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-berry focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg">\nSkip to main content\n</a> ', ' <main id="main-content" class="flex-1" role="main"> ', " </main> ", " <!-- Register Service Worker --> <script>\n      if ('serviceWorker' in navigator) {\n        window.addEventListener('load', () => {\n          navigator.serviceWorker.register('/sw.js').catch(() => {});\n        });\n      }\n    </script> </body> </html>"])), addAttribute(description, "content"), noindex ? renderTemplate`<meta name="robots" content="noindex, nofollow">` : renderTemplate`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`, addAttribute(canonicalUrl.href, "href"), alternateUrls.map(({ locale, url }) => renderTemplate`<link rel="alternate"${addAttribute(locale, "hreflang")}${addAttribute(url, "href")}>`), addAttribute(canonicalUrl.href, "href"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(type, "content"), addAttribute(canonicalUrl.href, "content"), addAttribute(image, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute("https://qilbrsswjhnjdkbdvdll.supabase.co", "href"), fullTitle, jsonLd && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(jsonLd))), isHome && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate(_b || (_b = __template(['<script type="application/ld+json">', '</script><script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(buildWebSiteJsonLd(siteUrl))), unescapeHTML(JSON.stringify(buildOrganizationJsonLd(siteUrl)))) })}`, breadcrumbs && breadcrumbs.length > 0 && renderTemplate(_c || (_c = __template(['<script type="application/ld+json">', "</script>"])), unescapeHTML(JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)))), renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/zach/web-projects/creami/src/components/layout/BaseLayout.astro", void 0);

export { $$BaseLayout as $, buildRecipeJsonLd as a, buildFaqJsonLd as b, buildRecipeFaqJsonLd as c, generateRecipeFaqs as g, renderScript as r };
