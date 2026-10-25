"use client";
// Site settings: name, pitch, bio, photo, accent color, contact links, nav items, SEO.
import { useActionState, useState } from "react";
import { saveSettings } from "@/app/admin/actions";
import { sectionName } from "@/lib/nav";
import type { Section, Settings } from "@/lib/types";
import { ROLES } from "@/lib/fonts";
import { FontPicker } from "./FontPicker";
import { inputClass } from "./ItemForm";
import { MediaUpload } from "./MediaUpload";

type FieldDef = { key: keyof Settings; label: string; area?: boolean; hint?: string };

const STARS = "Wrap words in **double stars** to make them bright and bold.";

const HERO_FIELDS: FieldDef[] = [
  { key: "hero_title", label: "Big hero text", hint: "The huge text at the top of your site, e.g. nimi" },
  { key: "tagline", label: "Small label above it", hint: "e.g. ai, tech & crypto" },
  { key: "pitch", label: "Pitch", area: true, hint: STARS },
  { key: "hero_primary_label", label: "Main button text", hint: "Goes to your contact section. e.g. work with me" },
  { key: "hero_secondary_label", label: "Second button text", hint: "Goes to your first work section. e.g. see work" },
];

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  { title: "About", fields: [{ key: "bio", label: "Bio", area: true, hint: `Leave an empty line between paragraphs. ${STARS}` }] },
  {
    title: "Contact",
    fields: [
      { key: "email", label: "Email" },
      { key: "x_url", label: "X link", hint: "https://x.com/..." },
      { key: "telegram_url", label: "Telegram link", hint: "https://t.me/..." },
    ],
  },
  {
    title: "SEO (Google + link previews)",
    fields: [
      { key: "name", label: "Your name", hint: "Shown in the top bar and footer." },
      { key: "seo_title", label: "Page title" },
      { key: "seo_description", label: "Description", area: true },
      { key: "footer_note", label: "Footer note" },
    ],
  },
];

export function SettingsForm({ settings, sections }: { settings: Settings; sections: Section[] }) {
  const [state, formAction, pending] = useActionState(saveSettings, undefined);
  const [uploading, setUploading] = useState(false);
  const [accent, setAccent] = useState(settings.accent);
  const [avatar, setAvatar] = useState(settings.floating_avatar !== "off");
  const [liquid, setLiquid] = useState(settings.background_style !== "plain");
  const fontValue = { heading: settings.font_heading, body: settings.font_body, label: settings.font_label };
  const valid = /^#[0-9a-fA-F]{6}$/.test(accent);

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      <fieldset className="space-y-4">
        <legend className="mb-3 font-display text-xl">Hero (top of the page)</legend>
        {HERO_FIELDS.map((f) => (
          <label key={f.key} className="block space-y-2 text-sm">
            <span className="block">{f.label}</span>
            {f.area ? (
              <textarea name={f.key} defaultValue={settings[f.key]} rows={3} className={inputClass} />
            ) : (
              <input name={f.key} defaultValue={settings[f.key]} className={inputClass} />
            )}
            {f.hint && <span className="block text-xs text-muted">{f.hint}</span>}
          </label>
        ))}
        <div className="space-y-2 text-sm">
          <span className="block">Hero image (optional)</span>
          <MediaUpload name="hero_image_path" kind="image" folder="hero" initialPath={settings.hero_image_path} onBusyChange={setUploading} />
          <span className="block text-xs text-muted">Shown next to the big text on laptops, above it on phones. A PNG with a see-through background looks best.</span>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-3 font-display text-xl">Profile photo</legend>
        <MediaUpload name="photo_path" kind="image" folder="profile" initialPath={settings.photo_path} onBusyChange={setUploading} />
        <input type="hidden" name="floating_avatar" value={avatar ? "on" : "off"} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={avatar} onChange={(e) => setAvatar(e.target.checked)} className="accent-[var(--accent)]" />
          Show my photo floating in the bottom-right corner (links to my X)
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-3 font-display text-xl">Accent color</legend>
        <div className="flex items-center gap-3">
          <input type="color" value={valid ? accent : "#F2B544"} onChange={(e) => setAccent(e.target.value.toUpperCase())} className="h-11 w-14 cursor-pointer border border-line bg-transparent" aria-label="Pick accent color" />
          <input name="accent" value={accent} onChange={(e) => setAccent(e.target.value)} className={`${inputClass} max-w-40 font-mono`} />
          <button type="button" onClick={() => setAccent("#F2B544")} className="text-sm text-muted hover:text-fg">
            Reset (matches your photo)
          </button>
        </div>
        <p className="text-sm" style={{ color: valid ? accent : undefined }}>
          This is how links, numbers and highlights will look.
        </p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-3 font-display text-xl">Fonts (whole site)</legend>
        <p className="text-xs text-muted">Each section can also have its own fonts: open the section and use &ldquo;Font style for this section&rdquo;.</p>
        <div className="grid gap-5 md:grid-cols-3">
          {ROLES.map((role) => (
            <FontPicker key={role} name={`font_${role}`} role={role} value={fontValue[role]} />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-3 font-display text-xl">Background</legend>
        <input type="hidden" name="background_style" value={liquid ? "liquid" : "plain"} />
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            [true, "Liquid glass (black & white)"],
            [false, "Plain black"],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setLiquid(value as boolean)}
              className={`border px-3 py-2 ${liquid === value ? "border-accent text-fg" : "border-line text-muted hover:text-fg"}`}
            >
              {label as string}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">Liquid glass: soft silver light that shifts as visitors scroll, with frosted-glass cards.</p>
      </fieldset>

      {GROUPS.map((group) => (
        <fieldset key={group.title} className="space-y-4">
          <legend className="mb-3 font-display text-xl">{group.title}</legend>
          {group.fields.map((f) => (
            <label key={f.key} className="block space-y-2 text-sm">
              <span className="block">{f.label}</span>
              {f.area ? (
                <textarea name={f.key} defaultValue={settings[f.key]} rows={f.key === "bio" ? 8 : 3} className={inputClass} />
              ) : (
                <input name={f.key} defaultValue={settings[f.key]} className={inputClass} />
              )}
              {f.hint && <span className="block text-xs text-muted">{f.hint}</span>}
            </label>
          ))}
        </fieldset>
      ))}

      <fieldset className="space-y-2">
        <legend className="mb-3 font-display text-xl">Top navigation</legend>
        <input type="hidden" name="nav_present" value="1" />
        <p className="mb-2 text-xs text-muted">Ticked sections get a link in the top bar (only while they are visible).</p>
        {sections
          .filter((s) => s.layout_type !== "hero")
          .map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="nav" value={s.id} defaultChecked={s.show_in_nav} className="accent-[var(--accent)]" />
              {sectionName(s)}
            </label>
          ))}
      </fieldset>

      <div className="sticky bottom-0 flex items-center gap-4 border-t border-line bg-bg py-4">
        <button type="submit" disabled={pending || uploading} className="bg-accent px-5 py-2.5 text-sm font-medium text-bg disabled:opacity-50">
          {uploading ? "Wait for upload…" : pending ? "Saving…" : "Save settings"}
        </button>
        {state?.ok && <span className="text-sm text-accent">{state.ok}</span>}
        {state?.error && <span className="text-sm text-red-400">{state.error}</span>}
      </div>
    </form>
  );
}
