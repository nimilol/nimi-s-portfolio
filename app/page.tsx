// The public one-page site. Built on the server from the database (or the built-in copy).
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { DotNav } from "@/components/site/DotNav";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { TopBar } from "@/components/site/TopBar";
import { getSiteData, safeAccent } from "@/lib/data";
import { mediaUrl } from "@/lib/media";
import { WORK_LAYOUTS, navLabel } from "@/lib/nav";
import { itemsFor, visibleSections } from "@/lib/visibility";

// Re-check the database at most once a minute. Admin saves refresh it instantly.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const photo = mediaUrl(settings.photo_path);
  return {
    title: settings.seo_title || settings.name,
    description: settings.seo_description,
    openGraph: {
      title: settings.seo_title,
      description: settings.seo_description,
      type: "website",
      images: photo ? [photo] : undefined,
    },
    twitter: {
      card: "summary",
      title: settings.seo_title,
      description: settings.seo_description,
      images: photo ? [photo] : undefined,
    },
  };
}

export default async function Home() {
  const { sections, items, settings } = await getSiteData();

  // Only sections with content (and not switched off) make it onto the page, nav and dots.
  const visible = visibleSections(sections, items, settings);
  const navLinks = visible
    .filter((s) => s.show_in_nav && s.layout_type !== "hero")
    .map((s) => ({ id: s.slug, label: navLabel(s) }));
  const dots = visible.map((s) => ({ id: s.slug, label: navLabel(s) }));

  const work = visible.find((s) => WORK_LAYOUTS.includes(s.layout_type));
  const contact = visible.find((s) => s.layout_type === "contact");
  const contactHref = contact ? `#${contact.slug}` : `mailto:${settings.email}`;

  return (
    <div id="top" style={{ "--accent": safeAccent(settings.accent) } as CSSProperties}>
      <TopBar name={settings.name} links={navLinks} xUrl={settings.x_url} />
      <DotNav dots={dots} />
      <main>
        {visible.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            items={itemsFor(section, items)}
            settings={settings}
            workHref={work ? `#${work.slug}` : null}
            contactHref={contactHref}
          />
        ))}
      </main>
      <footer className="border-t border-line px-5 py-10 text-sm text-muted md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 md:flex-row">
          <span>
            © {new Date().getFullYear()} {settings.name}
          </span>
          {settings.footer_note && <span>{settings.footer_note}</span>}
        </div>
      </footer>
    </div>
  );
}
