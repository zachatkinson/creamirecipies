-- Fix Supabase linter warning: view ran as SECURITY DEFINER, bypassing the
-- querying user's RLS. security_invoker makes it enforce the caller's policies.
ALTER VIEW recipe_model_compatibility SET (security_invoker = true);
