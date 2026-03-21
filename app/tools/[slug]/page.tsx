import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import SeoToolWorkspace from '@/components/tools/SeoToolWorkspace'
import ToolCardIcon from '@/components/tools/ToolCardIcon'
import { Button } from '@/components/ui/button'
import { getSeoToolBySlug, seoTools } from '@/lib/seo-tools'
import { getFullUrl } from '@/lib/site-url'

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return seoTools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getSeoToolBySlug(slug)

  if (!tool) {
    return {}
  }

  const title = `${tool.title} | SEO-инструменты`

  return {
    title,
    description: tool.description,
    alternates: {
      canonical: getFullUrl(`/tools/${tool.slug}`),
    },
    openGraph: {
      title,
      description: tool.description,
      url: getFullUrl(`/tools/${tool.slug}`),
      type: 'website',
    },
  }
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = getSeoToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const relatedTools = seoTools.filter((item) => item.slug !== tool.slug).slice(0, 3)

  return (
    <div className="page-shell">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="transition hover:text-white">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/tools" className="transition hover:text-white">
          Инструменты
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{tool.title}</span>
      </nav>

      <section className="surface-grid p-8 md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="warm-chip">{tool.category}</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                client-side
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              {tool.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{tool.summary}</p>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-slate-200 bg-white text-cyan-700">
                <ToolCardIcon icon={tool.icon} className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Принцип работы</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Инструмент решает узкую SEO-задачу прямо в браузере: вы вводите исходные данные, а результат
                  обновляется сразу, без ручного синтаксиса и без перехода между сервисами.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tools">
                <Button variant="outline" className="rounded-full border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-50">
                  Все инструменты
                </Button>
              </Link>
              <Link href="/contacts#contact-form">
                <Button className="rounded-full px-5">
                  Обсудить задачу
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <SeoToolWorkspace tool={tool} />
      </div>

      <section className="mt-10 reading-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Еще инструменты</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Можно открыть соседние утилиты</h2>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
            Перейти в хаб
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {relatedTools.map((item) => (
            <Link
              key={item.slug}
              href={`/tools/${item.slug}`}
              className="rounded-[28px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">{item.category}</div>
              <div className="mt-3 text-2xl font-semibold text-slate-950">{item.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
