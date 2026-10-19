"use client";
// Edit a section's title, subtitle, and the "hide" / "show in top nav" switches.
import { useActionState, useTransition } from "react";
import { deleteSection, saveSection } from "@/app/admin/actions";
import { SHOWCASE_LAYOUTS } from "@/lib/layouts";
import { sectionName } from "@/lib/nav";
import type { Section } from "@/lib/types";
import { inputClass } from "./ItemForm";

export function SectionForm({ section }: { section: Section }) {
  const [state, formAction, pending] = useActionState(saveSection, undefined);
  const [deleting, startDelete] = useTransition();

  return (
    <form action={formAction} className="max-w-2xl space-y-5 border border-line p-5">
      <input type="hidden" name="id" value={section.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="block">Small label</span>
          <input name="label" defaultValue={section.label ?? ""} placeholder="e.g. areas of focus" className={inputClass} />
          <span className="block text-xs text-muted">The small spaced text with the yellow line.</span>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block">Big heading</span>
          <input name="title" defaultValue={section.title} placeholder="e.g. what i do." className={inputClass} />
          <span className="block text-xs text-muted">Leave empty to show only the label.</span>
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="block">Subtitle (optional)</span>
          <input name="subtitle" defaultValue={section.subtitle ?? ""} className={inputClass} />
        </label>
        {SHOWCASE_LAYOUTS.includes(section.layout_type) && (
          <fieldset className="space-y-2 text-sm md:col-span-2">
            <legend className="mb-2">Style</legend>
            <div className="flex flex-wrap gap-3">
              {[
                ["circle", "Circle fade"],
                ["stack", "Stacked cards"],
              ].map(([value, text]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 border border-line px-3 py-2 has-[:checked]:border-accent">
                  <input type="radio" name="variant" value={value} defaultChecked={(section.variant ?? "circle") === value} className="accent-[var(--accent)]" />
                  {text}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_hidden" defaultChecked={section.is_hidden} className="accent-[var(--accent)]" />
          Hide this section (even if it has items)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="show_in_nav" defaultChecked={section.show_in_nav} className="accent-[var(--accent)]" />
          Show in top navigation
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="bg-accent px-5 py-2.5 text-sm font-medium text-bg disabled:opacity-50">
          {pending ? "Saving…" : "Save section"}
        </button>
        {state?.ok && <span className="text-sm text-accent">{state.ok}</span>}
        {state?.error && <span className="text-sm text-red-400">{state.error}</span>}
        {!section.is_builtin && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (confirm(`Delete the section "${sectionName(section)}" and ALL its items and files? This can't be undone.`)) {
                startDelete(() => deleteSection(section.id));
              }
            }}
            className="ml-auto text-sm text-muted hover:text-red-400"
          >
            {deleting ? "Deleting…" : "Delete section"}
          </button>
        )}
      </div>
      {section.is_builtin && <p className="text-xs text-muted">Built-in section: it can be hidden but not deleted.</p>}
    </form>
  );
}
