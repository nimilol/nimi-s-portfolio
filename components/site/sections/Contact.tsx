// Contact: "let's talk." with big email / X / Telegram links.
import type { Section, Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

function handle(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function Contact({ section, settings }: { section: Section; settings: Settings }) {
  const rows = [
    settings.email && { label: "email", value: settings.email, href: `mailto:${settings.email}` },
    settings.x_url && { label: "x", value: handle(settings.x_url), href: settings.x_url },
    settings.telegram_url && { label: "telegram", value: handle(settings.telegram_url), href: settings.telegram_url },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <SectionShell id={section.slug} title={section.title} subtitle={section.subtitle}>
      <ul className="border-b border-line">
        {rows.map((r, i) => (
          <Reveal as="li" key={r.label} delay={i * 0.08} y={10} className="border-t border-line">
              <a
                href={r.href}
                {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col gap-1 py-7 md:flex-row md:items-baseline md:justify-between md:py-9"
              >
                <span className="text-sm text-muted">{r.label}</span>
                <span className="break-all font-display text-2xl tracking-tight transition-colors duration-150 group-hover:text-accent md:text-5xl">
                  {r.value}
                </span>
              </a>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
