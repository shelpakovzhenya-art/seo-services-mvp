import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { Button } from '@/components/ui/button'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'
import LazyContactForm from '@/components/LazyContactForm'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { servicePages } from '@/lib/service-pages'
import { createBreadcrumbSchema, createCollectionPageSchema, createFaqSchema, createItemListSchema } from '@/lib/structured-data'

const servicesIndexCopy: Record<Locale, any> = {
  ru: {
    pageTitle: 'SEO и разработка сайтов под заявки',
    pageDescription:
      'SEO-услуги и разработка сайтов под заявки: аудит, техническая база, структура, контент, разработка новых страниц и запуск площадки с основой под рост.',
    chip: 'SEO и разработка',
    cta: 'Получить ориентир по услуге',
    back: 'Вернуться на главную',
    chooseKicker: 'Как выбрать формат',
    chooseCards: [
      'Если непонятно, где проект теряет потенциал, логично начинать с SEO-аудита или консультационного разбора, а не покупать большой пул работ вслепую.',
      'Если площадка устарела, слабо презентует услуги и мешает расширению, лучше смотреть в сторону разработки или перезапуска, а не в косметические правки.',
      'Если база живая, а проекту нужен системный рост, тогда уже подключаются SEO-продвижение, технический слой, контент и усиление ключевых посадочных.',
    ],
    comparisonKicker: 'Что чаще всего путают',
    comparisonTitle: 'Три развилки, на которых коммерческие сайты обычно тратят лишний бюджет',
    comparisonText:
      'Эта страница должна помогать выбрать правильный первый шаг. Поэтому ниже не “список преимуществ”, а развилки между соседними форматами работ.',
    comparisonCards: [
      {
        title: 'Аудит vs системное SEO',
        text: 'Если пока непонятно, где именно лежит корневая проблема, разумнее брать аудит. Системное SEO сильнее работает тогда, когда приоритеты уже видны и нужен регулярный контур роста.',
      },
      {
        title: 'Technical SEO vs разработка',
        text: 'Если базу сайта можно вылечить без полной пересборки, техоптимизация окупится быстрее. Если же каждая доработка ломает архитектуру и мешает расширению, нужен новый каркас сайта.',
      },
      {
        title: 'Контент vs консалтинг',
        text: 'SEO-контент нужен, когда слабы сами страницы. Консалтинг полезнее, когда сильная команда уже есть, но ей нужен стратегический слой и приоритет решений.',
      },
    ],
    faqKicker: 'FAQ',
    faqTitle: 'Частые вопросы по услугам',
    faqCount: 'Всего направлений',
    contactKicker: 'Консультация',
    contactTitle: 'Получить консультацию по выбору услуги',
    contactText:
      'Коротко опишите задачу, и я подскажу, с какого формата работ логичнее начать именно в вашем проекте: с аудита, разработки, доработки сайта или системного продвижения.',
    contactNoteA: 'Ответим в течение дня.',
    contactNoteB: 'Покажем точки роста и следующий шаг без лишних обязательств.',
    metaTitle: 'SEO и разработка сайтов | Shelpakov Digital',
    metaDescription:
      'SEO-услуги и разработка сайтов под заявки: аудит, техническая база, контент, перезапуск текущего сайта и создание новой площадки с основой под рост и обращения.',
    faq: [
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
          'Итоговый бюджет зависит от структуры сайта, количества уникальных страниц, контента, сложности дизайна, интеграций и того, нужен проекту просто запуск или сразу запас под дальнейшее масштабирование.',
      },
    ],
  },
  en: {
    pageTitle: 'SEO and website development built for lead generation',
    pageDescription:
      'SEO services and website development for lead growth: audits, technical foundations, structure, content, new landing pages, and launching a platform prepared for scale.',
    chip: 'SEO and development',
    cta: 'Get guidance on the right service',
    back: 'Back to home',
    chooseKicker: 'How to choose the format',
    chooseCards: [
      'If it is still unclear where the project is losing momentum, it makes more sense to start with an SEO audit or strategic review than to buy a broad scope blindly.',
      'If the platform is outdated, presents services weakly, and resists expansion, development or a relaunch is usually stronger than cosmetic fixes.',
      'If the base is healthy and the site needs systematic growth, that is when ongoing SEO, technical work, content, and stronger key pages become the right next step.',
    ],
    comparisonKicker: 'What gets confused most often',
    comparisonTitle: 'Three forks where commercial websites usually waste unnecessary budget',
    comparisonText:
      'This page should help select the right first move. So below is not a benefits list, but a set of decision forks between adjacent service formats.',
    comparisonCards: [
      {
        title: 'Audit vs ongoing SEO',
        text: 'If the core bottleneck is still unclear, an audit is the stronger start. Ongoing SEO makes more sense once priorities are visible and the project needs a recurring growth loop.',
      },
      {
        title: 'Technical SEO vs development',
        text: 'If the current platform can be healed without a full rebuild, technical optimization usually pays back faster. If every change keeps breaking architecture and expansion, the base itself needs to be rebuilt.',
      },
      {
        title: 'Content vs consulting',
        text: 'SEO content is the right move when the pages themselves are weak. Consulting is stronger when the team already has execution capacity but needs a strategic decision layer.',
      },
    ],
    faqKicker: 'FAQ',
    faqTitle: 'Frequently asked questions about services',
    faqCount: 'Total service lines',
    contactKicker: 'Consultation',
    contactTitle: 'Get guidance on the right service mix',
    contactText:
      'Briefly describe the task, and I will suggest which format makes the most sense for your project right now: audit, development, refinement, or ongoing SEO.',
    contactNoteA: 'Reply within one business day.',
    contactNoteB: 'Clear growth points and a sensible next step without pressure.',
    metaTitle: 'SEO and website development | Shelpakov Digital',
    metaDescription:
      'SEO services and website development for lead growth: audits, technical foundations, content, relaunching an existing website, and building a stronger platform for scale.',
    faq: [
      {
        question: 'How do you know when a project needs a new website rather than just SEO?',
        answer:
          'You can usually tell from the architecture and the page logic. If the website is hard to expand, presents services weakly, fails to guide the user toward inquiry, and limits growth, development or a relaunch is often the right move.',
      },
      {
        question: 'Can we start with one service and expand the website later?',
        answer:
          'Yes. That is a healthy scenario: a compact version can launch around the main goal first, and new sections, articles, case studies, and landing pages can be added after that.',
      },
      {
        question: 'Do you handle development and SEO separately or together?',
        answer:
          'Both formats are possible. Some projects need a strong platform first, while others already need an audit, technical SEO, or ongoing growth work on top of an existing site.',
      },
      {
        question: 'Why do you show starting prices instead of a fixed cost?',
        answer:
          'The final budget depends on the site structure, number of unique pages, content scope, design complexity, integrations, and whether the project needs a launch-only version or room for future expansion from day one.',
      },
    ],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const copy = servicesIndexCopy[locale]
  const alternates = getLocaleAlternates('/services')

  return {
    title: normalizeMetaTitle(copy.pageTitle, copy.metaTitle),
    description: normalizeMetaDescription(copy.pageDescription, copy.metaDescription),
    alternates,
    openGraph: {
      title: normalizeMetaTitle(copy.pageTitle, copy.metaTitle),
      description: normalizeMetaDescription(copy.pageDescription, copy.metaDescription),
      url: alternates.canonical,
      type: 'website',
    },
  }
}

export default async function ServicesIndexPage() {
  const locale = await getRequestLocale()
  const copy = servicesIndexCopy[locale]

  const faqSchema = createFaqSchema(copy.faq)
  const breadcrumbsSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: locale === 'ru' ? 'Услуги' : 'Services', path: '/services' },
  ])
  const collectionSchema = createCollectionPageSchema({
    path: '/services',
    name: copy.pageTitle,
    description: copy.pageDescription,
  })
  const itemListSchema = createItemListSchema({
    path: '/services',
    name: copy.pageTitle,
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
          <Link href={prefixPathWithLocale('/', locale)} className="transition hover:text-slate-900">
            {locale === 'ru' ? 'Главная' : 'Home'}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{locale === 'ru' ? 'Услуги' : 'Services'}</span>
        </nav>

        <section className="surface-grid surface-pad">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <div>
              <span className="warm-chip">{copy.chip}</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{copy.pageTitle}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{copy.pageDescription}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    {copy.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href={prefixPathWithLocale('/', locale)}>
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50">
                    {copy.back}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.chooseKicker}</div>
              <div className="mt-4 space-y-3">
                {copy.chooseCards.map((item: string) => (
                  <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ServicesCatalogSection />

        <section className="reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.comparisonKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.comparisonTitle}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{copy.comparisonText}</p>
          </div>

          <div className="uniform-grid-3 mt-6 gap-4">
            {copy.comparisonCards.map((item: any) => (
              <div key={item.title} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.faqKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.faqTitle}</h2>
            </div>
            <div className="text-sm text-slate-500">{copy.faqCount}: {servicePages.length}</div>
          </div>

          <div className="uniform-grid-2 mt-6 gap-4">
            {copy.faq.map((item: any) => (
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
              <div className="border-b border-orange-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.contactKicker}</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">{copy.contactNoteA}</div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">{copy.contactNoteB}</div>
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <LazyContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
