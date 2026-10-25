"use client";
// Fonts for one section. Empty = use the site's fonts (from Site settings).
import { useActionState } from "react";
import { saveSectionFonts } from "@/app/admin/actions";
import { ROLES, type FontRole } from "@/lib/fonts";
import { FontPicker } from "./FontPicker";

export function SectionFontsForm({ sectionId, fonts }: { sectionId: string; fonts: Partial<Record<FontRole, string>> }) {
  const [state, formAction, pending] = useActionState(saveSectionFonts, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5 border border-line p-5">
      <input type="hidden" name="section_id" value={sectionId} />
      <div>
        <h2 className="font-display text-xl">Font style for this section</h2>
        <p className="mt-1 text-xs text-muted">Only this section changes. Leave on &ldquo;site font&rdquo; to follow Site settings.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {ROLES.map((role) => (
          <FontPicker key={role} name={`font_${role}`} role={role} value={fonts[role] ?? ""} inheritLabel="Site font" />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="bg-accent px-5 py-2.5 text-sm font-medium text-bg disabled:opacity-50">
          {pending ? "Saving…" : "Save fonts"}
        </button>
        {state?.ok && <span className="text-sm text-accent">{state.ok}</span>}
        {state?.error && <span className="text-sm text-red-400">{state.error}</span>}
      </div>
    </form>
  );
}
