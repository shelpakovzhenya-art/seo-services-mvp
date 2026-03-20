import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { servicePages } from '@/lib/service-pages'

type Props = {
  currentPath?: string
}

export default async function ContentRecommendations({ currentPath = '' }: Props) {
  let posts: Array<{ slug: string; title: string; excerpt: string | null }> = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 2,
      select: {
        slug: true,
        title: true,
        excerpt: true,
      },
    })
  } catch (error) {
    console.error('Error loading recommendations:', error)
    posts = []
  }

  const recommendedServices = servicePages
    .filter((service) => !currentPath.startsWith(`/services/${service.slug}`))
    .slice(0, 3)

  const recommendedPosts = posts.filter((post) => !currentPath.startsWith(`/blog/${post.slug}`))

  if (recommendedServices.length === 0 && recommendedPosts.length === 0) {
    return null
  }

  return (
    <section className="border-t border-orange-100 bg-white/60">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Полезно дальше</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              Следующий полезный шаг: услуга или материал по теме
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            На любой странице сайта пользователь должен понимать, что читать дальше и куда перейти, если ему
            нужен либо разбор задачи, либо более предметная услуга.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="page-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-orange-700">Услуги</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Что можно подключить под задачу</h3>
              </div>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-slate-950">
                Все услуги
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {recommendedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-orange-700">{service.shortName}</div>
                  <h4 className="mt-3 text-xl font-semibold text-slate-950">{service.label}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.cardDescription}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    {service.cardCta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="page-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-orange-700">Блог</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Что почитать по теме</h3>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-slate-950">
                Все статьи
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {recommendedPosts.length > 0 ? (
                recommendedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block rounded-[24px] border border-orange-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-200"
                  >
                    <div className="text-xs uppercase tracking-[0.22em] text-orange-700">Материал</div>
                    <h4 className="mt-3 text-xl font-semibold text-slate-950">{post.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {post.excerpt || 'Практический материал по SEO, структуре сайта, конверсии и логике роста проекта.'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                      Читать статью
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[24px] border border-orange-100 bg-white p-5 text-sm leading-7 text-slate-600">
                  Здесь будут появляться свежие экспертные статьи, которые помогают клиенту лучше понять задачу,
                  риски и рабочие точки роста проекта.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
