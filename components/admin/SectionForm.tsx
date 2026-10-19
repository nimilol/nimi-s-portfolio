"use client";
// Edit a section's title, subtitle, and the "hide" / "show in top nav" switches.
import { useActionState, useTransition } from "react";
import { deleteSection, saveSection } from "@/app/admin/actions";
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
          <span className="block">Section title</span>
          <input name="title" defaultValue={section.title} className={inputClass} required />
        </label>
        <label className="space-y-2 text-sm">
          <span className="block">Subtitle (optional)</span>
          <input name="subtitle" defaultValue={section.subtitle ?? ""} className={inputClass} />
        </label>
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
              if (confirm(`Delete the section "${section.title}" and ALL its items and files? This can't be undone.`)) {
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
