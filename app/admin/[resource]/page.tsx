import { notFound, redirect } from "next/navigation";
import CollectionManager from "@/components/admin/CollectionManager";
import { adminResources } from "@/lib/admin-config";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const resolvedParams = await params;
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const config = adminResources[resolvedParams.resource];

  if (!config) {
    notFound();
  }

  return <CollectionManager resource={resolvedParams.resource} config={config} />;
}
