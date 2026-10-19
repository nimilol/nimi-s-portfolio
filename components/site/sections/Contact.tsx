// Contact: centered "let's talk." with big rounded buttons for X, Telegram and email.
import type { Section, Settings } from "@/lib/types";
import { Reveal } from "../Reveal";
import { SectionShell } from "./SectionShell";

function xHandle(url: string) {
  const handle = url.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "").replace(/\/.*$/, "");
  return handle && handle !== url ? `@${handle} on x` : "x";
}

export function Contact({ section, settings }: { section: Section; settings: Settings }) {
  const buttons = [
    settings.x_url && { label: xHandle(settings.x_url), href: settings.x_url },
    settings.telegram_url && { label: "telegram", href: settings.telegram_url },
    settings.email && { label: settings.email, href: `mailto:${settings.email}`, tight: true },
  ].filter(Boolean) as { label: string; href: string; tight?: boolean }[];

  return (
    <SectionShell section={section} center>
      <ul className="mx-auto flex max-w-xl flex-col gap-4">
        {buttons.map((b, i) => (
          <Reveal as="li" key={b.href} delay={i * 0.08} y={10}>
            <a
              href={b.href}
              {...(b.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`block break-all rounded-2xl border border-line bg-panel px-5 py-5 text-center font-mono text-sm lowercase transition-colors duration-150 hover:border-accent hover:text-accent md:text-base ${
                b.tight ? "tracking-[0.05em] md:tracking-[0.15em]" : "tracking-[0.25em]"
              }`}
            >
              {b.label} ↗
            </a>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
