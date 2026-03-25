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
  freeze_time_hours: number | null;
  hero_image_url: string | null;
  categories: string[];   // category slugs
  models: string[];       // model slugs
  author_name: string;
  author_avatar: string | null;
}

interface FilterConfig {
  baseTypes: { slug: string; name: string }[];
  flavorProfiles: { slug: string; name: string }[];
  dietary: { slug: string; name: string }[];
  models: { slug: string; name: string }[];
}

interface Props {
  recipes: RecipeData[];
  filterConfig: FilterConfig;
  initialQuery?: string;
}

type SortOption = 'newest' | 'rating' | 'reviews' | 'prep-time';

const QUICK_FILTERS = [
  { label: 'Easy & Beginner', filters: { difficulty: ['beginner'] } },
  { label: 'High Protein', filters: { dietary: ['high-protein'] } },
  { label: 'Vegan', filters: { dietary: ['vegan'] } },
  { label: 'Keto Friendly', filters: { dietary: ['keto'] } },
  { label: 'Dairy Free', filters: { dietary: ['dairy-free'] } },
  { label: 'Soft Serve', filters: { baseType: ['lite-ice-cream'] } },
];

export default function RecipeFilters({ recipes, filterConfig, initialQuery }: Props) {
  // Search
  const [query, setQuery] = useState(initialQuery ?? '');

  // Filter state
  const [selectedBaseTypes, setSelectedBaseTypes] = useState<Set<string>>(new Set());
  const [selectedFlavors, setSelectedFlavors] = useState<Set<string>>(new Set());
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['difficulty', 'base-type']));
  const [visibleCount, setVisibleCount] = useState(24);
  const gridRef = useRef<HTMLDivElement>(null);

  // Toggle functions
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

  // Apply quick filter
  const applyQuickFilter = useCallback((filters: Record<string, string[] | number>) => {
    clearAll();
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'difficulty' && Array.isArray(value)) setSelectedDifficulty(new Set(value));
      if (key === 'dietary' && Array.isArray(value)) setSelectedDietary(new Set(value));
      if (key === 'minRating' && typeof value === 'number') setMinRating(value);
    }
  }, []);

  // Clear all filters
  const clearAll = useCallback(() => {
    setQuery('');
    setSelectedBaseTypes(new Set());
    setSelectedFlavors(new Set());
    setSelectedDietary(new Set());
    setSelectedModels(new Set());
    setSelectedDifficulty(new Set());
    setMinRating(0);
    setSortBy('newest');
    setVisibleCount(24);
  }, []);

  // Reset visible count when any filter changes
  useEffect(() => {
    setVisibleCount(24);
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy]);

  // Filter recipes
  const filtered = recipes.filter((r) => {
    if (query) {
      const q = query.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    if (selectedBaseTypes.size > 0 && !selectedBaseTypes.has(r.base_type.toLowerCase().replace(/\s+/g, '-'))) return false;
    if (selectedDifficulty.size > 0 && !selectedDifficulty.has(r.difficulty)) return false;
    if (selectedFlavors.size > 0 && !r.categories.some((c) => selectedFlavors.has(c))) return false;
    if (selectedDietary.size > 0 && !r.categories.some((c) => selectedDietary.has(c))) return false;
    if (selectedModels.size > 0 && !r.models.some((m) => selectedModels.has(m))) return false;
    if (minRating > 0 && r.avg_rating < minRating) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.avg_rating - a.avg_rating;
      case 'reviews': return b.rating_count - a.rating_count;
      case 'prep-time': return (a.prep_time_minutes ?? 999) - (b.prep_time_minutes ?? 999);
      default: return 0; // newest = default order from DB
    }
  });

  // Active filter chips
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (query) activeFilters.push({ label: `"${query}"`, onRemove: () => setQuery('') });
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

  // Update URL params for shareability
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    selectedBaseTypes.forEach((v) => params.append('base', v));
    selectedDifficulty.forEach((v) => params.append('difficulty', v));
    selectedFlavors.forEach((v) => params.append('flavor', v));
    selectedDietary.forEach((v) => params.append('dietary', v));
    selectedModels.forEach((v) => params.append('model', v));
    if (minRating > 0) params.set('rating', String(minRating));
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, minRating, sortBy]);

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
  }, []);

  const FilterSidebar = () => (
    <div className="space-y-5">
      {/* Quick Filters */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Filters</div>
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

      {/* Difficulty */}
      <FilterGroup title="Difficulty" id="difficulty" expanded={expandedGroups.has('difficulty')} onToggle={() => toggleGroup('difficulty')}>
        {['beginner', 'intermediate', 'advanced'].map((d) => (
          <FilterCheckbox
            key={d}
            label={d.charAt(0).toUpperCase() + d.slice(1)}
            checked={selectedDifficulty.has(d)}
            onChange={() => toggle(selectedDifficulty, d, setSelectedDifficulty)}
            count={recipes.filter((r) => r.difficulty === d).length}
          />
        ))}
      </FilterGroup>

      {/* Base Type */}
      <FilterGroup title="Base Type" id="base-type" expanded={expandedGroups.has('base-type')} onToggle={() => toggleGroup('base-type')}>
        {filterConfig.baseTypes.map((bt) => (
          <FilterCheckbox
            key={bt.slug}
            label={bt.name}
            checked={selectedBaseTypes.has(bt.slug)}
            onChange={() => toggle(selectedBaseTypes, bt.slug, setSelectedBaseTypes)}
            count={recipes.filter((r) => r.base_type.toLowerCase().replace(/\s+/g, '-') === bt.slug).length}
          />
        ))}
      </FilterGroup>

      {/* Dietary */}
      <FilterGroup title="Dietary" id="dietary" expanded={expandedGroups.has('dietary')} onToggle={() => toggleGroup('dietary')}>
        {filterConfig.dietary.map((d) => (
          <FilterCheckbox
            key={d.slug}
            label={d.name}
            checked={selectedDietary.has(d.slug)}
            onChange={() => toggle(selectedDietary, d.slug, setSelectedDietary)}
            count={recipes.filter((r) => r.categories.includes(d.slug)).length}
          />
        ))}
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Minimum Rating" id="rating" expanded={expandedGroups.has('rating')} onToggle={() => toggleGroup('rating')}>
        {[4, 3].map((r) => (
          <FilterCheckbox
            key={r}
            label={`${r}+ Stars`}
            checked={minRating === r}
            onChange={() => setMinRating(minRating === r ? 0 : r)}
            count={recipes.filter((rec) => rec.avg_rating >= r).length}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div>
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes by name or ingredient..."
            aria-label="Search recipes"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-500 focus:border-[#F4B8C1] focus:ring-1 focus:ring-[#F4B8C1] outline-none transition-colors"
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
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="prep-time">Quickest Prep</option>
          </select>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-[#F4B8C1] transition-colors flex items-center gap-2"
            aria-label="Open filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
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
            className="text-xs text-slate-500 hover:text-[#8B3A62] transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Result Count */}
      <div className="text-sm text-slate-500 mb-4">
        Showing <strong className="text-[#5C3D2E]">{sorted.length}</strong> recipe{sorted.length !== 1 ? 's' : ''}
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <FilterSidebar />
          </div>
        </aside>

        {/* Recipe Grid */}
        <div className="flex-1" ref={gridRef}>
          {sorted.length > 0 ? (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sorted.slice(0, visibleCount).map((recipe) => (
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
                        {recipe.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">{recipe.base_type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#5C3D2E] group-hover:text-[#8B3A62] transition-colors line-clamp-2 mb-1.5" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className="w-3.5 h-3.5" fill={s <= Math.round(recipe.avg_rating) ? '#F5D47A' : '#E2E8F0'} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">({recipe.rating_count})</span>
                      </div>
                      {recipe.prep_time_minutes && (
                        <span className="text-xs text-slate-500">⏱ {recipe.prep_time_minutes}m prep</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < sorted.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3 bg-white text-[#8B3A62] font-medium rounded-full border-2 border-[#F4B8C1] hover:bg-[#F4B8C1]/10 transition-colors"
                >
                  Load More Recipes
                  <span className="ml-2 text-sm text-slate-500">
                    ({Math.min(visibleCount, sorted.length)} of {sorted.length})
                  </span>
                </button>
              </div>
            )}
            </>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-2xl">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-[#5C3D2E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No Recipes Found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={clearAll} className="px-6 py-3 bg-[#8B3A62] text-white font-medium rounded-full hover:bg-[#8B3A62]/90 transition-colors">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#5C3D2E]" style={{ fontFamily: 'Playfair Display, serif' }}>Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-700"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar />
            </div>
            {/* Sticky apply button */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#8B3A62] text-white font-medium rounded-xl hover:bg-[#8B3A62]/90 transition-colors"
              >
                Show {sorted.length} Recipe{sorted.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function FilterGroup({
  title,
  id,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
        aria-expanded={expanded}
        aria-controls={`filter-group-${id}`}
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
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

function FilterCheckbox({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count: number;
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
      <span className="text-xs text-slate-400">{count}</span>
    </label>
  );
}
