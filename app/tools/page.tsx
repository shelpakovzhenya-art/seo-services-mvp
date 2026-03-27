import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
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

      <section className="mt-8 surface-grid surface-pad">
        <h1 className="max-w-5xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{copy.heroTitle}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{copy.heroDescription}</p>
        <div className="mt-8">
          <Link href={prefixPathWithLocale(`/tools/${tools[0].slug}`, locale)}>
            <Button size="lg" className="rounded-full px-7">
              {copy.openFirstTool}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="uniform-grid-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={prefixPathWithLocale(`/tools/${tool.slug}`, locale)}
              className="uniform-card group rounded-[28px] border border-orange-100 bg-white p-7 text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-[#fffdf9]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-200 bg-[#fffaf5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
                  {tool.category}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  client-side
                </span>
              </div>

              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-cyan-100 bg-cyan-50 text-cyan-700">
                <ToolCardIcon icon={tool.icon} className="h-6 w-6" />
              </div>

              <h2 className="mt-8 text-3xl font-semibold leading-tight text-slate-950">{tool.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{tool.description}</p>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition group-hover:text-slate-950">
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
