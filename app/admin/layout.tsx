import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Don't check auth in layout - let each page handle it
  // This prevents redirect loops
  // Login page is client component and handles its own logic
  // Other pages check auth themselves
  
  let authenticated = false
  
  try {
    authenticated = await isAuthenticated()
  } catch (error) {
    // If auth check fails, just render children
    // Login page will show, other pages will handle errors
    return <>{children}</>
  }

  // If authenticated, show admin layout with nav
  if (authenticated) {
    return (
      <div className="admin-theme min-h-screen bg-slate-100 text-slate-900">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    )
  }

  // Not authenticated - just render children
  // Login page will show, other pages will redirect themselves
  return <>{children}</>
}

