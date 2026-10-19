// Dashboard: every section (even empty ones) with its count and status. Drag to reorder the page.
import Link from "next/link";
import { SortableList } from "@/components/admin/SortableList";
import { loadAdminData } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/auth";
import { LAYOUT_LABELS } from "@/lib/layouts";

export default async function Dashboard() {
  const { supabase } = await requireAdminPage();
  const data = await loadAdminData(supabase);
  if (!data.ok) return null;
  const visibleCount = data.sections.filter((s) => s.visible).length;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            {visibleCount} of {data.sections.length} sections are visible on the site. Empty sections stay hidden automatically.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/sections/new" className="bg-accent px-4 py-2 text-sm font-medium text-bg">
            + Add new section
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="border border-line px-4 py-2 text-sm hover:border-fg">
            View live site ↗
          </a>
        </div>
      </div>

      <h2 className="mb-1 text-sm">Sections (in page order)</h2>
      <p className="mb-4 text-xs text-muted">Drag to change the order of the public page and its navigation.</p>
      <SortableList
        kind="sections"
        rows={data.sections.map((s) => ({
          id: s.id,
          title: s.title,
          meta: `${LAYOUT_LABELS[s.layout_type]}${s.is_builtin ? "" : " · custom"}`,
          badge: { text: s.status, on: s.visible },
          href: `/admin/sections/${s.id}`,
        }))}
      />
    </div>
  );
}
