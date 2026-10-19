// Wraps every admin page (except login): checks you're the admin and shows the sidebar.
import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { loadAdminData } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/auth";
import { SETTINGS_LAYOUTS } from "@/lib/layouts";
import { sectionName } from "@/lib/nav";

export const metadata: Metadata = { title: "admin", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { supabase, user } = await requireAdminPage();
  const data = await loadAdminData(supabase);
  const sections = data.ok ? data.sections.map((s) => ({
        id: s.id,
        title: sectionName(s),
        // hero / about / contact get their content from Site settings, so no item count
        count: SETTINGS_LAYOUTS.includes(s.layout_type) ? null : s.count,
        visible: s.visible,
      })) : [];

  return (
    <div className="min-h-screen md:flex">
      <Sidebar sections={sections} email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        {data.ok ? (
          children
        ) : (
          <div className="max-w-xl space-y-3 border border-line p-5 text-sm">
            <p className="text-fg">The database isn&apos;t set up yet.</p>
            <p className="text-muted">
              In Supabase open <b>SQL Editor → New query</b>, paste all of <code>supabase/schema.sql</code> and click Run. Then do the same
              with <code>supabase/seed.sql</code>. Reload this page.
            </p>
            <p className="text-xs text-muted">Error: {data.error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
