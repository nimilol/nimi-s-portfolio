// Cards (Featured, AI, Tech, Crypto, Viral, custom...).
// With images: big image cards (image, tag, title, "view on x →").
// Without images: clean text rows inside a panel.
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Item, Section } from "@/lib/types";
import { Counter } from "../Counter";
import { Panel } from "../Panel";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

function linkProps(item: Item) {
  return item.link_url ? { href: item.link_url, target: "_blank", rel: "noopener noreferrer" } : {};
}

function Number_({ item }: { item: Item }) {
  if (item.number_value === null || item.number_value === undefined) return null;
  return (
    <p className="mb-3">
      <span className="font-display text-4xl font-semibold text-accent md:text-5xl">
        <Counter value={Number(item.number_value)} suffix={item.number_suffix} />
      </span>
      {item.extra.number_label && <span className="ml-2 font-mono text-xs tracking-[0.2em] text-muted">{item.extra.number_label}</span>}
    </p>
  );
}

function CardText({ item }: { item: Item }) {
  return (
    <>
      {item.extra.tag && <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent/80">{item.extra.tag}</p>}
      <Number_ item={item} />
      <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
      {item.description && <p className="mt-2 text-muted">{item.description}</p>}
      {item.link_url && (
        <p className="mt-5 font-mono text-sm lowercase tracking-[0.25em] text-fg/60 transition-colors duration-150 group-hover:text-accent">
          {item.extra.link_label || "view on x"} →
        </p>
      )}
    </>
  );
}

export function Cards({ section, items }: { section: Section; items: Item[] }) {
  const withImages = items.some((i) => i.media_path);

  if (!withImages) {
    return (
      <SectionShell section={section}>
        <Reveal>
          <Panel className="divide-y divide-line">
            {items.map((item) => {
              const Tag = item.link_url ? "a" : "div";
              return (
                <Tag key={item.id} {...linkProps(item)} className="group block px-6 py-7 md:px-8 md:py-8">
                  <CardText item={item} />
                </Tag>
              );
            })}
          </Panel>
        </Reveal>
      </SectionShell>
    );
  }

  return (
    <SectionShell section={section}>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        {items.map((item, i) => {
          const image = mediaUrl(item.media_path);
          const Tag = item.link_url ? "a" : "div";
          return (
            <Reveal key={item.id} delay={(i % 2) * 0.08}>
              <Tag {...linkProps(item)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors duration-200 hover:border-fg/30">
                {image && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex-1 p-6 md:p-7">
                  <CardText item={item} />
                </div>
              </Tag>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
