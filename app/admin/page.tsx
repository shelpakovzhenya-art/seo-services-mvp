import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
  // Check auth in page itself
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }
  let servicesCount = 0
  let activeServicesCount = 0
  let blogPostsCount = 0
  let publishedPostsCount = 0
  let casesCount = 0
  let reviewsCount = 0
  
  try {
    servicesCount = await prisma.service.count()
    activeServicesCount = await prisma.service.count({ where: { isActive: true } })
    blogPostsCount = await prisma.blogPost.count()
    publishedPostsCount = await prisma.blogPost.count({ where: { published: true } })
    casesCount = await prisma.case.count()
    reviewsCount = await prisma.review.count()
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Услуги</h2>
          <p className="text-3xl font-bold text-primary mb-4">
            {activeServicesCount} / {servicesCount}
          </p>
          <Link href="/admin/services">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Блог</h2>
          <p className="text-3xl font-bold text-primary mb-4">
            {publishedPostsCount} / {blogPostsCount}
          </p>
          <Link href="/admin/blog">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Кейсы</h2>
          <p className="text-3xl font-bold text-primary mb-4">{casesCount}</p>
          <Link href="/admin/cases">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Отзывы</h2>
          <p className="text-3xl font-bold text-primary mb-4">{reviewsCount}</p>
          <Link href="/admin/reviews">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Страницы</h2>
          <p className="text-3xl font-bold text-primary mb-4">—</p>
          <Link href="/admin/pages">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Настройки</h2>
          <p className="text-3xl font-bold text-primary mb-4">—</p>
          <Link href="/admin/settings">
            <Button variant="outline" className="w-full">Управление</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

