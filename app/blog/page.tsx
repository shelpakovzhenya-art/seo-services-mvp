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

  const [featuredPost, ...secondaryPosts] = posts

  return (
    <div className="page-shell">
      <section className="surface-cosmos p-8 md:p-10">
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

      {featuredPost ? (
        <section className="mt-10 surface-grid p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article className="interactive-card reading-shell flex h-full flex-col overflow-hidden p-0">
                {getPostCover(featuredPost) ? (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={getPostCover(featuredPost)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      unoptimized={isInlineImage(getPostCover(featuredPost))}
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">Главная статья</div>
                  <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt ? (
                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{featuredPost.excerpt}</p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <p className="text-sm text-slate-400">
                      {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('ru-RU') : 'Без даты'}
                    </p>
                    <span className="text-sm font-semibold text-sky-700 transition group-hover:text-sky-600">Читать материал</span>
                  </div>
                </div>
              </article>
            </Link>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
              {secondaryPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="interactive-card reading-shell flex h-full flex-col overflow-hidden p-0">
                    {getPostCover(post) ? (
                      <div className="relative h-52 w-full">
                        <Image
                          src={getPostCover(post)}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                          unoptimized={isInlineImage(getPostCover(post))}
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">Статья</div>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">{post.title}</h2>
                      {post.excerpt ? <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.excerpt}</p> : null}
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : 'Без даты'}
                        </p>
                        <span className="text-sm font-semibold text-sky-700 transition group-hover:text-sky-600">Открыть</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {secondaryPosts.length > 3 ? (
        <section className="mt-10 surface-grid p-6 md:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">Архив статей</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Еще полезные материалы</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {secondaryPosts.slice(3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="interactive-card reading-shell flex h-full flex-col overflow-hidden p-0">
                  {getPostCover(post) ? (
                    <div className="relative h-52 w-full">
                      <Image
                        src={getPostCover(post)}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        unoptimized={isInlineImage(getPostCover(post))}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">Статья</div>
                    <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-950">{post.title}</h2>
                    {post.excerpt ? <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.excerpt}</p> : null}
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="text-sm text-slate-400">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : 'Без даты'}
                      </p>
                      <span className="text-sm font-semibold text-sky-700 transition group-hover:text-sky-600">Открыть</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length === 0 ? (
        <section className="mt-10">
          <div className="reading-shell text-center text-slate-500">Пока опубликованных статей нет.</div>
        </section>
      ) : null}
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
