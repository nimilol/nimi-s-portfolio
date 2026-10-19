"use client";
// Small vertical dots on the right edge. The dot of the section you're reading turns yellow.
import { useEffect, useState } from "react";

type Dot = { id: string; label: string };

export function DotNav({ dots }: { dots: Dot[] }) {
  const [active, setActive] = useState(dots[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // a section counts as "current" when it crosses the middle of the screen
      { rootMargin: "-45% 0px -50% 0px" }
    );
    dots.forEach((d) => {
      const el = document.getElementById(d.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [dots]);

  if (dots.length < 2) return null;

  return (
    <nav className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex" aria-label="Section dots">
      {dots.map((d) => (
        <a key={d.id} href={`#${d.id}`} aria-label={d.label} title={d.label} className="group flex h-4 w-4 items-center justify-center">
          <span
            className={`block rounded-full transition-all duration-200 ${
              active === d.id ? "h-2.5 w-2.5 bg-accent" : "h-1.5 w-1.5 bg-muted/50 group-hover:bg-fg"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
