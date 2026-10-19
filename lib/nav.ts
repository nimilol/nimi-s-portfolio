// Short labels for the top navigation (custom sections use their own title).
import type { Section } from "./types";

const NAV_LABELS: Record<string, string> = {
  about: "about",
  focus: "focus",
  highlights: "numbers",
  featured: "work",
  ai: "ai",
  tech: "tech",
  crypto: "crypto",
  currently: "now",
  viral: "viral",
  threads: "threads",
  videos: "videos",
  graphics: "graphics",
  projects: "projects",
  experience: "experience",
  shipped: "shipped",
  content: "content",
  contact: "contact",
};

export function navLabel(section: Section) {
  return (section.is_builtin && NAV_LABELS[section.slug]) || (section.label || section.title).toLowerCase();
}

// Layouts that count as "work" for the hero's "see work" button.
export const WORK_LAYOUTS = ["cards", "links", "circle-video", "circle-image", "logos"];

// The name to show for a section inside admin (heading, or label if there's no heading).
export function sectionName(section: Pick<Section, "title" | "label" | "slug">) {
  return section.title || section.label || section.slug;
}
