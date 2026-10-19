// Focus: a numbered list in a panel (01 artificial intelligence, 02 tech...).
import type { Item, Section } from "@/lib/types";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Numbered({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <Panel as="ol" className="divide-y divide-line">
          {items.map((item, i) => {
            const tags = (item.extra.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
            return (
              <li key={item.id} className="grid grid-cols-[2.75rem_1fr] gap-x-3 px-6 py-6 md:grid-cols-[4rem_1fr] md:px-8 md:py-7">
                <span className="pt-1.5 font-mono text-sm text-accent tabular-nums md:pt-2.5 md:text-base">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold lowercase tracking-tight md:text-4xl">{item.title}</h3>
                  {item.description && <p className="mt-2 max-w-2xl text-muted">{item.description}</p>}
                  {tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <li key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] lowercase tracking-wider text-fg/70">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </Panel>
      </Reveal>
    </SectionShell>
  );
}
