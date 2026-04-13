import Link from 'next/link'
import BrandPageHero from '@/components/BrandPageHero'
import JsonLd from '@/components/JsonLd'
import RichContent from '@/components/RichContent'
import { buildCaseListing } from '@/lib/case-listing'
import { hasRussianCaseContent, localizeCaseRecord } from '@/lib/case-localization'
import { prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

const casesCopy = {
  ru: {
    title: 'Кейсы и примеры работ',
    description:
      'В кейсах показываю стартовую проблему, что менялось на сайте и какой эффект это дало по видимости, обращениям или управляемости проекта.',
    openCase: 'Открыть кейс',
    caseLabel: 'Кейс',
    previewFallback:
      'Короткий разбор проекта: исходная точка, приоритетные правки, внедрение и результат.',
    metaTitle: 'Кейсы по SEO и структуре сайта | Shelpakov Digital',
    metaDescription:
      'Кейсы по SEO и структуре сайта: стартовая проблема, принятые решения, внедрение правок и эффект для видимости, обращений или логики сайта.',
  },
  en: {
    title: 'Case studies and selected project examples',
    description:
      'Each case shows the starting problem, the changes made on the site, and the effect on visibility, lead flow, or project manageability.',
    openCase: 'Open case study',
    caseLabel: 'Case study',
    previewFallback:
      'A concise breakdown of the starting point, the priority fixes, the implementation, and the result.',
    metaTitle: 'SEO and website structure case studies | Shelpakov Digital',
    metaDescription:
      'Case studies on SEO and site structure: the starting problem, the decisions taken, the implementation, and the effect on visibility, leads, or site logic.',
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
    .map((caseItem) => localizeCaseRecord(caseItem, locale))
    .filter((caseItem) => (locale === 'en' ? !hasRussianCaseContent(caseItem) : true))
  const localizedPage = locale === 'ru' ? page : null
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: copy.caseLabel, path: '/cases' },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id="cases-breadcrumbs-schema" data={breadcrumbSchema} />

      <BrandPageHero
        eyebrow={copy.caseLabel}
        title={localizedPage?.h1 || copy.title}
        description={localizedPage?.description || copy.description}
      />

      {caseCards.length > 0 ? (
        <div className="uniform-grid-2 mt-8">
          {caseCards.map((caseItem) => {
            const cardContent = (
              <div className="flex h-full flex-col p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-slate-950">{caseItem.title}</h2>
                <p className="mt-4 flex-1 text-base leading-7 text-slate-600">{getCasePreview(caseItem, copy.previewFallback)}</p>
                {caseItem.slug ? (
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#8a5630]">
                    {copy.openCase}
                  </div>
                ) : null}
              </div>
            )

            return caseItem.slug ? (
              <Link
                key={caseItem.id}
                href={prefixPathWithLocale(`/cases/${caseItem.slug}`, locale)}
                className="uniform-card brand-link-card interactive-card overflow-hidden p-0"
              >
                {cardContent}
              </Link>
            ) : (
              <article key={caseItem.id} className="uniform-card brand-card overflow-hidden p-0">
                {cardContent}
              </article>
            )
          })}
        </div>
      ) : null}

      <RichContent
        content={localizedPage?.content}
        title={localizedPage?.h1 || localizedPage?.title || copy.caseLabel}
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

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/cases')
  const title = normalizeMetaTitle(localizedPage?.title, copy.metaTitle)
  const description = normalizeMetaDescription(localizedPage?.description, copy.metaDescription)

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
