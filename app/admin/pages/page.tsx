import { redirect } from 'next/navigation'
import PagesManager from '@/components/admin/PagesManager'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminPagesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const pages = await prisma.page.findMany({
    orderBy: { slug: 'asc' },
  })

  const serializedPages = pages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    h1: page.h1,
    content: page.content,
    parentId: page.parentId,
    order: page.order,
  }))

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Управление страницами</h1>
      <PagesManager initialPages={serializedPages} />
    </div>
  )
}
