-- Trigger function: notify IndexNow when content is published
-- Uses pg_net extension to make HTTP calls from within Postgres
create extension if not exists pg_net;

-- Function to ping IndexNow when a recipe is published
create or replace function public.notify_indexnow_recipe()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Only fire when status changes to 'published'
  if NEW.status = 'published' and (OLD.status is null or OLD.status != 'published') then
    perform net.http_post(
      url := 'https://api.indexnow.org/indexnow',
      body := jsonb_build_object(
        'host', 'eatcreami.com',
        'key', '3259e128db3d124710601aa575a1293a',
        'urlList', jsonb_build_array('https://eatcreami.com/recipes/' || NEW.slug)
      ),
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  end if;
  return NEW;
end;
$$;

-- Function to ping IndexNow when a post is published
create or replace function public.notify_indexnow_post()
returns trigger
language plpgsql
security definer
as $$
begin
  if NEW.status = 'published' and (OLD.status is null or OLD.status != 'published') then
    perform net.http_post(
      url := 'https://api.indexnow.org/indexnow',
      body := jsonb_build_object(
        'host', 'eatcreami.com',
        'key', '3259e128db3d124710601aa575a1293a',
        'urlList', jsonb_build_array('https://eatcreami.com/blog/' || NEW.slug)
      ),
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  end if;
  return NEW;
end;
$$;

-- Create triggers
create trigger on_recipe_publish
  after update on recipes
  for each row
  execute function notify_indexnow_recipe();

create trigger on_post_publish
  after update on posts
  for each row
  execute function notify_indexnow_post();
