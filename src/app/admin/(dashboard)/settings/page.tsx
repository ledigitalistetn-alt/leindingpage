import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Design & Contenu</h1>
      <p className="text-neutral-500 mb-6">
        Tout ce que vos visiteurs voient sur le site public : couleurs, polices, textes et images.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
