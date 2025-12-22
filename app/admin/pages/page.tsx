import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import PagesManager from '@/components/admin/PagesManager'

export default async function AdminPagesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const pages = await prisma.page.findMany({
    orderBy: { slug: 'asc' }
  })

  // Serialize data to remove Date objects and make it safe for client components
  const serializedPages = pages.map(page => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    description: page.description,
    h1: page.h1,
    content: page.content,
    parentId: page.parentId,
    order: page.order,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Управление страницами</h1>
      <PagesManager initialPages={serializedPages} />
    </div>
  )
}

