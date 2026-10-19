"use client";
// Left sidebar: every section with its item count and whether it shows on the site.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

export type SidebarSection = { id: string; title: string; count: number | null; visible: boolean };

export function Sidebar({ sections, email }: { sections: SidebarSection[]; email: string }) {
  const path = usePathname();
  const linkClass = (href: string) =>
    `flex items-center justify-between gap-2 px-3 py-1.5 text-sm ${path === href ? "bg-[#161616] text-fg" : "text-muted hover:text-fg"}`;

  const nav = (
    <>
      <Link href="/admin" className={linkClass("/admin")}>
        Dashboard
      </Link>
      <Link href="/admin/settings" className={linkClass("/admin/settings")}>
        Site settings
      </Link>
      <p className="mt-6 px-3 pb-2 text-xs text-muted">Sections</p>
      {sections.map((s) => (
        <Link key={s.id} href={`/admin/sections/${s.id}`} className={linkClass(`/admin/sections/${s.id}`)}>
          <span className="truncate">{s.title}</span>
          <span className="flex shrink-0 items-center gap-2 text-xs">
            {s.count !== null && <span className="tabular-nums">{s.count}</span>}
            <span className={`h-1.5 w-1.5 rounded-full ${s.visible ? "bg-accent" : "bg-muted/40"}`} title={s.visible ? "visible" : "hidden"} />
          </span>
        </Link>
      ))}
      <Link href="/admin/sections/new" className="mt-3 block px-3 py-1.5 text-sm text-accent hover:underline">
        + Add new section
      </Link>
    </>
  );

  return (
    <aside className="border-b border-line md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/admin" className="font-display text-lg font-semibold">
          admin<span className="text-accent">.</span>
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-accent">
          View live site ↗
        </a>
      </div>

      {/* Phones: collapsible menu. Laptops: always open. */}
      <details className="px-1 pb-3 md:hidden">
        <summary className="cursor-pointer px-3 py-2 text-sm">Menu</summary>
        <div className="flex flex-col">{nav}</div>
        <form action={logout} className="mt-4 border-t border-line px-3 pt-3">
          <button type="submit" className="text-sm text-muted hover:text-fg">
            Log out ({email})
          </button>
        </form>
      </details>
      <div className="hidden flex-col px-1 md:flex">{nav}</div>

      <form action={logout} className="mt-6 hidden border-t border-line px-4 py-4 md:block">
        <p className="mb-2 truncate text-xs text-muted">{email}</p>
        <button type="submit" className="text-sm text-muted hover:text-fg">
          Log out
        </button>
      </form>
    </aside>
  );
}
