import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import CasesManager from '@/components/admin/CasesManager'

export default async function AdminCasesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const cases = await prisma.case.findMany({
    orderBy: { order: 'asc' }
  })

  // Serialize data to remove Date objects and make it safe for client components
  const serializedCases = cases.map(caseItem => ({
    id: caseItem.id,
    title: caseItem.title,
    description: caseItem.description,
    content: caseItem.content,
    image: caseItem.image,
    order: caseItem.order,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Управление кейсами</h1>
      <CasesManager initialCases={serializedCases} />
    </div>
  )
}

