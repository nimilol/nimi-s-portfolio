// The fonts you can pick in admin (Site settings and each section).
// "default" means: use the site's built-in font for that role.
// Inter, Inter Tight and JetBrains Mono are always loaded; the others are loaded only when used.

export type FontRole = "heading" | "body" | "label";

export type FontOption = {
  id: string;
  label: string;
  family: string; // CSS font-family value
  google?: string; // Google Fonts "family=" value (missing = already loaded by the site)
};

export const FONTS: FontOption[] = [
  { id: "inter", label: "Inter", family: "var(--font-inter), system-ui, sans-serif" },
  { id: "inter-tight", label: "Inter Tight", family: "var(--font-inter-tight), system-ui, sans-serif" },
  { id: "jetbrains-mono", label: "JetBrains Mono", family: "var(--font-jb-mono), ui-monospace, monospace" },
  { id: "space-grotesk", label: "Space Grotesk", family: "'Space Grotesk', system-ui, sans-serif", google: "Space+Grotesk:wght@400;500;600;700" },
  { id: "manrope", label: "Manrope", family: "'Manrope', system-ui, sans-serif", google: "Manrope:wght@400;500;600;700;800" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', system-ui, sans-serif", google: "DM+Sans:wght@400;500;600;700" },
  { id: "outfit", label: "Outfit", family: "'Outfit', system-ui, sans-serif", google: "Outfit:wght@400;500;600;700" },
  { id: "sora", label: "Sora", family: "'Sora', system-ui, sans-serif", google: "Sora:wght@400;500;600;700" },
  { id: "syne", label: "Syne", family: "'Syne', system-ui, sans-serif", google: "Syne:wght@400;500;600;700;800" },
  { id: "bricolage", label: "Bricolage Grotesque", family: "'Bricolage Grotesque', system-ui, sans-serif", google: "Bricolage+Grotesque:wght@400;500;600;700;800" },
  { id: "unbounded", label: "Unbounded", family: "'Unbounded', system-ui, sans-serif", google: "Unbounded:wght@400;500;600;700" },
  { id: "archivo", label: "Archivo", family: "'Archivo', system-ui, sans-serif", google: "Archivo:wght@400;500;600;700;800" },
  { id: "playfair", label: "Playfair Display (serif)", family: "'Playfair Display', Georgia, serif", google: "Playfair+Display:ital,wght@0,400;0,600;0,700;1,400" },
  { id: "instrument-serif", label: "Instrument Serif (serif)", family: "'Instrument Serif', Georgia, serif", google: "Instrument+Serif:ital@0;1" },
  { id: "fraunces", label: "Fraunces (serif)", family: "'Fraunces', Georgia, serif", google: "Fraunces:wght@400;500;600;700" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", family: "'IBM Plex Mono', ui-monospace, monospace", google: "IBM+Plex+Mono:wght@400;500;600" },
  { id: "space-mono", label: "Space Mono", family: "'Space Mono', ui-monospace, monospace", google: "Space+Mono:wght@400;700" },
];

// What each role uses when nothing is picked.
export const DEFAULT_FONT: Record<FontRole, string> = {
  heading: "inter-tight",
  body: "inter",
  label: "jetbrains-mono",
};

export const ROLE_LABELS: Record<FontRole, string> = {
  heading: "Headings",
  body: "Body text",
  label: "Small labels & numbers",
};

// The CSS variable each role controls (see app/globals.css).
export const ROLE_VAR: Record<FontRole, string> = {
  heading: "--site-display",
  body: "--site-body",
  label: "--site-mono",
};

export const ROLES: FontRole[] = ["heading", "body", "label"];

const BY_ID = new Map(FONTS.map((f) => [f.id, f]));

export function isFontId(id: string | undefined | null): id is string {
  return !!id && BY_ID.has(id);
}

export function fontFamily(id: string) {
  return BY_ID.get(id)?.family;
}

// One Google Fonts stylesheet link for the given font ids (null if none need loading).
export function googleFontsHref(ids: Iterable<string>) {
  const families = [...new Set(ids)].map((id) => BY_ID.get(id)?.google).filter(Boolean);
  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
}

// Per-section fonts are saved as one JSON string in settings: { [sectionId]: { heading, body, label } }.
export type SectionFonts = Record<string, Partial<Record<FontRole, string>>>;

export function parseSectionFonts(value: string | undefined | null): SectionFonts {
  if (!value) return {};
  try {
    const raw = JSON.parse(value);
    if (!raw || typeof raw !== "object") return {};
    const out: SectionFonts = {};
    for (const [sectionId, fonts] of Object.entries(raw as Record<string, unknown>)) {
      if (!fonts || typeof fonts !== "object") continue;
      const clean: Partial<Record<FontRole, string>> = {};
      for (const role of ROLES) {
        const id = (fonts as Record<string, unknown>)[role];
        if (typeof id === "string" && isFontId(id)) clean[role] = id;
      }
      if (Object.keys(clean).length) out[sectionId] = clean;
    }
    return out;
  } catch {
    return {};
  }
}

// CSS variables for a set of picked fonts (only the roles that are set).
export function fontVars(picked: Partial<Record<FontRole, string>>) {
  const vars: Record<string, string> = {};
  for (const role of ROLES) {
    const id = picked[role];
    const family = id ? fontFamily(id) : undefined;
    if (family) vars[ROLE_VAR[role]] = family;
  }
  return vars;
}
