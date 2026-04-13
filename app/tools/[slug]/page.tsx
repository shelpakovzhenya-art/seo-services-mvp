import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import BrandPageHero from '@/components/BrandPageHero'
import JsonLd from '@/components/JsonLd'
import SeoToolWorkspace from '@/components/tools/SeoToolWorkspace'
import { Button } from '@/components/ui/button'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getSeoToolBySlug, getSeoTools, seoTools } from '@/lib/seo-tools'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

const toolDetailCopy: Record<
  Locale,
  {
    pageTitleSuffix: string
    pageDescriptionFallback: string
    home: string
    tools: string
    runtimeBadge: string
    principlesTitle: string
    principlesDescription: string
    allTools: string
    discussTask: string
    relatedKicker: string
    relatedTitle: string
    relatedLink: string
  }
> = {
  ru: {
    pageTitleSuffix: 'SEO-инструменты',
    pageDescriptionFallback:
      'Инструмент работает прямо в браузере и помогает быстро решить прикладную SEO-задачу без лишней ручной рутины.',
    home: 'Главная',
    tools: 'Инструменты',
    runtimeBadge: 'client-side',
    principlesTitle: 'Принцип работы',
    principlesDescription:
      'Инструмент решает узкую SEO-задачу прямо в браузере: вы вводите исходные данные, а результат обновляется сразу, без ручного синтаксиса и без перехода между сервисами.',
    allTools: 'Все инструменты',
    discussTask: 'Обсудить задачу',
    relatedKicker: 'Еще инструменты',
    relatedTitle: 'Можно открыть соседние утилиты',
    relatedLink: 'Перейти в хаб',
  },
  en: {
    pageTitleSuffix: 'SEO tools',
    pageDescriptionFallback:
      'This browser-based tool helps solve a practical SEO task quickly without extra software or manual syntax work.',
    home: 'Home',
    tools: 'Tools',
    runtimeBadge: 'client-side',
    principlesTitle: 'How it works',
    principlesDescription:
      'The tool handles a focused SEO task directly in the browser: you enter the source data and the result updates instantly, without manual syntax work or switching between services.',
    allTools: 'All tools',
    discussTask: 'Discuss the task',
    relatedKicker: 'More tools',
    relatedTitle: 'You can open adjacent utilities',
    relatedLink: 'Go to the hub',
  },
}

export async function generateStaticParams() {
  return seoTools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const copy = toolDetailCopy[locale]
  const tool = getSeoToolBySlug(slug, locale)

  if (!tool) {
    return {}
  }

  const title = normalizeMetaTitle(tool.title, `${tool.title} | ${copy.pageTitleSuffix}`)
  const description = normalizeMetaDescription(tool.description, `${tool.summary} ${copy.pageDescriptionFallback}`)
  const alternates = getLocaleAlternates(`/tools/${tool.slug}`)
  const canonical = getFullUrl(prefixPathWithLocale(`/tools/${tool.slug}`, locale))

  return {
    title,
    description,
    alternates: {
      ...alternates,
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
  }
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params
  const locale = await getRequestLocale()
  const copy = toolDetailCopy[locale]
  const tool = getSeoToolBySlug(slug, locale)

  if (!tool) {
    notFound()
  }

  const relatedTools = getSeoTools(locale)
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 3)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: copy.home, path: '/' },
    { name: copy.tools, path: '/tools' },
    { name: tool.title, path: `/tools/${tool.slug}` },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id={`tool-breadcrumbs-schema-${tool.slug}`} data={breadcrumbSchema} />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href={prefixPathWithLocale('/', locale)} className="transition hover:text-white">
          {copy.home}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={prefixPathWithLocale('/tools', locale)} className="transition hover:text-white">
          {copy.tools}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{tool.title}</span>
      </nav>

      <BrandPageHero
        eyebrow={tool.category}
        title={tool.title}
        description={tool.summary}
        actions={
          <>
            <Link href={prefixPathWithLocale('/tools', locale)}>
              <Button variant="outline" className="rounded-full border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-50">
                {copy.allTools}
              </Button>
            </Link>
            <Link href={prefixPathWithLocale('/contacts#contact-form', locale)}>
              <Button className="rounded-full px-5">
                {copy.discussTask}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="mt-10">
        <SeoToolWorkspace tool={tool} locale={locale} />
      </div>

      <section className="mt-10 reading-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950">{copy.relatedTitle}</h2>
          </div>
          <Link
            href={prefixPathWithLocale('/tools', locale)}
            className="inline-flex items-center gap-2 text-[#8a5630] transition hover:text-slate-950"
          >
            {copy.relatedLink}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {relatedTools.map((item) => (
            <Link
              key={item.slug}
              href={prefixPathWithLocale(`/tools/${item.slug}`, locale)}
              className="uniform-card brand-link-card p-5"
            >
              <div className="text-2xl font-semibold text-slate-950">{item.title}</div>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
