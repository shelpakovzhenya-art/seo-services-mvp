import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { Button } from '@/components/ui/button'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'
import LazyContactForm from '@/components/LazyContactForm'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getFullUrl } from '@/lib/site-url'
import { servicePages } from '@/lib/service-pages'
import { createBreadcrumbSchema, createCollectionPageSchema, createFaqSchema, createItemListSchema } from '@/lib/structured-data'

const pageTitle = 'SEO и разработка сайтов под заявки'
const pageDescription =
  'SEO-услуги и разработка сайтов под заявки: аудит, техническая база, структура, контент, разработка новых страниц и запуск площадки с основой под рост.'

const serviceFaq = [
  {
    question: 'Как понять, что проекту нужен новый сайт, а не только SEO?',
    answer:
      'Обычно это видно по архитектуре и логике страниц. Если сайт неудобно расширять, он слабо презентует услуги, не ведет к обращению и мешает росту, логичнее смотреть в сторону разработки или перезапуска.',
  },
  {
    question: 'Можно ли начать с одной услуги, а потом наращивать сайт?',
    answer:
      'Да. Это нормальный сценарий: сначала запускается компактная версия под ключевую задачу, затем добавляются новые разделы, статьи, кейсы и дополнительные посадочные страницы.',
  },
  {
    question: 'Вы подключаете разработку и SEO отдельно или вместе?',
    answer:
      'Возможны оба формата. Для одного проекта важнее сначала разработать сильную базу, для другого уже нужен аудит, техническое SEO или системное продвижение поверх существующего сайта.',
  },
  {
    question: 'Почему на сайте указаны стартовые цены, а не фиксированная стоимость?',
    answer:
      'Итоговый бюджет зависит от структуры сайта, количества уникальных страниц, контента, сложности дизайна, интеграций и того, нужен ли проекту просто запуск или сразу запас под дальнейшее масштабирование.',
  },
]

export const metadata: Metadata = {
  title: normalizeMetaTitle(pageTitle, 'SEO и разработка сайтов'),
  description: normalizeMetaDescription(
    pageDescription,
    'SEO-услуги и разработка сайтов под заявки: аудит, техническая база, контент, перезапуск текущего сайта и создание новой площадки с основой под рост и обращения.'
  ),
  alternates: {
    canonical: getFullUrl('/services'),
  },
  openGraph: {
    title: normalizeMetaTitle(pageTitle, 'SEO и разработка сайтов'),
    description: normalizeMetaDescription(
      pageDescription,
      'SEO-услуги и разработка сайтов под заявки: аудит, техническая база, контент, перезапуск текущего сайта и создание новой площадки с основой под рост и обращения.'
    ),
    url: getFullUrl('/services'),
    type: 'website',
  },
}

export default function ServicesIndexPage() {
  const faqSchema = createFaqSchema(serviceFaq)
  const breadcrumbsSchema = createBreadcrumbSchema([
    { name: 'Главная', path: '/' },
    { name: 'Услуги', path: '/services' },
  ])
  const collectionSchema = createCollectionPageSchema({
    path: '/services',
    name: pageTitle,
    description: pageDescription,
  })
  const itemListSchema = createItemListSchema({
    path: '/services',
    name: 'SEO-услуги и разработка сайтов',
    items: servicePages.map((service) => ({
      name: service.shortName,
      path: `/services/${service.slug}`,
      description: service.description,
    })),
  })

  return (
    <>
      <JsonLd id="services-faq-schema" data={faqSchema} />
      <JsonLd id="services-breadcrumbs-schema" data={breadcrumbsSchema} />
      <JsonLd id="services-collection-schema" data={collectionSchema} />
      <JsonLd id="services-item-list-schema" data={itemListSchema} />

      <div className="page-shell">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-slate-900">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Услуги</span>
        </nav>

        <section className="surface-grid surface-pad">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <div>
              <span className="warm-chip">SEO и разработка</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{pageTitle}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Подберите подходящий формат работ под задачу бизнеса: от аудита и SEO-базы до разработки нового сайта, перезапуска текущей площадки и дальнейшего роста через органику.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    Получить ориентир по услуге
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/">
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50">
                    Вернуться на главную
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Как выбрать формат</div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если нужно понять текущее состояние сайта и ограничения роста, логично начинать с SEO-аудита или консультационного разбора.
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если площадка устарела или не дает нормальных обращений, лучше смотреть в сторону разработки или перезапуска сайта с новой структурой и логикой.
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  Если сайт уже есть и ему нужен системный рост, дальше подключаются SEO-продвижение, техническая база, контент и усиление ключевых посадочных.
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalogSection />

        <section className="reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Частые вопросы по услугам</h2>
            </div>
            <div className="text-sm text-slate-500">Всего направлений: {servicePages.length}</div>
          </div>

          <div className="uniform-grid-2 mt-6 gap-4">
            {serviceFaq.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Консультация</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">Получить консультацию по выбору услуги</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Коротко опишите задачу, и я подскажу, с какого формата работ логичнее начать именно в вашем проекте: с аудита, разработки, доработки сайта или системного продвижения.
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
                <LazyContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
