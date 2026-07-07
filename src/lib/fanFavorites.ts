/**
 * Assemble the final fan-favorites list from RPC-ranked ids plus an all-time
 * fallback pool, preserving rank order and de-duplicating.
 *
 * The blended-score ranking (recent-window views x Bayesian rating) happens in
 * SQL (see migration 032 `get_fan_favorites`). This merges those ranked ids with
 * a fallback pool (all-time top by view_count) so the section is always full:
 * ranked entries come first in score order, then the fallback fills any gap —
 * e.g. right after deploy when the rolling window has too little history.
 */
export function assembleFanFavorites<T>(
  rankedIds: string[],
  rankedById: Map<string, T>,
  fallback: T[],
  limit: number,
  idOf: (item: T) => string,
): T[] {
  const out: T[] = [];
  const seen = new Set<string>();

  const tryPush = (item: T | undefined): boolean => {
    if (!item) return false;
    const id = idOf(item);
    if (seen.has(id)) return false;
    seen.add(id);
    out.push(item);
    return out.length >= limit;
  };

  for (const id of rankedIds) {
    if (tryPush(rankedById.get(id))) return out;
  }
  for (const item of fallback) {
    if (tryPush(item)) return out;
  }
  return out;
}
