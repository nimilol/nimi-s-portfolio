"use client";
// Makes the site always open at the top, and keeps "#section" out of the address bar.
// (A "#contact" left in the address made the browser jump to the bottom on every visit or reload.)
import { useEffect } from "react";

export function ScrollManager() {
  useEffect(() => {
    // Backup for the inline script: start at the top, with no "#..." in the address.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "instant" });

    // Links like "work with me" or the top-bar items: smooth-scroll to the section without changing the address.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
      const target = id && id !== "top" ? document.getElementById(id) : null;
      if (id && id !== "top" && !target) return;
      event.preventDefault();
      if (target) target.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
