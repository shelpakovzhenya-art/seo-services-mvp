import { notFound, redirect } from "next/navigation";
import CollectionManager from "@/components/admin/CollectionManager";
import { adminResources } from "@/lib/admin-config";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminResourcePage({
  params,
}: {
  params: { resource: string };
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const config = adminResources[params.resource];

  if (!config) {
    notFound();
  }

  return <CollectionManager resource={params.resource} config={config} />;
}
