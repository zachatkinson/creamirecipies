import { DIFFICULTY_COLORS } from '../../lib/blog';
import { buildRecipeImageSrcset } from '../../lib/images';
import { localePath, type Locale } from '../../i18n';
import { useRecipeFilters, type RecipeData, type FilterConfig, type Facets } from '../../hooks/useRecipeFilters';

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

interface Props {
  initialRecipes: RecipeData[];
  totalRecipes: number;
  initialFacets?: Facets;
  filterConfig: FilterConfig;
  labels?: Partial<Labels>;
  locale?: string;
}

export default function RecipeFilters({ initialRecipes, totalRecipes, initialFacets, filterConfig, labels: labelsProp, locale }: Props) {
  const l = { ...DEFAULT_LABELS, ...labelsProp };
  const f = useRecipeFilters(initialRecipes, totalRecipes, initialFacets ?? {}, locale);

  const QUICK_FILTERS: { label: string; filters: Record<string, string[]> }[] = [
    { label: l.easyBeginner, filters: { difficulty: ['beginner'] } },
    { label: l.highProtein, filters: { dietary: ['high-protein'] } },
    { label: l.vegan, filters: { dietary: ['vegan'] } },
    { label: l.ketoFriendly, filters: { dietary: ['keto'] } },
    { label: l.dairyFree, filters: { dietary: ['dairy-free'] } },
    { label: l.softServe, filters: { category: ['soft-serve'] } },
  ];

  // Active filter chips
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (f.query) activeFilters.push({ label: `"${f.query}"`, onRemove: () => f.setQuery('') });
  f.selectedBaseTypes.forEach((v) => {
    const bt = filterConfig.baseTypes.find((b) => b.slug === v);
    if (bt) activeFilters.push({ label: bt.name, onRemove: () => f.toggle(f.selectedBaseTypes, v, f.setSelectedBaseTypes) });
  });
  f.selectedDifficulty.forEach((v) => {
    const diffLabel = v === 'beginner' ? l.beginner : v === 'intermediate' ? l.intermediate : l.advanced;
    activeFilters.push({ label: diffLabel, onRemove: () => f.toggle(f.selectedDifficulty, v, f.setSelectedDifficulty) });
  });
  f.selectedFlavors.forEach((v) => {
    const fl = filterConfig.flavorProfiles.find((fp) => fp.slug === v);
    if (fl) activeFilters.push({ label: fl.name, onRemove: () => f.toggle(f.selectedFlavors, v, f.setSelectedFlavors) });
  });
  f.selectedDietary.forEach((v) => {
    const d = filterConfig.dietary.find((dt) => dt.slug === v);
    if (d) activeFilters.push({ label: d.name, onRemove: () => f.toggle(f.selectedDietary, v, f.setSelectedDietary) });
  });
  f.selectedModels.forEach((v) => {
    const m = filterConfig.models.find((md) => md.slug === v);
    if (m) activeFilters.push({ label: m.name, onRemove: () => f.toggle(f.selectedModels, v, f.setSelectedModels) });
  });
  f.selectedCategories.forEach((v) => {
    const all = [...filterConfig.baseTypes, ...filterConfig.flavorProfiles, ...filterConfig.dietary];
    const cat = all.find((c) => c.slug === v);
    activeFilters.push({ label: cat?.name ?? v, onRemove: () => f.toggle(f.selectedCategories, v, f.setSelectedCategories) });
  });
  if (f.minRating > 0) activeFilters.push({ label: `${f.minRating}+ ${l.stars}`, onRemove: () => f.setMinRating(0) });

  const FilterSidebar = () => (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">{l.quickFilters}</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((qf) => (
            <button
              key={qf.label}
              onClick={() => f.applyQuickFilter(qf.filters)}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-blush/20 to-lavender/20 text-berry hover:from-blush/40 hover:to-lavender/40 transition-all"
            >
              {qf.label}
            </button>
          ))}
        </div>
      </div>

      <FilterGroup title={l.difficulty} id="difficulty" expanded={f.expandedGroups.has('difficulty')} onToggle={() => f.toggleGroup('difficulty')}>
        {['beginner', 'intermediate', 'advanced'].map((d) => (
          <FilterCheckbox
            key={d}
            label={d === 'beginner' ? l.beginner : d === 'intermediate' ? l.intermediate : l.advanced}
            checked={f.selectedDifficulty.has(d)}
            onChange={() => f.toggle(f.selectedDifficulty, d, f.setSelectedDifficulty)}
            count={f.facets.difficulty?.[d]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.baseType} id="base-type" expanded={f.expandedGroups.has('base-type')} onToggle={() => f.toggleGroup('base-type')}>
        {filterConfig.baseTypes.map((bt) => (
          <FilterCheckbox
            key={bt.slug}
            label={bt.name}
            checked={f.selectedBaseTypes.has(bt.slug)}
            onChange={() => f.toggle(f.selectedBaseTypes, bt.slug, f.setSelectedBaseTypes)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.dietary} id="dietary" expanded={f.expandedGroups.has('dietary')} onToggle={() => f.toggleGroup('dietary')}>
        {filterConfig.dietary.map((d) => (
          <FilterCheckbox
            key={d.slug}
            label={d.name}
            checked={f.selectedDietary.has(d.slug)}
            onChange={() => f.toggle(f.selectedDietary, d.slug, f.setSelectedDietary)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={l.minRating} id="rating" expanded={f.expandedGroups.has('rating')} onToggle={() => f.toggleGroup('rating')}>
        {[4, 3].map((r) => (
          <FilterCheckbox
            key={r}
            label={`${r}+ ${l.stars}`}
            checked={f.minRating === r}
            onChange={() => f.setMinRating(f.minRating === r ? 0 : r)}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div>
      {/* Screen reader announcements for dynamic content */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{f.liveMessage}</div>
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={f.query}
            onChange={(e) => f.setQuery(e.target.value)}
            placeholder={l.searchPlaceholder}
            aria-label={l.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-600 focus:border-blush focus:ring-1 focus:ring-blush outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="sort-select" className="sr-only">Sort recipes</label>
          <select
            id="sort-select"
            value={f.sortBy}
            onChange={(e) => f.setSortBy(e.target.value as 'newest' | 'rating' | 'reviews' | 'prep-time')}
            aria-label="Sort recipes"
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 focus:border-blush outline-none"
          >
            <option value="newest">{l.sortNewest}</option>
            <option value="rating">{l.sortRating}</option>
            <option value="reviews">{l.sortReviews}</option>
            <option value="prep-time">{l.sortPrep}</option>
          </select>
          <button
            onClick={() => f.setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:border-blush transition-colors flex items-center gap-2"
            aria-label="Open filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {l.filters}
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-berry text-white text-xs rounded-full flex items-center justify-center">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blush/20 text-berry text-xs font-medium rounded-full hover:bg-blush/40 transition-colors group"
            >
              {filter.label}
              <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={f.clearAll}
            className="text-xs text-slate-600 hover:text-berry transition-colors underline"
          >
            {l.clearAll}
          </button>
        </div>
      )}

      {/* Result Count */}
      <div className="text-sm text-slate-600 mb-4">
        {l.showing} <strong className="text-chocolate">{f.total}</strong> {f.total !== 1 ? l.recipes : l.recipe}
        {f.loading && <span className="ml-2 text-slate-400 animate-pulse">...</span>}
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <FilterSidebar />
          </div>
        </aside>

        <div className="flex-1" ref={f.gridRef}>
          {f.recipes.length > 0 ? (
            <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${f.loading ? 'opacity-60' : ''}`}>
              {f.recipes.map((recipe) => (
                <a
                  key={recipe.id}
                  href={localePath(`/recipes/${recipe.slug}`, (locale ?? 'en') as Locale)}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] bg-cream-dark overflow-hidden">
                    {recipe.hero_image_url ? (() => {
                      const img = buildRecipeImageSrcset(recipe.hero_image_url!);
                      return <img src={img.src} srcSet={img.srcset} sizes={img.sizes} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />;
                    })() : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blush/20 to-lavender/20">🍦</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty] ?? 'bg-vanilla/40 text-chocolate'}`}>
                        {recipe.difficulty === 'beginner' ? l.beginner : recipe.difficulty === 'intermediate' ? l.intermediate : l.advanced}
                      </span>
                      <span className="text-xs text-slate-600">{l.baseTypeMap?.[recipe.base_type] ?? recipe.base_type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-chocolate group-hover:text-berry transition-colors line-clamp-2 mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
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

            {f.hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => f.fetchRecipes(f.page + 1, true)}
                  disabled={f.loading}
                  className="px-8 py-3 bg-white text-berry font-medium rounded-full border-2 border-blush hover:bg-blush/10 transition-colors disabled:opacity-50"
                >
                  {f.loading ? (l.loading ?? 'Loading...') : l.loadMore}
                  <span className="ml-2 text-sm text-slate-600">
                    ({f.recipes.length} {l.of} {f.total})
                  </span>
                </button>
              </div>
            )}
            </>
          ) : f.loading ? (
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
              <h3 className="text-xl font-bold text-chocolate mb-2" style={{ fontFamily: 'var(--font-display)' }}>{l.noResults}</h3>
              <p className="text-slate-600 mb-6">{l.noResultsDesc}</p>
              <button onClick={f.clearAll} className="px-6 py-3 bg-berry text-white font-medium rounded-full hover:bg-berry/90 transition-colors">
                {l.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {f.mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => f.setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-chocolate" style={{ fontFamily: 'var(--font-display)' }}>{l.filters}</h3>
              <button onClick={() => f.setMobileFilterOpen(false)} className="p-2 text-slate-600 hover:text-slate-700" aria-label="Close filters">
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
                onClick={() => f.setMobileFilterOpen(false)}
                className="w-full py-3 bg-berry text-white font-medium rounded-xl hover:bg-berry/90 transition-colors"
              >
                {l.showing} {f.total} {f.total !== 1 ? l.recipes : l.recipe}
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
        className="w-4 h-4 rounded border-slate-300 text-berry focus:ring-blush cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-800 flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-slate-400">{count}</span>}
    </label>
  );
}
