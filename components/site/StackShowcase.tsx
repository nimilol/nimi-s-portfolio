"use client";
// Stacked cards: the front card plus two tilted cards peeking out behind it.
// Swipe or use the arrows; it also moves on by itself. Tap the front card to open full screen.
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Lightbox, type MediaItem } from "./Lightbox";

const SLIDE_MS = 4500;

export function StackShowcase({ items, noun }: { items: MediaItem[]; noun: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useRef(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const count = items.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    if (count < 2 || paused || open !== null) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(timer);
  }, [count, paused, open]);

  // Only the front video plays (muted).
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && open === null) v.play().catch(() => {});
      else v.pause();
    });
  }, [index, open]);

  // Where each card sits: 0 = front, 1 = behind on the right, -1 = behind on the left.
  function place(i: number) {
    const k = (i - index + count) % count;
    if (k === 0) return { x: "0%", rotate: 0, scale: 1, opacity: 1, zIndex: 3 };
    if (k === 1) return { x: "14%", rotate: 6, scale: 0.88, opacity: 0.55, zIndex: 2 };
    if (k === count - 1) return { x: "-14%", rotate: -6, scale: 0.88, opacity: 0.55, zIndex: 2 };
    return { x: "0%", rotate: 0, scale: 0.8, opacity: 0, zIndex: 1 };
  }

  return (
    <div className="flex flex-col items-center" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[16/11] w-[74vw] max-w-[620px] md:w-[min(80vw,620px)]">
        {items.map((item, i) => {
          const p = place(i);
          const front = p.zIndex === 3;
          return (
            <motion.div
              key={item.id}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-line bg-[#111] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]"
              style={{ zIndex: p.zIndex }}
              initial={false}
              animate={{ x: p.x, rotate: p.rotate, scale: p.scale, opacity: p.opacity }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              drag={front && count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragStart={() => (dragged.current = true)}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) go(1);
                else if (info.offset.x > 50) go(-1);
                setTimeout(() => (dragged.current = false), 0);
              }}
              onClick={() => {
                if (front && !dragged.current) setOpen(i);
              }}
              role={front ? "button" : undefined}
              aria-label={front ? `Open ${noun} viewer` : undefined}
              tabIndex={front ? 0 : -1}
              onKeyDown={(e) => {
                if (front && (e.key === "Enter" || e.key === " ")) setOpen(i);
              }}
            >
              {item.type === "video" ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={item.url}
                  poster={item.poster ?? undefined}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  className="pointer-events-none h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.title || `${noun} ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 74vw, 620px"
                  className="pointer-events-none object-cover"
                  priority={i === 0}
                  unoptimized={item.url.endsWith(".gif")}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 md:gap-3">
        {count > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="h-10 w-10 shrink-0 rounded-full border border-line text-muted hover:border-fg hover:text-fg">
            ←
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen(index)}
          className="whitespace-nowrap rounded-full border border-line bg-panel px-4 py-2.5 font-mono text-[11px] lowercase tracking-[0.15em] text-fg/80 hover:border-fg/40 md:px-5 md:text-xs md:tracking-[0.25em]"
        >
          <span className="text-accent">{count}</span> {noun} · tap to expand
        </button>
        {count > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="Next" className="h-10 w-10 shrink-0 rounded-full border border-line text-muted hover:border-fg hover:text-fg">
            →
          </button>
        )}
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}
