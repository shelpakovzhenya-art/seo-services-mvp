import Image from 'next/image'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createCollectionPageSchema, createItemListSchema } from '@/lib/structured-data'

const blogCopy: Record<Locale, any> = {
  ru: {
    chip: 'Блог',
    title: 'Материалы по SEO и развитию сайта',
    description:
      'Публикую разборы по SEO, структуре сайта, коммерческим факторам и контенту, которые помогают принимать взвешенные решения по проекту.',
    badges: ['Разборы ошибок и точек роста', 'Материалы для владельца сайта', 'SEO + упаковка + конверсия'],
    routesKicker: 'Маршруты чтения',
    routesTitle: 'Не весь блог нужен всем подряд. Вот с чего логичнее начать под разную задачу.',
    routes: [
      {
        title: 'Если сайт устарел и плохо конвертирует',
        text: 'Начните с материала про требования к современному сайту для SEO и заявок. Он помогает увидеть, где слабость именно в конструкции сайта, а не в количестве трафика.',
        href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
      },
      {
        title: 'Если планируете переезд или большой редизайн',
        text: 'Сначала посмотрите материал про переезд на новый домен без потери трафика. Это лучший анти-commodity сценарий для тех, кто не хочет терять видимость из-за миграции.',
        href: '/blog/pereezd-na-novyy-domen-bez-poteri-trafika',
      },
      {
        title: 'Если хотите понять новый слой GEO и AI-выдачи',
        text: 'Откройте материалы про GEO и AI search. Они полезны тем, кто уже думает не только про классическую органику, но и про новый формат ответа в выдаче.',
        href: '/blog/geo-i-ii-vydacha-kak-poluchat-trafik-v-2026',
      },
    ],
    cardKicker: 'Статья',
    open: 'Открыть',
    noDate: 'Без даты',
    empty: 'Пока опубликованных статей нет.',
    collectionName: 'Блог о SEO и развитии сайта',
    collectionDescription:
      'Экспертные статьи о SEO, структуре сайта, контенте, коммерческих факторах и росте заявок с понятными выводами для бизнеса.',
    itemListName: 'Статьи блога Shelpakov Digital',
    metaTitle: 'Блог о SEO и развитии сайта | Shelpakov Digital',
    metaDescription:
      'Экспертные статьи о SEO, структуре сайта, коммерческих факторах и контенте: с практическими выводами для бизнеса, маркетинга и роста заявок.',
    dateLocale: 'ru-RU',
  },
  en: {
    chip: 'Blog',
    title: 'Insights on SEO and website growth',
    description:
      'I publish practical breakdowns on SEO, website structure, commercial signals, and content that help teams make better decisions about growth.',
    badges: ['Breakdowns of mistakes and growth levers', 'Materials for website owners and teams', 'SEO + positioning + conversion'],
    routesKicker: 'Reading paths',
    routesTitle: 'Not every article is relevant to every visitor. Here is the fastest starting point for different situations.',
    routes: [
      {
        title: 'If the website feels outdated and under-converts',
        text: 'Start with the article on what a modern site needs for SEO and lead generation. It helps separate weak architecture from weak traffic.',
        href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
      },
      {
        title: 'If a migration or major redesign is coming',
        text: 'Open the domain migration article first. It is the most useful anti-commodity route for teams that do not want to lose visibility during a move.',
        href: '/blog/pereezd-na-novyy-domen-bez-poteri-trafika',
      },
      {
        title: 'If you want to understand GEO and AI search',
        text: 'Read the GEO and AI-search pieces. They are useful when the team is already thinking beyond classic blue-link SEO.',
        href: '/blog/geo-i-ii-vydacha-kak-poluchat-trafik-v-2026',
      },
    ],
    cardKicker: 'Article',
    open: 'Open',
    noDate: 'No date',
    empty: 'No published articles yet.',
    collectionName: 'Blog on SEO and website growth',
    collectionDescription:
      'Expert articles on SEO, site structure, content, commercial signals, and lead growth with practical business takeaways.',
    itemListName: 'Shelpakov Digital blog articles',
    metaTitle: 'Blog on SEO and website growth | Shelpakov Digital',
    metaDescription:
      'Expert articles on SEO, site structure, commercial signals, and content with practical takeaways for growth, marketing, and lead generation.',
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

  const collectionSchema = createCollectionPageSchema({
    path: '/blog',
    name: copy.collectionName,
    description: copy.collectionDescription,
  })
  const itemListSchema = createItemListSchema({
    path: '/blog',
    name: copy.itemListName,
    items: posts.map((post) => ({
      name: post.title,
      path: `/blog/${post.slug}`,
      description: post.excerpt || undefined,
    })),
  })

  return (
    <div className="page-shell">
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
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.routesKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.routesTitle}</h2>
            </div>
          </div>

          <div className="uniform-grid-3 mt-6 gap-4">
            {copy.routes.map((route: any) => (
              <Link key={route.title} href={prefixPathWithLocale(route.href, locale)} className="uniform-card glass-panel interactive-card p-6">
                <h3 className="text-2xl font-semibold text-slate-950">{route.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{route.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  {copy.open}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="uniform-grid-3">
            {posts.map((post) => {
              const cover = getPostCover(post)

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
                        <p className="text-sm text-slate-400">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(copy.dateLocale) : copy.noDate}
                        </p>
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
