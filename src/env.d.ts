/// <reference path="../.astro/types.d.ts" />

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './lib/types';
import type { Locale } from './i18n';

declare namespace App {
  interface Locals {
    supabase: SupabaseClient<Database>;
    locale: Locale;
  }
}
