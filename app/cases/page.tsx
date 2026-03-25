import Link from 'next/link'
import RichContent from '@/components/RichContent'
import { buildCaseListing } from '@/lib/case-listing'
import { prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const casesCopy = {
  ru: {
    title: 'Кейсы и примеры работ',
    description:
      'Здесь собраны кейсы по SEO, структуре сайта и усилению коммерческих факторов: от диагностики проекта до роста видимости, трафика и заявок.',
    readingKicker: 'Как читать кейс',
    readingTitle: 'Сильный кейс полезен не красивыми словами, а логикой: проблема, развилка, внедрение, эффект',
    readingCards: [
      'Смотрите, с какой исходной проблемой стартовал проект: индексация, структура, посадочные, коммерческая подача или слабая лидогенерация.',
      'Смотрите не только на список действий, а на выбор приоритета: что сделали первым и почему не трогали всё подряд.',
      'Смотрите, как изменился сам сайт: появились ли новые страницы, логика спроса, доказательства, путь к заявке и управляемость проекта.',
    ],
    caseHint: 'Что смотреть внутри: стартовая проблема, первые приоритеты и изменения, которые реально сдвинули проект.',
    openCase: 'Открыть кейс',
    caseLabel: 'Кейс',
    previewFallback:
      'Короткий разбор проекта: что было на старте, какие изменения пошли в приоритет и к каким результатам это привело.',
    metaTitle: 'Кейсы по SEO и структуре сайта | Shelpakov Digital',
    metaDescription:
      'Кейсы по SEO, структуре сайта и коммерческим факторам: как меняется проект после доработки страниц, логики спроса, конверсии и пути клиента к заявке.',
  },
  en: {
    title: 'Case studies and selected project examples',
    description:
      'A curated set of case studies on SEO, site structure, and stronger commercial signals: from early diagnostics to visibility, traffic, and lead growth.',
    readingKicker: 'How to read a case study',
    readingTitle: 'A strong case study is useful not because it sounds impressive, but because it shows the logic: problem, fork, implementation, outcome',
    readingCards: [
      'Look at the starting constraint first: indexation, structure, key pages, commercial presentation, or weak lead generation.',
      'Look not only at the action list, but at prioritization: what was done first and why the team did not touch everything at once.',
      'Look at how the website itself changed: stronger pages, better demand mapping, more proof, clearer paths to inquiry, and more control over growth.',
    ],
    caseHint: 'What to look for inside: the starting problem, the first priorities, and the changes that actually moved the project.',
    openCase: 'Open case study',
    caseLabel: 'Case study',
    previewFallback:
      'A concise project breakdown covering the starting point, the priorities chosen first, and the business result those changes produced.',
    metaTitle: 'SEO and website structure case studies | Shelpakov Digital',
    metaDescription:
      'Case studies on SEO, website structure, and commercial signals: how a project changes after refining key pages, demand logic, conversion paths, and the user journey to a lead.',
  },
} as const

function getCasePreview(caseItem: { description?: string | null; content?: string | null }, fallback: string) {
  const description = caseItem.description?.trim()

  if (description) {
    return description
  }

  const content = (caseItem.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!content) {
    return fallback
  }

  return content.length > 220 ? `${content.slice(0, 217).trimEnd()}...` : content
}

export default async function CasesPage() {
  const locale = await getRequestLocale()
  const copy = casesCopy[locale]
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
        <span className="warm-chip">{copy.caseLabel}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || copy.description}</p>
      </section>

      <section className="reading-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.readingKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.readingTitle}</h2>
          </div>
        </div>
        <div className="uniform-grid-3 mt-6 gap-4">
          {copy.readingCards.map((item: string) => (
            <div key={item} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      {caseCards.length > 0 ? (
        <div className="uniform-grid-2 mt-8">
          {caseCards.map((caseItem) => {
            const cardContent = (
              <div className="flex h-full flex-col p-6 md:p-8">
                <span className="warm-chip w-fit">{copy.caseLabel}</span>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">{caseItem.title}</h2>
                <p className="mt-4 flex-1 text-base leading-7 text-slate-600">{getCasePreview(caseItem, copy.previewFallback)}</p>
                <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-slate-700">{copy.caseHint}</div>
                {caseItem.slug ? (
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    {copy.openCase}
                  </div>
                ) : null}
              </div>
            )

            return caseItem.slug ? (
              <Link
                key={caseItem.id}
                href={prefixPathWithLocale(`/cases/${caseItem.slug}`, locale)}
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
        title={page?.h1 || page?.title || copy.caseLabel}
        className="reading-shell editorial-prose mt-8 max-w-none"
      />
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = casesCopy[locale]
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'cases' } })
  } catch (error) {
    page = null
  }

  const alternates = getLocaleAlternates('/cases')
  const title = normalizeMetaTitle(page?.title, copy.metaTitle)
  const description = normalizeMetaDescription(page?.description, copy.metaDescription)

  return {
    title,
    description,
    alternates: {
      ...alternates,
    },
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
