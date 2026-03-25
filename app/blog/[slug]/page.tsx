import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import RichContent from '@/components/RichContent'
import { getBuiltInBlogPostBySlug, hydrateBlogPostRecord, isPlaceholderBlogPost } from '@/lib/built-in-blog-posts'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getFullUrl } from '@/lib/site-url'
import { createBlogPostingSchema, createBreadcrumbSchema } from '@/lib/structured-data'

type BlogPostRecord = {
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  content?: string | null
  coverImage?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
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

function getRelatedServices(slug: string) {
  const relatedMap: Record<string, Array<{ href: string; label: string; description: string }>> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': [
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Подходит, если сначала нужно увидеть, какие шаблоны и страницы уже режут рост сайта.',
      },
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Нужно, когда проблема уже упирается в индексацию, дубли, шаблоны и мобильную стабильность.',
      },
      {
        href: '/services/website-development',
        label: 'Разработка сайтов',
        description: 'Полезно, если сайт надо не латать, а пересобирать под более сильную структуру и путь к заявке.',
      },
    ],
    'kak-podgotovit-sait-k-geo-i-ii-vydache': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Нужно, если сайт уже пора перестраивать под новую выдачу системно, а не точечно по статьям.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Подходит, когда надо перепаковать сильные темы, убрать шум и связать статьи с услугами.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Полезен, если сначала важно понять, какие страницы брать в работу первыми.',
      },
    ],
    'seo-dlya-brand-media-kak-izmerit-polzu': [
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Нужен, когда блог должен работать как система тем, а не как архив отдельных публикаций.',
      },
      {
        href: '/services/seo-consulting',
        label: 'SEO-консалтинг',
        description: 'Помогает увязать редакционный план, кластерную логику и бизнес-задачи сайта.',
      },
      {
        href: '/services/b2b-seo',
        label: 'B2B SEO',
        description: 'Подходит экспертным проектам, где контент должен поддерживать длинный цикл сделки.',
      },
    ],
    'pereezd-na-novyy-domen-bez-poteri-trafika': [
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Нужно, если при переезде надо контролировать редиректы, индексацию и шаблоны страниц.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Подходит, когда важно заранее найти рискованные URL и слабые зоны до миграции.',
      },
      {
        href: '/services/website-development',
        label: 'Разработка сайтов',
        description: 'Полезно, если перенос совпадает с редизайном, новой CMS или пересборкой структуры.',
      },
    ],
    'geo-i-ii-vydacha-kak-poluchat-trafik-v-2026': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Подходит, когда надо перестраивать сайт под новый формат выдачи и защищать заявки.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Полезен, если нужно обновить статьи, хабы и связи между ними без шаблонных текстов.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Показывает, какие страницы уже сейчас проигрывают из-за структуры, шума и слабых сниппетов.',
      },
    ],
    'seo-trendy-2026-chto-rabotaet-segodnya': [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Нужно, если проекту пора перейти от разрозненных действий к одной рабочей системе роста.',
      },
      {
        href: '/services/b2b-seo',
        label: 'B2B SEO',
        description: 'Подходит сложным услугам, где важно усиливать не только трафик, но и доверие к решению.',
      },
      {
        href: '/services/technical-seo',
        label: 'Техническое SEO',
        description: 'Полезно, когда рост уже упирается в индексацию, шаблоны и качество техбазы.',
      },
    ],
    'kak-izmerit-effektivnost-seo-i-ai-trafika': [
      {
        href: '/services/seo-consulting',
        label: 'SEO-консалтинг',
        description: 'Помогает собрать рабочую модель отчётности и связать SEO с решениями бизнеса.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Нужен, если важно понять, какие страницы реально мешают росту и что делать первым.',
      },
      {
        href: '/services/b2b-seo',
        label: 'B2B SEO',
        description: 'Актуально, когда проекту важны не визиты сами по себе, а качественные обращения из органики.',
      },
    ],
  }

  return (
    relatedMap[slug] || [
      {
        href: '/services/seo',
        label: 'SEO-продвижение',
        description: 'Основной формат для системного роста органики, структуры сайта и заявок.',
      },
      {
        href: '/services/seo-audit',
        label: 'SEO-аудит',
        description: 'Стартовая точка, если сначала нужно увидеть реальные ограничения проекта и приоритеты.',
      },
      {
        href: '/services/seo-content',
        label: 'SEO-контент',
        description: 'Нужен, когда статья должна вести в рабочие посадочные и усиливать коммерческие страницы.',
      },
    ]
  )
}

async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  try {
    const dbPost = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    })

    if (dbPost && !isPlaceholderBlogPost(dbPost)) {
      return hydrateBlogPostRecord(dbPost)
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
  }

  const builtInPost = getBuiltInBlogPostBySlug(slug)
  return builtInPost && !isPlaceholderBlogPost(builtInPost) ? builtInPost : null
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post || !post.title || !post.content || !post.slug) {
    notFound()
  }

  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const content = stripLeadingMarkdownH1(post.content, post.title)
  const relatedServices = getRelatedServices(post.slug)
  const articleDescription = normalizeMetaDescription(
    post.excerpt,
    'Материал Shelpakov Digital о SEO, структуре сайта, коммерческих страницах и росте заявок.'
  )
  const articleSchema = createBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: articleDescription,
    coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    relatedServices,
  })
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Главная', path: '/' },
    { name: 'Блог', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ])

  return (
    <article className="page-shell max-w-5xl">
      <JsonLd id={`blog-post-schema-${post.slug}`} data={articleSchema} />
      <JsonLd id={`blog-breadcrumbs-schema-${post.slug}`} data={breadcrumbSchema} />

      <header className="surface-cosmos surface-pad overflow-hidden">
        <div className="max-w-3xl">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300/85">
            <Link href="/" className="transition hover:text-white">
              Главная
            </Link>
            <span>/</span>
            <Link href="/blog" className="transition hover:text-white">
              Блог
            </Link>
          </nav>

          {post.publishedAt ? (
            <p className="mt-4 text-sm text-slate-400">
              {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : null}

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">{post.title}</h1>
          {post.excerpt ? <p className="mt-5 text-lg leading-8 text-slate-300">{post.excerpt}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">Автор: Shelpakov Digital</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
              Тема: SEO, структура сайта и коммерческие страницы
            </span>
            <Link
              href="/services"
              className="rounded-full border border-cyan-300/24 bg-cyan-400/10 px-4 py-2 transition hover:border-cyan-200/50 hover:text-white"
            >
              Перейти к услугам
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

        <div className="mt-10 rounded-[28px] border border-orange-100 bg-[linear-gradient(180deg,#fffaf5,#f7fbff)] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-700">Связанные услуги</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 md:text-3xl">Что логично открыть после этой статьи</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Если хотите перейти от чтения к внедрению, начните с этих страниц. Они продолжают тему статьи уже в формате конкретной работы по сайту.
          </p>

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
  const post = await getBlogPostBySlug(params.slug)

  if (!post || !post.title || !post.slug) {
    return {
      title: 'Статья не найдена | Shelpakov Digital',
    }
  }

  const postUrl = getFullUrl(`/blog/${params.slug}`)
  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const metaTitle = normalizeMetaTitle(post.title, 'Статья Shelpakov Digital')
  const metaDescription = normalizeMetaDescription(
    post.excerpt,
    'Материал Shelpakov Digital о SEO, структуре сайта, коммерческих страницах и росте заявок.'
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
