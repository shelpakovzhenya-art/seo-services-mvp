import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription } from '@/lib/seo-meta'

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
  let posts: any[] = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Error loading blog page:', error)
    posts = []
  }

  return (
    <div className="page-shell">
      <section className="surface-cosmos surface-pad">
        <div className="max-w-4xl">
          <span className="warm-chip">Блог</span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Материалы по SEO и развитию сайта</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Публикую разборы по SEO, структуре сайта, коммерческим факторам и контенту, которые помогают принимать
            взвешенные решения по проекту.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">Разборы ошибок и точек роста</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">Материалы для владельца сайта</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">SEO + упаковка + конверсия</span>
          </div>
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        {posts.length > 0 ? (
          <div className="uniform-grid-3">
            {posts.map((post) => {
              const cover = getPostCover(post)

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="uniform-card interactive-card reading-shell overflow-hidden p-0">
                    {cover ? (
                      <div className="relative h-52 w-full">
                        <Image
                          src={cover}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          unoptimized={isInlineImage(cover)}
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">Статья</div>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">{post.title}</h2>
                      {post.excerpt ? (
                        <p
                          className="mt-3 flex-1 text-sm leading-7 text-slate-600"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {post.excerpt}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : 'Без даты'}
                        </p>
                        <span className="text-sm font-semibold text-sky-700 transition group-hover:text-sky-600">Открыть</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="reading-shell text-center text-slate-500">Пока опубликованных статей нет.</div>
        )}
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const { getFullUrl } = await import('@/lib/site-url')
  const blogUrl = getFullUrl('/blog')
  const title = 'Блог о SEO и развитии сайта | Shelpakov Digital'
  const description = normalizeMetaDescription(
    null,
    'Экспертные статьи о SEO, структуре сайта, коммерческих факторах и контенте: с практическими выводами для бизнеса, маркетинга и роста заявок.'
  )

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title,
      description,
      url: blogUrl,
      type: 'website',
    },
  }
}
