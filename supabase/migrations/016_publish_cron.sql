-- Enable pg_cron extension (available on Supabase free tier)
create extension if not exists pg_cron;

-- Function: publish scheduled recipes and posts
create or replace function public.publish_scheduled_content()
returns void
language plpgsql
security definer
as $$
declare
  recipe_count int;
  post_count int;
begin
  -- Publish recipes whose published_at has passed
  update recipes
  set status = 'published'
  where status = 'draft'
    and published_at is not null
    and published_at <= now();

  get diagnostics recipe_count = row_count;

  -- Publish blog posts whose published_at has passed
  update posts
  set status = 'published'
  where status = 'draft'
    and published_at is not null
    and published_at <= now();

  get diagnostics post_count = row_count;

  -- Log the results
  if recipe_count > 0 or post_count > 0 then
    raise log 'publish_scheduled_content: published % recipes, % posts', recipe_count, post_count;
  end if;
end;
$$;

-- Schedule: run every hour at minute 0
-- This catches the 5 daily recipes (scheduled at 09:00 UTC) and weekly blog posts
select cron.schedule(
  'publish-scheduled-content',
  '0 * * * *',
  $$select public.publish_scheduled_content()$$
);
