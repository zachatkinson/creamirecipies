import { createClient } from '@supabase/supabase-js';
import '@supabase/ssr';

const supabaseUrl = "https://qilbrsswjhnjdkbdvdll.supabase.co";
const supabaseAnonKey = "sb_publishable_VezDbx0z1XCjGoluPT0WnQ_re4mIfCq";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
function createSupabaseAdmin() {
  const serviceRoleKey = "sb_secret_dg9Jxk0ocFsh-O_HRKR4Aw_ybk2Jq74";
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export { createSupabaseAdmin as c, supabase as s };
