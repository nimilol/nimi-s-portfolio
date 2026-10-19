// Focus: a big numbered list (01, 02, 03...) with small tags.
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Numbered({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <ol>
        {items.map((item, i) => {
          const tags = (item.extra.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
          return (
            <Reveal as="li" key={item.id} delay={i * 0.06} y={12} className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:py-10">
                <span className="font-display text-xl text-accent tabular-nums md:col-span-1 md:text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-6">
                  <h3 className="font-display text-3xl font-semibold lowercase tracking-tight md:text-5xl">{item.title}</h3>
                </div>
                <div className="md:col-span-5">
                  {item.description && <p className="text-muted">{item.description}</p>}
                  {tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <li key={t} className="border border-line px-2.5 py-1 text-xs lowercase text-fg/80">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            </Reveal>
          );
        })}
      </ol>
    </SectionShell>
  );
}
