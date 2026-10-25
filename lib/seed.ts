// Built-in copy of the starting content.
// Used when Supabase is not connected yet (or is down), so the live site never breaks.
// supabase/seed.sql puts the same content into the database.
import type { Item, Section, Settings, SiteData } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  name: "nimi",
  hero_title: "nimi",
  tagline: "ai, tech & crypto",
  pitch:
    "I write about and build with **AI**, **tech** and **crypto**. Clear takes for people who want to keep up, and working products for teams who want to ship.",
  hero_primary_label: "work with me",
  hero_secondary_label: "see work",
  hero_image_path: "",
  floating_avatar: "on",
  bio: [
    "I'm nimi — a **builder and writer** living deep in **AI, tech and crypto**. I test the tools, write about what matters, and use AI-assisted development to ship real software at a speed traditional timelines can't match.",
    "Every business has something it needs built. My job: understand it, build it fast, and put a working live version in your hands — not mockups, not promises.",
    "Landing pages, booking systems, portfolios, product demos, threads that explain the hard stuff. You talk directly to the person doing the work — zero layers, zero fluff.",
  ].join("\n\n"),
  photo_path: "/pfp.webp",
  accent: "#F2B544",
  email: "victoradoji4@gmail.com",
  x_url: "https://x.com/nimi_101",
  telegram_url: "https://t.me/nimi_101",
  seo_title: "nimi — ai, tech & crypto",
  seo_description:
    "Nimi writes about and builds with AI, tech and crypto. Threads, videos, graphics and shipped work.",
  footer_note: "AI-assisted. Shipped live.",
  font_heading: "inter-tight",
  font_body: "inter",
  font_label: "jetbrains-mono",
  section_fonts: "{}",
  background_style: "liquid",
};

// [slug, label, heading, layout, show_in_nav, variant]
type Builtin = [string, string, string, Section["layout_type"], boolean, string | null];
const BUILTIN: Builtin[] = [
  ["hero", "hero", "", "hero", false, null],
  ["about", "about", "hi, i'm nimi.", "about", true, null],
  ["focus", "areas of focus", "what i do.", "numbered", true, null],
  ["highlights", "highlights", "", "stats", false, null],
  ["featured", "featured work", "work i'm proud of.", "cards", true, null],
  ["ai", "ai", "making ai make sense.", "cards", true, null],
  ["tech", "tech", "tech, explained and built.", "cards", true, null],
  ["crypto", "crypto", "crypto without the noise.", "cards", true, null],
  ["viral", "viral", "posts that travelled far.", "cards", false, null],
  ["threads", "threads", "best threads.", "links", false, null],
  ["videos", "videos", "best videos.", "circle-video", true, "circle"],
  ["graphics", "graphics", "illustrations i've made.", "circle-image", true, "circle"],
  ["projects", "clients", "projects i've worked with.", "logos", true, null],
  ["experience", "experience", "where i've been building.", "timeline", false, null],
  ["shipped", "shipped", "projects i've shipped.", "cards", false, null],
  ["content", "content", "posts that connect.", "links", false, null],
  ["currently", "currently", "", "bullets", false, null],
  ["contact", "connect", "let's talk.", "contact", true, null],
];

export const SEED_SECTIONS: Section[] = BUILTIN.map(([slug, label, title, layout, nav, variant], i) => ({
  id: `seed-${slug}`,
  slug,
  label,
  title,
  subtitle: null,
  layout_type: layout,
  variant,
  sort_order: i,
  is_hidden: false,
  is_builtin: true,
  show_in_nav: nav,
}));

// Small helper so each seed item only lists the fields it uses.
function item(slug: string, order: number, fields: Partial<Item>): Item {
  return {
    id: `seed-${slug}-${order}`,
    section_id: `seed-${slug}`,
    title: "",
    description: null,
    link_url: null,
    media_path: null,
    media_type: null,
    thumb_path: null,
    number_value: null,
    number_suffix: null,
    extra: {},
    sort_order: order,
    ...fields,
  };
}

export const SEED_ITEMS: Item[] = [
  item("focus", 0, {
    title: "Artificial Intelligence",
    description: "AI tools, agents and AI-assisted building — tested hands-on and explained simply.",
    extra: { tags: "Claude / Claude Code, AI-assisted development, Agents" },
  }),
  item("focus", 1, {
    title: "Tech",
    description: "Websites, booking systems, product demos and the tools behind them.",
    extra: {
      tags: "Business websites, Landing pages, Booking systems, Portfolios, Product demos, E-commerce pages, Supabase",
    },
  }),
  item("focus", 2, {
    title: "Crypto",
    description: "Web3, onchain culture and the builders shipping it.",
    extra: { tags: "Web3 UI, Hackathons, Builder communities" },
  }),
  item("currently", 0, { title: "writing about ai, tech & crypto" }),
  item("currently", 1, { title: "building websites & product demos with ai" }),
  item("currently", 2, { title: "exploring web3 and onchain culture" }),
  item("currently", 3, { title: "open to collaborations", extra: { highlight: "on" } }),
  item("experience", 0, {
    title: "Independent Builder",
    description:
      "Learning and shipping in public — websites, landing pages, and product demos built with AI-assisted workflows, each one deployed live with a public link.",
    extra: { date: "2026 — Present", role: "AI-assisted development · building in public" },
  }),
  item("experience", 1, {
    title: "OKX Hackathon",
    description: "Built and shipped under deadline pressure alongside a community of web3 builders and founders.",
    extra: { date: "2025", role: "Participant · Web3 builder community" },
  }),
];

export const SEED_DATA: SiteData = {
  sections: SEED_SECTIONS,
  items: SEED_ITEMS,
  settings: DEFAULT_SETTINGS,
  fromSeed: true,
  status: "no-config",
};
