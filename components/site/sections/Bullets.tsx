// "currently": a bullet list in a panel. Highlighted lines get a yellow dot.
import type { Item, Section } from "@/lib/types";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Bullets({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <Panel as="ul" className="divide-y divide-line">
          {items.map((item) => {
            const on = item.extra.highlight === "on";
            return (
              <li key={item.id} className="flex items-baseline gap-5 px-6 py-6 md:px-8 md:py-7">
                <span aria-hidden className={`h-2 w-2 shrink-0 -translate-y-1 rounded-full ${on ? "bg-accent" : "bg-fg/60"}`} />
                <span className="font-display text-xl font-semibold lowercase tracking-tight md:text-2xl">{item.title}</span>
              </li>
            );
          })}
        </Panel>
      </Reveal>
    </SectionShell>
  );
}
