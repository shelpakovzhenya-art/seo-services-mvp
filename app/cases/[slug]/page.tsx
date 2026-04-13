import Image from 'next/image'
import { notFound } from 'next/navigation'
import CaseGallery from '@/components/cases/CaseGallery'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import { botiqCase, getBuiltInCaseBySlug, hydrateBotiqCaseRecord } from '@/lib/botiq-case'
import { parseCaseGallery } from '@/lib/case-gallery'
import { hasRussianCaseContent, localizeCaseRecord, type LocalizableCaseRecord } from '@/lib/case-localization'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCaseArticleSchema } from '@/lib/structured-data'

type CaseRecord = LocalizableCaseRecord & {
  slug?: string | null
  title: string
  description?: string | null
  content?: string | null
  image?: string | null
  resultImages?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}

const casePageCopy: Record<
  Locale,
  {
    home: string
    cases: string
    chip: string
    cta: string
    contactChip: string
    contactTitle: string
    contactDescription: string
    metaTitleSuffix: string
    metaDescriptionFallback: string
  }
> = {
  ru: {
    home: 'Главная',
    cases: 'Кейсы',
    chip: 'Кейс',
    cta: 'Обсудить похожий проект',
    contactChip: 'Обсудить проект',
    contactTitle: 'Нужен похожий результат для вашего сайта?',
    contactDescription:
      'Разберу задачу, покажу, где сайт теряет потенциал, и подскажу, с чего разумнее начинать, чтобы SEO и структура сайта работали на заявки, а не только на видимость.',
    metaTitleSuffix: 'SEO-кейс',
    metaDescriptionFallback:
      'Кейс Shelpakov Digital по SEO, структуре сайта и поэтапному усилению ключевых страниц под рост видимости и заявок.',
  },
  en: {
    home: 'Home',
    cases: 'Case studies',
    chip: 'Case study',
    cta: 'Discuss a similar project',
    contactChip: 'Discuss your project',
    contactTitle: 'Need a similar result for your website?',
    contactDescription:
      'I will break the task down, show where the site is losing potential, and outline the most sensible starting point so SEO and site structure support leads, not just visibility.',
    metaTitleSuffix: 'Case study',
    metaDescriptionFallback:
      'A Shelpakov Digital case study on SEO, site structure, and staged improvements to key pages for stronger visibility and lead flow.',
  },
}

async function getCaseBySlug(slug: string): Promise<{ caseItem: CaseRecord | null; isBuiltIn: boolean }> {
  try {
    const dbCase = await prisma.case.findFirst({
      where: { slug },
    })

    if (dbCase) {
      return { caseItem: hydrateBotiqCaseRecord(dbCase), isBuiltIn: false }
    }
  } catch (error) {
    console.error('Error loading case:', error)
  }

  const builtInCase = getBuiltInCaseBySlug(slug)
  return {
    caseItem: builtInCase ? hydrateBotiqCaseRecord(builtInCase) : null,
    isBuiltIn: Boolean(builtInCase),
  }
}

export default async function CasePage({ params }: { params: { slug: string } }) {
  const locale = await getRequestLocale()
  const copy = casePageCopy[locale]
  const result = await getCaseBySlug(params.slug)
  const caseItem = result.caseItem ? localizeCaseRecord(result.caseItem, locale) : null
  const { isBuiltIn } = result

  if (!caseItem) {
    notFound()
  }

  if (locale === 'en' && hasRussianCaseContent(caseItem)) {
    notFound()
  }

  const galleryImages = parseCaseGallery(caseItem.resultImages)
  const baseCasePath = isBuiltIn && params.slug === botiqCase.slug ? botiqCase.url : `/cases/${params.slug}`
  const localizedCasePath = prefixPathWithLocale(baseCasePath, locale)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: copy.home, path: prefixPathWithLocale('/', locale) },
    { name: copy.cases, path: prefixPathWithLocale('/cases', locale) },
    { name: caseItem.title, path: localizedCasePath },
  ], { locale })
  const caseArticleSchema = createCaseArticleSchema({
    path: localizedCasePath,
    title: caseItem.title,
    description: caseItem.description || copy.metaDescriptionFallback,
    image: caseItem.image,
    publishedAt: isBuiltIn && params.slug === botiqCase.slug ? botiqCase.publishedAt : caseItem.createdAt,
    updatedAt: isBuiltIn && params.slug === botiqCase.slug ? botiqCase.updatedAt : caseItem.updatedAt,
    about:
      caseItem.about && caseItem.about.length > 0
        ? caseItem.about
        : locale === 'en'
          ? ['SEO audit', 'Site structure', 'Technical SEO']
          : ['SEO-аудит', 'Структура сайта', 'Техническое SEO'],
    locale,
  })

  return (
    <div className="page-shell">
      <JsonLd id={`case-breadcrumbs-${params.slug}`} data={breadcrumbSchema} />
      <JsonLd id={`case-article-${params.slug}`} data={caseArticleSchema} />

      <section className="page-hero-shell surface-pad overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(320px,1.02fr)] lg:items-end">
          <div>
            <span className="brand-chip">{copy.chip}</span>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[0.94] text-slate-950 md:text-6xl">{caseItem.title}</h1>
            {caseItem.description ? <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{caseItem.description}</p> : null}

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#case-contact">
                <Button size="lg" className="rounded-full px-7">
                  {copy.cta}
                </Button>
              </a>
            </div>
          </div>

          {caseItem.image ? (
            <div className="page-aside-card p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_20px_50px_rgba(58,97,137,0.1)]">
                <div className="relative aspect-[16/10] w-full lg:aspect-[16/9]">
                  <Image src={caseItem.image} alt={caseItem.title} fill unoptimized className="object-cover" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <RichContent
        content={caseItem.content}
        title={caseItem.title}
        className="reading-shell editorial-prose mt-8 max-w-none"
      />

      {galleryImages.length > 0 ? <CaseGallery images={galleryImages} title={caseItem.title} locale={locale} /> : null}

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{copy.contactDescription}</p>
          </div>

          <div className="p-5 sm:p-8">
            <LazyContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = await getRequestLocale()
  const copy = casePageCopy[locale]
  const result = await getCaseBySlug(params.slug)
  const caseItem = result.caseItem ? localizeCaseRecord(result.caseItem, locale) : null
  const { isBuiltIn } = result

  if (!caseItem) {
    return {}
  }

  if (locale === 'en' && hasRussianCaseContent(caseItem)) {
    return {}
  }

  const baseCasePath = isBuiltIn && params.slug === botiqCase.slug ? botiqCase.url : `/cases/${params.slug}`
  const alternates = getLocaleAlternates(baseCasePath)
  const canonical = getFullUrl(prefixPathWithLocale(baseCasePath, locale))
  const ogImage =
    caseItem.image && !caseItem.image.startsWith('http') ? getFullUrl(caseItem.image) : caseItem.image || undefined
  const title = normalizeMetaTitle(caseItem.title, copy.metaTitleSuffix)
  const description = normalizeMetaDescription(caseItem.description, copy.metaDescriptionFallback)

  return {
    title,
    description,
    alternates: {
      ...alternates,
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}
