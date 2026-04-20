import Image from 'next/image'
import Link from 'next/link'
import BrandPageHero from '@/components/BrandPageHero'
import JsonLd from '@/components/JsonLd'
import { buildLocalizedBlogListing } from '@/lib/blog-localization'
import { getBlogCover, isInlineImageAsset } from '@/lib/content-covers'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getReadingTimeLabel } from '@/lib/reading-time'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCollectionPageSchema, createItemListSchema } from '@/lib/structured-data'

type BlogCategoryKey = 'all' | 'seo' | 'reputation' | 'leads' | 'development' | 'branding' | 'digital' | 'marketplaces'

type BlogPostCategory = Exclude<BlogCategoryKey, 'all'>

type BlogPageProps = {
  searchParams?: {
    category?: string
  }
}

const categoryBySlug: Record<string, BlogPostCategory> = {
  'canonical-ili-301-redirekt-kak-vybrat-dlya-seo': 'seo',
  '301-redirekt-s-domena-na-domen-checklist-bez-poter': 'seo',
  'oshibka-401-unauthorized-vliyanie-na-indeksaciyu-i-seo': 'seo',
  'bitye-ssylki-na-saite-kak-naiti-i-ustranit-bez-haosa': 'seo',
  'chto-vliyaet-na-skorost-saita-i-kak-uskorit-kommercheskie-stranicy': 'seo',
  'meta-tegi-title-description-h1-praktika-dlya-uslug': 'seo',
  'seo-dlya-media-i-ekspertnogo-bloga-kak-rasti-bez-vody': 'digital',
  'kak-podgotovit-sait-k-redizainu-i-razrabotke-bez-prosadki-seo': 'development',
  'kachestvo-lidov-iz-seo-pochemu-vazhnee-obema-trafika': 'leads',
  'reputaciya-i-seo-kak-otzyvy-vliyayut-na-vidimost-i-zayavki': 'reputation',
  'geo-i-ii-vydacha-kak-poluchat-trafik-v-2026': 'seo',
  'seo-trendy-2026-chto-rabotaet-segodnya': 'seo',
  'kak-izmerit-effektivnost-seo-i-ai-trafika': 'leads',
  'kak-podgotovit-sait-k-geo-i-ii-vydache': 'seo',
  'seo-dlya-brand-media-kak-izmerit-polzu': 'digital',
  'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': 'development',
  'pereezd-na-novyy-domen-bez-poteri-trafika': 'development',
}

const blogCategories: Record<Locale, Array<{ key: BlogCategoryKey; label: string }>> = {
  ru: [
    { key: 'all', label: 'Все статьи' },
    { key: 'seo', label: 'SEO' },
    { key: 'reputation', label: 'Репутация' },
    { key: 'leads', label: 'Лидогенерация' },
    { key: 'development', label: 'Разработка сайта' },
    { key: 'branding', label: 'Брендинг' },
    { key: 'digital', label: 'Digital' },
    { key: 'marketplaces', label: 'Маркетплейсы' },
  ],
  en: [
    { key: 'all', label: 'All articles' },
    { key: 'seo', label: 'SEO' },
    { key: 'reputation', label: 'Reputation' },
    { key: 'leads', label: 'Lead generation' },
    { key: 'development', label: 'Website development' },
    { key: 'branding', label: 'Branding' },
    { key: 'digital', label: 'Digital' },
    { key: 'marketplaces', label: 'Marketplaces' },
  ],
}

function getPostCategory(slug?: string | null): BlogPostCategory {
  if (!slug) {
    return 'seo'
  }

  return categoryBySlug[slug] || 'seo'
}

const blogCopy: Record<Locale, any> = {
  ru: {
    chip: 'Блог',
    title: 'Материалы по SEO и развитию сайта',
    description:
      'Здесь материалы по миграциям, структуре услуг, GEO и AI-выдаче, коммерческим факторам и контентным решениям для сайта.',
    badges: ['Миграции, GEO и структура услуг', 'Разборы страниц, а не общая теория', 'Материалы, которые можно использовать в работе'],
    announcementsKicker: 'Анонсы',
    announcementsTitle: 'Свежие материалы в блоге',
    announcementsDescription:
      'Короткие анонсы последних публикаций: по клику открывается полный разбор с практическими шагами.',
    announcementsFallback:
      'Короткий анонс пока не добавлен. Откройте материал, чтобы посмотреть полный разбор и рекомендации.',
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
    badges: ['Migrations, GEO, and service-page structure', 'Page-level breakdowns, not generic theory', 'Materials that are useful in practice'],
    announcementsKicker: 'Announcements',
    announcementsTitle: 'Latest blog updates',
    announcementsDescription:
      'Short previews of the newest articles. Open any card to read the full breakdown and implementation notes.',
    announcementsFallback:
      'Preview text is not available yet. Open the article to view the full explanation and practical guidance.',
    cardKicker: 'Article',
    open: 'Open',
    noDate: 'No date',
    readingTimeFallback: '1 min read',
    empty: 'No published articles yet.',
    collectionName: 'Blog on SEO and website growth',
    collectionDescription:
      'Articles on structure, migrations, content, GEO, commercial pages, and SEO decisions with practical takeaways for real projects.',
    itemListName: 'Shelpakov Digital blog articles',
    metaTitle: 'Blog on SEO and website growth | Shelpakov Digital',
    metaDescription:
      'Articles on site structure, migrations, GEO, commercial signals, and content with practical takeaways for growth-focused businesses.',
    dateLocale: 'en-US',
  },
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = await getRequestLocale()
  const copy = blogCopy[locale]
  const categories = blogCategories[locale]
  const requestedCategory = typeof searchParams?.category === 'string' ? searchParams.category.toLowerCase() : 'all'
  const categoryKeys = new Set(categories.map((category) => category.key))
  const activeCategory: BlogCategoryKey = categoryKeys.has(requestedCategory as BlogCategoryKey)
    ? (requestedCategory as BlogCategoryKey)
    : 'all'
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
  const visiblePosts =
    activeCategory === 'all' ? posts : posts.filter((post) => getPostCategory(post.slug) === activeCategory)
  const announcementPosts = visiblePosts.slice(0, 3)

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
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
    items: visiblePosts.map((post) => ({
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

      <BrandPageHero
        eyebrow={copy.chip}
        title={copy.title}
        description={copy.description}
        badges={copy.badges}
        aside={
          <>
            <div className="page-aside-card">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{locale === 'ru' ? 'Формат материалов' : 'Format'}</div>
              <div className="mt-4 space-y-3">
                <div className="brand-list-item text-sm">
                  <span>{locale === 'ru' ? 'Практические разборы, а не поток общих SEO-советов.' : 'Practical breakdowns rather than generic SEO commentary.'}</span>
                </div>
                <div className="brand-list-item text-sm">
                  <span>{locale === 'ru' ? 'Материалы связаны с услугами, кейсами и реальной методологией работы.' : 'Each article connects to services, case work, and the actual delivery methodology.'}</span>
                </div>
              </div>
            </div>
            <div className="page-aside-card--dark">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d5b08d]">{locale === 'ru' ? 'Опубликовано' : 'Published'}</div>
              <div className="mt-3 text-3xl font-semibold text-white">{visiblePosts.length}</div>
              <p className="mt-2 text-sm leading-7 text-slate-300">{locale === 'ru' ? 'Блог поддерживает экспертный слой сайта и помогает клиенту понять подход до заявки.' : 'The blog supports the site’s expert layer and helps visitors understand the approach before inquiry.'}</p>
            </div>
          </>
        }
      />

      <section className="mt-8 surface-grid surface-pad">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => {
            const href =
              category.key === 'all'
                ? prefixPathWithLocale('/blog', locale)
                : `${prefixPathWithLocale('/blog', locale)}?category=${category.key}`
            const isActive = category.key === activeCategory

            return (
              <Link
                key={category.key}
                href={href}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {category.label}
              </Link>
            )
          })}
        </div>

        {announcementPosts.length > 0 ? (
          <div className="mb-8 rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-slate-50/55 to-white p-5 md:p-7">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.announcementsKicker}</div>
                <h2 className="mt-2 text-[clamp(1.45rem,2.6vw,2rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950">
                  {copy.announcementsTitle}
                </h2>
              </div>
              <p className="text-sm leading-7 text-slate-600 lg:text-right">{copy.announcementsDescription}</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {announcementPosts.map((post) => {
                const cover = getBlogCover(post)

                return (
                  <Link
                    key={`announcement-${post.slug || post.id}`}
                    href={prefixPathWithLocale(`/blog/${post.slug}`, locale)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-900/20 hover:shadow-[0_20px_42px_rgba(15,23,42,0.1)]"
                  >
                    {cover ? (
                      <div className="relative h-32 w-full border-b border-slate-100 bg-slate-100">
                        <Image
                          src={cover}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          unoptimized={isInlineImageAsset(cover)}
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-4">
                      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.announcementsKicker}</div>
                      <h3 className="mt-2 text-base font-semibold leading-tight text-slate-950">{post.title}</h3>
                      <p
                        className="mt-2 flex-1 text-sm leading-6 text-slate-600"
                        style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {post.excerpt || copy.announcementsFallback}
                      </p>
                      <span className="mt-4 text-sm font-semibold text-[#8a5630] transition group-hover:text-slate-950">{copy.open}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}

        {visiblePosts.length > 0 ? (
          <div className="uniform-grid-3">
            {visiblePosts.map((post) => {
              const cover = getBlogCover(post)
              const readingTimeLabel = getReadingTimeLabel(post.content || post.excerpt || post.title, locale) || copy.readingTimeFallback
              const postCategory = categories.find((category) => category.key === getPostCategory(post.slug))

              return (
                <Link key={post.id} href={prefixPathWithLocale(`/blog/${post.slug}`, locale)} className="group block h-full">
                  <article className="uniform-card brand-link-card interactive-card overflow-hidden p-0">
                    {cover ? (
                      <div className="relative h-52 w-full">
                        <Image
                          src={cover}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          unoptimized={isInlineImageAsset(cover)}
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                        {postCategory?.label || copy.cardKicker}
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">{post.title}</h2>
                      {post.excerpt ? (
                        <p className="mt-3 flex-1 overflow-hidden text-sm leading-7 text-slate-600" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
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
                        <span className="text-sm font-semibold text-[#8a5630] transition group-hover:text-slate-950">{copy.open}</span>
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
  const alternates = getLocaleAlternates('/blog', locale)
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
