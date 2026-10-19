"use client";
// Graphics: images sit inside a big circle and cross-fade one after another (every 4s).
// Hover pauses it. Tap/click opens the full-screen viewer.
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Lightbox, type MediaItem } from "./Lightbox";

const SLIDE_MS = 4000;

export function CircleImageShowcase({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused || open !== null) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(timer);
  }, [count, paused, open]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen(index)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative aspect-square w-[min(86vw,560px)] overflow-hidden rounded-full border border-line bg-[#111] outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="Open graphics gallery"
      >
        {/* Every image is stacked; only the current one is visible. No layout jumping. */}
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.04 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src={item.url}
              alt={item.title || `graphic ${i + 1}`}
              fill
              sizes="(max-width: 768px) 86vw, 560px"
              className="object-cover"
              priority={i === 0}
              unoptimized={item.url.endsWith(".gif")}
            />
          </motion.div>
        ))}
      </button>

      <Dots count={count} index={index} onPick={setIndex} />
      {items[index]?.title && <p className="mt-4 text-sm text-muted">{items[index].title}</p>}

      <AnimatePresence>
        {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}

export function Dots({ count, index, onPick }: { count: number; index: number; onPick: (i: number) => void }) {
  if (count < 2) return null;
  return (
    <div className="mt-6 flex gap-2.5" role="tablist">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Show item ${i + 1}`}
          onClick={() => onPick(i)}
          className="flex h-5 w-5 items-center justify-center"
        >
          <span className={`block rounded-full transition-all duration-200 ${i === index ? "h-2 w-2 bg-accent" : "h-1.5 w-1.5 bg-muted/50"}`} />
        </button>
      ))}
    </div>
  );
}
