// THE MOST IMPORTANT RULE: a section with nothing in it is not shown at all.
import type { Item, Section, Settings } from "./types";

export function itemsFor(section: Section, items: Item[]) {
  return items.filter((i) => i.section_id === section.id).sort((a, b) => a.sort_order - b.sort_order);
}

// Hero, About and Contact take their content from Site settings instead of items.
export function hasContent(section: Section, items: Item[], s: Settings): boolean {
  switch (section.layout_type) {
    case "hero":
      return !!(s.name.trim() || s.pitch.trim());
    case "about":
      return !!(s.bio.trim() || s.photo_path.trim());
    case "contact":
      return !!(s.email.trim() || s.x_url.trim() || s.telegram_url.trim());
    default:
      return itemsFor(section, items).length > 0;
  }
}

// Visible = not switched off by hand AND has content.
export function isVisible(section: Section, items: Item[], s: Settings): boolean {
  return !section.is_hidden && hasContent(section, items, s);
}

export function visibleSections(sections: Section[], items: Item[], s: Settings) {
  return [...sections]
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter((sec) => isVisible(sec, items, s));
}
