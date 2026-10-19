"use client";
// Create a brand-new custom section.
import { useActionState } from "react";
import { createSection } from "@/app/admin/actions";
import { CUSTOM_LAYOUTS, LAYOUT_LABELS } from "@/lib/layouts";
import { inputClass } from "./ItemForm";

const LAYOUT_HELP: Record<string, string> = {
  cards: "Cards with a title, a line of text and a link (optionally an image and a big number).",
  links: "A clean numbered list of links.",
  text: "Paragraphs of text.",
  logos: "A strip of logos with links.",
  "circle-image": "Images fading inside a big circle. Click opens a gallery.",
  "circle-video": "Muted video loops fading inside a circle. Click plays with sound.",
};

export function NewSectionForm() {
  const [state, formAction, pending] = useActionState(createSection, undefined);
  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <label className="block space-y-2 text-sm">
        <span className="block">Section name *</span>
        <input name="title" required placeholder="e.g. podcasts" className={inputClass} />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="block">Subtitle (optional)</span>
        <input name="subtitle" className={inputClass} />
      </label>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm">Layout *</legend>
        {CUSTOM_LAYOUTS.map((layout, i) => (
          <label key={layout} className="flex cursor-pointer gap-3 border border-line p-3 text-sm has-[:checked]:border-accent">
            <input type="radio" name="layout_type" value={layout} defaultChecked={i === 0} className="mt-1 accent-[var(--accent)]" />
            <span>
              <span className="block">{LAYOUT_LABELS[layout]}</span>
              <span className="block text-xs text-muted">{LAYOUT_HELP[layout]}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="show_in_nav" defaultChecked className="accent-[var(--accent)]" />
        Show in top navigation
      </label>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className="bg-accent px-5 py-2.5 text-sm font-medium text-bg disabled:opacity-50">
        {pending ? "Creating…" : "Create section"}
      </button>
      <p className="text-xs text-muted">It appears on the site as soon as you add its first item.</p>
    </form>
  );
}
