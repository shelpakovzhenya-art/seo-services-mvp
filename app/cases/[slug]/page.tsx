import Image from 'next/image'
import { notFound } from 'next/navigation'
import CaseGallery from '@/components/cases/CaseGallery'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import { botiqCase, getBuiltInCaseBySlug, hydrateBotiqCaseRecord } from '@/lib/botiq-case'
import { parseCaseGallery } from '@/lib/case-gallery'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { prisma } from '@/lib/prisma'
import { getFullUrl } from '@/lib/site-url'
import { createBreadcrumbSchema, createCaseArticleSchema } from '@/lib/structured-data'

type CaseRecord = {
  slug?: string | null
  title: string
  description?: string | null
  content?: string | null
  image?: string | null
  resultImages?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
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
  const { caseItem, isBuiltIn } = await getCaseBySlug(params.slug)

  if (!caseItem) {
    notFound()
  }

  const galleryImages = parseCaseGallery(caseItem.resultImages)
  const casePath = isBuiltIn && params.slug === botiqCase.slug ? botiqCase.url : `/cases/${params.slug}`
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Главная', path: '/' },
    { name: 'Кейсы', path: '/cases' },
    { name: caseItem.title, path: casePath },
  ])
  const caseArticleSchema = createCaseArticleSchema({
    path: casePath,
    title: caseItem.title,
    description:
      caseItem.description ||
      'Кейс по SEO-аудиту, структуре сайта и поэтапному усилению ключевых страниц под рост видимости и заявок.',
    image: caseItem.image,
    publishedAt: isBuiltIn && params.slug === botiqCase.slug ? botiqCase.publishedAt : caseItem.createdAt,
    updatedAt: isBuiltIn && params.slug === botiqCase.slug ? botiqCase.updatedAt : caseItem.updatedAt,
    about: isBuiltIn && params.slug === botiqCase.slug ? botiqCase.about : ['SEO-аудит', 'Структура сайта', 'Техническое SEO'],
  })

  return (
    <div className="page-shell">
      <JsonLd id={`case-breadcrumbs-${params.slug}`} data={breadcrumbSchema} />
      <JsonLd id={`case-article-${params.slug}`} data={caseArticleSchema} />

      <section className="soft-section surface-pad overflow-hidden">
        <span className="warm-chip">Кейс</span>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold text-slate-950 md:text-6xl">{caseItem.title}</h1>
        {caseItem.description ? (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{caseItem.description}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#case-contact">
            <Button size="lg" className="rounded-full px-7">
              Обсудить похожий проект
            </Button>
          </a>
        </div>

        {caseItem.image ? (
          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_50px_rgba(58,97,137,0.12)]">
            <div className="relative aspect-[16/9] w-full">
              <Image src={caseItem.image} alt={caseItem.title} fill unoptimized className="object-cover" />
            </div>
          </div>
        ) : null}
      </section>

      <RichContent
        content={caseItem.content}
        title={caseItem.title}
        className="reading-shell editorial-prose mt-8 max-w-none"
      />

      {galleryImages.length > 0 ? <CaseGallery images={galleryImages} title={caseItem.title} /> : null}

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
            <span className="warm-chip">Обсудить проект</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
              Нужен похожий кейс для вашего сайта?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Разберу задачу, покажу точки роста и подскажу, с чего логично начать, чтобы SEO и структура сайта
              работали на заявки.
            </p>
          </div>

          <div className="p-8">
            <LazyContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { caseItem, isBuiltIn } = await getCaseBySlug(params.slug)

  if (!caseItem) {
    return {}
  }

  const url = getFullUrl(isBuiltIn && params.slug === botiqCase.slug ? botiqCase.url : `/cases/${params.slug}`)
  const ogImage =
    caseItem.image && !caseItem.image.startsWith('http') ? getFullUrl(caseItem.image) : caseItem.image || undefined
  const title = normalizeMetaTitle(caseItem.title, 'SEO-кейс')
  const description = normalizeMetaDescription(
    caseItem.description,
    'Кейс Shelpakov Digital по SEO, структуре сайта и росту заявок с понятной стратегией, внедрением ключевых правок и акцентом на коммерческий результат.'
  )

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}
