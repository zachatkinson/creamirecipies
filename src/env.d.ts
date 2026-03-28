/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    supabase: import('@supabase/supabase-js').SupabaseClient<import('./lib/types').Database>;
    locale: import('./i18n').Locale;
  }
}
