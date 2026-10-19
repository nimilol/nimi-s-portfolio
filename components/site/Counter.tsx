"use client";
// Counts a number up from 0 the first time it scrolls into view (only once).
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({ value, suffix }: { value: number; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const decimals = Math.min((String(value).split(".")[1] ?? "").length, 2);
  const format = (n: number) => `${n.toFixed(decimals)}${suffix ?? ""}`;

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    if (reduce) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // fast start, soft landing
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={format(value)}>
      {format(0)}
    </span>
  );
}
