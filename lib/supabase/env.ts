// Reads the public Supabase settings. These are safe for the browser.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// The storage bucket that holds every uploaded image and video.
export const MEDIA_BUCKET = "media";

// True once the keys have been added (locally in .env.local, or in Vercel).
export function isSupabaseConfigured() {
  return /^https?:\/\//.test(SUPABASE_URL) && SUPABASE_KEY.length > 20;
}
