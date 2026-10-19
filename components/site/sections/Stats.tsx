// Highlights: big yellow numbers that count up once, inside a panel.
import type { Item, Section } from "@/lib/types";
import { Counter } from "../Counter";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Stats({ section, items }: { section: Section; items: Item[] }) {
  const odd = items.length % 2 === 1;
  return (
    <SectionShell section={section}>
      <Reveal>
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {items.map((item, i) => (
            <div key={item.id} className={`bg-panel px-7 py-9 md:px-10 md:py-12 ${odd && i === items.length - 1 ? "md:col-span-2" : ""}`}>
              <dd className="font-display text-6xl font-semibold tracking-tight text-accent md:text-7xl">
                <Counter value={Number(item.number_value ?? 0)} suffix={item.number_suffix} />
              </dd>
              <dt className="mt-4 font-mono text-sm lowercase tracking-[0.3em] text-fg/70">{item.title}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </SectionShell>
  );
}
