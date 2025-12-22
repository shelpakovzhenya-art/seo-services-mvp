import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import ParsersManager from '@/components/admin/ParsersManager'

export default async function AdminParsersPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const jobs = await prisma.parserJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Парсеры</h1>
      <ParsersManager initialJobs={jobs} />
    </div>
  )
}

