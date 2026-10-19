import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { requireAdminPage } from "@/lib/auth";
import { LAYOUT_FIELDS } from "@/lib/layouts";
import type { Section } from "@/lib/types";

export default async function NewItemPage({ params }: PageProps<"/admin/sections/[id]/items/new">) {
  const { id } = await params;
  const { supabase } = await requireAdminPage();
  const { data: section } = await supabase.from("sections").select("*").eq("id", id).single<Section>();
  if (!section || LAYOUT_FIELDS[section.layout_type].length === 0) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/admin/sections/${id}`} className="text-sm text-muted hover:text-fg">
          ← {section.title}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold">add item</h1>
      </div>
      <ItemForm fields={LAYOUT_FIELDS[section.layout_type]} sectionId={id} folder={section.slug} item={null} />
    </div>
  );
}
