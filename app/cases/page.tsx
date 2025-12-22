import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

export default async function CasesPage() {
  let page: any = null
  let cases: any[] = []
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'cases' } })
    cases = await prisma.case.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading cases page:', error)
    page = null
    cases = []
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{page?.h1 || 'Кейсы'}</h1>
      
      {page?.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {caseItem.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3">{caseItem.title}</h2>
              {caseItem.description && (
                <p className="text-gray-600 mb-4">{caseItem.description}</p>
              )}
              {caseItem.content && (
                <div className="prose max-w-none">
                  <ReactMarkdown>{caseItem.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {page?.content && (
        <div className="prose max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'cases' } })
  } catch (error) {
    page = null
  }
  return {
    title: page?.title || 'Кейсы - SEO Services',
    description: page?.description || 'Наши кейсы',
  }
}

