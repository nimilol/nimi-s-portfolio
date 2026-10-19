"use client";
// Supabase client for the browser (admin uploads). Uses the logged-in session cookie.
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
