"use client";
// Full-screen viewer. Swipe (or use arrows / keyboard) to move between items.
// Videos play here WITH sound and controls.
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
  title?: string;
  link?: string | null;
  poster?: string | null;
};

export function Lightbox({ items, start, onClose }: { items: MediaItem[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [direction, setDirection] = useState(0);
  const count = items.length;
  const item = items[index];

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((i) => (i + step + count) % count);
    },
    [count]
  );

  // Keyboard: Esc closes, arrows move. Also stop the page behind from scrolling.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = old;
    };
  }, [go, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-14 items-center justify-between px-5 text-sm text-muted">
        <span className="tabular-nums">
          {index + 1} / {count}
        </span>
        <button type="button" onClick={onClose} className="text-fg hover:text-accent">
          close
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={item.id}
            custom={direction}
            className="absolute inset-0 flex items-center justify-center px-4"
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                poster={item.poster ?? undefined}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full"
              />
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src={item.url}
                  alt={item.title || "graphic"}
                  fill
                  sizes="100vw"
                  className="pointer-events-none object-contain"
                  unoptimized={item.url.endsWith(".gif")}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3 text-sm">
        <button type="button" onClick={() => go(-1)} disabled={count < 2} className="text-muted hover:text-fg disabled:opacity-0">
          ← prev
        </button>
        <div className="text-center">
          {item.title && <p className="text-fg">{item.title}</p>}
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-accent">
              view post ↗
            </a>
          )}
        </div>
        <button type="button" onClick={() => go(1)} disabled={count < 2} className="text-muted hover:text-fg disabled:opacity-0">
          next →
        </button>
      </div>
    </motion.div>
  );
}
