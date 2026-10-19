// Clients / projects you've worked with: rounded tiles with a round logo and "name ↗".
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Item, Section } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function Logos({ section, items }: { section: Section; items: Item[] }) {
  return (
    <SectionShell section={section}>
      <Reveal>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const logo = mediaUrl(item.media_path);
            const Tag = item.link_url ? "a" : "div";
            return (
              <li key={item.id}>
                <Tag
                  {...(item.link_url ? { href: item.link_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col items-center gap-5 rounded-2xl border border-line bg-panel px-4 py-8 text-center transition-colors duration-200 hover:border-fg/30"
                >
                  <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-line bg-[#141414] md:h-24 md:w-24">
                    {logo ? (
                      <Image src={logo} alt={item.title} fill sizes="96px" className="object-cover" />
                    ) : (
                      <span className="font-display text-3xl font-semibold">{item.title.slice(0, 1).toUpperCase()}</span>
                    )}
                  </span>
                  <span className="font-mono text-sm lowercase tracking-[0.2em] text-fg/80 transition-colors duration-150 group-hover:text-accent">
                    {item.title}
                    {item.link_url && " ↗"}
                  </span>
                </Tag>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </SectionShell>
  );
}
