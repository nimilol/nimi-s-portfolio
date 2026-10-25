// Loads everything the public page needs.
// If Supabase isn't connected yet (or fails), it falls back to the built-in content.
import { DEFAULT_SETTINGS, SEED_DATA } from "./seed";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import type { Item, Section, Settings, SiteData } from "./types";

// Settings are stored as rows of { key, value }. This turns them into one object.
export function rowsToSettings(rows: { key: string; value: unknown }[] | null): Settings {
  const s: Settings = { ...DEFAULT_SETTINGS };
  for (const row of rows ?? []) {
    if (row.key in s && typeof row.value === "string") {
      (s as Record<string, string>)[row.key] = row.value;
    }
  }
  return s;
}

export async function getSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured()) return SEED_DATA;
  try {
    const supabase = createPublicClient();
    const [sections, items, settings] = await Promise.all([
      supabase.from("sections").select("*").order("sort_order"),
      supabase.from("items").select("*").order("sort_order"),
      supabase.from("settings").select("key, value"),
    ]);
    // Settings are used on their own, so a site-settings edit always shows even if sections can't load.
    const liveSettings = settings.error ? DEFAULT_SETTINGS : rowsToSettings(settings.data);
    const failed = sections.error ?? items.error ?? settings.error;
    if (failed) {
      console.error("Supabase read failed, using built-in sections:", failed);
      return { ...SEED_DATA, settings: liveSettings, status: "error", error: failed.message };
    }
    // Database is connected but has no sections yet (seed not loaded): built-in sections + your settings.
    if (!sections.data || sections.data.length === 0) {
      return { ...SEED_DATA, settings: liveSettings, status: "empty" };
    }
    return {
      sections: sections.data as Section[],
      items: (items.data ?? []).map((i) => ({ ...i, extra: i.extra ?? {} })) as Item[],
      settings: liveSettings,
      fromSeed: false,
      status: "db",
    };
  } catch (error) {
    console.error("Supabase unreachable, using built-in content:", error);
    return { ...SEED_DATA, status: "error", error: error instanceof Error ? error.message : String(error) };
  }
}

// Only allow real hex colors like #F2B544 (keeps the page safe from odd values).
export function safeAccent(color: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_SETTINGS.accent;
}
