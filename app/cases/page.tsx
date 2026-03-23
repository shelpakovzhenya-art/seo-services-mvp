import Link from 'next/link'
import RichContent from '@/components/RichContent'
import { buildCaseListing } from '@/lib/case-listing'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

const PAGE_FALLBACK_TITLE = '\u041a\u0435\u0439\u0441\u044b \u0438 \u043f\u0440\u0438\u043c\u0435\u0440\u044b \u0440\u0430\u0431\u043e\u0442'
const PAGE_FALLBACK_DESCRIPTION =
  '\u0417\u0434\u0435\u0441\u044c \u0441\u043e\u0431\u0440\u0430\u043d\u044b \u043a\u0435\u0439\u0441\u044b \u043f\u043e SEO, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 \u0438 \u0443\u0441\u0438\u043b\u0435\u043d\u0438\u044e \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0438\u0445 \u0444\u0430\u043a\u0442\u043e\u0440\u043e\u0432: \u043e\u0442 \u0434\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0434\u043e \u0440\u043e\u0441\u0442\u0430 \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u0438, \u0442\u0440\u0430\u0444\u0438\u043a\u0430 \u0438 \u0437\u0430\u044f\u0432\u043e\u043a.'
const OPEN_CASE = '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441'
const CASE_LABEL = '\u041a\u0435\u0439\u0441'
const CASE_PREVIEW_FALLBACK =
  '\u041a\u043e\u0440\u043e\u0442\u043a\u0438\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 \u043f\u0440\u043e\u0435\u043a\u0442\u0430: \u0447\u0442\u043e \u0431\u044b\u043b\u043e \u043d\u0430 \u0441\u0442\u0430\u0440\u0442\u0435, \u043a\u0430\u043a\u0438\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u043f\u043e\u0448\u043b\u0438 \u0432 \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u0438 \u043a \u0430\u043a\u0438\u043c \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430\u043c \u044d\u0442\u043e \u043f\u0440\u0438\u0432\u0435\u043b\u043e.'
const META_TITLE = '\u041a\u0435\u0439\u0441\u044b \u043f\u043e SEO \u0438 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 | Shelpakov Digital'
const META_DESCRIPTION =
  '\u041a\u0435\u0439\u0441\u044b \u043f\u043e SEO, \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0435 \u0441\u0430\u0439\u0442\u0430 \u0438 \u043a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u0438\u043c \u0444\u0430\u043a\u0442\u043e\u0440\u0430\u043c: \u043a\u0430\u043a \u043c\u0435\u043d\u044f\u0435\u0442\u0441\u044f \u043f\u0440\u043e\u0435\u043a\u0442 \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446, \u043b\u043e\u0433\u0438\u043a\u0438 \u0441\u043f\u0440\u043e\u0441\u0430, \u043a\u043e\u043d\u0432\u0435\u0440\u0441\u0438\u0438 \u0438 \u043f\u0443\u0442\u0438 \u043a\u043b\u0438\u0435\u043d\u0442\u0430 \u043a \u0437\u0430\u044f\u0432\u043a\u0435.'

function getCasePreview(caseItem: { description?: string | null; content?: string | null }) {
  const description = caseItem.description?.trim()

  if (description) {
    return description
  }

  const content = (caseItem.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!content) {
    return CASE_PREVIEW_FALLBACK
  }

  return content.length > 220 ? `${content.slice(0, 217).trimEnd()}...` : content
}

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

  const caseCards = buildCaseListing(cases)

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <span className="warm-chip">{'\u041a\u0435\u0439\u0441\u044b'}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || PAGE_FALLBACK_TITLE}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || PAGE_FALLBACK_DESCRIPTION}</p>
      </section>

      {caseCards.length > 0 ? (
        <div className="uniform-grid-2 mt-8">
          {caseCards.map((caseItem) => {
            const cardContent = (
              <div className="flex h-full flex-col p-6 md:p-8">
                <span className="warm-chip w-fit">{CASE_LABEL}</span>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">{caseItem.title}</h2>
                <p className="mt-4 flex-1 text-base leading-7 text-slate-600">{getCasePreview(caseItem)}</p>
                {caseItem.slug ? (
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    {OPEN_CASE}
                  </div>
                ) : null}
              </div>
            )

            return caseItem.slug ? (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="uniform-card reading-shell interactive-card overflow-hidden p-0"
              >
                {cardContent}
              </Link>
            ) : (
              <article key={caseItem.id} className="uniform-card reading-shell overflow-hidden p-0">
                {cardContent}
              </article>
            )
          })}
        </div>
      ) : null}

      <RichContent
        content={page?.content}
        title={page?.h1 || page?.title || '\u041a\u0435\u0439\u0441\u044b'}
        className="reading-shell editorial-prose mt-8 max-w-none"
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
