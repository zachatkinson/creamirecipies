import { useState, useCallback, useEffect, useRef } from 'react';

interface RecipeData {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  base_type: string;
  avg_rating: number;
  rating_count: number;
  prep_time_minutes: number | null;
  hero_image_url: string | null;
  categories: string[];
  models: string[];
}

interface FilterConfig {
  baseTypes: { slug: string; name: string }[];
  flavorProfiles: { slug: string; name: string }[];
  dietary: { slug: string; name: string }[];
  models: { slug: string; name: string }[];
}

interface Labels {
  baseTypeMap?: Record<string, string>;
  searchPlaceholder: string;
  sortNewest: string;
  sortRating: string;
  sortReviews: string;
  sortPrep: string;
  filters: string;
  quickFilters: string;
  difficulty: string;
  baseType: string;
  dietary: string;
  minRating: string;
  showing: string;
  recipe: string;
  recipes: string;
  clearAll: string;
  noResults: string;
  noResultsDesc: string;
  clearFilters: string;
  loadMore: string;
  of: string;
  stars: string;
  prep: string;
  easyBeginner: string;
  highProtein: string;
  vegan: string;
  ketoFriendly: string;
  dairyFree: string;
  softServe: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  loading?: string;
}

const DEFAULT_LABELS: Labels = {
  searchPlaceholder: 'Search recipes by name or ingredient...',
  sortNewest: 'Newest First', sortRating: 'Highest Rated', sortReviews: 'Most Reviewed', sortPrep: 'Quickest Prep',
  filters: 'Filters', quickFilters: 'Quick Filters', difficulty: 'Difficulty', baseType: 'Base Type',
  dietary: 'Dietary', minRating: 'Minimum Rating', showing: 'Showing', recipe: 'recipe', recipes: 'recipes',
  clearAll: 'Clear all', noResults: 'No Recipes Found', noResultsDesc: 'Try adjusting your filters or search terms.',
  clearFilters: 'Clear All Filters', loadMore: 'Load More Recipes', of: 'of', stars: 'Stars', prep: 'prep',
  easyBeginner: 'Easy & Beginner', highProtein: 'High Protein', vegan: 'Vegan', ketoFriendly: 'Keto Friendly',
  dairyFree: 'Dairy Free', softServe: 'Soft Serve', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
  loading: 'Loading...',
};

interface Facets {
  difficulty?: Record<string, number>;
}

interface Props {
  initialRecipes: RecipeData[];
  totalRecipes: number;
  initialFacets?: Facets;
  filterConfig: FilterConfig;
  labels?: Partial<Labels>;
}

type SortOption = 'newest' | 'rating' | 'reviews' | 'prep-time';

export default function RecipeFilters({ initialRecipes, totalRecipes, initialFacets, filterConfig, labels: labelsProp }: Props) {
  const l = { ...DEFAULT_LABELS, ...labelsProp };

  const QUICK_FILTERS: { label: string; filters: Record<string, string[]> }[] = [
    { label: l.easyBeginner, filters: { difficulty: ['beginner'] } },
    { label: l.highProtein, filters: { dietary: ['high-protein'] } },
    { label: l.vegan, filters: { dietary: ['vegan'] } },
    { label: l.ketoFriendly, filters: { dietary: ['keto'] } },
    { label: l.dairyFree, filters: { dietary: ['dairy-free'] } },
    { label: l.softServe, filters: { baseType: ['lite-ice-cream'] } },
  ];

  // Recipe data state
  const [recipes, setRecipes] = useState<RecipeData[]>(initialRecipes);
  const [total, setTotal] = useState(totalRecipes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facets, setFacets] = useState<Facets>(initialFacets ?? {});

  // Filter state
  const [query, setQuery] = useState('');
  const [selectedBaseTypes, setSelectedBaseTypes] = useState<Set<string>>(new Set());
  const [selectedFlavors, setSelectedFlavors] = useState<Set<string>>(new Set());
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build query params from current filter state
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    selectedBaseTypes.forEach((v) => params.append('base', v));
    selectedDifficulty.forEach((v) => params.append('difficulty', v));
    selectedFlavors.forEach((v) => params.append('flavor', v));
    selectedDietary.forEach((v) => params.append('dietary', v));
    selectedModels.forEach((v) => params.append('model', v));
    if (minRating > 0) params.set('rating', String(minRating));
    if (sortBy !== 'newest') params.set('sort', sortBy);
    return params;
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy]);

  // Fetch recipes from API
  const fetchRecipes = useCallback(async (pageNum: number, append: boolean) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    const params = buildParams();
    params.set('page', String(pageNum));

    try {
      const res = await fetch(`/api/recipes?${params.toString()}`, { signal: controller.signal });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setRecipes((prev) => append ? [...prev, ...data.recipes] : data.recipes);
      setTotal(data.total);
      setPage(pageNum);
      if (data.facets) setFacets(data.facets);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Failed to fetch recipes:', err);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [buildParams]);

  // Toggle helpers
  const toggle = useCallback((set: Set<string>, value: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }, []);

  const applyQuickFilter = useCallback((filters: Record<string, string[] | number>) => {
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'difficulty' && Array.isArray(value)) {
        setSelectedDifficulty((prev) => { const next = new Set(prev); const v = value[0]; if (next.has(v)) next.delete(v); else next.add(v); return next; });
      }
      if (key === 'dietary' && Array.isArray(value)) {
        setSelectedDietary((prev) => { const next = new Set(prev); const v = value[0]; if (next.has(v)) next.delete(v); else next.add(v); return next; });
      }
      if (key === 'baseType' && Array.isArray(value)) {
        setSelectedBaseTypes((prev) => { const next = new Set(prev); const v = value[0]; if (next.has(v)) next.delete(v); else next.add(v); return next; });
      }
      if (key === 'minRating' && typeof value === 'number') setMinRating((prev) => prev === value ? 0 : value);
    }
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setSelectedBaseTypes(new Set());
    setSelectedFlavors(new Set());
    setSelectedDietary(new Set());
    setSelectedModels(new Set());
    setSelectedDifficulty(new Set());
    setMinRating(0);
    setSortBy('newest');
  }, []);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) setQuery(params.get('q')!);
    if (params.getAll('base').length) setSelectedBaseTypes(new Set(params.getAll('base')));
    if (params.getAll('difficulty').length) setSelectedDifficulty(new Set(params.getAll('difficulty')));
    if (params.getAll('flavor').length) setSelectedFlavors(new Set(params.getAll('flavor')));
    if (params.getAll('dietary').length) setSelectedDietary(new Set(params.getAll('dietary')));
    if (params.getAll('model').length) setSelectedModels(new Set(params.getAll('model')));
    if (params.get('rating')) setMinRating(Number(params.get('rating')));
    if (params.get('sort')) setSortBy(params.get('sort') as SortOption);
    initializedRef.current = true;
  }, []);

  // When any filter/sort changes (after initialization), fetch from API and sync URL
  useEffect(() => {
    if (!initializedRef.current) return;

    // Update URL
    const params = buildParams();
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    // Fetch page 1 with new filters (debounce search input)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const delay = query ? 300 : 0;
    searchTimerRef.current = setTimeout(() => fetchRecipes(1, false), delay);

    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy, buildParams, fetchRecipes]);

  // Active filter chips
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (query) activeFilters.push({ label: `"${query}"`, onRemove: () => setQuery('') });
  selectedBaseTypes.forEach((v) => {
    const bt = filterConfig.baseTypes.find((b) => b.slug === v);
    if (bt) activeFilters.push({ label: bt.name, onRemove: () => toggle(selectedBaseTypes, v, setSelectedBaseTypes) });
  });
  selectedDifficulty.forEach((v) => {
    const diffLabel = v === 'beginner' ? l.beginner : v === 'intermediate' ? l.intermediate : l.advanced;
    activeFilters.push({ label: diffLabel, onRemove: () => toggle(selectedDifficulty, v, setSelectedDifficulty) });
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
  if (minRating > 0) activeFilters.push({ label: `${minRating}+ ${l.stars}`, onRemove: () => setMinRating(0) });

  const FilterSidebar = () => (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">{l.quickFilters}</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((qf) => (
            <button
              key={qf.label}
              onClick={() => applyQuickFilter(qf.filters)}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-[#F4B8C1]/20 to-[#C4B1D4]/20 text-[#8B3A62] hover:from-[#F4B8C1]/40 hover:to-[#C4B1D4]/40 transition-all"
            >
              {qf.label}
            </button>
          ))}
        </div>
      </div>

      <FilterGroup title={l.difficulty} id="difficulty" expanded={expandedGroups.has('difficulty')} onToggle={() => toggleGroup('difficulty')}>
        {['beginner', 'intermediate', 'advanced'].map((d) => (
          <FilterCheckbox
            key={d}
            label={d === 'beginner' ? l.beginner : d === 'intermediate' ? l.intermediate : l.advanced}
            checked={selectedDifficulty.has(d)}
            onChange={() => toggle(selectedDifficulty, d, setSelectedDifficulty)}
            count={facets.difficulty?.[d]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.baseType} id="base-type" expanded={expandedGroups.has('base-type')} onToggle={() => toggleGroup('base-type')}>
        {filterConfig.baseTypes.map((bt) => (
          <FilterCheckbox
            key={bt.slug}
            label={bt.name}
            checked={selectedBaseTypes.has(bt.slug)}
            onChange={() => toggle(selectedBaseTypes, bt.slug, setSelectedBaseTypes)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.dietary} id="dietary" expanded={expandedGroups.has('dietary')} onToggle={() => toggleGroup('dietary')}>
        {filterConfig.dietary.map((d) => (
          <FilterCheckbox
            key={d.slug}
            label={d.name}
            checked={selectedDietary.has(d.slug)}
            onChange={() => toggle(selectedDietary, d.slug, setSelectedDietary)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.minRating} id="rating" expanded={expandedGroups.has('rating')} onToggle={() => toggleGroup('rating')}>
        {[4, 3].map((r) => (
          <FilterCheckbox
            key={r}
            label={`${r}+ ${l.stars}`}
            checked={minRating === r}
            onChange={() => setMinRating(minRating === r ? 0 : r)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  const hasMore = recipes.length < total;

  return (
    <div>
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={l.searchPlaceholder}
            aria-label={l.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-600 focus:border-[#F4B8C1] focus:ring-1 focus:ring-[#F4B8C1] outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="sort-select" className="sr-only">Sort recipes</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort recipes"
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 focus:border-[#F4B8C1] outline-none"
          >
            <option value="newest">{l.sortNewest}</option>
            <option value="rating">{l.sortRating}</option>
            <option value="reviews">{l.sortReviews}</option>
            <option value="prep-time">{l.sortPrep}</option>
          </select>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-[#F4B8C1] transition-colors flex items-center gap-2"
            aria-label="Open filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {l.filters}
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-[#8B3A62] text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeFilters.map((filter, i) => (
            <button
              key={i}
              onClick={filter.onRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4B8C1]/20 text-[#8B3A62] text-xs font-medium rounded-full hover:bg-[#F4B8C1]/40 transition-colors group"
            >
              {filter.label}
              <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-slate-600 hover:text-[#8B3A62] transition-colors underline"
          >
            {l.clearAll}
          </button>
        </div>
      )}

      {/* Result Count */}
      <div className="text-sm text-slate-600 mb-4">
        {l.showing} <strong className="text-[#5C3D2E]">{total}</strong> {total !== 1 ? l.recipes : l.recipe}
        {loading && <span className="ml-2 text-slate-400 animate-pulse">...</span>}
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <FilterSidebar />
          </div>
        </aside>

        <div className="flex-1" ref={gridRef}>
          {recipes.length > 0 ? (
            <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${loading ? 'opacity-60' : ''}`}>
              {recipes.map((recipe) => (
                <a
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] bg-[#F5EDE3] overflow-hidden">
                    {recipe.hero_image_url ? (
                      <img src={recipe.hero_image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[#F4B8C1]/20 to-[#C4B1D4]/20">🍦</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        recipe.difficulty === 'beginner' ? 'bg-[#A8D8C8]/40 text-[#1a6b4f]' :
                        recipe.difficulty === 'advanced' ? 'bg-[#F4B8C1]/40 text-[#6b1d42]' :
                        'bg-[#FDE9B0]/40 text-[#5C3D2E]'
                      }`}>
                        {recipe.difficulty === 'beginner' ? l.beginner : recipe.difficulty === 'intermediate' ? l.intermediate : l.advanced}
                      </span>
                      <span className="text-xs text-slate-600">{l.baseTypeMap?.[recipe.base_type] ?? recipe.base_type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#5C3D2E] group-hover:text-[#8B3A62] transition-colors line-clamp-2 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className="w-3.5 h-3.5" fill={s <= Math.round(recipe.avg_rating) ? '#F5D47A' : '#E2E8F0'} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-600">({recipe.rating_count})</span>
                      </div>
                      {recipe.prep_time_minutes && (
                        <span className="text-xs text-slate-600">⏱ {recipe.prep_time_minutes}m {l.prep}</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchRecipes(page + 1, true)}
                  disabled={loading}
                  className="px-8 py-3 bg-white text-[#8B3A62] font-medium rounded-full border-2 border-[#F4B8C1] hover:bg-[#F4B8C1]/10 transition-colors disabled:opacity-50"
                >
                  {loading ? (l.loading ?? 'Loading...') : l.loadMore}
                  <span className="ml-2 text-sm text-slate-600">
                    ({recipes.length} {l.of} {total})
                  </span>
                </button>
              </div>
            )}
            </>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-2xl">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-[#5C3D2E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{l.noResults}</h3>
              <p className="text-slate-600 mb-6">{l.noResultsDesc}</p>
              <button onClick={clearAll} className="px-6 py-3 bg-[#8B3A62] text-white font-medium rounded-full hover:bg-[#8B3A62]/90 transition-colors">
                {l.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#5C3D2E]" style={{ fontFamily: 'Playfair Display, serif' }}>{l.filters}</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-600 hover:text-slate-700" aria-label="Close filters">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar />
            </div>
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#8B3A62] text-white font-medium rounded-xl hover:bg-[#8B3A62]/90 transition-colors"
              >
                {l.showing} {total} {total !== 1 ? l.recipes : l.recipe}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function FilterGroup({ title, id, expanded, onToggle, children }: {
  title: string; id: string; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-700 transition-colors"
        aria-expanded={expanded}
        aria-controls={`filter-group-${id}`}
      >
        {title}
        <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div id={`filter-group-${id}`} className="space-y-1 pb-2">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange, count }: {
  label: string; checked: boolean; onChange: () => void; count?: number;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-slate-300 text-[#8B3A62] focus:ring-[#F4B8C1] cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-800 flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400">{count}</span>}
    </label>
  );
}
