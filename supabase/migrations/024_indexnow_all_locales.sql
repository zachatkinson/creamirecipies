-- Update IndexNow triggers to submit all locale URLs when content is published

create or replace function public.notify_indexnow_recipe()
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
        'urlList', jsonb_build_array(
          'https://eatcreami.com/recipes/' || NEW.slug,
          'https://eatcreami.com/fr/recipes/' || NEW.slug,
          'https://eatcreami.com/es/recipes/' || NEW.slug,
          'https://eatcreami.com/de/recipes/' || NEW.slug,
          'https://eatcreami.com/pt/recipes/' || NEW.slug
        )
      ),
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  end if;
  return NEW;
end;
$$;

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
        'urlList', jsonb_build_array(
          'https://eatcreami.com/blog/' || NEW.slug,
          'https://eatcreami.com/fr/blog/' || NEW.slug,
          'https://eatcreami.com/es/blog/' || NEW.slug,
          'https://eatcreami.com/de/blog/' || NEW.slug,
          'https://eatcreami.com/pt/blog/' || NEW.slug
        )
      ),
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  end if;
  return NEW;
end;
$$;
