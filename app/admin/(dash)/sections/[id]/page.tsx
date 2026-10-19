// One section: its settings + its items (add, edit, delete, drag to reorder).
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionForm } from "@/components/admin/SectionForm";
import { SortableList } from "@/components/admin/SortableList";
import { loadAdminData } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/auth";
import { LAYOUT_LABELS, SETTINGS_LAYOUTS } from "@/lib/layouts";
import { mediaUrl } from "@/lib/media";
import { sectionName } from "@/lib/nav";
import type { Item } from "@/lib/types";

function rowMeta(item: Item) {
  const bits = [
    item.number_value !== null ? `${item.number_value}${item.number_suffix ?? ""}` : "",
    item.extra?.date ?? "",
    item.description ?? "",
    item.link_url ?? "",
  ].filter(Boolean);
  return bits.join(" · ");
}

export default async function SectionPage({ params, searchParams }: PageProps<"/admin/sections/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const { supabase } = await requireAdminPage();
  const data = await loadAdminData(supabase);
  if (!data.ok) return null;
  const section = data.sections.find((s) => s.id === id);
  if (!section) notFound();

  const fromSettings = SETTINGS_LAYOUTS.includes(section.layout_type);
  const { data: items } = fromSettings
    ? { data: [] as Item[] }
    : await supabase.from("items").select("*").eq("section_id", id).order("sort_order");

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-fg">
          ← Dashboard
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold">{sectionName(section)}</h1>
        <p className="mt-1 text-sm text-muted">
          {LAYOUT_LABELS[section.layout_type]} ·{" "}
          <span className={section.visible ? "text-accent" : ""}>{section.status}</span>
        </p>
        {saved && <p className="mt-3 text-sm text-accent">Saved. Reload the live site to see it.</p>}
      </div>

      <SectionForm section={section} />

      {fromSettings ? (
        <p className="border border-line p-5 text-sm text-muted">
          This section&apos;s content (text, photo, links) is edited in{" "}
          <Link href="/admin/settings" className="text-accent hover:underline">
            Site settings
          </Link>
          .
        </p>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">Items</h2>
            <Link href={`/admin/sections/${id}/items/new`} className="bg-accent px-4 py-2 text-sm font-medium text-bg">
              + Add item
            </Link>
          </div>
          {(items ?? []).length === 0 ? (
            <p className="border border-dashed border-line p-6 text-sm text-muted">
              0 items — this section is hidden on the site. Add the first item and it appears.
            </p>
          ) : (
            <SortableList
              kind="items"
              rows={(items as Item[]).map((item) => ({
                id: item.id,
                title: item.title || (item.media_type === "video" ? "Video" : item.media_type === "image" ? "Image" : "(untitled)"),
                meta: rowMeta(item),
                thumb: mediaUrl(item.media_type === "video" ? item.thumb_path : item.media_path),
                href: `/admin/sections/${id}/items/${item.id}`,
              }))}
            />
          )}
        </div>
      )}
    </div>
  );
}
