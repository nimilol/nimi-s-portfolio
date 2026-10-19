// About: your photo, then your bio in a panel. **Words in stars** show bright and bold.
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import { emphasize } from "@/lib/richtext";
import type { Section, Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

export function About({ section, settings }: { section: Section; settings: Settings }) {
  const photo = mediaUrl(settings.photo_path);
  const paragraphs = settings.bio.split(/\n\s*\n/).filter(Boolean);
  return (
    <SectionShell section={section}>
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        {photo && (
          <Reveal className="md:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-line md:max-w-none">
              <Image src={photo} alt={settings.name} fill sizes="(max-width: 768px) 90vw, 460px" className="object-cover" />
            </div>
          </Reveal>
        )}
        {paragraphs.length > 0 && (
          <Reveal delay={0.1} className={photo ? "md:col-span-7" : "md:col-span-12"}>
            <div className="h-full space-y-6 rounded-2xl border border-line bg-panel p-6 text-lg leading-relaxed text-fg/70 md:p-10 md:text-xl">
              {paragraphs.map((p, i) => (
                <p key={i}>{emphasize(p)}</p>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </SectionShell>
  );
}
