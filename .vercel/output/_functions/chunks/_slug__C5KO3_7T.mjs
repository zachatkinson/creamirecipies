import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { x as maybeRenderHead, a2 as addAttribute, L as renderTemplate, b7 as defineScriptVars, b6 as unescapeHTML } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { r as renderScript, a as buildRecipeJsonLd, g as generateRecipeFaqs, c as buildRecipeFaqJsonLd, $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useCallback, useEffect } from 'react';
import { $ as $$StepCard } from './StepCard_MmDk2mXr.mjs';
import 'clsx';
import { $ as $$RatingStars } from './RatingStars_Dd-NYA1I.mjs';
import { $ as $$ScrollReveal } from './ScrollReveal_DvuQgtHV.mjs';
import { $ as $$AdUnit } from './AdUnit_BZmLqD-f.mjs';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { a as getRecipeBySlug, b as getCreamiModels } from './recipes_7tIktda5.mjs';
import { D as DEFAULT_LOCALE } from './index_Bf_3aS85.mjs';

const GROUP_LABELS = {
  base: "Base Ingredients",
  "mix-ins": "Mix-Ins",
  topping: "Toppings",
  swirl: "Swirl"
};
const GROUP_ORDER = ["base", "mix-ins", "swirl", "topping"];
const METRIC_CONVERSIONS = {
  "cup": { unit: "ml", multiplier: 240 },
  "tablespoon": { unit: "ml", multiplier: 15 },
  "teaspoon": { unit: "ml", multiplier: 5 },
  "oz": { unit: "g", multiplier: 28.35 },
  "lb": { unit: "g", multiplier: 453.6 },
  "fl oz": { unit: "ml", multiplier: 29.6 }
};
function convertToMetric(amount, unit) {
  if (!unit) return { amount, unit: "" };
  const conversion = METRIC_CONVERSIONS[unit.toLowerCase()];
  if (!conversion) return { amount, unit };
  const num = parseFloat(amount);
  if (isNaN(num)) return { amount, unit };
  const converted = num * conversion.multiplier;
  return {
    amount: converted >= 100 ? Math.round(converted).toString() : converted.toFixed(0),
    unit: conversion.unit
  };
}
function scaleAmount(amount, scale) {
  if (scale === 1) return amount;
  const fractionMatch = amount.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num2 = parseInt(fractionMatch[1]) * scale;
    const den = parseInt(fractionMatch[2]);
    const value = num2 / den;
    return formatNumber(value);
  }
  const mixedMatch = amount.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num2 = parseInt(mixedMatch[2]);
    const den = parseInt(mixedMatch[3]);
    const value = (whole + num2 / den) * scale;
    return formatNumber(value);
  }
  const num = parseFloat(amount);
  if (!isNaN(num)) {
    return formatNumber(num * scale);
  }
  return amount;
}
function formatNumber(n) {
  const fractions = [
    [0.125, "1/8"],
    [0.25, "1/4"],
    [0.333, "1/3"],
    [0.375, "3/8"],
    [0.5, "1/2"],
    [0.625, "5/8"],
    [0.667, "2/3"],
    [0.75, "3/4"],
    [0.875, "7/8"]
  ];
  const whole = Math.floor(n);
  const frac = n - whole;
  if (frac < 0.05) return String(whole || "0");
  const closest = fractions.reduce(
    (best, [val, label]) => Math.abs(frac - val) < Math.abs(frac - best[0]) ? [val, label] : best,
    [999, ""]
  );
  if (Math.abs(frac - closest[0]) < 0.05) {
    return whole > 0 ? `${whole} ${closest[1]}` : closest[1];
  }
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}
function ScalableIngredients({ ingredients, models, recipePintSize, isSwirl, modelOnly = false }) {
  const [scale, setScale] = useState(1);
  const [measureSystem, setMeasureSystem] = useState(() => {
    if (typeof document !== "undefined") {
      return document.cookie.split("; ").find((c) => c.startsWith("measure_system="))?.split("=")[1] || "us";
    }
    return "us";
  });
  useCallback((newScale) => {
    setScale(newScale);
  }, []);
  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;
      if (detail?.scale) setScale(detail.scale);
    };
    window.addEventListener("creami-model-change", handler);
    return () => window.removeEventListener("creami-model-change", handler);
  }, []);
  const toggleMeasureSystem = useCallback(() => {
    setMeasureSystem((prev) => {
      const next = prev === "us" ? "metric" : "us";
      document.cookie = `measure_system=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      return next;
    });
  }, []);
  const groups = {};
  for (const ing of ingredients) {
    const group = ing.group_name || "base";
    if (!groups[group]) groups[group] = [];
    groups[group].push(ing);
  }
  const sortedGroups = GROUP_ORDER.filter((g) => groups[g]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 pb-3 border-b border-slate-100", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: "Units:" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleMeasureSystem,
          className: `px-3 py-1 text-xs font-medium rounded-full transition-colors ${measureSystem === "us" ? "bg-[#8B3A62] text-white" : "bg-slate-100 text-slate-600"}`,
          children: "US"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleMeasureSystem,
          className: `px-3 py-1 text-xs font-medium rounded-full transition-colors ${measureSystem === "metric" ? "bg-[#8B3A62] text-white" : "bg-slate-100 text-slate-600"}`,
          children: "Metric"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sortedGroups.map((groupName) => /* @__PURE__ */ jsxs("div", { children: [
      sortedGroups.length > 1 && /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3", children: GROUP_LABELS[groupName] ?? groupName }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: groups[groupName].map((ingredient, i) => {
        const scaledAmount = scaleAmount(ingredient.amount, scale);
        const isScaled = scale !== 1;
        let displayAmount = scaledAmount;
        let displayUnit = ingredient.unit ?? "";
        if (measureSystem === "metric" && ingredient.unit) {
          const scaledNum = parseFloat(scaledAmount.replace(/\s+/g, "+").split("+").reduce((a, b) => {
            const frac = b.match(/^(\d+)\/(\d+)$/);
            return String(Number(a) + (frac ? Number(frac[1]) / Number(frac[2]) : Number(b) || 0));
          }, "0"));
          if (!isNaN(scaledNum)) {
            const metric = convertToMetric(String(scaledNum), ingredient.unit);
            displayAmount = metric.amount;
            displayUnit = metric.unit;
          }
        }
        const isChanged = isScaled || measureSystem === "metric";
        return /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-start gap-3 py-2 border-b border-slate-50 last:border-0",
            children: [
              /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 border-[#F4B8C1]/40" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700", children: ingredient.name }),
                /* @__PURE__ */ jsxs("span", { className: `ml-2 text-sm ${isChanged ? "text-[#8B3A62] font-medium" : "text-slate-500"}`, children: [
                  displayAmount,
                  displayUnit ? ` ${displayUnit}` : ""
                ] }),
                isScaled && measureSystem === "us" && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-[10px] text-slate-400 line-through", children: [
                  ingredient.amount,
                  ingredient.unit ? ` ${ingredient.unit}` : ""
                ] })
              ] })
            ]
          },
          i
        );
      }) })
    ] }, groupName)) })
  ] });
}

const $$ShareButtons = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ShareButtons;
  const { title, url, description = "" } = Astro2.props;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDesc = encodeURIComponent(description);
  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877F2",
      icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "#000000",
      icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      color: "#E60023",
      icon: "M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      color: "#64748B",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center gap-2"> <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Share:</span> ${shareLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} target="_blank" rel="noopener noreferrer" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"${addAttribute(`Share on ${link.name}`, "aria-label")}${addAttribute(`Share on ${link.name}`, "title")}> <svg class="w-4 h-4" fill="none"${addAttribute(link.color, "stroke")} stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(link.icon, "d")}></path> </svg> </a>`)} <button id="copy-link-btn" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors" aria-label="Copy link" title="Copy link"> <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path> </svg> </button> </div> ${renderScript($$result, "/Users/zach/web-projects/creami/src/components/recipe/ShareButtons.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/zach/web-projects/creami/src/components/recipe/ShareButtons.astro", void 0);

async function getRecipeTranslation(client, recipeId, locale) {
  if (locale === DEFAULT_LOCALE) return null;
  const { data } = await client.from("recipe_translations").select("title, description, steps, ingredients").eq("recipe_id", recipeId).eq("locale", locale).single();
  return data;
}
function applyTranslation(recipe, translation) {
  if (!translation) return recipe;
  return {
    ...recipe,
    title: translation.title || recipe.title,
    description: translation.description || recipe.description
  };
}
async function getIngredientTranslations(client, locale) {
  if (locale === DEFAULT_LOCALE) return /* @__PURE__ */ new Map();
  const column = `name_${locale}`;
  const { data } = await client.from("master_ingredients").select(`id, ${column}`).not(column, "is", null);
  const map = /* @__PURE__ */ new Map();
  if (data) {
    for (const row of data) {
      const translated = row[column];
      if (translated) map.set(row.id, translated);
    }
  }
  return map;
}
const RECIPE_UI = {
  "ingredients": { en: "Ingredients", fr: "Ingrédients", es: "Ingredientes", de: "Zutaten", pt: "Ingredientes" },
  "directions": { en: "Directions", fr: "Instructions", es: "Instrucciones", de: "Zubereitung", pt: "Modo de Preparo" },
  "cookMode": { en: "Cook Mode", fr: "Mode Cuisine", es: "Modo Cocina", de: "Kochmodus", pt: "Modo Cozinha" },
  "beforeYouBegin": { en: "Before You Begin", fr: "Avant de Commencer", es: "Antes de Comenzar", de: "Bevor Sie Beginnen", pt: "Antes de Começar" },
  "yourModel": { en: "Your Creami Model", fr: "Votre Modèle Creami", es: "Su Modelo Creami", de: "Ihr Creami-Modell", pt: "Seu Modelo Creami" },
  "selectModel": { en: "Select your model — ingredients will auto-scale to your pint size.", fr: "Sélectionnez votre modèle — les ingrédients s'ajusteront automatiquement.", es: "Seleccione su modelo — los ingredientes se ajustarán automáticamente.", de: "Wählen Sie Ihr Modell — die Zutaten werden automatisch angepasst.", pt: "Selecione seu modelo — os ingredientes serão ajustados automaticamente." },
  "selectYourModel": { en: "Select your Creami model...", fr: "Choisissez votre modèle Creami...", es: "Seleccione su modelo Creami...", de: "Wählen Sie Ihr Creami-Modell...", pt: "Selecione seu modelo Creami..." },
  "commonQuestions": { en: "Common Questions", fr: "Questions Fréquentes", es: "Preguntas Frecuentes", de: "Häufige Fragen", pt: "Perguntas Frequentes" },
  "proTip": { en: "Pro Tip", fr: "Astuce de Pro", es: "Consejo Pro", de: "Profi-Tipp", pt: "Dica Profissional" },
  "allergenWarning": { en: "Allergen Warning — Contains:", fr: "Avertissement Allergènes — Contient :", es: "Advertencia de Alérgenos — Contiene:", de: "Allergen-Warnung — Enthält:", pt: "Aviso de Alérgenos — Contém:" },
  "checkLabels": { en: "Always verify individual ingredient labels for specific allergen information.", fr: "Vérifiez toujours les étiquettes individuelles des ingrédients.", es: "Siempre verifique las etiquetas individuales de los ingredientes.", de: "Überprüfen Sie immer die einzelnen Zutatenetiketten.", pt: "Sempre verifique os rótulos individuais dos ingredientes." },
  "share": { en: "Share:", fr: "Partager :", es: "Compartir:", de: "Teilen:", pt: "Compartilhar:" },
  "print": { en: "Print", fr: "Imprimer", es: "Imprimir", de: "Drucken", pt: "Imprimir" },
  "prep": { en: "Prep", fr: "Préparation", es: "Preparación", de: "Vorbereitung", pt: "Preparo" },
  "freeze": { en: "Freeze", fr: "Congélation", es: "Congelación", de: "Einfrieren", pt: "Congelamento" },
  "total": { en: "Total", fr: "Total", es: "Total", de: "Gesamt", pt: "Total" },
  "servings": { en: "Servings", fr: "Portions", es: "Porciones", de: "Portionen", pt: "Porções" },
  "creamiProgram": { en: "Creami Program:", fr: "Programme Creami :", es: "Programa Creami:", de: "Creami-Programm:", pt: "Programa Creami:" },
  "watchVideo": { en: "Watch How to Make It", fr: "Regardez Comment le Préparer", es: "Mira Cómo Prepararlo", de: "Schau dir die Zubereitung an", pt: "Veja Como Preparar" },
  "units": { en: "Units:", fr: "Unités :", es: "Unidades:", de: "Einheiten:", pt: "Unidades:" }
};
function ui(key, locale) {
  return RECIPE_UI[key]?.[locale] ?? RECIPE_UI[key]?.["en"] ?? key;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const locale = Astro2.locals.locale;
  let recipe = await getRecipeBySlug(supabase, slug);
  if (!recipe) {
    return Astro2.redirect("/404");
  }
  const translation = await getRecipeTranslation(supabase, recipe.id, locale);
  if (translation) {
    recipe = applyTranslation(recipe, translation);
  }
  const ingredientNames = await getIngredientTranslations(supabase, locale);
  if (locale !== "en") {
    for (const ing of recipe.ingredients) {
      if (ing.master_ingredient_id && ingredientNames.has(ing.master_ingredient_id)) {
        ing.translated_name = ingredientNames.get(ing.master_ingredient_id);
      }
    }
  }
  const siteUrl = Astro2.site?.toString().replace(/\/$/, "") ?? "";
  const recipeJsonLd = buildRecipeJsonLd(recipe, siteUrl);
  const recipeFaqs = generateRecipeFaqs(recipe);
  const recipeFaqJsonLd = buildRecipeFaqJsonLd(recipe);
  const allergenKeywords = {
    "Dairy": ["cream", "milk", "yogurt", "cheese", "butter", "eggnog", "mascarpone", "condensed milk", "evaporated milk"],
    "Nuts": ["almond", "pecan", "walnut", "cashew", "hazelnut", "pistachio", "macadamia"],
    "Peanuts": ["peanut"],
    "Gluten": ["cookie", "cracker", "wafer", "cereal", "pretzel", "ladyfinger", "shortbread", "biscoff", "brownie", "cake", "graham"],
    "Eggs": ["egg", "eggnog"],
    "Soy": ["soy"],
    "Sesame": ["sesame", "tahini"]
  };
  const detectedAllergens = [];
  const ingredientText = recipe.ingredients.map((i) => i.name.toLowerCase()).join(" ");
  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    if (keywords.some((kw) => ingredientText.includes(kw))) {
      if (allergen === "Dairy" && !keywords.some((kw) => ingredientText.includes(kw) && !ingredientText.match(new RegExp(`coconut\\s+${kw}|almond\\s+${kw}|oat\\s+${kw}|cashew\\s+${kw}`)))) {
        const hasDairy = recipe.ingredients.some((i) => {
          const n = i.name.toLowerCase();
          return (n.includes("cream") || n.includes("milk") || n.includes("yogurt") || n.includes("cheese") || n.includes("butter") || n.includes("eggnog") || n.includes("mascarpone")) && !n.includes("coconut") && !n.includes("almond") && !n.includes("oat") && !n.includes("cashew") && !n.includes("dairy-free") && !n.includes("vegan") && !n.includes("cookie butter") && !n.includes("peanut butter") && !n.includes("almond butter") && !n.includes("cashew butter");
        });
        if (hasDairy) detectedAllergens.push(allergen);
      } else if (allergen === "Nuts") {
        const hasNuts = recipe.ingredients.some((i) => {
          const n = i.name.toLowerCase();
          return keywords.some((kw) => n.includes(kw)) && !n.includes("milk") && !n.includes("extract");
        });
        if (hasNuts) detectedAllergens.push(allergen);
      } else {
        detectedAllergens.push(allergen);
      }
    }
  }
  const breadcrumbs = [
    { name: "Home", url: siteUrl },
    { name: "Recipes", url: `${siteUrl}/recipes` },
    { name: recipe.title, url: `${siteUrl}/recipes/${recipe.slug}` }
  ];
  const allModels = await getCreamiModels(supabase);
  const currentModels = allModels.filter((m) => !m.is_discontinued).map((m) => ({ slug: m.slug, name: m.name, pint_size_oz: m.pint_size_oz ?? 16 }));
  const scalableIngredients = recipe.ingredients.map((i) => ({
    name: i.name,
    amount: i.amount,
    unit: i.unit,
    group_name: i.group_name ?? "base"
  }));
  const difficultyColors = {
    beginner: "bg-mint/40 text-[#1a6b4f]",
    intermediate: "bg-vanilla/40 text-[#5C3D2E]",
    advanced: "bg-blush/40 text-[#6b1d42]"
  };
  const totalTime = (recipe.prep_time_minutes ?? 0) + (recipe.freeze_time_hours ?? 24) * 60;
  const totalTimeLabel = totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60 > 0 ? `${totalTime % 60}m` : ""}` : `${totalTime}m`;
  return renderTemplate(_b || (_b = __template(["", ' <!-- Cook Mode Modal --> <div id="cook-mode-overlay" class="fixed inset-0 z-50 bg-chocolate/95 text-white hidden flex-col"> <div class="flex items-center justify-between p-4 border-b border-white/10"> <h3 class="font-display text-lg font-bold">', '</h3> <button id="cook-mode-close" class="p-2 hover:bg-white/10 rounded-lg transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <div class="flex-1 flex flex-col items-center justify-center p-8"> <div class="text-sm text-white/40 mb-2">\nStep <span id="cm-current">1</span> of <span id="cm-total">', '</span> </div> <p id="cm-instruction" class="text-2xl md:text-3xl text-center leading-relaxed max-w-2xl mb-4"></p> <div id="cm-hint" class="hidden text-white/60 text-center max-w-xl mb-8 bg-white/5 p-4 rounded-xl"></div> <div class="flex items-center gap-4"> <button id="cm-prev" class="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors">\nPrevious\n</button> <button id="cm-next" class="px-6 py-3 bg-blush text-chocolate font-medium rounded-full hover:bg-blush/90 transition-colors">\nNext\n</button> </div> </div> </div> <script>(function(){', "\n  // Cook Mode\n  const overlay = document.getElementById('cook-mode-overlay');\n  const openBtn = document.getElementById('cook-mode-btn');\n  const closeBtn = document.getElementById('cook-mode-close');\n  const prevBtn = document.getElementById('cm-prev');\n  const nextBtn = document.getElementById('cm-next');\n  const instructionEl = document.getElementById('cm-instruction');\n  const hintEl = document.getElementById('cm-hint');\n  const currentEl = document.getElementById('cm-current');\n\n  let currentStep = 0;\n\n  function updateCookMode() {\n    const step = steps[currentStep];\n    if (!step || !instructionEl || !hintEl || !currentEl || !prevBtn || !nextBtn) return;\n    instructionEl.textContent = step.instruction;\n    currentEl.textContent = String(currentStep + 1);\n    if (step.hint) {\n      hintEl.textContent = step.hint;\n      hintEl.classList.remove('hidden');\n    } else {\n      hintEl.classList.add('hidden');\n    }\n    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';\n    nextBtn.textContent = currentStep === steps.length - 1 ? 'Done' : 'Next';\n  }\n\n  openBtn?.addEventListener('click', () => {\n    currentStep = 0;\n    updateCookMode();\n    overlay?.classList.remove('hidden');\n    overlay?.classList.add('flex');\n    document.body.style.overflow = 'hidden';\n  });\n\n  closeBtn?.addEventListener('click', () => {\n    overlay?.classList.add('hidden');\n    overlay?.classList.remove('flex');\n    document.body.style.overflow = '';\n  });\n\n  prevBtn?.addEventListener('click', () => {\n    if (currentStep > 0) { currentStep--; updateCookMode(); }\n  });\n\n  nextBtn?.addEventListener('click', () => {\n    if (currentStep < steps.length - 1) { currentStep++; updateCookMode(); }\n    else { closeBtn?.click(); }\n  });\n\n  // Keyboard navigation\n  document.addEventListener('keydown', (e) => {\n    if (overlay?.classList.contains('hidden')) return;\n    if (e.key === 'ArrowRight' || e.key === ' ') nextBtn?.click();\n    if (e.key === 'ArrowLeft') prevBtn?.click();\n    if (e.key === 'Escape') closeBtn?.click();\n  });\n\n  // Before You Begin: model selector → dispatches custom event\n  const bybSelect = document.getElementById('byb-model-select');\n  const bybNote = document.getElementById('byb-scale-note');\n\n  // Load saved model\n  const savedModel = document.cookie.split('; ').find(c => c.startsWith('user_creami_model='))?.split('=')[1];\n  if (savedModel && bybSelect) {\n    const opts = Array.from(bybSelect.options);\n    const match = opts.find(o => o.value.startsWith(savedModel + '|'));\n    if (match) bybSelect.value = match.value;\n  }\n\n  bybSelect?.addEventListener('change', () => {\n    const val = bybSelect.value;\n    if (!val) return;\n    const [slug, sizeStr] = val.split('|');\n    const pintSize = parseInt(sizeStr);\n    const recipePintSize = 16; // all recipes are 16oz\n    const scale = pintSize / recipePintSize;\n\n    // Save to cookie\n    document.cookie = `user_creami_model=${slug}; path=/; max-age=${60 * 60 * 24 * 365}`;\n\n    // Show scale note\n    if (bybNote) {\n      if (scale !== 1) {\n        bybNote.textContent = `Ingredients scaled to ${pintSize}oz for your model.`;\n        bybNote.classList.remove('hidden');\n      } else {\n        bybNote.classList.add('hidden');\n      }\n    }\n\n    // Dispatch event for React ScalableIngredients to pick up\n    window.dispatchEvent(new CustomEvent('creami-model-change', { detail: { slug, pintSize, scale } }));\n  });\n})();<\/script>"], ["", ' <!-- Cook Mode Modal --> <div id="cook-mode-overlay" class="fixed inset-0 z-50 bg-chocolate/95 text-white hidden flex-col"> <div class="flex items-center justify-between p-4 border-b border-white/10"> <h3 class="font-display text-lg font-bold">', '</h3> <button id="cook-mode-close" class="p-2 hover:bg-white/10 rounded-lg transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <div class="flex-1 flex flex-col items-center justify-center p-8"> <div class="text-sm text-white/40 mb-2">\nStep <span id="cm-current">1</span> of <span id="cm-total">', '</span> </div> <p id="cm-instruction" class="text-2xl md:text-3xl text-center leading-relaxed max-w-2xl mb-4"></p> <div id="cm-hint" class="hidden text-white/60 text-center max-w-xl mb-8 bg-white/5 p-4 rounded-xl"></div> <div class="flex items-center gap-4"> <button id="cm-prev" class="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors">\nPrevious\n</button> <button id="cm-next" class="px-6 py-3 bg-blush text-chocolate font-medium rounded-full hover:bg-blush/90 transition-colors">\nNext\n</button> </div> </div> </div> <script>(function(){', "\n  // Cook Mode\n  const overlay = document.getElementById('cook-mode-overlay');\n  const openBtn = document.getElementById('cook-mode-btn');\n  const closeBtn = document.getElementById('cook-mode-close');\n  const prevBtn = document.getElementById('cm-prev');\n  const nextBtn = document.getElementById('cm-next');\n  const instructionEl = document.getElementById('cm-instruction');\n  const hintEl = document.getElementById('cm-hint');\n  const currentEl = document.getElementById('cm-current');\n\n  let currentStep = 0;\n\n  function updateCookMode() {\n    const step = steps[currentStep];\n    if (!step || !instructionEl || !hintEl || !currentEl || !prevBtn || !nextBtn) return;\n    instructionEl.textContent = step.instruction;\n    currentEl.textContent = String(currentStep + 1);\n    if (step.hint) {\n      hintEl.textContent = step.hint;\n      hintEl.classList.remove('hidden');\n    } else {\n      hintEl.classList.add('hidden');\n    }\n    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';\n    nextBtn.textContent = currentStep === steps.length - 1 ? 'Done' : 'Next';\n  }\n\n  openBtn?.addEventListener('click', () => {\n    currentStep = 0;\n    updateCookMode();\n    overlay?.classList.remove('hidden');\n    overlay?.classList.add('flex');\n    document.body.style.overflow = 'hidden';\n  });\n\n  closeBtn?.addEventListener('click', () => {\n    overlay?.classList.add('hidden');\n    overlay?.classList.remove('flex');\n    document.body.style.overflow = '';\n  });\n\n  prevBtn?.addEventListener('click', () => {\n    if (currentStep > 0) { currentStep--; updateCookMode(); }\n  });\n\n  nextBtn?.addEventListener('click', () => {\n    if (currentStep < steps.length - 1) { currentStep++; updateCookMode(); }\n    else { closeBtn?.click(); }\n  });\n\n  // Keyboard navigation\n  document.addEventListener('keydown', (e) => {\n    if (overlay?.classList.contains('hidden')) return;\n    if (e.key === 'ArrowRight' || e.key === ' ') nextBtn?.click();\n    if (e.key === 'ArrowLeft') prevBtn?.click();\n    if (e.key === 'Escape') closeBtn?.click();\n  });\n\n  // Before You Begin: model selector → dispatches custom event\n  const bybSelect = document.getElementById('byb-model-select');\n  const bybNote = document.getElementById('byb-scale-note');\n\n  // Load saved model\n  const savedModel = document.cookie.split('; ').find(c => c.startsWith('user_creami_model='))?.split('=')[1];\n  if (savedModel && bybSelect) {\n    const opts = Array.from(bybSelect.options);\n    const match = opts.find(o => o.value.startsWith(savedModel + '|'));\n    if (match) bybSelect.value = match.value;\n  }\n\n  bybSelect?.addEventListener('change', () => {\n    const val = bybSelect.value;\n    if (!val) return;\n    const [slug, sizeStr] = val.split('|');\n    const pintSize = parseInt(sizeStr);\n    const recipePintSize = 16; // all recipes are 16oz\n    const scale = pintSize / recipePintSize;\n\n    // Save to cookie\n    document.cookie = \\`user_creami_model=\\${slug}; path=/; max-age=\\${60 * 60 * 24 * 365}\\`;\n\n    // Show scale note\n    if (bybNote) {\n      if (scale !== 1) {\n        bybNote.textContent = \\`Ingredients scaled to \\${pintSize}oz for your model.\\`;\n        bybNote.classList.remove('hidden');\n      } else {\n        bybNote.classList.add('hidden');\n      }\n    }\n\n    // Dispatch event for React ScalableIngredients to pick up\n    window.dispatchEvent(new CustomEvent('creami-model-change', { detail: { slug, pintSize, scale } }));\n  });\n})();<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": recipe.meta_title || recipe.title, "description": recipe.meta_description || recipe.description, "image": recipe.hero_image_url ?? void 0, "type": "article", "jsonLd": recipeJsonLd, "breadcrumbs": breadcrumbs }, { "default": async ($$result2) => renderTemplate`    ${maybeRenderHead()}<section class="relative bg-gradient-to-b from-cream to-white"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16"> ${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up" }, { "default": async ($$result3) => renderTemplate`  <nav class="flex items-center gap-2 text-sm text-slate-500 mb-6"> <a href="/" class="hover:text-berry transition-colors">Home</a> <span>/</span> <a href="/recipes" class="hover:text-berry transition-colors">Recipes</a> <span>/</span> <span class="text-slate-600">${recipe.title}</span> </nav> <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"> <!-- Image --> <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-dark shadow-lg"> ${recipe.hero_image_url ? renderTemplate`<img${addAttribute(recipe.hero_image_url, "src")}${addAttribute(recipe.title, "alt")} class="w-full h-full object-cover">` : renderTemplate`<div class="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blush/20 to-lavender/20">
🍦
</div>`} </div> <!-- Info --> <div>  ${recipe.is_sponsored && renderTemplate`<div class="flex items-center gap-2 mb-4 px-4 py-2.5 bg-vanilla/20 rounded-xl border border-vanilla/40"> ${recipe.sponsor_logo_url && renderTemplate`<img${addAttribute(recipe.sponsor_logo_url, "src")}${addAttribute(recipe.sponsor_name ?? "Sponsor", "alt")} class="w-6 h-6 rounded-full object-contain">`} <span class="text-xs text-slate-500">
Sponsored by
${recipe.sponsor_url ? renderTemplate`<a${addAttribute(recipe.sponsor_url, "href")} rel="nofollow sponsored noopener" target="_blank" class="font-medium text-chocolate hover:text-berry transition-colors ml-1"> ${recipe.sponsor_name} </a>` : renderTemplate`<span class="font-medium text-chocolate ml-1">${recipe.sponsor_name}</span>`} </span> </div>`} <div class="flex flex-wrap items-center gap-2 mb-4"> <span${addAttribute(["text-xs font-medium px-3 py-1 rounded-full", difficultyColors[recipe.difficulty]], "class:list")}> ${recipe.difficulty} </span> <span class="text-xs font-medium px-3 py-1 rounded-full bg-lavender/20 text-lavender-dark"> ${recipe.base_type} </span> ${recipe.models.map((model) => renderTemplate`<span class="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600"> ${model.name.replace("Ninja Creami ", "")} </span>`)} </div> <h1 class="font-display text-3xl md:text-4xl font-bold text-chocolate mb-4"> ${recipe.title} </h1> <p class="text-slate-600 leading-relaxed mb-6">${recipe.description}</p> <!-- Rating --> <div class="flex items-center gap-3 mb-6"> ${renderComponent($$result3, "RatingStars", $$RatingStars, { "rating": recipe.avg_rating, "size": "lg", "showValue": true })} <span class="text-sm text-slate-500">
(${recipe.rating_count} review${recipe.rating_count !== 1 ? "s" : ""})
</span> </div> <!-- Quick Stats --> <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-100"> ${recipe.prep_time_minutes && renderTemplate`<div class="text-center"> <div class="text-xs text-slate-500 mb-1">${ui("prep", locale)}</div> <div class="font-semibold text-chocolate">${recipe.prep_time_minutes}m</div> </div>`} <div class="text-center"> <div class="text-xs text-slate-500 mb-1">${ui("freeze", locale)}</div> <div class="font-semibold text-chocolate">${recipe.freeze_time_hours ?? 24}h</div> </div> <div class="text-center"> <div class="text-xs text-slate-500 mb-1">${ui("total", locale)}</div> <div class="font-semibold text-chocolate">${totalTimeLabel}</div> </div> <div class="text-center"> <div class="text-xs text-slate-500 mb-1">${ui("servings", locale)}</div> <div class="font-semibold text-chocolate">${recipe.servings ?? 4}</div> </div> </div> ${recipe.churn_program && renderTemplate`<div class="mt-4 p-4 bg-mint/10 rounded-xl border border-mint/20"> <span class="text-sm font-medium text-mint-dark">${ui("creamiProgram", locale)}</span> <span class="ml-2 text-sm text-slate-600">${recipe.churn_program}</span> </div>`} <!-- Author --> <div class="mt-6 flex items-center gap-3"> <div class="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center text-lavender-dark font-bold text-sm"> ${(recipe.author.display_name || recipe.author.username).charAt(0).toUpperCase()} </div> <div> <span class="text-sm font-medium text-chocolate"> ${recipe.author.display_name || recipe.author.username} </span> <div class="text-xs text-slate-500"> ${new Date(recipe.published_at ?? recipe.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })} </div> </div> <!-- Share + Print --> <div class="mt-6 flex items-center justify-between"> ${renderComponent($$result3, "ShareButtons", $$ShareButtons, { "title": recipe.title, "url": `${siteUrl}/recipes/${recipe.slug}`, "description": recipe.description })} <button onclick="window.print()" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-berry rounded-full border border-slate-200 hover:border-blush transition-colors" aria-label="Print recipe"> <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path> </svg>
Print
</button> </div> </div> </div> </div> ` })} </div> </section>  ${recipe.video_url && renderTemplate`<section class="py-8 bg-white/50"> <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="font-display text-xl font-bold text-chocolate mb-4 text-center">${ui("watchVideo", locale)}</h2> <div class="aspect-video rounded-2xl overflow-hidden shadow-lg"> ${recipe.video_url.includes("youtube.com") || recipe.video_url.includes("youtu.be") ? renderTemplate`<iframe${addAttribute(recipe.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/"), "src")}${addAttribute(`How to Make ${recipe.title}`, "title")} class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>` : renderTemplate`<video${addAttribute(recipe.video_url, "src")}${addAttribute(recipe.video_thumbnail_url ?? void 0, "poster")} controls preload="metadata" class="w-full h-full object-cover"> <track kind="captions"> </video>`} </div> </div> </section>`} <section class="py-6"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <div class="rounded-2xl p-6 md:p-8 border-2 border-mint bg-gradient-to-br from-mint/5 to-cream shadow-sm"> <h2 class="font-display text-xl font-bold text-chocolate mb-5 flex items-center gap-2"> <svg class="w-6 h-6 text-mint-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Before You Begin
</h2> <!-- Model Selection --> <div class="mb-5"> <label for="byb-model-select" class="block text-sm font-semibold text-slate-700 mb-2">
What Creami model do you have?
</label> <select id="byb-model-select" class="w-full px-6 text-lg font-semibold rounded-2xl border-2 border-mint-dark/30 bg-white text-chocolate focus:border-mint-dark focus:ring-2 focus:ring-mint/30 outline-none cursor-pointer shadow-sm hover:shadow-md transition-shadow appearance-none" style="height: 64px; -webkit-appearance: none; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235C3D2E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E&quot;); background-repeat: no-repeat; background-position: right 16px center; background-size: 20px;" aria-label="Select your Ninja Creami model"> <option value="">Select your Creami model...</option> ${currentModels.map((m) => renderTemplate`<option${addAttribute(`${m.slug}|${m.pint_size_oz}`, "value")}> ${m.name} — ${m.pint_size_oz}oz pint
</option>`)} </select> <div id="byb-scale-note" class="hidden mt-2 text-sm text-mint-dark bg-mint/15 px-4 py-3 rounded-xl font-medium"></div> </div> <!-- Allergen Warning (inside Before You Begin) --> ${detectedAllergens.length > 0 && renderTemplate`<div class="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"> <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path> </svg> <div> <span class="text-sm font-bold text-red-800">${ui("allergenWarning", locale)} </span> <span class="text-sm text-red-700 font-semibold"> ${detectedAllergens.join(", ")} </span> <p class="text-xs text-red-600 mt-1">${ui("checkLabels", locale)}</p> </div> </div>`} </div> </div> </section>  <section class="py-10 md:py-16"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"> <!-- Sidebar: Scalable Ingredients + Ad --> <aside class="lg:col-span-1"> <div class="sticky top-24 space-y-6"> <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"> <h2 class="font-display text-xl font-bold text-chocolate mb-5">${ui("ingredients", locale)}</h2> ${renderComponent($$result2, "ScalableIngredients", ScalableIngredients, { "client:load": true, "ingredients": scalableIngredients, "models": currentModels, "recipePintSize": recipe.pint_size ?? "16oz", "isSwirl": recipe.is_swirl_recipe ?? false, "client:component-hydration": "load", "client:component-path": "/Users/zach/web-projects/creami/src/components/recipe/ScalableIngredients", "client:component-export": "default" })} </div> <!-- Ad: sidebar medium rectangle (sticky with ingredients) --> ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "medium-rectangle", "slot": "recipe-sidebar" })} </div> </aside> <!-- Main: Steps --> <div class="lg:col-span-2"> <div class="flex items-center justify-between mb-8"> <h2 class="font-display text-2xl font-bold text-chocolate">${ui("directions", locale)}</h2> <button id="cook-mode-btn" class="px-5 py-2.5 bg-berry text-white text-sm font-medium rounded-full hover:bg-berry/90 transition-colors shadow-sm">
Cook Mode
</button> </div> <!-- Step Timeline --> <div id="step-timeline" class="space-y-2"> ${recipe.steps.map((step) => renderTemplate`${renderComponent($$result2, "ScrollReveal", $$ScrollReveal, { "animation": "fade-up", "delay": step.step_number * 0.05 }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "StepCard", $$StepCard, { "step": step, "totalSteps": recipe.steps.length })} ` })}`)} </div> <!-- Ad: after recipe steps (in-article) --> ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "in-article", "slot": "recipe-after-steps", "class": "mt-10" })} <!-- Categories & Tags --> ${(recipe.categories.length > 0 || recipe.tags.length > 0) && renderTemplate`<div class="mt-10 pt-8 border-t border-slate-100"> <div class="flex flex-wrap gap-2"> ${recipe.categories.map((cat) => renderTemplate`<a${addAttribute(`/recipes?base=${cat.slug}`, "href")} class="px-3 py-1 bg-blush/15 text-berry text-xs font-medium rounded-full hover:bg-blush/25 transition-colors"> ${cat.name} </a>`)} ${recipe.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
#${tag.name} </span>`)} </div> </div>`} <!-- Allergen info is in "Before You Begin" section above --> <!-- FAQ Section --> ${recipeFaqs.length > 0 && renderTemplate`<div class="mt-10 pt-8 border-t border-slate-100"> <h2 class="font-display text-xl font-bold text-chocolate mb-4">${ui("commonQuestions", locale)}</h2> <div class="space-y-2"> ${recipeFaqs.map((faq) => renderTemplate`<details class="group bg-cream/50 rounded-xl border border-slate-100"> <summary class="flex items-center justify-between px-5 py-3 cursor-pointer text-sm font-medium text-chocolate hover:text-berry transition-colors"> ${faq.question} <svg class="w-4 h-4 shrink-0 ml-3 transition-transform duration-200 group-open:rotate-180 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </summary> <div class="px-5 pb-4 text-sm text-slate-600 leading-relaxed"> ${faq.answer} </div> </details>`)} </div> </div>`} </div> </div> </div> </section> `, "head": async ($$result2) => renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(recipeFaqJsonLd))) }), ui("cookMode", locale), recipe.steps.length, defineScriptVars({ steps: recipe.steps }));
}, "/Users/zach/web-projects/creami/src/pages/recipes/[slug].astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/recipes/[slug].astro";
const $$url = "/recipes/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
