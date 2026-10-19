import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Section, Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function About({ section, settings }: { section: Section; settings: Settings }) {
  const photo = mediaUrl(settings.photo_path);
  const paragraphs = settings.bio.split(/\n\s*\n/).filter(Boolean);
  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {photo && (
          <Reveal className="md:col-span-4">
            <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-full border border-line md:w-full">
              <Image src={photo} alt={settings.name} fill sizes="(max-width: 768px) 224px, 360px" className="object-cover" />
            </div>
          </Reveal>
        )}
        <Reveal delay={0.1} className={photo ? "md:col-span-8" : "md:col-span-12"}>
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-2xl leading-snug md:text-3xl" : "mt-6 text-lg leading-relaxed text-muted"}>
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}
