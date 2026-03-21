import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
}

function getRelatedServices(slug: string) {
  const relatedMap: Record<string, Array<{ href: string; label: string; description: string }>> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': [
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Быстро выявляет слабые места структуры, контента и технической базы сайта.',
      },
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Подходит, если после аудита нужно сразу исправить индексацию, скорость и архитектуру.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Помогает упаковать страницы и статьи так, чтобы они работали и на поиск, и на заявки.',
      },
    ],
    'kak-podgotovit-sait-k-geo-i-ii-vydache': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Системная работа над структурой, спросом и конверсией сайта, а не только над видимостью.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Показывает, что мешает сайту быть заметным в поиске и ИИ-ответах уже сейчас.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Нужен, чтобы перестроить ключевые страницы и экспертные материалы под новый тип выдачи.',
      },
    ],
    'seo-dlya-brand-media-kak-izmerit-polzu': [
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Подходит, если нужно собрать бренд-медиа как систему полезных страниц, а не набор публикаций.',
      },
      {
        href: '/services/seo-consulting',
        label: 'SEO-консалтинг',
        description: 'Помогает увязать редакционную стратегию, семантику и бизнес-цели сайта.',
      },
      {
        href: '/services/b2b-seo',
        label: 'B2B SEO',
        description: 'Хороший формат для экспертных ниш, где длинный цикл сделки и важна глубина материалов.',
      },
    ],
    'pereezd-na-novyy-domen-bez-poteri-trafika': [
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Контролирует редиректы, индексацию и всю техническую базу после переезда.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Подходит, если нужно заранее проверить риски переноса и не потерять сильные страницы.',
      },
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Помогает стабилизировать рост после изменений в структуре, контенте и логике сайта.',
      },
    ],
  }

  return (
    relatedMap[slug] || [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Основной формат для роста органики, структуры сайта и заявок без хаотичных правок.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Удобная стартовая точка, если сначала нужно понять реальные проблемы проекта.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Нужен, когда статья должна переходить в рабочие посадочные и усиливать коммерческие страницы.',
      },
    ]
  )
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: any = null

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    })
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const content = stripLeadingMarkdownH1(post.content, post.title)
  const relatedServices = getRelatedServices(post.slug)

  return (
    <article className="page-shell max-w-5xl">
      <header className="surface-cosmos overflow-hidden p-8 md:p-10">
        <div className="max-w-3xl">
          {post.publishedAt && (
            <p className="text-sm text-slate-400">
              {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg leading-8 text-slate-300">{post.excerpt}</p>}
        </div>

        {coverImage && (
          <div className="relative mt-8 overflow-hidden rounded-[30px] border border-white/12 bg-white/8 shadow-[0_24px_60px_rgba(2,8,23,0.28)]">
            <div className="relative aspect-[16/9] w-full">
              <Image src={coverImage} alt={post.title} fill className="object-cover" />
            </div>
          </div>
        )}
      </header>

      <section className="mt-8 reading-shell">
        <div className="editorial-prose max-w-none">
          <RichContent content={content} />
        </div>

        <div className="mt-10 rounded-[28px] border border-orange-100 bg-[linear-gradient(180deg,#fffaf5,#f7fbff)] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-700">Связанные услуги</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 md:text-3xl">Что открыть дальше по теме статьи</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Если хотите перейти от чтения к внедрению, начните с этих страниц услуг. Они напрямую продолжают тему
            материала и помогают превратить выводы в рабочий план.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {relatedServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-[22px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
              >
                <p className="text-lg font-semibold text-slate-950 transition-colors duration-200 group-hover:text-sky-700">
                  {service.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{service.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-sky-700">Перейти к услуге</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let post: any = null

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    })
  } catch (error) {
    post = null
  }

  if (!post) {
    return {
      title: 'Статья не найдена | Shelpakov Digital',
    }
  }

  const { getFullUrl } = await import('@/lib/site-url')
  const postUrl = getFullUrl(`/blog/${params.slug}`)
  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const metaTitle = normalizeMetaTitle(post.title, 'Статья Shelpakov Digital')
  const metaDescription = normalizeMetaDescription(
    post.excerpt,
    'Экспертный материал Shelpakov Digital о SEO, структуре сайта, контенте и росте заявок с практическими выводами для бизнеса.'
  )

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
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
