// Short labels for the top navigation (custom sections use their own title).
import type { Section } from "./types";

const NAV_LABELS: Record<string, string> = {
  about: "about",
  focus: "focus",
  highlights: "numbers",
  featured: "work",
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
  return (section.is_builtin && NAV_LABELS[section.slug]) || section.title.toLowerCase();
}

// Layouts that count as "work" for the hero's "see work" button.
export const WORK_LAYOUTS = ["cards", "links", "circle-video", "circle-image", "logos"];
