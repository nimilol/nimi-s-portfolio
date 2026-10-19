// Supabase client for the server that knows who is logged in (reads the login cookie).
// Used by admin pages and admin save actions.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a page (not an action): cookies can't be written there. proxy.ts refreshes them instead.
        }
      },
    },
  });
}
