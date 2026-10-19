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
    if (sections.error || items.error || settings.error) {
      console.error("Supabase read failed, using built-in content:", sections.error ?? items.error ?? settings.error);
      return SEED_DATA;
    }
    // Database is connected but the seed SQL hasn't been run yet: show built-in content.
    if (!sections.data || sections.data.length === 0) return SEED_DATA;
    return {
      sections: sections.data as Section[],
      items: (items.data ?? []).map((i) => ({ ...i, extra: i.extra ?? {} })) as Item[],
      settings: rowsToSettings(settings.data),
      fromSeed: false,
    };
  } catch (error) {
    console.error("Supabase unreachable, using built-in content:", error);
    return SEED_DATA;
  }
}

// Only allow real hex colors like #F2B544 (keeps the page safe from odd values).
export function safeAccent(color: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_SETTINGS.accent;
}
