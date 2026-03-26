import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { Database } from './types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/** Browser-side Supabase client (anon key, no cookies) */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/** Server-side Supabase client with cookie-based auth */
export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return getAllCookies(cookies);
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, options);
        }
      },
    },
  });
}

/** Service-role client for admin operations (server-side only) */
export function createSupabaseAdmin() {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAllCookies(cookies: AstroCookies): { name: string; value: string }[] {
  // Parse cookies from the header entries
  const entries: { name: string; value: string }[] = [];
  for (const header of cookies.headers()) {
    if (typeof header === 'string' && header.includes('=')) {
      const [name, ...rest] = header.split('=');
      entries.push({ name: name.trim(), value: rest.join('=').trim() });
    }
  }
  return entries.length > 0 ? entries : [];
}

