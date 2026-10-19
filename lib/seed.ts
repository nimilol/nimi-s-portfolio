// Built-in copy of the starting content.
// Used when Supabase is not connected yet (or is down), so the live site never breaks.
// supabase/seed.sql puts the same content into the database.
import type { Item, Section, Settings, SiteData } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  name: "nimi",
  tagline: "ai, tech & crypto",
  pitch:
    "I write about and build with AI, tech and crypto. Clear takes for people who want to keep up, and working products for teams who want to ship.",
  bio: [
    "I'm nimi — a builder and writer living deep in AI, tech and crypto. I test the tools, write about what matters, and use AI-assisted development to ship real software at a speed traditional timelines can't match.",
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
};

// [slug, title, subtitle, layout, show_in_nav]
const BUILTIN: [string, string, string | null, Section["layout_type"], boolean][] = [
  ["hero", "hero", null, "hero", false],
  ["about", "about", null, "about", true],
  ["focus", "focus", "what I cover", "numbered", true],
  ["highlights", "highlights", null, "stats", false],
  ["featured", "featured work", null, "cards", true],
  ["viral", "viral work", "posts that travelled far", "cards", false],
  ["threads", "best threads", null, "links", false],
  ["videos", "best videos", null, "circle-video", true],
  ["graphics", "graphics & illustrations", null, "circle-image", true],
  ["projects", "projects I've worked with", null, "logos", true],
  ["experience", "experience", null, "timeline", false],
  ["shipped", "projects I've shipped", null, "cards", false],
  ["content", "content", "posts that connect", "links", false],
  ["contact", "let's talk.", "have a project? reach out.", "contact", true],
];

export const SEED_SECTIONS: Section[] = BUILTIN.map(([slug, title, subtitle, layout, nav], i) => ({
  id: `seed-${slug}`,
  slug,
  title,
  subtitle,
  layout_type: layout,
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
};
