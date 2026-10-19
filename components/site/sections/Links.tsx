// A simple list of links (Best threads, Content posts, custom).
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Links({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <Reveal>
        <ul className="border-b border-line">
          {items.map((item, i) => (
            <li key={item.id} className="border-t border-line">
              <a
                href={item.link_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 md:grid-cols-[4rem_1fr_auto] md:py-7"
              >
                <span className="text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-xl transition-colors duration-150 group-hover:text-accent md:text-2xl">
                    {item.title}
                  </span>
                  {item.description && <span className="mt-1 block text-sm text-muted">{item.description}</span>}
                </span>
                <span className="text-muted transition-colors duration-150 group-hover:text-accent">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionShell>
  );
}
