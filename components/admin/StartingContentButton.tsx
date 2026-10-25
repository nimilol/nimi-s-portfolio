"use client";
// One-click setup: copies the starting content into an empty database.
import { useActionState } from "react";
import { loadStartingContent } from "@/app/admin/actions";

export function StartingContentButton() {
  const [state, formAction, pending] = useActionState(loadStartingContent, undefined);
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className="bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-50">
        {pending ? "Loading…" : "Load my starting content"}
      </button>
      {state?.ok && <span className="text-sm text-accent">{state.ok}</span>}
      {state?.error && <span className="text-sm text-red-400">{state.error}</span>}
    </form>
  );
}
