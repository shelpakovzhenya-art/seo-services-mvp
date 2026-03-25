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
