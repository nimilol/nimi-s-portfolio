// Cards with links (Featured work, Viral work, Shipped projects, custom).
// The first card is large when the count is odd, so the grid never looks like a template.
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Item, Section } from "@/lib/types";
import { Counter } from "../Counter";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Cards({ section, items }: { section: Section; items: Item[] }) {
  const featureFirst = items.length % 2 === 1;
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        {items.map((item, i) => {
          const big = featureFirst && i === 0;
          const image = mediaUrl(item.media_path);
          const Tag = item.link_url ? "a" : "div";
          return (
            <Reveal key={item.id} delay={(i % 2) * 0.08} className={big ? "md:col-span-2" : ""}>
              <Tag
                {...(item.link_url ? { href: item.link_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group flex h-full flex-col bg-bg p-6 md:p-8 ${big && image ? "md:grid md:grid-cols-2 md:gap-10" : ""}`}
              >
                {image && (
                  <div className={`relative mb-6 aspect-[16/10] overflow-hidden ${big ? "md:mb-0" : ""}`}>
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes={big ? "(max-width: 768px) 100vw, 560px" : "(max-width: 768px) 100vw, 540px"}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col">
                  {item.number_value !== null && item.number_value !== undefined && (
                    <p className="mb-4">
                      <span className="font-display text-4xl font-semibold text-accent md:text-5xl">
                        <Counter value={Number(item.number_value)} suffix={item.number_suffix} />
                      </span>
                      {item.extra.number_label && <span className="ml-2 text-sm text-muted">{item.extra.number_label}</span>}
                    </p>
                  )}
                  <h3 className={`font-display font-semibold tracking-tight ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}>{item.title}</h3>
                  {item.description && <p className="mt-3 text-muted">{item.description}</p>}
                  {item.link_url && (
                    <span className="mt-auto pt-6 text-sm text-accent">
                      {item.extra.link_label || "read"}{" "}
                      <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                    </span>
                  )}
                </div>
              </Tag>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
