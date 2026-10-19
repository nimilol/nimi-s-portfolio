import { MEDIA_BUCKET, SUPABASE_URL } from "./supabase/env";

// Turns a saved file path into a full web address.
// Paths that start with "/" are files inside the project's /public folder (built-in content).
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

// True for files we uploaded to Supabase Storage (so they can be deleted later).
export function isStoragePath(path: string | null | undefined): path is string {
  return !!path && !path.startsWith("/") && !path.startsWith("http");
}
