import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import SEOFilesManager from '@/components/admin/SEOFilesManager'

export default async function AdminSEOFilesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SEO файлы</h1>
      <SEOFilesManager />
    </div>
  )
}


