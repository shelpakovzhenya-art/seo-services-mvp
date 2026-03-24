import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main", siteName: "Студия Английского" },
  });

  return <SettingsForm initialSettings={settings} />;
}
