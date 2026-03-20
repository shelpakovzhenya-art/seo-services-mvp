'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { servicePages } from '@/lib/service-pages'

type Props = {
  currentPath?: string
}

const featuredReads = [
  {
    href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
    kicker: 'Блог',
    title: 'Каким должен быть современный сайт для SEO и заявок',
    description:
      'Материал о структуре, скорости, коммерческих факторах и технической базе, которые влияют на трафик и обращения.',
    cta: 'Читать материал',
  },
  {
    href: '/cases/podocenter-kzn-seo-growth',
    kicker: 'Кейс',
    title: 'Кейс подологического центра в Казани',
    description:
      'Показываю, как гибридная структура сайта и SEO-работы влияют на видимость, заявки и стоимость лида.',
    cta: 'Открыть кейс',
  },
  {
    href: '/blog',
    kicker: 'Блог',
    title: 'Все статьи по SEO и развитию сайта',
    description:
      'Если хотите глубже разобраться в задаче, переходите в блог: там собраны практические материалы без воды.',
    cta: 'Перейти в блог',
  },
]

export default function ContentRecommendations({ currentPath }: Props) {
  const pathname = usePathname() || currentPath || ''

  if (!pathname || pathname.startsWith('/admin')) {
    return null
  }

  const recommendedServices = servicePages
    .filter((service) => !pathname.startsWith(`/services/${service.slug}`))
    .slice(0, 3)

  const recommendedReads = featuredReads.filter((item) => item.href !== pathname).slice(0, 3)

  return (
    <section className="border-t border-orange-200/80 bg-[linear-gradient(180deg,rgba(255,248,241,0.92),rgba(255,255,255,0.98))]">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="soft-section p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Полезно дальше</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
                На любой странице должен быть следующий полезный шаг
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Если человеку рано оставлять заявку, ему нужен сильный следующий переход: в услугу, кейс или экспертный
              материал. Поэтому этот блок теперь сквозной и показывается на всех публичных страницах сайта.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[30px] border border-orange-100 bg-white/90 p-6 shadow-[0_22px_60px_rgba(210,133,69,0.08)] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-orange-700">Услуги</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Что можно подключить под задачу</h3>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-slate-950"
                >
                  Все услуги
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {recommendedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_16px_40px_rgba(49,149,181,0.10)]"
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

            <div className="rounded-[30px] border border-orange-100 bg-white/90 p-6 shadow-[0_22px_60px_rgba(210,133,69,0.08)] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-orange-700">Контент</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">Что почитать или посмотреть дальше</h3>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-slate-950"
                >
                  Все материалы
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {recommendedReads.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-[24px] border border-orange-100 bg-[#fffdf9] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_16px_40px_rgba(49,149,181,0.10)]"
                  >
                    <div className="text-xs uppercase tracking-[0.22em] text-orange-700">{item.kicker}</div>
                    <h4 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                      {item.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
