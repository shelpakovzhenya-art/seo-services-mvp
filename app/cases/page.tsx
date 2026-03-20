import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

export default async function CasesPage() {
  let page: any = null
  let cases: any[] = []

  try {
    page = await prisma.page.findUnique({ where: { slug: 'cases' } })
    cases = await prisma.case.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Error loading cases page:', error)
    page = null
    cases = []
  }

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Кейсы</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">
          {page?.h1 || 'Кейсы и примеры работ'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {page?.description ||
            'Здесь можно показать, как меняется сайт после доработки структуры, оффера и SEO-основы.'}
        </p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {cases.map((caseItem) => (
          <article key={caseItem.id} className="page-card overflow-hidden p-0">
            {caseItem.image && (
              <div className="relative h-56 w-full">
                <Image src={caseItem.image} alt={caseItem.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">{caseItem.title}</h2>
              {caseItem.description && (
                <p className="mt-3 text-base leading-7 text-slate-600">{caseItem.description}</p>
              )}
              {caseItem.content && (
                <div className="prose mt-5 max-w-none prose-slate">
                  <ReactMarkdown>{caseItem.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="page-card mt-8">
          <h2 className="text-2xl font-semibold text-slate-950">Кейсы появятся здесь</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Лучше всего работают кейсы с задачей клиента, перечнем правок и итогом без выдуманных цифр.
          </p>
        </div>
      )}

      {page?.content && (
        <div className="page-card mt-8 prose max-w-none prose-slate">
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
  const { getFullUrl } = await import('@/lib/site-url')
  const casesUrl = getFullUrl('/cases')
  const fallbackTitle = 'Кейсы по SEO и структуре сайта | Shelpakov Digital'
  const fallbackDescription =
    'Кейсы по SEO, структуре сайта и коммерческим факторам: как меняется проект после доработки страниц, логики спроса, конверсии и пути клиента к заявке.'
  const title = normalizeMetaTitle(page?.title, fallbackTitle)
  const description = normalizeMetaDescription(page?.description, fallbackDescription)

  return {
    title,
    description,
    alternates: {
      canonical: casesUrl,
    },
    openGraph: {
      title,
      description,
      url: casesUrl,
      type: 'website',
    },
  }
}
