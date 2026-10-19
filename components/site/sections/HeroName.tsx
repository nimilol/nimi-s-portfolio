"use client";
// Signature entrance: the letters of your name rise up, then the yellow circle opens.
import { motion, useReducedMotion } from "framer-motion";

export function HeroName({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const letters = Array.from(name.toLowerCase());
  // Long names get a smaller size so they always fit on one line.
  const scale = Math.min(1, 5 / Math.max(letters.length, 1));
  return (
    <h1
      className="font-display font-semibold leading-[0.82] tracking-[-0.06em]"
      style={{ fontSize: `min(${(26 * scale).toFixed(2)}vw, ${(15 * scale).toFixed(2)}rem)` }}
      aria-label={name}
    >
      <span className="inline-flex overflow-hidden pb-[0.06em]" aria-hidden>
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
      <motion.span
        aria-hidden
        className="ml-[0.04em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-accent align-baseline"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.25 + letters.length * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </h1>
  );
}
