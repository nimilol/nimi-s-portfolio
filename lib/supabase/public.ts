// Supabase client for the public page. It never reads cookies,
// so the public page can be cached and served fast.
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
