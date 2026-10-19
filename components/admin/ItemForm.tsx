"use client";
// Add / edit one item. The fields shown depend on the section's layout (see lib/layouts.ts).
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveItem } from "@/app/admin/actions";
import type { Field } from "@/lib/layouts";
import type { Item } from "@/lib/types";
import { MediaUpload } from "./MediaUpload";

function valueOf(item: Item | null, key: string): string {
  if (!item) return "";
  if (key.startsWith("extra.")) return item.extra?.[key.slice(6)] ?? "";
  const v = (item as unknown as Record<string, unknown>)[key];
  return v === null || v === undefined ? "" : String(v);
}

export const inputClass =
  "w-full border border-line bg-[#111] px-3 py-2.5 text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none";

export function ItemForm({
  fields,
  sectionId,
  folder,
  item,
}: {
  fields: Field[];
  sectionId: string;
  folder: string;
  item: Item | null;
}) {
  const [state, formAction, pending] = useActionState(saveItem, undefined);
  const [uploading, setUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="section_id" value={sectionId} />

      {fields.map((f) => (
        <div key={f.key} className="space-y-2">
          <label htmlFor={f.key} className="block text-sm">
            {f.label} {f.required && <span className="text-accent">*</span>}
          </label>
          {f.type === "image" || f.type === "video" ? (
            <MediaUpload
              name="media_path"
              kind={f.type}
              folder={folder}
              initialPath={item?.media_path}
              initialThumb={item?.thumb_path}
              required={f.required}
              onBusyChange={setUploading}
            />
          ) : f.type === "checkbox" ? (
            <input id={f.key} name={f.key} type="checkbox" defaultChecked={valueOf(item, f.key) === "on"} className="h-5 w-5 accent-[var(--accent)]" />
          ) : f.type === "textarea" ? (
            <textarea id={f.key} name={f.key} defaultValue={valueOf(item, f.key)} rows={4} className={inputClass} required={f.required} />
          ) : (
            <input
              id={f.key}
              name={f.key}
              type={f.type === "number" ? "number" : "text"}
              step={f.type === "number" ? "any" : undefined}
              inputMode={f.type === "url" ? "url" : undefined}
              placeholder={f.type === "url" ? "https://" : undefined}
              defaultValue={valueOf(item, f.key)}
              className={inputClass}
              required={f.required}
            />
          )}
          {f.hint && <p className="text-xs text-muted">{f.hint}</p>}
        </div>
      ))}

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending || uploading}
          className="bg-accent px-5 py-2.5 text-sm font-medium text-bg disabled:opacity-50"
        >
          {uploading ? "Wait for upload…" : pending ? "Saving…" : "Save"}
        </button>
        <Link href={`/admin/sections/${sectionId}`} className="text-sm text-muted hover:text-fg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
