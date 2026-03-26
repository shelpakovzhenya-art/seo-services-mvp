import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import ToolCardIcon from '@/components/tools/ToolCardIcon'
import { Button } from '@/components/ui/button'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getSeoTools } from '@/lib/seo-tools'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

const toolsIndexCopy: Record<
  Locale,
  {
    pageTitle: string
    pageTitleSuffix: string
    pageDescription: string
    metadataFallback: string
    home: string
    tools: string
    chip: string
    heroTitle: string
    heroDescription: string
    openFirstTool: string
    sideNotes: string[]
    fitKicker: string
    fitTitle: string
    fitCards: string[]
    openTool: string
  }
> = {
  ru: {
    pageTitle: 'SEO-инструменты для быстрых проверок и генерации SEO-материалов',
    pageTitleSuffix: 'SEO-инструменты для работы с сайтом',
    pageDescription:
      'Подборка SEO-инструментов, которые работают прямо в браузере: генератор ЧПУ, UTM-меток, meta-тегов, robots.txt и Open Graph.',
    metadataFallback:
      'Набор SEO-инструментов для браузера: генератор ЧПУ, UTM-меток, meta-тегов, robots.txt и Open Graph без установки лишнего софта.',
    home: 'Главная',
    tools: 'Инструменты',
    chip: 'SEO-инструменты',
    heroTitle: 'Отдельный хаб с полезными SEO-инструментами для быстрых рабочих задач.',
    heroDescription:
      'Все работает прямо в браузере: без лишнего софта и без ручной рутины, когда нужно быстро собрать slug, UTM, robots.txt или Open Graph.',
    openFirstTool: 'Открыть первый инструмент',
    sideNotes: [
      'Генераторы и проверки работают полностью на клиентской стороне.',
      'Можно быстро собрать slug, UTM или Open Graph без ручного копания в синтаксисе.',
      'Раздел вынесен отдельно, чтобы не перегружать основную навигацию сайта.',
    ],
    fitKicker: 'Когда этот раздел полезен',
    fitTitle: 'Инструменты экономят время на рутине, но не маскируют большие проблемы сайта',
    fitCards: [
      'Хаб полезен, когда нужно быстро собрать slug, UTM, мета-теги или robots без запуска отдельного софта.',
      'Инструменты закрывают рутинные микро-задачи и помогают ускорить публикацию, но не заменяют аудит, стратегию и переработку страниц.',
      'Если проблема лежит в структуре сайта, слабом оффере, миграции или шаблонных ошибках, правильнее идти в услуги, а не надеяться на утилиту.',
    ],
    openTool: 'Открыть инструмент',
  },
  en: {
    pageTitle: 'SEO tools for quick checks and production tasks',
    pageTitleSuffix: 'SEO tools for practical website work',
    pageDescription:
      'A browser-based toolkit for slugs, UTM parameters, meta tags, robots.txt, and Open Graph markup.',
    metadataFallback:
      'A browser toolkit for practical SEO work: slugs, UTM tags, meta tags, robots.txt, and Open Graph without extra software.',
    home: 'Home',
    tools: 'Tools',
    chip: 'SEO tools',
    heroTitle: 'A dedicated hub of practical SEO tools for fast production work.',
    heroDescription:
      'Everything runs directly in the browser: no extra software and no manual syntax digging when you need a slug, UTM link, robots.txt draft, or Open Graph tags.',
    openFirstTool: 'Open the first tool',
    sideNotes: [
      'The generators and checks run fully on the client side.',
      'You can assemble slugs, UTM links, and Open Graph tags without manual syntax work.',
      'The section lives separately so the main site navigation stays focused on services and cases.',
    ],
    fitKicker: 'When this section is useful',
    fitTitle: 'These tools save time on repetitive tasks, but they do not replace deeper SEO work',
    fitCards: [
      'The hub is useful when you need a slug, UTM tag, meta snippet, or robots.txt draft quickly.',
      'The tools speed up routine production tasks, but they do not replace an audit, strategy, or a page rebuild.',
      'If the issue sits in site structure, weak offer framing, migration risk, or template-level problems, the next step should be a service, not a utility.',
    ],
    openTool: 'Open tool',
  },
}

export default async function ToolsIndexPage() {
  const locale = await getRequestLocale()
  const copy = toolsIndexCopy[locale]
  const tools = getSeoTools(locale)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: copy.home, path: '/' },
    { name: copy.tools, path: '/tools' },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id="tools-breadcrumbs-schema" data={breadcrumbSchema} />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href={prefixPathWithLocale('/', locale)} className="transition hover:text-white">
          {copy.home}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{copy.tools}</span>
      </nav>

      <section className="surface-cosmos surface-pad">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="warm-chip">{copy.chip}</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                client-side
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.heroDescription}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={prefixPathWithLocale(`/tools/${tools[0].slug}`, locale)}>
                <Button size="lg" className="rounded-full px-7">
                  {copy.openFirstTool}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {copy.sideNotes.map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-5 text-sm leading-7 text-slate-200 backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-orange-300" />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 surface-grid surface-pad">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.fitKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">{copy.fitTitle}</h2>
          </div>
        </div>

        <div className="uniform-grid-3 mt-6 gap-4">
          {copy.fitCards.map((item) => (
            <div key={item} className="uniform-card rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="uniform-grid-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={prefixPathWithLocale(`/tools/${tool.slug}`, locale)}
              className="uniform-card group rounded-[34px] border border-white/10 bg-[#071120]/88 p-7 text-slate-300 shadow-[0_24px_70px_rgba(2,6,23,0.34)] transition hover:-translate-y-1.5 hover:border-orange-300/30 hover:bg-[#0a1528]/94"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-200">
                  {tool.category}
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  client-side
                </span>
              </div>

              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-cyan-200">
                <ToolCardIcon icon={tool.icon} className="h-6 w-6" />
              </div>

              <h2 className="mt-8 text-3xl font-semibold leading-tight text-white">{tool.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">{tool.description}</p>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition group-hover:text-white">
                {copy.openTool}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const copy = toolsIndexCopy[locale]
  const alternates = getLocaleAlternates('/tools')
  const title = normalizeMetaTitle(copy.pageTitle, copy.pageTitleSuffix)
  const description = normalizeMetaDescription(copy.pageDescription, copy.metadataFallback)
  const canonical = getFullUrl(prefixPathWithLocale('/tools', locale))

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
