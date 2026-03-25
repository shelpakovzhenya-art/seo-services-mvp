import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { demoteHtmlHeadings } from '@/lib/content-headings'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { containsCyrillic } from '@/lib/text-detection'

type PageProps = {
  params: {
    slug: string
  }
}

const dynamicPageCopy: Record<
  Locale,
  {
    fallbackTitle: string
    fallbackDescription: string
  }
> = {
  ru: {
    fallbackTitle: 'Страница Shelpakov Digital',
    fallbackDescription:
      'Страница Shelpakov Digital о SEO, структуре сайта и усилении проекта под рост органического трафика, доверия и заявок.',
  },
  en: {
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
  const page = await getPageBySlug(params.slug)

  if (!page || page.slug === 'home' || (locale === 'en' && pageHasRussianContent(page))) {
    notFound()
  }

  const pageContent = demoteHtmlHeadings(page.content)

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="break-words text-4xl font-semibold text-white md:text-6xl">{page.h1 || page.title}</h1>
        {page.description && <p className="mt-6 break-words text-lg leading-8 text-slate-300">{page.description}</p>}
        {pageContent && (
          <article
            className="prose prose-invert mt-10 max-w-none break-words prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        )}
      </div>
    </div>
  )
}
