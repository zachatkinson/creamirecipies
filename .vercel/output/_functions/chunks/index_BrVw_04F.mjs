import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_yfz4azir.mjs';
import { $ as $$BaseLayout } from './BaseLayout_C4z3TKmE.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useCallback, useEffect } from 'react';
import { $ as $$AdUnit } from './AdUnit_BZmLqD-f.mjs';
import { s as supabase } from './supabase_DxTYJlbZ.mjs';
import { c as getPublishedRecipes, d as getCategories, b as getCreamiModels } from './recipes_7tIktda5.mjs';
import { D as DEFAULT_LOCALE } from './index_Bf_3aS85.mjs';

const QUICK_FILTERS = [
  { label: "Easy & Beginner", filters: { difficulty: ["beginner"] } },
  { label: "High Protein", filters: { dietary: ["high-protein"] } },
  { label: "Vegan", filters: { dietary: ["vegan"] } },
  { label: "Keto Friendly", filters: { dietary: ["keto"] } },
  { label: "Dairy Free", filters: { dietary: ["dairy-free"] } },
  { label: "Soft Serve", filters: { baseType: ["lite-ice-cream"] } }
];
function RecipeFilters({ recipes, filterConfig, initialQuery }) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [selectedBaseTypes, setSelectedBaseTypes] = useState(/* @__PURE__ */ new Set());
  const [selectedFlavors, setSelectedFlavors] = useState(/* @__PURE__ */ new Set());
  const [selectedDietary, setSelectedDietary] = useState(/* @__PURE__ */ new Set());
  const [selectedModels, setSelectedModels] = useState(/* @__PURE__ */ new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState(/* @__PURE__ */ new Set());
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(/* @__PURE__ */ new Set(["difficulty", "base-type"]));
  const [visibleCount, setVisibleCount] = useState(24);
  const gridRef = useRef(null);
  const toggle = useCallback((set, value, setter) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);
  const toggleGroup = useCallback((group) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);
  const applyQuickFilter = useCallback((filters) => {
    clearAll();
    for (const [key, value] of Object.entries(filters)) {
      if (key === "difficulty" && Array.isArray(value)) setSelectedDifficulty(new Set(value));
      if (key === "dietary" && Array.isArray(value)) setSelectedDietary(new Set(value));
      if (key === "minRating" && typeof value === "number") setMinRating(value);
    }
  }, []);
  const clearAll = useCallback(() => {
    setQuery("");
    setSelectedBaseTypes(/* @__PURE__ */ new Set());
    setSelectedFlavors(/* @__PURE__ */ new Set());
    setSelectedDietary(/* @__PURE__ */ new Set());
    setSelectedModels(/* @__PURE__ */ new Set());
    setSelectedDifficulty(/* @__PURE__ */ new Set());
    setMinRating(0);
    setSortBy("newest");
    setVisibleCount(24);
  }, []);
  useEffect(() => {
    setVisibleCount(24);
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy]);
  const filtered = recipes.filter((r) => {
    if (query) {
      const q = query.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    if (selectedBaseTypes.size > 0 && !selectedBaseTypes.has(r.base_type.toLowerCase().replace(/\s+/g, "-"))) return false;
    if (selectedDifficulty.size > 0 && !selectedDifficulty.has(r.difficulty)) return false;
    if (selectedFlavors.size > 0 && !r.categories.some((c) => selectedFlavors.has(c))) return false;
    if (selectedDietary.size > 0 && !r.categories.some((c) => selectedDietary.has(c))) return false;
    if (selectedModels.size > 0 && !r.models.some((m) => selectedModels.has(m))) return false;
    if (minRating > 0 && r.avg_rating < minRating) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.avg_rating - a.avg_rating;
      case "reviews":
        return b.rating_count - a.rating_count;
      case "prep-time":
        return (a.prep_time_minutes ?? 999) - (b.prep_time_minutes ?? 999);
      default:
        return 0;
    }
  });
  const activeFilters = [];
  if (query) activeFilters.push({ label: `"${query}"`, onRemove: () => setQuery("") });
  selectedBaseTypes.forEach((v) => {
    const bt = filterConfig.baseTypes.find((b) => b.slug === v);
    if (bt) activeFilters.push({ label: bt.name, onRemove: () => toggle(selectedBaseTypes, v, setSelectedBaseTypes) });
  });
  selectedDifficulty.forEach((v) => {
    activeFilters.push({ label: v.charAt(0).toUpperCase() + v.slice(1), onRemove: () => toggle(selectedDifficulty, v, setSelectedDifficulty) });
  });
  selectedFlavors.forEach((v) => {
    const f = filterConfig.flavorProfiles.find((fp) => fp.slug === v);
    if (f) activeFilters.push({ label: f.name, onRemove: () => toggle(selectedFlavors, v, setSelectedFlavors) });
  });
  selectedDietary.forEach((v) => {
    const d = filterConfig.dietary.find((dt) => dt.slug === v);
    if (d) activeFilters.push({ label: d.name, onRemove: () => toggle(selectedDietary, v, setSelectedDietary) });
  });
  selectedModels.forEach((v) => {
    const m = filterConfig.models.find((md) => md.slug === v);
    if (m) activeFilters.push({ label: m.name, onRemove: () => toggle(selectedModels, v, setSelectedModels) });
  });
  if (minRating > 0) activeFilters.push({ label: `${minRating}+ Stars`, onRemove: () => setMinRating(0) });
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    selectedBaseTypes.forEach((v) => params.append("base", v));
    selectedDifficulty.forEach((v) => params.append("difficulty", v));
    selectedFlavors.forEach((v) => params.append("flavor", v));
    selectedDietary.forEach((v) => params.append("dietary", v));
    selectedModels.forEach((v) => params.append("model", v));
    if (minRating > 0) params.set("rating", String(minRating));
    if (sortBy !== "newest") params.set("sort", sortBy);
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setQuery(params.get("q"));
    if (params.getAll("base").length) setSelectedBaseTypes(new Set(params.getAll("base")));
    if (params.getAll("difficulty").length) setSelectedDifficulty(new Set(params.getAll("difficulty")));
    if (params.getAll("flavor").length) setSelectedFlavors(new Set(params.getAll("flavor")));
    if (params.getAll("dietary").length) setSelectedDietary(new Set(params.getAll("dietary")));
    if (params.getAll("model").length) setSelectedModels(new Set(params.getAll("model")));
    if (params.get("rating")) setMinRating(Number(params.get("rating")));
    if (params.get("sort")) setSortBy(params.get("sort"));
  }, []);
  const FilterSidebar = () => /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Quick Filters" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: QUICK_FILTERS.map((qf) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => applyQuickFilter(qf.filters),
          className: "px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-[#F4B8C1]/20 to-[#C4B1D4]/20 text-[#8B3A62] hover:from-[#F4B8C1]/40 hover:to-[#C4B1D4]/40 transition-all",
          children: qf.label
        },
        qf.label
      )) })
    ] }),
    /* @__PURE__ */ jsx(FilterGroup, { title: "Difficulty", id: "difficulty", expanded: expandedGroups.has("difficulty"), onToggle: () => toggleGroup("difficulty"), children: ["beginner", "intermediate", "advanced"].map((d) => /* @__PURE__ */ jsx(
      FilterCheckbox,
      {
        label: d.charAt(0).toUpperCase() + d.slice(1),
        checked: selectedDifficulty.has(d),
        onChange: () => toggle(selectedDifficulty, d, setSelectedDifficulty),
        count: recipes.filter((r) => r.difficulty === d).length
      },
      d
    )) }),
    /* @__PURE__ */ jsx(FilterGroup, { title: "Base Type", id: "base-type", expanded: expandedGroups.has("base-type"), onToggle: () => toggleGroup("base-type"), children: filterConfig.baseTypes.map((bt) => /* @__PURE__ */ jsx(
      FilterCheckbox,
      {
        label: bt.name,
        checked: selectedBaseTypes.has(bt.slug),
        onChange: () => toggle(selectedBaseTypes, bt.slug, setSelectedBaseTypes),
        count: recipes.filter((r) => r.base_type.toLowerCase().replace(/\s+/g, "-") === bt.slug).length
      },
      bt.slug
    )) }),
    /* @__PURE__ */ jsx(FilterGroup, { title: "Dietary", id: "dietary", expanded: expandedGroups.has("dietary"), onToggle: () => toggleGroup("dietary"), children: filterConfig.dietary.map((d) => /* @__PURE__ */ jsx(
      FilterCheckbox,
      {
        label: d.name,
        checked: selectedDietary.has(d.slug),
        onChange: () => toggle(selectedDietary, d.slug, setSelectedDietary),
        count: recipes.filter((r) => r.categories.includes(d.slug)).length
      },
      d.slug
    )) }),
    /* @__PURE__ */ jsx(FilterGroup, { title: "Minimum Rating", id: "rating", expanded: expandedGroups.has("rating"), onToggle: () => toggleGroup("rating"), children: [4, 3].map((r) => /* @__PURE__ */ jsx(
      FilterCheckbox,
      {
        label: `${r}+ Stars`,
        checked: minRating === r,
        onChange: () => setMinRating(minRating === r ? 0 : r),
        count: recipes.filter((rec) => rec.avg_rating >= r).length
      },
      r
    )) })
  ] });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx("svg", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "search",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search recipes by name or ingredient...",
            "aria-label": "Search recipes",
            className: "w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-500 focus:border-[#F4B8C1] focus:ring-1 focus:ring-[#F4B8C1] outline-none transition-colors"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "sort-select", className: "sr-only", children: "Sort recipes" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "sort-select",
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            "aria-label": "Sort recipes",
            className: "px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 focus:border-[#F4B8C1] outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
              /* @__PURE__ */ jsx("option", { value: "rating", children: "Highest Rated" }),
              /* @__PURE__ */ jsx("option", { value: "reviews", children: "Most Reviewed" }),
              /* @__PURE__ */ jsx("option", { value: "prep-time", children: "Quickest Prep" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMobileFilterOpen(true),
            className: "lg:hidden px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-[#F4B8C1] transition-colors flex items-center gap-2",
            "aria-label": "Open filters",
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) }),
              "Filters",
              activeFilters.length > 0 && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 bg-[#8B3A62] text-white text-xs rounded-full flex items-center justify-center", children: activeFilters.length })
            ]
          }
        )
      ] })
    ] }),
    activeFilters.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-6", children: [
      activeFilters.map((filter, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: filter.onRemove,
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4B8C1]/20 text-[#8B3A62] text-xs font-medium rounded-full hover:bg-[#F4B8C1]/40 transition-colors group",
          children: [
            filter.label,
            /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 opacity-60 group-hover:opacity-100", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          ]
        },
        i
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearAll,
          className: "text-xs text-slate-500 hover:text-[#8B3A62] transition-colors underline",
          children: "Clear all"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-500 mb-4", children: [
      "Showing ",
      /* @__PURE__ */ jsx("strong", { className: "text-[#5C3D2E]", children: sorted.length }),
      " recipe",
      sorted.length !== 1 ? "s" : ""
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block w-64 shrink-0", children: /* @__PURE__ */ jsx("div", { className: "sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto", children: /* @__PURE__ */ jsx(FilterSidebar, {}) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", ref: gridRef, children: sorted.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6", children: sorted.slice(0, visibleCount).map((recipe) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/recipes/${recipe.slug}`,
            className: "group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
            children: [
              /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] bg-[#F5EDE3] overflow-hidden", children: recipe.hero_image_url ? /* @__PURE__ */ jsx("img", { src: recipe.hero_image_url, alt: recipe.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", loading: "lazy" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[#F4B8C1]/20 to-[#C4B1D4]/20", children: "🍦" }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-2.5 py-0.5 rounded-full ${recipe.difficulty === "beginner" ? "bg-[#A8D8C8]/40 text-[#1a6b4f]" : recipe.difficulty === "advanced" ? "bg-[#F4B8C1]/40 text-[#6b1d42]" : "bg-[#FDE9B0]/40 text-[#5C3D2E]"}`, children: recipe.difficulty }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500", children: recipe.base_type })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#5C3D2E] group-hover:text-[#8B3A62] transition-colors line-clamp-2 mb-1.5", style: { fontFamily: "Playfair Display, serif" }, children: recipe.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 line-clamp-2 mb-3", children: recipe.description }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: s <= Math.round(recipe.avg_rating) ? "#F5D47A" : "#E2E8F0", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) }, s)) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
                      "(",
                      recipe.rating_count,
                      ")"
                    ] })
                  ] }),
                  recipe.prep_time_minutes && /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
                    "⏱ ",
                    recipe.prep_time_minutes,
                    "m prep"
                  ] })
                ] })
              ] })
            ]
          },
          recipe.id
        )) }),
        visibleCount < sorted.length && /* @__PURE__ */ jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setVisibleCount((prev) => prev + 24),
            className: "px-8 py-3 bg-white text-[#8B3A62] font-medium rounded-full border-2 border-[#F4B8C1] hover:bg-[#F4B8C1]/10 transition-colors",
            children: [
              "Load More Recipes",
              /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-slate-500", children: [
                "(",
                Math.min(visibleCount, sorted.length),
                " of ",
                sorted.length,
                ")"
              ] })
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-20 bg-white/50 rounded-2xl", children: [
        /* @__PURE__ */ jsx("span", { className: "text-5xl mb-4 block", children: "🔍" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#5C3D2E] mb-2", style: { fontFamily: "Playfair Display, serif" }, children: "No Recipes Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 mb-6", children: "Try adjusting your filters or search terms." }),
        /* @__PURE__ */ jsx("button", { onClick: clearAll, className: "px-6 py-3 bg-[#8B3A62] text-white font-medium rounded-full hover:bg-[#8B3A62]/90 transition-colors", children: "Clear All Filters" })
      ] }) })
    ] }),
    mobileFilterOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/40",
          onClick: () => setMobileFilterOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-3 pb-2", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-1 bg-slate-200 rounded-full" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 pb-3 border-b border-slate-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#5C3D2E]", style: { fontFamily: "Playfair Display, serif" }, children: "Filters" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMobileFilterOpen(false),
              className: "p-2 text-slate-500 hover:text-slate-700",
              "aria-label": "Close filters",
              children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-5", children: /* @__PURE__ */ jsx(FilterSidebar, {}) }),
        /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-slate-100 bg-white", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMobileFilterOpen(false),
            className: "w-full py-3 bg-[#8B3A62] text-white font-medium rounded-xl hover:bg-[#8B3A62]/90 transition-colors",
            children: [
              "Show ",
              sorted.length,
              " Recipe",
              sorted.length !== 1 ? "s" : ""
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
function FilterGroup({
  title,
  id,
  expanded,
  onToggle,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: onToggle,
        className: "flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors",
        "aria-expanded": expanded,
        "aria-controls": `filter-group-${id}`,
        children: [
          title,
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`,
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
            }
          )
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsx("div", { id: `filter-group-${id}`, className: "space-y-1 pb-2", children })
  ] });
}
function FilterCheckbox({
  label,
  checked,
  onChange,
  count
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 py-1.5 cursor-pointer group", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "checkbox",
        checked,
        onChange,
        className: "w-4 h-4 rounded border-slate-300 text-[#8B3A62] focus:ring-[#F4B8C1] cursor-pointer"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600 group-hover:text-slate-800 flex-1", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: count })
  ] });
}

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const locale = Astro2.locals.locale;
  const recipes = await getPublishedRecipes(supabase);
  if (locale !== DEFAULT_LOCALE) {
    const { data: translations } = await supabase.from("recipe_translations").select("recipe_id, title, description").eq("locale", locale).in("recipe_id", recipes.map((r) => r.id)).limit(1e3);
    if (translations) {
      const transMap = new Map(translations.map((t) => [t.recipe_id, t]));
      for (const recipe of recipes) {
        const t = transMap.get(recipe.id);
        if (t) {
          recipe.title = t.title;
          recipe.description = t.description;
        }
      }
    }
  }
  const categories = await getCategories(supabase);
  const models = await getCreamiModels(supabase);
  recipes.map((r) => r.id);
  async function fetchAll(table, select) {
    const allRows = [];
    let page = 0;
    const pageSize = 1e3;
    while (true) {
      const { data } = await supabase.from(table).select(select).range(page * pageSize, (page + 1) * pageSize - 1);
      if (!data || data.length === 0) break;
      allRows.push(...data);
      if (data.length < pageSize) break;
      page++;
    }
    return allRows;
  }
  const recipeCats = await fetchAll("recipe_categories", "recipe_id, category:categories (slug)");
  const recipeModelLinks = await fetchAll("recipe_models", "recipe_id, model:creami_models (slug)");
  const catMap = /* @__PURE__ */ new Map();
  for (const rc of recipeCats ?? []) {
    const slug = rc.category?.slug;
    if (!slug) continue;
    if (!catMap.has(rc.recipe_id)) catMap.set(rc.recipe_id, []);
    catMap.get(rc.recipe_id).push(slug);
  }
  const modelMap = /* @__PURE__ */ new Map();
  for (const rm of recipeModelLinks ?? []) {
    const slug = rm.model?.slug;
    if (!slug) continue;
    if (!modelMap.has(rm.recipe_id)) modelMap.set(rm.recipe_id, []);
    modelMap.get(rm.recipe_id).push(slug);
  }
  const enrichedRecipes = recipes.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    difficulty: r.difficulty,
    base_type: r.base_type,
    avg_rating: r.avg_rating,
    rating_count: r.rating_count,
    prep_time_minutes: r.prep_time_minutes,
    freeze_time_hours: r.freeze_time_hours,
    hero_image_url: r.hero_image_url,
    categories: catMap.get(r.id) ?? [],
    models: modelMap.get(r.id) ?? [],
    author_name: r.author?.display_name || r.author?.username || "Unknown",
    author_avatar: r.author?.avatar_url ?? null
  }));
  const filterConfig = {
    baseTypes: categories.filter((c) => c.type === "base_type").map((c) => ({ slug: c.slug, name: c.name })),
    flavorProfiles: categories.filter((c) => c.type === "flavor_profile").map((c) => ({ slug: c.slug, name: c.name })),
    dietary: categories.filter((c) => c.type === "dietary").map((c) => ({ slug: c.slug, name: c.name })),
    models: models.map((m) => ({ slug: m.slug, name: m.name }))
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "All Recipes", "description": "Browse all Ninja Creami recipes — ice cream, sorbet, gelato, and more. Filter by difficulty, dietary needs, flavor, and Creami model." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12 md:py-16"> <div class="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-10"> <h1 class="font-display text-4xl md:text-5xl font-bold mb-4" style="color: #5C3D2E;">
All Recipes
</h1> <p class="max-w-lg mx-auto" style="color: #64748B;"> ${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} and counting. Find your next frozen creation.
</p> </div> <h2 class="font-display text-2xl font-bold mb-6" style="color: #5C3D2E;">Browse Recipes</h2> ${renderComponent($$result2, "RecipeFilters", RecipeFilters, { "client:load": true, "recipes": enrichedRecipes, "filterConfig": filterConfig, "client:component-hydration": "load", "client:component-path": "/Users/zach/web-projects/creami/src/components/recipe/RecipeFilters", "client:component-export": "default" })} <!-- Ad: bottom of recipe listing --> <div class="mt-12"> ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "leaderboard", "slot": "recipes-bottom" })} ${renderComponent($$result2, "AdUnit", $$AdUnit, { "size": "mobile-banner", "slot": "recipes-bottom-mobile" })} </div> </div> </section> ` })}`;
}, "/Users/zach/web-projects/creami/src/pages/recipes/index.astro", void 0);

const $$file = "/Users/zach/web-projects/creami/src/pages/recipes/index.astro";
const $$url = "/recipes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
