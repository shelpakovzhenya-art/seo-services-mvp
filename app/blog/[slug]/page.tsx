import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import RichContent from '@/components/RichContent'
import { getBuiltInBlogPostBySlug, hydrateBlogPostRecord, isPlaceholderBlogPost } from '@/lib/built-in-blog-posts'
import { hasRussianBlogContent, localizeBlogPostRecord } from '@/lib/blog-localization'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getReadingTimeLabel } from '@/lib/reading-time'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getServicePageForLocale } from '@/lib/service-page-localization'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBlogPostingSchema, createBreadcrumbSchema } from '@/lib/structured-data'
import { getArticleTrustCopy, getEditorialTeam, getTrustLinks } from '@/lib/trust-content'

type BlogPostRecord = {
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  content?: string | null
  coverImage?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
}

type RelatedService = {
  href: string
  label: string
  description: string
}

const blogPostCopy: Record<
  Locale,
  {
    home: string
    blog: string
    authorPrefix: string
    topic: string
    servicesLink: string
    relatedServicesKicker: string
    relatedServicesTitle: string
    relatedServicesDescription: string
    openService: string
    metaNotFound: string
    metaTitleSuffix: string
    metaDescriptionFallback: string
    dateLocale: string
    relatedServiceFallback: string
    publishedLabel: string
    updatedLabel: string
  }
> = {
  ru: {
    home: 'Главная',
    blog: 'Блог',
    authorPrefix: 'Подготовлено:',
    topic: 'Тема: SEO, структура сайта и коммерческие страницы',
    servicesLink: 'Перейти к услугам',
    relatedServicesKicker: 'Связанные услуги',
    relatedServicesTitle: 'Что логично открыть после этой статьи',
    relatedServicesDescription:
      'Если хотите перейти от чтения к внедрению, начните с этих страниц. Они продолжают тему статьи уже в формате конкретной работы по сайту.',
    openService: 'Перейти к услуге',
    metaNotFound: 'Статья не найдена | Shelpakov Digital',
    metaTitleSuffix: 'Статья Shelpakov Digital',
    metaDescriptionFallback:
      'Материал Shelpakov Digital о SEO, структуре сайта, коммерческих страницах и росте заявок.',
    dateLocale: 'ru-RU',
    relatedServiceFallback: 'Откройте страницу услуги, чтобы перейти от чтения к внедрению.',
    publishedLabel: 'Опубликовано',
    updatedLabel: 'Обновлено',
  },
  en: {
    home: 'Home',
    blog: 'Blog',
    authorPrefix: 'Prepared by:',
    topic: 'Topic: SEO, site structure, and commercial pages',
    servicesLink: 'Browse services',
    relatedServicesKicker: 'Related services',
    relatedServicesTitle: 'What to open after this article',
    relatedServicesDescription:
      'If you want to move from reading to implementation, start with these pages. They continue the topic in a more concrete, service-oriented format.',
    openService: 'Open service',
    metaNotFound: 'Article not found | Shelpakov Digital',
    metaTitleSuffix: 'Shelpakov Digital article',
    metaDescriptionFallback:
      'A Shelpakov Digital article on SEO, site structure, commercial pages, and lead growth.',
    dateLocale: 'en-US',
    relatedServiceFallback: 'Open the service page to move from reading to implementation.',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
  },
}

const relatedServiceMap: Record<string, string[]> = {
  'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': ['seo-audit', 'technical-seo', 'website-development'],
  'kak-podgotovit-sait-k-geo-i-ii-vydache': ['seo', 'seo-content', 'seo-audit'],
  'seo-dlya-brand-media-kak-izmerit-polzu': ['seo-content', 'seo-consulting', 'b2b-seo'],
  'pereezd-na-novyy-domen-bez-poteri-trafika': ['technical-seo', 'seo-audit', 'website-development'],
  'geo-i-ii-vydacha-kak-poluchat-trafik-v-2026': ['seo', 'seo-content', 'seo-audit'],
  'seo-trendy-2026-chto-rabotaet-segodnya': ['seo', 'b2b-seo', 'technical-seo'],
  'kak-izmerit-effektivnost-seo-i-ai-trafika': ['seo-consulting', 'seo-audit', 'b2b-seo'],
}

const defaultRelatedServiceSlugs = ['seo', 'seo-audit', 'seo-content']

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
}

function isInlineImage(src: string) {
  return src.startsWith('data:')
}

function getRelatedServices(slug: string, locale: Locale): RelatedService[] {
  const serviceSlugs = relatedServiceMap[slug] || defaultRelatedServiceSlugs
  const copy = blogPostCopy[locale]

  return serviceSlugs.map((serviceSlug) => {
    const service = getServicePageForLocale(serviceSlug, locale)

    return {
      href: prefixPathWithLocale(`/services/${serviceSlug}`, locale),
      label: service?.shortName || service?.h1 || serviceSlug,
      description: service?.intro || copy.relatedServiceFallback,
    }
  })
}

async function getBlogPostBySlug(slug: string, locale: Locale): Promise<BlogPostRecord | null> {
  try {
    const dbPost = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    })

    if (dbPost && !isPlaceholderBlogPost(dbPost)) {
      const localizedPost = localizeBlogPostRecord(hydrateBlogPostRecord(dbPost), locale)
      return locale === 'en' && hasRussianBlogContent(localizedPost) ? null : localizedPost
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
  }

  const builtInPost = getBuiltInBlogPostBySlug(slug)
  if (!builtInPost || isPlaceholderBlogPost(builtInPost)) {
    return null
  }

  const localizedPost = localizeBlogPostRecord(builtInPost, locale)
  return locale === 'en' && hasRussianBlogContent(localizedPost) ? null : localizedPost
}

function formatDate(value: Date | string | null | undefined, locale: string) {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function hasMeaningfulUpdate(publishedAt?: Date | string | null, updatedAt?: Date | string | null) {
  if (!publishedAt || !updatedAt) {
    return false
  }

  return new Date(publishedAt).toISOString().slice(0, 10) !== new Date(updatedAt).toISOString().slice(0, 10)
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const locale = await getRequestLocale()
  const copy = blogPostCopy[locale]
  const post = await getBlogPostBySlug(params.slug, locale)

  if (!post || !post.title || !post.content || !post.slug) {
    notFound()
  }

  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const content = stripLeadingMarkdownH1(post.content, post.title)
  const readingTimeLabel = getReadingTimeLabel(post.content, locale)
  const relatedServices = getRelatedServices(post.slug, locale)
  const team = getEditorialTeam(locale)
  const trustCopy = getArticleTrustCopy(locale)
  const trustLinks = getTrustLinks(locale).links
  const localizedPostPath = prefixPathWithLocale(`/blog/${post.slug}`, locale)
  const articleDescription = normalizeMetaDescription(post.excerpt, copy.metaDescriptionFallback)
  const publishedDate = formatDate(post.publishedAt, copy.dateLocale)
  const updatedDate = formatDate(post.updatedAt, copy.dateLocale)
  const showUpdatedDate = hasMeaningfulUpdate(post.publishedAt, post.updatedAt)
  const articleSchema = createBlogPostingSchema({
    slug: post.slug,
    path: localizedPostPath,
    locale,
    title: post.title,
    description: articleDescription,
    coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    relatedServices,
  })
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: copy.home, path: prefixPathWithLocale('/', locale) },
      { name: copy.blog, path: prefixPathWithLocale('/blog', locale) },
      { name: post.title, path: localizedPostPath },
    ],
    { locale }
  )

  return (
    <article className="page-shell max-w-5xl">
      <JsonLd id={`blog-post-schema-${post.slug}`} data={articleSchema} />
      <JsonLd id={`blog-breadcrumbs-schema-${post.slug}`} data={breadcrumbSchema} />

      <header className="surface-cosmos surface-pad overflow-hidden">
        <div className="max-w-3xl">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300/85">
            <Link href={prefixPathWithLocale('/', locale)} className="transition hover:text-white">
              {copy.home}
            </Link>
            <span>/</span>
            <Link href={prefixPathWithLocale('/blog', locale)} className="transition hover:text-white">
              {copy.blog}
            </Link>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            {publishedDate ? <p>{publishedDate}</p> : null}
            {publishedDate ? <span aria-hidden="true">•</span> : null}
            <p>{readingTimeLabel}</p>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">{post.title}</h1>
          {post.excerpt ? <p className="mt-5 text-lg leading-8 text-slate-300">{post.excerpt}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">{`${copy.authorPrefix} ${team.name}`}</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">{copy.topic}</span>
            {showUpdatedDate && updatedDate ? (
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">{`${copy.updatedLabel}: ${updatedDate}`}</span>
            ) : null}
            <Link
              href={prefixPathWithLocale('/services', locale)}
              className="rounded-full border border-cyan-300/24 bg-cyan-400/10 px-4 py-2 transition hover:border-cyan-200/50 hover:text-white"
            >
              {copy.servicesLink}
            </Link>
          </div>
        </div>

        {coverImage ? (
          <div className="relative mt-8 overflow-hidden rounded-[30px] border border-white/12 bg-white/8 shadow-[0_24px_60px_rgba(2,8,23,0.28)]">
            <div className="relative aspect-[16/9] w-full">
              <Image src={coverImage} alt={post.title} fill className="object-cover" unoptimized={isInlineImage(coverImage)} />
            </div>
          </div>
        ) : null}
      </header>

      <section className="mt-8 reading-shell">
        <div className="editorial-prose max-w-none">
          <RichContent content={content} />
        </div>

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-700">{trustCopy.kicker}</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 md:text-3xl">{trustCopy.title}</h2>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
            {publishedDate ? <span>{`${copy.publishedLabel}: ${publishedDate}`}</span> : null}
            {showUpdatedDate && updatedDate ? <span>{`${copy.updatedLabel}: ${updatedDate}`}</span> : null}
          </div>

          <div className="mt-6 rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
            <p className="text-lg font-semibold text-slate-950">{team.name}</p>
            <p className="mt-2 text-sm font-medium text-sky-800">{team.role}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{team.summary}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-950">{trustCopy.evidenceTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {team.trustPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-7 text-slate-600">{trustCopy.methodologyNote}</p>
            </div>

            <div className="grid gap-3">
              {trustLinks.map((item) => (
                <Link
                  key={item.href}
                  href={prefixPathWithLocale(item.href, locale)}
                  className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition hover:border-cyan-200 hover:bg-slate-50"
                >
                  <p className="text-base font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </Link>
              ))}
              <Link
                href={prefixPathWithLocale('/contacts', locale)}
                className="rounded-[22px] border border-cyan-200 bg-cyan-50 px-4 py-4 text-sky-900 transition hover:border-cyan-300 hover:bg-cyan-100/70"
              >
                <p className="text-base font-semibold">{team.contactLabel}</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-orange-100 bg-[linear-gradient(180deg,#fffaf5,#f7fbff)] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-700">{copy.relatedServicesKicker}</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 md:text-3xl">{copy.relatedServicesTitle}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{copy.relatedServicesDescription}</p>

          <div className="uniform-grid-3 mt-6 gap-3">
            {relatedServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="uniform-card group rounded-[22px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
              >
                <p className="text-lg font-semibold text-slate-950 transition-colors duration-200 group-hover:text-sky-700">
                  {service.label}
                </p>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{service.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-sky-700">{copy.openService}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const locale = await getRequestLocale()
  const copy = blogPostCopy[locale]
  const post = await getBlogPostBySlug(params.slug, locale)

  if (!post || !post.title || !post.slug) {
    return {
      title: copy.metaNotFound,
    }
  }

  const alternates = getLocaleAlternates(`/blog/${params.slug}`)
  const postUrl = getFullUrl(prefixPathWithLocale(`/blog/${params.slug}`, locale))
  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const metaTitle = normalizeMetaTitle(post.title, copy.metaTitleSuffix)
  const metaDescription = normalizeMetaDescription(post.excerpt, copy.metaDescriptionFallback)

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      ...alternates,
      canonical: postUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      images: coverImage ? [getFullUrl(coverImage)] : [],
    },
  }
}
