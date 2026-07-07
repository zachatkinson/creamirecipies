-- Fan favorites: blended score over a rolling window.
-- Adds a timestamped view-event log so we can rank by RECENT views (not just
-- all-time), and blends that with a Bayesian-smoothed rating. `recipes.view_count`
-- stays as the cumulative all-time counter and homepage fallback.

-- 1. Timestamped view-event log ------------------------------------------------
create table if not exists public.recipe_view_events (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_rve_recipe_time on public.recipe_view_events (recipe_id, viewed_at desc);
create index if not exists idx_rve_time on public.recipe_view_events (viewed_at desc);

-- No RLS policies: direct table access is denied. All reads/writes flow through
-- the SECURITY DEFINER functions below, which run as the table owner.
alter table public.recipe_view_events enable row level security;

-- 2. Extend the view increment to also log a timestamped event -----------------
create or replace function public.increment_recipe_views(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
  rid uuid;
begin
  update public.recipes
  set view_count = coalesce(view_count, 0) + 1
  where slug = p_slug and status = 'published'
  returning id, view_count into rid, new_count;

  if rid is not null then
    insert into public.recipe_view_events (recipe_id) values (rid);
  end if;
  return new_count;
end;
$$;

-- 3. Blended fan-favorites ranking ---------------------------------------------
-- score = recent-window views x Bayesian-smoothed rating (normalized to 0..1).
-- Bayesian smoothing (m = 5 prior votes at the global mean rating C) keeps a lone
-- 5-star from hijacking the list and defaults unrated recipes to the global mean,
-- so views lead and quality nudges. Only recipes with views in the window rank;
-- the homepage fills any shortfall from all-time view_count.
create or replace function public.get_fan_favorites(p_limit int default 3, p_window_days int default 30)
returns table (recipe_id uuid, recent_views bigint, score numeric)
language sql
stable
security definer
set search_path = public
as $$
  with prior as (
    select coalesce(avg(avg_rating), 3.5)::numeric as c
    from public.recipes
    where rating_count > 0
  ),
  recent as (
    select e.recipe_id, count(*)::bigint as rv
    from public.recipe_view_events e
    where e.viewed_at >= now() - make_interval(days => p_window_days)
    group by e.recipe_id
  )
  select
    r.id,
    rec.rv,
    (rec.rv
      * ((r.rating_count * r.avg_rating + 5 * prior.c) / (r.rating_count + 5))
      / 5.0)::numeric as score
  from recent rec
  join public.recipes r on r.id = rec.recipe_id
  cross join prior
  where r.status = 'published'
    and r.published_at <= now()
  order by score desc, rec.rv desc, r.view_count desc
  limit p_limit;
$$;

grant execute on function public.get_fan_favorites(int, int) to anon, authenticated;
