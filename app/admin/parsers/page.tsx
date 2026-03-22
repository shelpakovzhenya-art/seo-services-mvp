import { redirect } from 'next/navigation'
import ParsersManager from '@/components/admin/ParsersManager'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminParsersPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const jobsRaw = await prisma.parserJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      type: true,
      status: true,
      error: true,
      config: true,
      createdAt: true,
      completedAt: true,
    },
  })

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Парсеры и SEO-аудит</h1>
      <ParsersManager initialJobs={jobsRaw} />
    </div>
  )
}
