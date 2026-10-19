// A text block in a panel (custom sections). **Words in stars** show bright and bold.
import { emphasize } from "@/lib/richtext";
import type { Item, Section } from "@/lib/types";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function TextBlock({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <Panel className="divide-y divide-line">
          {items.map((item) => (
            <div key={item.id} className="space-y-5 p-6 text-lg leading-relaxed text-fg/70 md:p-10">
              {item.title && <h3 className="font-display text-2xl font-semibold text-fg">{item.title}</h3>}
              {(item.description ?? "").split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{emphasize(p)}</p>
              ))}
            </div>
          ))}
        </Panel>
      </Reveal>
    </SectionShell>
  );
}
