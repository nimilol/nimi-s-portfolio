import type { Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { HeroName } from "./HeroName";

export function Hero({ settings, workHref, contactHref }: { settings: Settings; workHref: string | null; contactHref: string }) {
  return (
    <section id="hero" className="flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 md:px-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        {settings.tagline && (
          <Reveal delay={0.05} y={8}>
            <p className="mb-6 text-sm text-accent lowercase md:text-base">{settings.tagline}</p>
          </Reveal>
        )}
        {settings.name && <HeroName name={settings.name} />}
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          {settings.pitch && (
            <Reveal delay={0.55} className="md:col-span-7">
              <p className="text-xl leading-snug text-fg/90 md:text-2xl">{settings.pitch}</p>
            </Reveal>
          )}
          <Reveal delay={0.7} className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <a
              href={contactHref}
              className="bg-accent px-6 py-3.5 text-sm font-medium text-bg transition-transform duration-150 hover:-translate-y-0.5"
            >
              work with me
            </a>
            {workHref && (
              <a href={workHref} className="border border-line px-6 py-3.5 text-sm transition-colors duration-150 hover:border-fg">
                see work
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
