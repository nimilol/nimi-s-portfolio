"use client";
// The black & white "liquid glass" background behind the whole site.
// It doesn't loop on its own: the light shapes move as you scroll down the page.
import { useEffect, useRef } from "react";

export function LiquidBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--scroll", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="liquid-bg">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="sheen" />
      <div className="grain" />
    </div>
  );
}
