import AdminNav from "@/components/admin/AdminNav";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated().catch(() => false);

  if (!authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  );
}
