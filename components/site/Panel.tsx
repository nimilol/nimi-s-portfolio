// A rounded panel with a thin border. Rows inside get thin divider lines.
import type { ReactNode } from "react";

export function Panel({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const Tag = as;
  return <Tag className={`overflow-hidden rounded-2xl border border-line bg-panel ${className}`}>{children}</Tag>;
}
