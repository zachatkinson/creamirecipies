-- Submit newly published recipes and blog posts to the Internet Archive's
-- Wayback Machine so the canonical English URL gets archived on publish.
--
-- Public save endpoint: https://web.archive.org/save/{url}
-- GET triggers an async save; no auth required. Rate limit ~15/min anonymous.
-- We only submit the English canonical — archiving 5 locales per publish
-- would burn the rate limit and the content is identical modulo translation.

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

    perform net.http_get(
      url := 'https://web.archive.org/save/https://eatcreami.com/recipes/' || NEW.slug,
      headers := jsonb_build_object('User-Agent', 'eatcreami-wayback-bot/1.0')
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

    perform net.http_get(
      url := 'https://web.archive.org/save/https://eatcreami.com/blog/' || NEW.slug,
      headers := jsonb_build_object('User-Agent', 'eatcreami-wayback-bot/1.0')
    );
  end if;
  return NEW;
end;
$$;
