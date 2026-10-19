// Highlights: big numbers that count up once when scrolled into view.
import type { Item, Section } from "@/lib/types";
import { Counter } from "../Counter";
import { SectionShell } from "./SectionShell";

export function Stats({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <dl className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="border-b border-r border-line px-5 py-10 md:px-8 md:py-14">
            <dd className="font-display text-5xl font-semibold tracking-tight text-accent md:text-7xl">
              <Counter value={Number(item.number_value ?? 0)} suffix={item.number_suffix} />
            </dd>
            <dt className="mt-3 text-sm lowercase text-muted">{item.title}</dt>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
