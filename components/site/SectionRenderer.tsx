// Picks the right look for a section based on its layout.
import { mediaUrl } from "@/lib/media";
import type { Item, Section, Settings } from "@/lib/types";
import { CircleImageShowcase } from "./CircleImageShowcase";
import { CircleVideoShowcase } from "./CircleVideoShowcase";
import type { MediaItem } from "./Lightbox";
import { About } from "./sections/About";
import { Cards } from "./sections/Cards";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import { Links } from "./sections/Links";
import { Logos } from "./sections/Logos";
import { Numbered } from "./sections/Numbered";
import { SectionShell } from "./sections/SectionShell";
import { Stats } from "./sections/Stats";
import { TextBlock } from "./sections/TextBlock";
import { Bullets } from "./sections/Bullets";
import { StackShowcase } from "./StackShowcase";
import { Timeline } from "./sections/Timeline";

function toMedia(items: Item[], type: "image" | "video"): MediaItem[] {
  return items
    .filter((i) => i.media_path)
    .map((i) => ({
      id: i.id,
      url: mediaUrl(i.media_path)!,
      type,
      title: i.title || undefined,
      link: i.link_url,
      poster: mediaUrl(i.thumb_path),
    }));
}

export function SectionRenderer({
  section,
  items,
  settings,
  workHref,
  contactHref,
}: {
  section: Section;
  items: Item[];
  settings: Settings;
  workHref: string | null;
  contactHref: string;
}) {
  switch (section.layout_type) {
    case "hero":
      return <Hero settings={settings} workHref={workHref} contactHref={contactHref} />;
    case "about":
      return <About section={section} settings={settings} />;
    case "contact":
      return <Contact section={section} settings={settings} />;
    case "numbered":
      return <Numbered section={section} items={items} />;
    case "stats":
      return <Stats section={section} items={items} />;
    case "cards":
      return <Cards section={section} items={items} />;
    case "links":
      return <Links section={section} items={items} />;
    case "timeline":
      return <Timeline section={section} items={items} />;
    case "logos":
      return <Logos section={section} items={items} />;
    case "text":
      return <TextBlock section={section} items={items} />;
    case "bullets":
      return <Bullets section={section} items={items} />;
    case "circle-image":
    case "circle-video": {
      const isVideo = section.layout_type === "circle-video";
      const media = toMedia(items, isVideo ? "video" : "image");
      if (media.length === 0) return null;
      const noun = isVideo ? "videos" : "graphics";
      return (
        <SectionShell section={section}>
          {section.variant === "stack" ? (
            <StackShowcase items={media} noun={noun} />
          ) : isVideo ? (
            <CircleVideoShowcase items={media} />
          ) : (
            <CircleImageShowcase items={media} />
          )}
        </SectionShell>
      );
    }
    default:
      return null;
  }
}
