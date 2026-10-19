// Which fields each layout's items have in the admin form.
// "extra.xxx" fields are saved inside the item's `extra` JSON column.
import type { LayoutType } from "./types";

export type FieldType = "text" | "textarea" | "url" | "number" | "image" | "video" | "tags";

export type Field = {
  key: string; // column name, or "extra.something"
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
};

const TITLE: Field = { key: "title", label: "Title", type: "text", required: true };
const DESC: Field = { key: "description", label: "Description", type: "textarea" };
const LINK: Field = { key: "link_url", label: "Link", type: "url" };

export const LAYOUT_FIELDS: Record<LayoutType, Field[]> = {
  hero: [],
  about: [],
  contact: [],
  numbered: [
    TITLE,
    { ...DESC, hint: "One line about this topic." },
    { key: "extra.tags", label: "Tags", type: "tags", hint: "Separate with commas." },
  ],
  stats: [
    { key: "number_value", label: "Number", type: "number", required: true, hint: "e.g. 12 (shown as 12m+ with suffix m+)" },
    { key: "number_suffix", label: "Suffix", type: "text", hint: "e.g. m+, k+, %, yrs" },
    { key: "title", label: "Label", type: "text", required: true, hint: "e.g. impressions" },
  ],
  cards: [
    TITLE,
    { ...DESC, hint: "One line." },
    { ...LINK, hint: "Where 'read ↗' goes, e.g. the X post." },
    { key: "extra.link_label", label: "Link text", type: "text", hint: "Default: read" },
    { key: "media_path", label: "Cover image (optional)", type: "image" },
    { key: "number_value", label: "Big number (optional)", type: "number", hint: "e.g. impressions: 1.2" },
    { key: "number_suffix", label: "Number suffix", type: "text", hint: "e.g. m+" },
    { key: "extra.number_label", label: "Number label", type: "text", hint: "e.g. impressions" },
  ],
  links: [TITLE, { ...DESC, hint: "Optional one line." }, { ...LINK, required: true }],
  timeline: [
    TITLE,
    { key: "extra.date", label: "Date", type: "text", hint: "e.g. 2025 — Present" },
    { key: "extra.role", label: "Role", type: "text" },
    DESC,
  ],
  logos: [
    { key: "title", label: "Project name", type: "text", required: true },
    { key: "media_path", label: "Logo", type: "image" },
    { ...LINK, hint: "Where 'see my work' goes." },
  ],
  "circle-image": [
    { key: "media_path", label: "Image", type: "image", required: true },
    { key: "title", label: "Caption (optional)", type: "text" },
    { key: "link_url", label: "Link (optional)", type: "url" },
  ],
  "circle-video": [
    { key: "media_path", label: "Video", type: "video", required: true },
    { key: "title", label: "Title", type: "text" },
    { key: "link_url", label: "X post link (optional)", type: "url" },
  ],
  text: [{ key: "title", label: "Heading (optional)", type: "text" }, { key: "description", label: "Text", type: "textarea", required: true }],
};

export const LAYOUT_LABELS: Record<LayoutType, string> = {
  hero: "Hero (from site settings)",
  about: "About (from site settings)",
  contact: "Contact (from site settings)",
  numbered: "Numbered list",
  stats: "Number counters",
  cards: "Cards with links",
  links: "List of links",
  timeline: "Timeline",
  logos: "Logo strip",
  "circle-image": "Circular image fade",
  "circle-video": "Circular video fade",
  text: "Text block",
};

// Layouts you can pick when adding a new custom section.
export const CUSTOM_LAYOUTS: LayoutType[] = ["cards", "links", "text", "logos", "circle-image", "circle-video"];

// These sections take their content from Site settings, not from items.
export const SETTINGS_LAYOUTS: LayoutType[] = ["hero", "about", "contact"];
