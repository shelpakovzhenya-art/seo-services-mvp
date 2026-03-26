import Image from 'next/image'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { buildLocalizedBlogListing } from '@/lib/blog-localization'
import { prisma } from '@/lib/prisma'
import { getReadingTimeLabel } from '@/lib/reading-time'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCollectionPageSchema, createItemListSchema } from '@/lib/structured-data'

const blogCopy: Record<Locale, any> = {
  ru: {
    chip: 'Блог',
    title: 'Материалы по SEO и развитию сайта',
    description:
      'Здесь материалы по миграциям, структуре услуг, GEO и AI-выдаче, коммерческим факторам и контентным решениям для сайта.',
    badges: ['Миграции, GEO и структура услуг', 'Разборы страниц, а не общая теория', 'Материалы, которые можно использовать в работе'],
    cardKicker: 'Статья',
    open: 'Открыть',
    noDate: 'Без даты',
    readingTimeFallback: '1 мин чтения',
    empty: 'Пока опубликованных статей нет.',
    collectionName: 'Блог о SEO и развитии сайта',
    collectionDescription:
      'Статьи о структуре сайта, миграциях, контенте, GEO, коммерческих страницах и SEO-решениях, которые можно применять в работе.',
    itemListName: 'Статьи блога Shelpakov Digital',
    metaTitle: 'Блог о SEO и развитии сайта | Shelpakov Digital',
    metaDescription:
      'Статьи о структуре сайта, миграциях, GEO, коммерческих факторах и контенте: с практическими выводами для бизнеса и команды сайта.',
    dateLocale: 'ru-RU',
  },
  en: {
    chip: 'Blog',
    title: 'Insights on SEO and website growth',
    description:
      'Articles on migrations, service-page structure, GEO and AI search, commercial signals, and content decisions for real websites.',
    badges: ['Migrations, GEO, and service-page structure', 'Page-level breakdowns, not generic theory', 'Materials a team can use in practice'],
    cardKicker: 'Article',
    open: 'Open',
    noDate: 'No date',
    readingTimeFallback: '1 min read',
    empty: 'No published articles yet.',
    collectionName: 'Blog on SEO and website growth',
    collectionDescription:
      'Articles on structure, migrations, content, GEO, commercial pages, and SEO decisions with practical takeaways for real teams.',
    itemListName: 'Shelpakov Digital blog articles',
    metaTitle: 'Blog on SEO and website growth | Shelpakov Digital',
    metaDescription:
      'Articles on site structure, migrations, GEO, commercial signals, and content with practical takeaways for growth and website teams.',
    dateLocale: 'en-US',
  },
}

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
}

function isInlineImage(src: string) {
  return src.startsWith('data:')
}

function getPostCover(post: { slug: string; coverImage?: string | null }) {
  return post.coverImage || getFallbackCover(post.slug)
}

export default async function BlogPage() {
  const locale = await getRequestLocale()
  const copy = blogCopy[locale]
  let posts: any[] = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Error loading blog page:', error)
  }

  posts = buildLocalizedBlogListing(posts, locale)

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Р“Р»Р°РІРЅР°СЏ' : 'Home', path: '/' },
    { name: copy.chip, path: '/blog' },
  ], { locale })
  const collectionSchema = createCollectionPageSchema({
    path: '/blog',
    name: copy.collectionName,
    description: copy.collectionDescription,
  }, { locale })
  const itemListSchema = createItemListSchema({
    path: '/blog',
    name: copy.itemListName,
    items: posts.map((post) => ({
      name: post.title,
      path: `/blog/${post.slug}`,
      description: post.excerpt || undefined,
    })),
  }, { locale })

  return (
    <div className="page-shell">
      <JsonLd id="blog-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="blog-collection-schema" data={collectionSchema} />
      <JsonLd id="blog-item-list-schema" data={itemListSchema} />

      <section className="surface-cosmos surface-pad">
        <div className="max-w-4xl">
          <span className="warm-chip">{copy.chip}</span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{copy.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
            {copy.badges.map((badge: string) => (
              <span key={badge} className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        {posts.length > 0 ? (
          <div className="uniform-grid-3">
            {posts.map((post) => {
              const cover = getPostCover(post)
              const readingTimeLabel = getReadingTimeLabel(post.content || post.excerpt || post.title, locale) || copy.readingTimeFallback

              return (
                <Link key={post.id} href={prefixPathWithLocale(`/blog/${post.slug}`, locale)} className="group block h-full">
                  <article className="uniform-card interactive-card reading-shell overflow-hidden p-0">
                    {cover ? (
                      <div className="relative h-52 w-full">
                        <Image src={cover} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-[1.02]" unoptimized={isInlineImage(cover)} />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">{copy.cardKicker}</div>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">{post.title}</h2>
                      {post.excerpt ? (
                        <p className="mt-3 flex-1 overflow-hidden text-sm leading-7 text-slate-600" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>
                          {post.excerpt}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                          <p>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(copy.dateLocale) : copy.noDate}</p>
                          <span aria-hidden="true">•</span>
                          <p>{readingTimeLabel}</p>
                        </div>
                        <span className="text-sm font-semibold text-sky-700 transition group-hover:text-sky-600">{copy.open}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="reading-shell text-center text-slate-500">{copy.empty}</div>
        )}
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = blogCopy[locale]
  const alternates = getLocaleAlternates('/blog')
  const title = copy.metaTitle
  const description = normalizeMetaDescription(null, copy.metaDescription)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
