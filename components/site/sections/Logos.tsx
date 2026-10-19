// Projects I've worked with: logo tiles with a "see my work" link.
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Logos({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <Reveal>
        <ul className="grid grid-cols-2 border-l border-t border-line md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const logo = mediaUrl(item.media_path);
            const Tag = item.link_url ? "a" : "div";
            return (
              <li key={item.id} className="border-b border-r border-line">
                <Tag
                  {...(item.link_url ? { href: item.link_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col justify-between gap-8 p-6"
                >
                  <div className="relative flex h-14 items-center">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={item.title}
                        fill
                        sizes="200px"
                        className="object-contain object-left opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="font-display text-2xl font-semibold">{item.title}</span>
                    )}
                  </div>
                  <div>
                    {logo && <p className="text-sm">{item.title}</p>}
                    {item.link_url && <p className="mt-1 text-sm text-muted transition-colors group-hover:text-accent">see my work ↗</p>}
                  </div>
                </Tag>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </SectionShell>
  );
}
