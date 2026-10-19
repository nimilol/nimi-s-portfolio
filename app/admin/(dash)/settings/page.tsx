import { SettingsForm } from "@/components/admin/SettingsForm";
import { loadAdminData } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/auth";

export default async function SettingsPage() {
  const { supabase } = await requireAdminPage();
  const data = await loadAdminData(supabase);
  if (!data.ok) return null;
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-semibold">site settings</h1>
      <SettingsForm settings={data.settings} sections={data.sections} />
    </div>
  );
}
