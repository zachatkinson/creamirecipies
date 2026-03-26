-- Change publish cron from hourly to daily at 9:05 UTC
-- (5 min after scheduled publish times to ensure they've passed)
select cron.unschedule('publish-scheduled-content');

select cron.schedule(
  'publish-scheduled-content',
  '5 9 * * *',
  $$select public.publish_scheduled_content()$$
);
