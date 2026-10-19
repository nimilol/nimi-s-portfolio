// A plain text block (custom sections).
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function TextBlock({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <div className="max-w-3xl space-y-12">
        {items.map((item) => (
          <Reveal key={item.id}>
            {item.title && <h3 className="mb-4 font-display text-2xl font-semibold">{item.title}</h3>}
            {(item.description ?? "").split(/\n\s*\n/).map((p, i) => (
              <p key={i} className="mb-5 text-lg leading-relaxed text-fg/85">
                {p}
              </p>
            ))}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
