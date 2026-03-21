import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'

function normalizeMetaDescription(excerpt: string | null | undefined) {
  const clean = (excerpt || '').replace(/\s+/g, ' ').trim()

  if (clean.length >= 140 && clean.length <= 160) {
    return clean
  }

  if (clean.length > 160) {
    return `${clean.slice(0, 157).trimEnd()}...`
  }

  const fallback = `${clean ? `${clean} ` : ''}Экспертный материал Shelpakov Digital о SEO, структуре сайта и росте органического трафика.`
  return fallback.length > 160 ? `${fallback.slice(0, 157).trimEnd()}...` : fallback
}

function normalizeMetaTitle(title: string) {
  if (title.length <= 48) {
    return `${title} | Shelpakov Digital`
  }

  return `${title.slice(0, 45).trimEnd()}... | Shelpakov Digital`
}

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
}

function getRelatedServices(slug: string) {
  const relatedMap: Record<string, Array<{ href: string; label: string; description: string }>> = {
    'welcome-to-seo-services': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Системная работа над органическим ростом и заявками.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Понять, где сайт теряет рост, до внедрения дорогих правок.',
      },
    ],
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': [
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Быстрое выявление слабых мест структуры, контента и техники.',
      },
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Исправление базы сайта: индексация, скорость, стабильность.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Страницы и статьи, которые помогают и поиску, и заявкам.',
      },
    ],
    'kak-podgotovit-sait-k-geo-i-ii-vydache': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Выстраиваем структуру и видимость сайта под рост обращений.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Определяем, что мешает сайту быть заметным и конверсионным.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Собираем страницы и материалы под реальный спрос аудитории.',
      },
    ],
    'seo-dlya-brand-media-kak-izmerit-polzu': [
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Редакционная система контента, а не разрозненные публикации.',
      },
      {
        href: '/services/seo-consulting',
        label: 'SEO-консалтинг',
        description: 'Помогаю связать контент, семантику и коммерческую логику сайта.',
      },
      {
        href: '/services/b2b-seo',
        label: 'B2B SEO',
        description: 'Подход для экспертных и длинных циклов принятия решения.',
      },
    ],
    'pereezd-na-novyy-domen-bez-poteri-trafika': [
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Контроль индексации, редиректов и технической базы после переезда.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Проверка рисков до и после запуска нового домена.',
      },
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Помогаю стабилизировать рост после изменений в структуре сайта.',
      },
    ],
  }

  return (
    relatedMap[slug] || [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Основная услуга для роста органики, структуры сайта и заявок.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Удобная стартовая точка, если сначала нужно понять проблемы проекта.',
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

      <div className="mt-10 reading-shell">
        <div className="editorial-prose max-w-none">
          <RichContent content={content} />
        </div>
      </div>

      <section className="surface-panel mt-8 p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[rgba(202,92,17,0.85)]">Связанные услуги</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950 md:text-3xl">Что полезно открыть дальше</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Ниже собрал услуги, которые логично продолжают тему этой статьи и помогают перейти от чтения к внедрению.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {relatedServices.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:border-sky-300"
            >
              <p className="text-lg font-semibold text-slate-950 transition-colors duration-200 group-hover:text-sky-700">
                {service.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-700">
                Перейти к услуге
              </span>
            </Link>
          ))}
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
      title: 'Статья не найдена',
    }
  }

  const { getFullUrl } = await import('@/lib/site-url')
  const postUrl = getFullUrl(`/blog/${params.slug}`)
  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const metaTitle = normalizeMetaTitle(post.title)
  const metaDescription = normalizeMetaDescription(post.excerpt)

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      images: coverImage ? [getFullUrl(coverImage)] : [],
    },
  }
}
