import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import ToolCardIcon from '@/components/tools/ToolCardIcon'
import { Button } from '@/components/ui/button'
import { seoTools } from '@/lib/seo-tools'
import { getFullUrl } from '@/lib/site-url'

const pageTitle = 'SEO-инструменты для быстрых проверок и генерации SEO-материалов'
const pageDescription =
  'Подборка SEO-инструментов, которые работают прямо в браузере: генератор ЧПУ, UTM-меток, meta-тегов, robots.txt и Open Graph.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: getFullUrl('/tools'),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: getFullUrl('/tools'),
    type: 'website',
  },
}

export default function ToolsIndexPage() {
  return (
    <div className="page-shell">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="transition hover:text-white">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">Инструменты</span>
      </nav>

      <section className="surface-cosmos p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="warm-chip">SEO-инструменты</span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                client-side
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Отдельный хаб с полезными SEO-инструментами для быстрых рабочих задач.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Всё работает прямо в браузере: без лишней бюрократии, без скачивания софта и без отправки данных в
              сторонние сервисы. Подходит для разметки ссылок, базовых SEO-проверок и подготовки к публикации.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/tools/${seoTools[0].slug}`}>
                <Button size="lg" className="rounded-full px-7">
                  Открыть первый инструмент
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {[
              'Генераторы и проверки работают полностью на клиентской стороне.',
              'Можно быстро собрать slug, UTM или Open Graph без ручного копания в синтаксисе.',
              'Раздел вынесен отдельно, чтобы не перегружать основную навигацию сайта.',
            ].map((item) => (
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

      <section className="mt-10">
        <div className="grid gap-6 xl:grid-cols-3">
          {seoTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex h-full flex-col rounded-[34px] border border-white/10 bg-[#071120]/88 p-7 text-slate-300 shadow-[0_24px_70px_rgba(2,6,23,0.34)] transition hover:-translate-y-1.5 hover:border-orange-300/30 hover:bg-[#0a1528]/94"
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
                Открыть инструмент
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
