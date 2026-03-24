import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { isAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return <SettingsForm initialSettings={settings} />;
}
