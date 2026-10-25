"use server";
// Every admin "save" lives here. Each action:
//   1. checks you are the admin (requireAdmin) — on the server, not just in the UI
//   2. writes to Supabase (the database also double-checks with Row Level Security)
//   3. refreshes the public page so the change shows on the next reload

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin, isAdminEmail, requireAdmin } from "@/lib/auth";
import { CUSTOM_LAYOUTS, LAYOUT_FIELDS, SHOWCASE_LAYOUTS } from "@/lib/layouts";
import { isStoragePath } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";
import { MEDIA_BUCKET, isSupabaseConfigured } from "@/lib/supabase/env";
import type { LayoutType, Settings } from "@/lib/types";
import { isFontId, parseSectionFonts, ROLES } from "@/lib/fonts";
import { DEFAULT_SETTINGS, SEED_ITEMS, SEED_SECTIONS } from "@/lib/seed";

export type FormState = { error?: string; ok?: string } | undefined;

// ---------- small helpers ----------

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

// Only allow normal web links (blocks things like "javascript:" links).
function safeUrl(value: string) {
  if (!value) return null;
  if (/^(https?:\/\/|mailto:)/i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`; // "x.com/abc" -> https://x.com/abc
  return null;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

// Supabase doesn't report an error when Row Level Security quietly blocks a change: it just changes 0 rows.
// This turns that silent "nothing happened" into a clear message.
const BLOCKED =
  "The database refused this change, so nothing was saved. In Supabase, check that the email inside is_admin() " +
  "(top of supabase/schema.sql) is exactly your login email, then run schema.sql again.";

// A copy of a row without the given columns (e.g. the built-in "seed-..." ids; the database makes real ones).
function withoutKeys<T extends object>(row: T, keys: string[]) {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !keys.includes(key)));
}

function changed(res: { data: unknown[] | null }) {
  return !!res.data && res.data.length > 0;
}

async function removeFiles(paths: (string | null | undefined)[]) {
  const files = paths.filter(isStoragePath);
  if (files.length === 0) return;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(files);
  if (error) console.error("Could not delete files from storage:", error.message);
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "section"
  );
}

// ---------- login / logout ----------

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return { error: "Supabase is not connected yet. See docs/SETUP.md." };
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  if (!isAdminEmail(email)) return { error: "This email is not allowed to log in." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Wrong email or password." };
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: "This account is not the admin." };
  }
  redirect("/admin");
}

export async function logout() {
  const admin = await getAdmin();
  if (admin) await admin.supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- items ----------

export async function saveItem(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const sectionId = text(form, "section_id");

  const { data: section } = await supabase.from("sections").select("id, layout_type").eq("id", sectionId).single();
  if (!section) return { error: "Section not found." };
  const fields = LAYOUT_FIELDS[section.layout_type as LayoutType];

  // Build the row from the fields this layout uses.
  const row: Record<string, unknown> = { section_id: sectionId, title: "" };
  const extra: Record<string, string> = {};
  for (const field of fields) {
    const value = text(form, field.key);
    if (field.required && !value) return { error: `"${field.label}" is required.` };

    if (field.key.startsWith("extra.")) {
      if (value) extra[field.key.slice(6)] = value;
    } else if (field.type === "number") {
      if (value && Number.isNaN(Number(value))) return { error: `"${field.label}" must be a number.` };
      row[field.key] = value ? Number(value) : null;
    } else if (field.type === "url") {
      const url = safeUrl(value);
      if (value && !url) return { error: `"${field.label}" must be a link starting with https://` };
      row[field.key] = url;
    } else if (field.type === "image" || field.type === "video") {
      row.media_path = value || null;
      row.media_type = value ? field.type : null;
      if (field.type === "video") row.thumb_path = text(form, "thumb_path") || null;
    } else {
      row[field.key] = value || null;
    }
  }
  row.title = (row.title as string | null) ?? "";
  row.extra = extra;

  if (id) {
    // Editing: if a file was replaced, delete the old one from storage.
    const { data: old } = await supabase.from("items").select("media_path, thumb_path").eq("id", id).single();
    const res = await supabase.from("items").update(row).eq("id", id).select("id");
    if (res.error) return { error: res.error.message };
    if (!changed(res)) return { error: BLOCKED };
    if (old) {
      await removeFiles([
        old.media_path !== row.media_path ? old.media_path : null,
        old.thumb_path !== (row.thumb_path ?? old.thumb_path) ? old.thumb_path : null,
      ]);
    }
  } else {
    // Adding: put the new item at the end.
    const { data: last } = await supabase
      .from("items")
      .select("sort_order")
      .eq("section_id", sectionId)
      .order("sort_order", { ascending: false })
      .limit(1);
    row.sort_order = (last?.[0]?.sort_order ?? -1) + 1;
    const res = await supabase.from("items").insert(row).select("id");
    if (res.error) return { error: res.error.message };
    if (!changed(res)) return { error: BLOCKED };
  }

  refreshSite();
  redirect(`/admin/sections/${sectionId}?saved=1`);
}

export async function deleteItem(itemId: string) {
  const { supabase } = await requireAdmin();
  const { data: item } = await supabase.from("items").select("media_path, thumb_path").eq("id", itemId).single();
  const res = await supabase.from("items").delete().eq("id", itemId).select("id");
  if (res.error) throw new Error(res.error.message);
  if (!changed(res)) throw new Error(BLOCKED);
  if (item) await removeFiles([item.media_path, item.thumb_path]);
  refreshSite();
}

export async function reorderItems(ids: string[]) {
  const { supabase } = await requireAdmin();
  for (let i = 0; i < ids.length; i++) {
    const res = await supabase.from("items").update({ sort_order: i }).eq("id", ids[i]).select("id");
    if (res.error) throw new Error(res.error.message);
    if (!changed(res)) throw new Error(BLOCKED);
  }
  refreshSite();
}

// Deletes files that were uploaded in a form but then replaced or not saved.
export async function discardUploads(paths: string[]) {
  const { supabase } = await requireAdmin();
  // Never delete a file that a saved item still uses.
  const safe: string[] = [];
  for (const path of paths.filter(isStoragePath)) {
    const { count } = await supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .or(`media_path.eq.${path},thumb_path.eq.${path}`);
    if (!count) safe.push(path);
  }
  await removeFiles(safe);
}

// ---------- sections ----------

export async function saveSection(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  const label = text(form, "label");
  if (!title && !label) return { error: "Add a label or a heading (or both)." };
  const variant = text(form, "variant");
  const res = await supabase
    .from("sections")
    .update({
      label: label || null,
      title,
      subtitle: text(form, "subtitle") || null,
      ...(variant ? { variant: variant === "stack" ? "stack" : "circle" } : {}),
      is_hidden: form.get("is_hidden") === "on",
      show_in_nav: form.get("show_in_nav") === "on",
    })
    .eq("id", id)
    .select("id");
  if (res.error) return { error: res.error.message };
  if (!changed(res)) return { error: BLOCKED };
  refreshSite();
  return { ok: "Saved. It's live on your site now." };
}

export async function setSectionHidden(id: string, hidden: boolean) {
  const { supabase } = await requireAdmin();
  const res = await supabase.from("sections").update({ is_hidden: hidden }).eq("id", id).select("id");
  if (res.error) throw new Error(res.error.message);
  if (!changed(res)) throw new Error(BLOCKED);
  refreshSite();
}

export async function createSection(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const title = text(form, "title");
  const label = text(form, "label");
  const layout = text(form, "layout_type") as LayoutType;
  if (!title && !label) return { error: "Add a label or a heading." };
  if (!CUSTOM_LAYOUTS.includes(layout)) return { error: "Pick a layout." };

  // Make a unique web-friendly id for the section, e.g. "my-podcasts".
  const base = slugify(label || title);
  const { data: existing } = await supabase.from("sections").select("slug, sort_order");
  const slugs = new Set((existing ?? []).map((s) => s.slug));
  let slug = base;
  for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;

  // Place it just before Contact (or at the end).
  const contact = existing?.find((s) => s.slug === "contact");
  const maxOrder = Math.max(-1, ...(existing ?? []).map((s) => s.sort_order));
  let sortOrder = maxOrder + 1;
  if (contact) {
    sortOrder = contact.sort_order;
    await supabase.from("sections").update({ sort_order: maxOrder + 1 }).eq("slug", "contact");
  }

  const { data, error } = await supabase
    .from("sections")
    .insert({
      slug,
      label: label || null,
      title,
      subtitle: text(form, "subtitle") || null,
      layout_type: layout,
      variant: SHOWCASE_LAYOUTS.includes(layout) ? (text(form, "variant") === "stack" ? "stack" : "circle") : null,
      sort_order: sortOrder,
      is_builtin: false,
      show_in_nav: form.get("show_in_nav") === "on",
    })
    .select("id")
    .single();
  if (error || !data) return { error: error?.message ?? "Could not create section." };
  refreshSite();
  redirect(`/admin/sections/${data.id}`);
}

export async function deleteSection(id: string) {
  const { supabase } = await requireAdmin();
  const { data: section } = await supabase.from("sections").select("is_builtin").eq("id", id).single();
  if (!section) throw new Error("Section not found.");
  if (section.is_builtin) throw new Error("Built-in sections can't be deleted, only hidden.");

  const { data: items } = await supabase.from("items").select("media_path, thumb_path").eq("section_id", id);
  const res = await supabase.from("sections").delete().eq("id", id).select("id"); // items are deleted with it
  if (res.error) throw new Error(res.error.message);
  if (!changed(res)) throw new Error(BLOCKED);
  await removeFiles((items ?? []).flatMap((i) => [i.media_path, i.thumb_path]));
  refreshSite();
  redirect("/admin");
}

export async function reorderSections(ids: string[]) {
  const { supabase } = await requireAdmin();
  for (let i = 0; i < ids.length; i++) {
    const res = await supabase.from("sections").update({ sort_order: i }).eq("id", ids[i]).select("id");
    if (res.error) throw new Error(res.error.message);
    if (!changed(res)) throw new Error(BLOCKED);
  }
  refreshSite();
}

// ---------- site settings ----------

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const values: Partial<Settings> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    if (form.has(key)) values[key] = text(form, key);
  }
  if (values.accent && !/^#[0-9a-fA-F]{6}$/.test(values.accent)) {
    return { error: "Accent color must look like #F2B544." };
  }
  for (const key of ["x_url", "telegram_url"] as const) {
    if (values[key]) {
      const url = safeUrl(values[key]!);
      if (!url) return { error: "Links must start with https://" };
      values[key] = url;
    }
  }

  if (values.floating_avatar !== undefined) values.floating_avatar = values.floating_avatar === "off" ? "off" : "on";
  if (values.background_style !== undefined) values.background_style = values.background_style === "plain" ? "plain" : "liquid";
  for (const key of ["font_heading", "font_body", "font_label"] as const) {
    if (values[key] !== undefined && !isFontId(values[key])) return { error: "Pick a font from the list." };
  }
  delete values.section_fonts; // saved from each section's page instead

  // Remember the old uploaded images so we can delete them if they were replaced.
  const IMAGE_KEYS = ["photo_path", "hero_image_path"] as const;
  const { data: oldImages } = await supabase.from("settings").select("key, value").in("key", [...IMAGE_KEYS]);

  const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
  if (rows.length > 0) {
    const res = await supabase.from("settings").upsert(rows).select("key");
    if (res.error) return { error: res.error.message };
    if (!changed(res)) return { error: BLOCKED };
  }

  // Which sections show in the top navigation.
  const navIds = form.getAll("nav").map(String);
  if (form.has("nav_present")) {
    const { data: sections } = await supabase.from("sections").select("id, show_in_nav");
    for (const s of sections ?? []) {
      const want = navIds.includes(s.id);
      if (want === s.show_in_nav) continue;
      const res = await supabase.from("sections").update({ show_in_nav: want }).eq("id", s.id).select("id");
      if (res.error) return { error: res.error.message };
      if (!changed(res)) return { error: BLOCKED };
    }
  }

  for (const key of IMAGE_KEYS) {
    const old = oldImages?.find((r) => r.key === key)?.value;
    if (values[key] !== undefined && typeof old === "string" && old !== values[key]) await removeFiles([old]);
  }

  refreshSite();
  return { ok: "Settings saved. They're live on your site now." };
}

// ---------- fonts for one section ----------

export async function saveSectionFonts(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const sectionId = text(form, "section_id");
  if (!sectionId) return { error: "Section not found." };

  const { data: row, error: readError } = await supabase.from("settings").select("value").eq("key", "section_fonts").maybeSingle();
  if (readError) return { error: readError.message };
  const all = parseSectionFonts(typeof row?.value === "string" ? row.value : null);

  const picked: Partial<Record<(typeof ROLES)[number], string>> = {};
  for (const role of ROLES) {
    const id = text(form, `font_${role}`);
    if (id && !isFontId(id)) return { error: "Pick a font from the list." };
    if (id) picked[role] = id;
  }
  if (Object.keys(picked).length) all[sectionId] = picked;
  else delete all[sectionId];

  const res = await supabase
    .from("settings")
    .upsert({ key: "section_fonts", value: JSON.stringify(all) })
    .select("key");
  if (res.error) return { error: res.error.message };
  if (!changed(res)) return { error: BLOCKED };
  refreshSite();
  return { ok: "Fonts saved. They're live on your site now." };
}

// ---------- first-time setup ----------

// Copies the built-in starting content into an empty database (same content as supabase/seed.sql),
// so you can edit it in admin.
export async function loadStartingContent(): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const { count, error: countError } = await supabase.from("sections").select("id", { count: "exact", head: true });
  if (countError) return { error: countError.message };
  if (count) return { error: "Your database already has sections. Nothing was changed." };

  const { data: created, error } = await supabase
    .from("sections")
    .insert(SEED_SECTIONS.map((section) => withoutKeys(section, ["id"])))
    .select("id, slug");
  if (error) return { error: error.message };
  if (!created?.length) return { error: BLOCKED };

  const idFor = new Map(created.map((s) => [`seed-${s.slug}`, s.id]));
  const items = SEED_ITEMS.filter((i) => idFor.has(i.section_id)).map((item) => ({
    ...withoutKeys(item, ["id", "created_at"]),
    section_id: idFor.get(item.section_id)!,
  }));
  if (items.length) {
    const res = await supabase.from("items").insert(items).select("id");
    if (res.error) return { error: res.error.message };
  }

  // Fill in any settings you haven't saved yet (never overwrites yours).
  const { data: existing } = await supabase.from("settings").select("key");
  const have = new Set((existing ?? []).map((r) => r.key));
  const missing = Object.entries(DEFAULT_SETTINGS)
    .filter(([key]) => !have.has(key))
    .map(([key, value]) => ({ key, value }));
  if (missing.length) {
    const res = await supabase.from("settings").insert(missing);
    if (res.error) return { error: res.error.message };
  }

  refreshSite();
  return { ok: "Starting content loaded. You can edit everything now." };
}
