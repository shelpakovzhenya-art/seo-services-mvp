import { redirect } from "next/navigation";
import SEOFilesManager from "@/components/admin/SEOFilesManager";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminSEOFilesPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return <SEOFilesManager />;
}
