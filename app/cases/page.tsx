import Image from 'next/image'
import Link from 'next/link'
import RichContent from '@/components/RichContent'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

const PAGE_FALLBACK_TITLE = '\u041a\u0435\u0439\u0441\u044b \u0438 \u043f\u0440\u0438\u043c\u0435\u0440\u044b \u0440\u0430\u0431\u043e\u0442'
const PAGE_FALLBACK_DESCRIPTION =
  '\u0417\u0434\u0435\u0441\u044c \u0441\u043e\u0431\u0440\u0430\u043d\u044b \u043a\u0435\u0439\u0441\u044b \u043f\u043e SEO, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 \u0438 \u0443\u0441\u0438\u043b\u0435\u043d\u0438\u044e \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0438\u0445 \u0444\u0430\u043a\u0442\u043e\u0440\u043e\u0432: \u043e\u0442 \u0434\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0434\u043e \u0440\u043e\u0441\u0442\u0430 \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u0438, \u0442\u0440\u0430\u0444\u0438\u043a\u0430 \u0438 \u0437\u0430\u044f\u0432\u043e\u043a.'
const OPEN_CASE = '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441'
const EMPTY_TITLE = '\u041a\u0435\u0439\u0441\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0432 \u0430\u0434\u043c\u0438\u043d\u043a\u0435'
const EMPTY_DESCRIPTION =
  '\u0417\u0434\u0435\u0441\u044c \u0442\u0435\u043f\u0435\u0440\u044c \u043d\u0435\u0442 \u0437\u0430\u0445\u0430\u0440\u0434\u043a\u043e\u0436\u0435\u043d\u043d\u044b\u0445 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a: \u0441\u043f\u0438\u0441\u043e\u043a \u0432\u0441\u0435\u0433\u0434\u0430 \u0431\u0435\u0440\u0451\u0442\u0441\u044f \u0438\u0437 \u0434\u0430\u043d\u043d\u044b\u0445 \u0430\u0434\u043c\u0438\u043d\u043a\u0438.'
const META_TITLE = '\u041a\u0435\u0439\u0441\u044b \u043f\u043e SEO \u0438 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 | Shelpakov Digital'
const META_DESCRIPTION =
  '\u041a\u0435\u0439\u0441\u044b \u043f\u043e SEO, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 \u0438 \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0438\u043c \u0444\u0430\u043a\u0442\u043e\u0440\u0430\u043c: \u043a\u0430\u043a \u043c\u0435\u043d\u044f\u0435\u0442\u0441\u044f \u043f\u0440\u043e\u0435\u043a\u0442 \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446, \u043b\u043e\u0433\u0438\u043a\u0438 \u0441\u043f\u0440\u043e\u0441\u0430, \u043a\u043e\u043d\u0432\u0435\u0440\u0441\u0438\u0438 \u0438 \u043f\u0443\u0442\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0430 \u043a \u0437\u0430\u044f\u0432\u043a\u0435.'

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
        <span className="warm-chip">{'\u041a\u0435\u0439\u0441\u044b'}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || PAGE_FALLBACK_TITLE}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || PAGE_FALLBACK_DESCRIPTION}</p>
      </section>

      {cases.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {cases.map((caseItem) => {
            const cardContent = (
              <>
                {caseItem.image ? (
                  <div className="relative h-56 w-full">
                    <Image src={caseItem.image} alt={caseItem.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-slate-950">{caseItem.title}</h2>
                  {caseItem.description ? <p className="mt-3 text-base leading-7 text-slate-600">{caseItem.description}</p> : null}
                  <RichContent content={caseItem.content} title={caseItem.title} className="prose mt-5 max-w-none prose-slate" />
                  {caseItem.slug ? <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">{OPEN_CASE}</div> : null}
                </div>
              </>
            )

            return caseItem.slug ? (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="page-card overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-cyan-200"
              >
                {cardContent}
              </Link>
            ) : (
              <article key={caseItem.id} className="page-card overflow-hidden p-0">
                {cardContent}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="page-card mt-8">
          <h2 className="text-2xl font-semibold text-slate-950">{EMPTY_TITLE}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{EMPTY_DESCRIPTION}</p>
        </div>
      )}

      <RichContent
        content={page?.content}
        title={page?.h1 || page?.title || '\u041a\u0435\u0439\u0441\u044b'}
        className="page-card mt-8 prose max-w-none prose-slate"
      />
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
  const title = normalizeMetaTitle(page?.title, META_TITLE)
  const description = normalizeMetaDescription(page?.description, META_DESCRIPTION)

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
