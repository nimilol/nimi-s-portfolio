// Shared data shapes used by the public site and the admin panel.

// Every section uses one "layout". The layout decides how it looks and which fields its items have.
export type LayoutType =
  | "hero"
  | "about"
  | "contact"
  | "numbered"
  | "stats"
  | "cards"
  | "links"
  | "timeline"
  | "logos"
  | "circle-image"
  | "circle-video"
  | "text"
  | "bullets";

export type Section = {
  id: string;
  slug: string;
  label: string | null; // small spaced label above the heading, e.g. "areas of focus"
  title: string; // the big heading, e.g. "what i do." (can be empty)
  subtitle: string | null;
  variant: string | null; // showcases: "circle" or "stack"
  layout_type: LayoutType;
  sort_order: number;
  is_hidden: boolean;
  is_builtin: boolean;
  show_in_nav: boolean;
};

export type Item = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  media_path: string | null;
  media_type: "image" | "video" | null;
  thumb_path: string | null;
  number_value: number | null;
  number_suffix: string | null;
  extra: Record<string, string | undefined>;
  sort_order: number;
  created_at?: string;
};

export type Settings = {
  name: string; // top bar, footer, SEO
  hero_title: string; // the big text in the hero
  tagline: string;
  pitch: string;
  hero_primary_label: string;
  hero_secondary_label: string;
  hero_image_path: string;
  floating_avatar: string; // "on" or "off"
  bio: string;
  photo_path: string;
  accent: string;
  email: string;
  x_url: string;
  telegram_url: string;
  seo_title: string;
  seo_description: string;
  footer_note: string;
};

export type SiteData = {
  sections: Section[];
  items: Item[];
  settings: Settings;
  // true when the data came from the built-in copy (Supabase not connected yet)
  fromSeed: boolean;
};
