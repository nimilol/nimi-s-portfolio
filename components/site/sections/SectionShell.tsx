// The frame around every section: a thin top line, a lowercase heading and an optional subtitle.
import type { ReactNode } from "react";
import { Reveal } from "../Reveal";

export function SectionShell({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string | null;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-line px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl font-semibold lowercase tracking-tight md:text-6xl">{title}</h2>
          {subtitle && <p className="max-w-sm text-muted lowercase md:text-right">{subtitle}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
