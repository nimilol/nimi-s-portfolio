"use client";
// Top bar: name on the left, links to visible sections in the middle, X link on the right.
import { useEffect, useState } from "react";

type Link = { id: string; label: string };

export function TopBar({ name, links, xUrl }: { name: string; links: Link[]; xUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-bg transition-colors duration-300 ${
        scrolled || open ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="px-5 md:px-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6">
          <a href="#top" className="font-display text-lg font-bold lowercase tracking-[0.3em]">
            {name}
          </a>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Sections">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="lowercase transition-colors duration-150 hover:text-accent">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {xUrl && (
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-line px-4 py-2 font-mono text-sm transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                x ↗
              </a>
            )}
            {links.length > 0 && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="text-sm text-muted md:hidden"
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                {open ? "close" : "menu"}
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line px-5 py-4 md:hidden" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="block py-2.5 font-display text-2xl lowercase"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
