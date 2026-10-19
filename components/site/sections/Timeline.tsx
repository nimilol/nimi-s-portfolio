// Experience: date, then what you did, in a panel.
import type { Item, Section } from "@/lib/types";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Timeline({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <Panel as="ol" className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="grid gap-2 px-6 py-7 md:grid-cols-12 md:gap-8 md:px-8">
              <span className="font-mono text-xs tracking-[0.2em] text-accent md:col-span-3 md:pt-1.5">{item.extra.date}</span>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                {item.extra.role && <p className="mt-1 text-sm text-fg/70">{item.extra.role}</p>}
                {item.description && <p className="mt-3 max-w-2xl text-muted">{item.description}</p>}
              </div>
            </li>
          ))}
        </Panel>
      </Reveal>
    </SectionShell>
  );
}
