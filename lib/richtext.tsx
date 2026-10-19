// Lets you make words stand out by wrapping them in **double stars** in admin.
// "I write about **AI** and tech" -> "AI" shows bright and bold.
import type { ReactNode } from "react";

export function emphasize(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

// Removes the stars (for places that show plain text, like SEO).
export function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
