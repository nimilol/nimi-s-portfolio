import Link from "next/link";
import { NewSectionForm } from "@/components/admin/NewSectionForm";
import { requireAdminPage } from "@/lib/auth";

export default async function NewSectionPage() {
  await requireAdminPage();
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-fg">
          ← Dashboard
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold">add new section</h1>
      </div>
      <NewSectionForm />
    </div>
  );
}
