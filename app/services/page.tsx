import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'
import ContactForm from '@/components/ContactForm'
import { getFullUrl } from '@/lib/site-url'
import { serviceIndexFaq, servicePages } from '@/lib/service-pages'

const pageTitle = 'SEO-услуги для роста органики, структуры сайта и заявок'
const pageDescription =
  'SEO-услуги под разные задачи бизнеса: SEO-продвижение, аудит, техническое SEO, локальное продвижение, Ecommerce, B2B, контент, Link Building и консалтинг.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: getFullUrl('/services'),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: getFullUrl('/services'),
    type: 'website',
  },
}

export default function ServicesIndexPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: serviceIndexFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: getFullUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: getFullUrl('/services') },
    ],
  }

  return (
    <>
      <Script
        id="services-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="services-breadcrumbs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="page-shell">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-slate-900">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Услуги</span>
        </nav>

        <section className="soft-section p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <span className="warm-chip">SEO-услуги</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                {pageTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Подберите подходящий формат работы под задачу бизнеса: от аудита и технической базы до системного
                продвижения, контента и консультационной поддержки.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    Получить ориентир по услуге
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50"
                  >
                    Вернуться на главную
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Какой формат выбрать</div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если нужно понять текущее состояние сайта, обычно начинают с SEO-аудита или консультации.
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если проекту нужен системный рост, логичнее смотреть в сторону комплексного SEO-продвижения.
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если есть конкретное ограничение, можно выбрать точечную услугу: техническое SEO, контент, локальное
                  SEO или консалтинг.
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalogSection />

        <section className="page-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Частые вопросы по SEO-услугам</h2>
            </div>
            <div className="text-sm text-slate-500">Всего направлений: {servicePages.length}</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {serviceIndexFaq.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-10 scroll-mt-32 soft-section overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Консультация</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
                Получить консультацию по выбору услуги
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                Коротко опишите задачу, и я подскажу, с какого формата работ логичнее начать именно в вашем проекте.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                  Ответим в течение дня.
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                  Покажем точки роста и следующий шаг без лишних обязательств.
                </div>
              </div>
            </div>
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
