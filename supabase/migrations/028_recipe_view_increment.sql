-- Atomic view count increment. Returns the new count.
-- Called from /api/recipes/view to increment once per client-side page load.

create or replace function public.increment_recipe_views(p_slug text)
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  update public.recipes
  set view_count = coalesce(view_count, 0) + 1
  where slug = p_slug and status = 'published'
  returning view_count into new_count;
  return new_count;
end;
$$;
