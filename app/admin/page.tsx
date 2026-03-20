import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const dashboardCards = [
  { title: 'Услуги', href: '/admin/services' },
  { title: 'Блог', href: '/admin/blog' },
  { title: 'Кейсы', href: '/admin/cases' },
  { title: 'Отзывы', href: '/admin/reviews' },
  { title: 'Страницы', href: '/admin/pages' },
  { title: 'Настройки', href: '/admin/settings' },
]

export default async function AdminDashboard() {
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

  const values = [
    `${activeServicesCount} / ${servicesCount}`,
    `${publishedPostsCount} / ${blogPostsCount}`,
    `${casesCount}`,
    `${reviewsCount}`,
    '—',
    '—',
  ]

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <div key={card.href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">{card.title}</h2>
            <p className="mb-4 text-3xl font-bold text-cyan-700">{values[index]}</p>
            <Link href={card.href}>
              <Button variant="outline" className="w-full">
                Управление
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
