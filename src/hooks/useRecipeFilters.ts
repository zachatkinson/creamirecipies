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

interface Facets {
  difficulty?: Record<string, number>;
}

type SortOption = 'newest' | 'rating' | 'reviews' | 'prep-time';

export type { RecipeData, FilterConfig, Facets, SortOption };

export function useRecipeFilters(
  initialRecipes: RecipeData[],
  totalRecipes: number,
  initialFacets: Facets,
  locale?: string,
) {
  // Recipe data state
  const [recipes, setRecipes] = useState<RecipeData[]>(initialRecipes);
  const [total, setTotal] = useState(totalRecipes);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [facets, setFacets] = useState<Facets>(initialFacets);
  const [liveMessage, setLiveMessage] = useState('');

  // Filter state
  const [query, setQuery] = useState('');
  const [selectedBaseTypes, setSelectedBaseTypes] = useState<Set<string>>(new Set());
  const [selectedFlavors, setSelectedFlavors] = useState<Set<string>>(new Set());
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
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
    selectedCategories.forEach((v) => params.append('tag', v));
    if (minRating > 0) params.set('rating', String(minRating));
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (locale) params.set('locale', locale);
    return params;
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, selectedCategories, minRating, sortBy, locale]);

  // Fetch recipes from API
  const fetchRecipes = useCallback(async (pageNum: number, append: boolean) => {
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
      const prevCount = append ? recipes.length : 0;
      setRecipes((prev) => append ? [...prev, ...data.recipes] : data.recipes);
      setTotal(data.total);
      setPage(pageNum);
      if (data.facets) setFacets(data.facets);
      const newCount = data.recipes.length;
      setLiveMessage(append
        ? `${newCount} more recipes loaded. Showing ${prevCount + newCount} of ${data.total}.`
        : `${data.total} recipes found.`);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Failed to fetch recipes:', err);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [buildParams, recipes.length]);

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
      if (key === 'model' && Array.isArray(value)) {
        setSelectedModels((prev) => { const next = new Set(prev); const v = value[0]; if (next.has(v)) next.delete(v); else next.add(v); return next; });
      }
      if (key === 'category' && Array.isArray(value)) {
        setSelectedCategories((prev) => { const next = new Set(prev); const v = value[0]; if (next.has(v)) next.delete(v); else next.add(v); return next; });
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
    setSelectedCategories(new Set());
    setSelectedDifficulty(new Set());
    setMinRating(0);
    setSortBy('newest');
  }, []);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) setQuery(params.get('q')!);
    if (params.getAll('base').length) setSelectedBaseTypes(new Set(params.getAll('base')));
    if (params.getAll('difficulty').length) setSelectedDifficulty(new Set(params.getAll('difficulty')));
    if (params.getAll('flavor').length) setSelectedFlavors(new Set(params.getAll('flavor')));
    if (params.getAll('dietary').length) setSelectedDietary(new Set(params.getAll('dietary')));
    if (params.getAll('model').length) setSelectedModels(new Set(params.getAll('model')));
    if (params.getAll('tag').length) setSelectedCategories(new Set(params.getAll('tag')));
    if (params.get('rating')) setMinRating(Number(params.get('rating')));
    if (params.get('sort')) setSortBy(params.get('sort') as SortOption);
    initializedRef.current = true;
  }, []);

  // When any filter/sort changes, fetch from API and sync URL
  useEffect(() => {
    if (!initializedRef.current) return;

    const params = buildParams();
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const delay = query ? 300 : 0;
    searchTimerRef.current = setTimeout(() => fetchRecipes(1, false), delay);

    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [query, selectedBaseTypes, selectedDifficulty, selectedFlavors, selectedDietary, selectedModels, selectedCategories, minRating, sortBy, buildParams, fetchRecipes]);

  const hasMore = recipes.length < total;

  return {
    // Data
    recipes, total, loading, facets, liveMessage, hasMore, page,
    // Filter state
    query, setQuery,
    selectedBaseTypes, setSelectedBaseTypes,
    selectedFlavors, setSelectedFlavors,
    selectedDietary, setSelectedDietary,
    selectedModels, setSelectedModels,
    selectedCategories, setSelectedCategories,
    selectedDifficulty, setSelectedDifficulty,
    minRating, setMinRating,
    sortBy, setSortBy,
    // UI state
    mobileFilterOpen, setMobileFilterOpen,
    expandedGroups, toggleGroup,
    gridRef,
    // Actions
    fetchRecipes, toggle, applyQuickFilter, clearAll,
  };
}
