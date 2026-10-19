// The frame around every section: a small spaced label with a short yellow line,
// then the big heading (e.g. "what i do."), then an optional subtitle.
import type { ReactNode } from "react";
import type { Section } from "@/lib/types";
import { Reveal } from "../Reveal";

export function SectionShell({
  section,
  children,
  center = false,
}: {
  section: Pick<Section, "slug" | "label" | "title" | "subtitle">;
  children: ReactNode;
  center?: boolean;
}) {
  const { slug, label, title, subtitle } = section;
  return (
    <section id={slug} className="scroll-mt-16 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className={`mb-10 md:mb-14 ${center ? "flex flex-col items-center text-center" : ""}`}>
          {label && <SectionLabel text={label} as={title ? "p" : "h2"} />}
          {title && (
            <h2 className={`font-display text-4xl font-semibold lowercase tracking-tight md:text-6xl ${label ? "mt-5" : ""}`}>{title}</h2>
          )}
          {subtitle && <p className="mt-4 max-w-xl text-muted">{subtitle}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function SectionLabel({ text, as = "p" }: { text: string; as?: "p" | "h2" }) {
  const Tag = as;
  return (
    <Tag className="flex items-center gap-4 font-mono text-xs lowercase tracking-[0.35em] text-accent md:text-sm">
      <span aria-hidden className="h-px w-10 bg-accent/80" />
      {text}
    </Tag>
  );
}
