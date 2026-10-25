"use client";
// A font dropdown with a live preview line in the chosen font.
import { useState } from "react";
import { FONTS, fontFamily, ROLE_LABELS, type FontRole } from "@/lib/fonts";
import { inputClass } from "./ItemForm";

const SAMPLE: Record<FontRole, string> = {
  heading: "what i do.",
  body: "I write about and build with AI, tech and crypto.",
  label: "areas of focus · 01 · 12m+",
};

export function FontPicker({
  name,
  role,
  value,
  inheritLabel,
}: {
  name: string;
  role: FontRole;
  value: string;
  inheritLabel?: string; // when set, adds a "use site font" option (empty value)
}) {
  const [picked, setPicked] = useState(value);
  const family = (picked && fontFamily(picked)) || undefined;

  return (
    <label className="block space-y-2 text-sm">
      <span className="block">{ROLE_LABELS[role]}</span>
      <select name={name} value={picked} onChange={(e) => setPicked(e.target.value)} className={inputClass}>
        {inheritLabel !== undefined && <option value="">{inheritLabel}</option>}
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
      <span
        className={`block truncate text-fg/80 ${role === "heading" ? "text-2xl font-semibold" : role === "label" ? "text-xs tracking-[0.2em]" : "text-base"}`}
        style={{ fontFamily: family }}
      >
        {SAMPLE[role]}
      </span>
    </label>
  );
}
