// Hero: your big editable title, a short tagline, your pitch in a panel, and two buttons.
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import { emphasize } from "@/lib/richtext";
import type { Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { HeroName } from "./HeroName";
import { SectionLabel } from "./SectionShell";

export function Hero({ settings, workHref, contactHref }: { settings: Settings; workHref: string | null; contactHref: string }) {
  const image = mediaUrl(settings.hero_image_path);
  return (
    <section id="hero" className="flex min-h-[100svh] flex-col justify-end px-5 pb-14 pt-28 md:px-10 md:pb-20">
      <div className={`mx-auto grid w-full max-w-6xl gap-10 ${image ? "md:grid-cols-12 md:items-end" : ""}`}>
        {image && (
          <Reveal delay={0.1} className="md:order-2 md:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-sm md:max-w-none">
              <Image src={image} alt="" fill priority sizes="(max-width: 768px) 90vw, 460px" className="object-contain" />
            </div>
          </Reveal>
        )}
        <div className={image ? "md:col-span-7" : ""}>
          {settings.tagline && (
            <Reveal delay={0.05} y={8} className="mb-6">
              <SectionLabel text={settings.tagline} />
            </Reveal>
          )}
          {settings.hero_title && <HeroName name={settings.hero_title} />}
          {settings.pitch && (
            <Reveal delay={0.55} className="mt-10 max-w-2xl">
              <p className="rounded-2xl border border-line bg-panel p-6 text-lg leading-relaxed text-fg/75 md:p-8 md:text-xl">
                {emphasize(settings.pitch)}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.7} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={contactHref}
              className="rounded-xl bg-fg px-7 py-4 text-center font-mono text-sm lowercase tracking-[0.25em] text-bg transition-colors duration-150 hover:bg-accent"
            >
              {settings.hero_primary_label || "work with me"} →
            </a>
            {workHref && (
              <a
                href={workHref}
                className="rounded-xl border border-line px-7 py-4 text-center font-mono text-sm lowercase tracking-[0.25em] transition-colors duration-150 hover:border-fg"
              >
                {settings.hero_secondary_label || "see work"}
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
