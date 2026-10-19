// Experience: date on the left, what you did on the right.
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Timeline({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <ol>
        {items.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 0.06} y={10} className="grid gap-2 border-t border-line py-8 md:grid-cols-12 md:gap-8">
              <span className="text-sm text-accent md:col-span-3">{item.extra.date}</span>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                {item.extra.role && <p className="mt-1 text-sm text-fg/70">{item.extra.role}</p>}
                {item.description && <p className="mt-3 max-w-2xl text-muted">{item.description}</p>}
              </div>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
