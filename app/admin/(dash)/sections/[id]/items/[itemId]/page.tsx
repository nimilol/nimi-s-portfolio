import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { requireAdminPage } from "@/lib/auth";
import { LAYOUT_FIELDS } from "@/lib/layouts";
import { sectionName } from "@/lib/nav";
import type { Item, Section } from "@/lib/types";

export default async function EditItemPage({ params }: PageProps<"/admin/sections/[id]/items/[itemId]">) {
  const { id, itemId } = await params;
  const { supabase } = await requireAdminPage();
  const [{ data: section }, { data: item }] = await Promise.all([
    supabase.from("sections").select("*").eq("id", id).single<Section>(),
    supabase.from("items").select("*").eq("id", itemId).eq("section_id", id).single<Item>(),
  ]);
  if (!section || !item) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/admin/sections/${id}`} className="text-sm text-muted hover:text-fg">
          ← {sectionName(section)}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold">edit item</h1>
      </div>
      <ItemForm fields={LAYOUT_FIELDS[section.layout_type]} sectionId={id} folder={section.slug} item={{ ...item, extra: item.extra ?? {} }} />
    </div>
  );
}
