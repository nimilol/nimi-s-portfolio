"use client";
// Videos: short muted loops inside a circle, fading from one to the next.
// Click opens the full player with sound.
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Dots } from "./CircleImageShowcase";
import { Lightbox, type MediaItem } from "./Lightbox";

const SLIDE_MS = 6000;

export function CircleVideoShowcase({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const count = items.length;

  // Move to the next video every few seconds (not while hovering or watching full screen).
  useEffect(() => {
    if (count < 2 || paused || open !== null) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(timer);
  }, [count, paused, open]);

  // Only the visible video plays; the others rest (saves battery and data).
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && open === null) {
        v.play().catch(() => {}); // some browsers block autoplay; the poster image still shows
      } else {
        v.pause();
      }
    });
  }, [index, open]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen(index)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative aspect-square w-[min(86vw,560px)] overflow-hidden rounded-full border border-line bg-[#111] outline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="Open video player"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
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
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
        <span className="absolute bottom-[12%] left-1/2 -translate-x-1/2 bg-bg/80 px-3 py-1 text-xs text-fg">
          ▶ play with sound
        </span>
      </button>

      <Dots count={count} index={index} onPick={setIndex} />
      {items[index]?.title && <p className="mt-4 text-sm text-muted">{items[index].title}</p>}

      <AnimatePresence>
        {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}
