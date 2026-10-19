// Loads sections, item counts and settings for the admin panel.
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { rowsToSettings } from "./data";
import { SETTINGS_LAYOUTS } from "./layouts";
import type { Item, Section, Settings } from "./types";
import { hasContent } from "./visibility";

export type AdminSection = Section & {
  count: number;
  visible: boolean;
  status: string; // e.g. "3 items — visible" or "0 items — hidden on site"
};

export type AdminData =
  | { ok: true; sections: AdminSection[]; settings: Settings }
  | { ok: false; error: string };

export async function loadAdminData(supabase: SupabaseClient): Promise<AdminData> {
  const [sections, items, settings] = await Promise.all([
    supabase.from("sections").select("*").order("sort_order"),
    supabase.from("items").select("id, section_id"),
    supabase.from("settings").select("key, value"),
  ]);
  if (sections.error || items.error || settings.error) {
    return { ok: false, error: (sections.error ?? items.error ?? settings.error)!.message };
  }
  const s = rowsToSettings(settings.data);
  const allItems = (items.data ?? []) as Pick<Item, "id" | "section_id">[];

  return {
    ok: true,
    settings: s,
    sections: (sections.data as Section[]).map((sec) => {
      const count = allItems.filter((i) => i.section_id === sec.id).length;
      const filled = hasContent(sec, allItems as Item[], s);
      const visible = filled && !sec.is_hidden;
      const fromSettings = SETTINGS_LAYOUTS.includes(sec.layout_type);
      let status: string;
      if (sec.is_hidden) status = "hidden by you";
      else if (fromSettings) status = filled ? "visible" : "hidden (empty — fill in Site settings)";
      else status = filled ? `${count} item${count === 1 ? "" : "s"} — visible` : "0 items — hidden on site";
      return { ...sec, count, visible, status };
    }),
  };
}
