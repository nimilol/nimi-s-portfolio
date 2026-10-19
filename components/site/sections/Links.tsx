// A list of links in a panel (Best threads, Content posts, custom).
import type { Item, Section } from "@/lib/types";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Links({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <Panel as="ul" className="divide-y divide-line">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={item.link_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 px-6 py-6 md:grid-cols-[3.5rem_1fr_auto] md:px-8 md:py-7"
              >
                <span className="font-mono text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-xl font-semibold transition-colors duration-150 group-hover:text-accent md:text-2xl">
                    {item.title}
                  </span>
                  {item.description && <span className="mt-1.5 block text-muted">{item.description}</span>}
                </span>
                <span className="text-muted transition-colors duration-150 group-hover:text-accent">↗</span>
              </a>
            </li>
          ))}
        </Panel>
      </Reveal>
    </SectionShell>
  );
}
