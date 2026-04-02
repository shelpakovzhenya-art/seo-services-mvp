import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BrandPageHero from '@/components/BrandPageHero'
import JsonLd from '@/components/JsonLd'
import { demoteHtmlHeadings } from '@/lib/content-headings'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { containsCyrillic } from '@/lib/text-detection'

type PageProps = {
  params: {
    slug: string
  }
}

const dynamicPageCopy: Record<
  Locale,
  {
    home: string
    fallbackTitle: string
    fallbackDescription: string
  }
> = {
  ru: {
    home: 'Главная',
    fallbackTitle: 'Страница Shelpakov Digital',
    fallbackDescription:
      'Страница Shelpakov Digital о SEO, структуре сайта и усилении проекта под рост органического трафика, доверия и заявок.',
  },
  en: {
    home: 'Home',
    fallbackTitle: 'Shelpakov Digital page',
    fallbackDescription:
      'A Shelpakov Digital page about SEO, site structure, and practical website improvements for organic growth and leads.',
  },
}

async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
  })
}

function pageHasRussianContent(page: Awaited<ReturnType<typeof getPageBySlug>>) {
  if (!page) {
    return false
  }

  return [page.title, page.description, page.h1, page.content, page.keywords].some((value) => containsCyrillic(value))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getRequestLocale()
  const copy = dynamicPageCopy[locale]
  const page = await getPageBySlug(params.slug)

  if (!page || page.slug === 'home' || (locale === 'en' && pageHasRussianContent(page))) {
    return {}
  }

  const title = normalizeMetaTitle(page.title, `${page.h1 || page.title} | ${copy.fallbackTitle}`)
  const description = normalizeMetaDescription(page.description, copy.fallbackDescription)
  const alternates = getLocaleAlternates(`/${page.slug}`)
  const canonical = getFullUrl(prefixPathWithLocale(`/${page.slug}`, locale))

  return {
    title: { absolute: title },
    description,
    keywords: page.keywords
      ? page.keywords.split(',').map((item) => item.trim()).filter(Boolean)
      : undefined,
    alternates: {
      ...alternates,
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const locale = await getRequestLocale()
  const copy = dynamicPageCopy[locale]
  const page = await getPageBySlug(params.slug)

  if (!page || page.slug === 'home' || (locale === 'en' && pageHasRussianContent(page))) {
    notFound()
  }

  const pageContent = demoteHtmlHeadings(page.content)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: copy.home, path: '/' },
    { name: page.h1 || page.title, path: `/${page.slug}` },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id={`page-breadcrumbs-schema-${page.slug}`} data={breadcrumbSchema} />

      <BrandPageHero
        eyebrow={locale === 'ru' ? 'Экспертная страница' : 'Expert page'}
        title={page.h1 || page.title}
        description={page.description}
        actions={
          <Link href={prefixPathWithLocale('/contacts#contact-form', locale)} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
            {locale === 'ru' ? 'Обсудить задачу' : 'Discuss the task'}
          </Link>
        }
        aside={
          <div className="page-aside-card">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{locale === 'ru' ? 'Формат страницы' : 'Page format'}</div>
            <div className="mt-4 space-y-3">
              <div className="brand-list-item text-sm">
                <span>{locale === 'ru' ? 'Эта страница встроена в общую экспертную систему сайта и должна помогать принять следующий шаг.' : 'This page is part of the site-wide expert system and should support the next rational step.'}</span>
              </div>
              <div className="brand-list-item text-sm">
                <span>{locale === 'ru' ? 'Контент здесь может работать как посадочная, отраслевой материал или дополнительное объяснение услуги.' : 'The content here can work as a landing page, industry page, or a supporting explanation around a service.'}</span>
              </div>
            </div>
          </div>
        }
      />

      {pageContent && (
        <article
          className="editorial-prose reading-shell mt-8 max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: pageContent }}
        />
      )}
    </div>
  )
}
