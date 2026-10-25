// Dashboard: every section (even empty ones) with its count and status. Drag to reorder the page.
import Link from "next/link";
import { SortableList } from "@/components/admin/SortableList";
import { StartingContentButton } from "@/components/admin/StartingContentButton";
import { getSiteData } from "@/lib/data";
import { loadAdminData } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/auth";
import { LAYOUT_LABELS } from "@/lib/layouts";
import { sectionName } from "@/lib/nav";

export default async function Dashboard() {
  const { supabase } = await requireAdminPage();
  const data = await loadAdminData(supabase);
  if (!data.ok) return null;
  const visibleCount = data.sections.filter((s) => s.visible).length;
  // What the public page is reading right now (it uses the public key, not your login).
  const live = await getSiteData();

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

      <LiveStatus status={live.status} error={live.error} />

      <h2 className="mb-1 text-sm">Sections (in page order)</h2>
      <p className="mb-4 text-xs text-muted">Drag to change the order of the public page and its navigation.</p>
      <SortableList
        kind="sections"
        rows={data.sections.map((s) => ({
          id: s.id,
          title: sectionName(s),
          meta: `${LAYOUT_LABELS[s.layout_type]}${s.is_builtin ? "" : " · custom"}`,
          badge: { text: s.status, on: s.visible },
          href: `/admin/sections/${s.id}`,
        }))}
      />
    </div>
  );
}

// Tells you whether the live site is really showing what you edit here.
function LiveStatus({ status, error }: { status: string; error?: string }) {
  if (status === "db") {
    return <p className="mb-8 border border-line px-4 py-3 text-sm text-muted">✓ Your live site reads from this database. Saves show up on the next page load.</p>;
  }
  if (status === "empty") {
    return (
      <div className="mb-8 space-y-3 border border-accent/60 p-4 text-sm">
        <p>Your database has no sections yet, so the live site is showing the built-in starting copy. Edits to sections can&apos;t show until the content is in the database.</p>
        <StartingContentButton />
      </div>
    );
  }
  return (
    <div className="mb-8 space-y-2 border border-red-400/60 p-4 text-sm">
      <p>The live site can&apos;t read your database, so it is showing the built-in starting copy instead of your edits.</p>
      <p className="text-muted">
        In Supabase run <code>supabase/schema.sql</code> again (it sets up public read access), then reload this page.
      </p>
      {error && <p className="text-xs text-muted">Error: {error}</p>}
    </div>
  );
}
