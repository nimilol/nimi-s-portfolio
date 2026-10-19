// Server-only checks for "is this the admin?".
import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

// The single allowed admin email (set ADMIN_EMAIL in Vercel). If missing, nobody is admin.
export function isAdminEmail(email: string | null | undefined) {
  const admin = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  return !!admin && !!email && email.trim().toLowerCase() === admin;
}

// Returns the logged-in admin, or null.
export async function getAdmin() {
  await connection(); // always check on each visit (never cached)
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAdminEmail(data.user.email)) return null;
  return { supabase, user: data.user };
}

// For admin PAGES: sends anyone who isn't the admin to the login page.
export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// For admin SAVE ACTIONS: refuses to do anything unless it's the admin.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not allowed: please log in as the admin.");
  return admin;
}
