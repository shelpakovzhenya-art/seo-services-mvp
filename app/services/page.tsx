import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import BrandPageHero from '@/components/BrandPageHero'
import { Button } from '@/components/ui/button'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'
import LazyContactForm from '@/components/LazyContactForm'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { getServicePagesForLocale } from '@/lib/service-page-localization'
import { createBreadcrumbSchema, createCollectionPageSchema, createFaqSchema, createItemListSchema } from '@/lib/structured-data'

const servicesIndexCopy: Record<Locale, any> = {
  ru: {
    pageTitle: 'SEO и разработка сайтов под заявки',
    pageDescription:
      'SEO-услуги и разработка сайтов: аудит, техбаза, переработка ключевых страниц и запуск новой площадки, когда старый сайт уже мешает.',
    chip: 'SEO и разработка',
    cta: 'Получить ориентир по услуге',
    back: 'Вернуться на главную',
    chooseKicker: 'Как выбрать формат',
    chooseCards: [
      'Если трафик уже есть, но непонятно, где теряются заявки, логичнее начинать с аудита.',
      'Если сайт устарел на уровне структуры и мешает продажам, нужен не косметический ремонт, а пересборка.',
      'Если база уже нормальная, дальше подключаются SEO, техработы, контент и усиление ключевых страниц.',
    ],
    comparisonKicker: 'Что чаще всего путают',
    comparisonTitle: 'Где чаще всего выбирают не тот первый шаг',
    comparisonText:
      'Ниже короткое сравнение соседних услуг без рекламной упаковки. Оно помогает не переплатить за лишний объём на старте.',
    comparisonCards: [
      {
        title: 'Аудит vs системное SEO',
        text: 'Если корневая проблема ещё не ясна, начните с аудита. Системное SEO нужно тогда, когда приоритеты уже понятны и нужен регулярный темп работ.',
      },
      {
        title: 'Technical SEO vs разработка',
        text: 'Если базу сайта можно починить без полной пересборки, техработы окупятся быстрее. Если любая доработка ломает архитектуру, нужен новый каркас сайта.',
      },
      {
        title: 'Контент vs консалтинг',
        text: 'SEO-контент нужен, когда слабы сами страницы. Консалтинг нужен, когда исполнители уже есть, а не хватает приоритетов и контроля решений.',
      },
    ],
    faqKicker: 'FAQ',
    faqTitle: 'Частые вопросы по услугам',
    faqCount: 'Всего направлений',
    contactKicker: 'Консультация',
    contactTitle: 'Можно прислать сайт и задачу',
    contactText:
      'Опишите домен, задачу и последние изменения на сайте. Так быстрее понять, нужен аудит, техработы, переработка страниц или новый сайт.',
    contactNoteA: 'Отвечу в течение дня.',
    contactNoteB: 'В ответе скажу, с чего начинать и нужен ли вообще большой объём работ.',
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
      'SEO services and website development: audits, technical foundations, key-page rewrites, and new websites when the old one is already getting in the way.',
    chip: 'SEO and development',
    cta: 'Get guidance on the right service',
    back: 'Back to home',
    chooseKicker: 'How to choose the format',
    chooseCards: [
      'If traffic already exists but it is unclear where leads are being lost, start with an audit.',
      'If the site is outdated at the structural level and gets in the way of sales, it needs a rebuild, not cosmetic fixes.',
      'If the base is already solid, the next step is ongoing SEO, technical work, content, and stronger key pages.',
    ],
    comparisonKicker: 'What gets confused most often',
    comparisonTitle: 'Where businesses most often choose the wrong first step',
    comparisonText:
      'This is a short comparison of adjacent services without sales language, so the first move is easier to choose.',
    comparisonCards: [
      {
        title: 'Audit vs ongoing SEO',
        text: 'If the core bottleneck is still unclear, start with an audit. Ongoing SEO makes sense once priorities are visible and the work needs a steady rhythm.',
      },
      {
        title: 'Technical SEO vs development',
        text: 'If the current platform can be fixed without a full rebuild, technical work usually pays back faster. If every change keeps breaking architecture, the base itself needs rebuilding.',
      },
      {
        title: 'Content vs consulting',
        text: 'SEO content is the right move when the pages themselves are weak. Consulting is the right move when in-house execution exists, but priorities and strategic control are still missing.',
      },
    ],
    faqKicker: 'FAQ',
    faqTitle: 'Frequently asked questions about services',
    faqCount: 'Total service lines',
    contactKicker: 'Consultation',
    contactTitle: 'Send the site and the task',
    contactText:
      'Send the domain, the task, and the latest site changes. That makes it much faster to understand whether the project needs an audit, technical work, page rewrites, or a new site.',
    contactNoteA: 'Reply within one business day.',
    contactNoteB: 'The reply will say what to start with and whether the project actually needs a bigger scope.',
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
        question: 'Can a project start with one service and expand the website later?',
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
  const services = getServicePagesForLocale(locale)

  const faqSchema = createFaqSchema(copy.faq)
  const breadcrumbsSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: locale === 'ru' ? 'Услуги' : 'Services', path: '/services' },
  ], { locale })
  const collectionSchema = createCollectionPageSchema({
    path: '/services',
    name: copy.pageTitle,
    description: copy.pageDescription,
  }, { locale })
  const itemListSchema = createItemListSchema({
    path: '/services',
    name: copy.pageTitle,
    items: services.map((service) => ({
      name: service.shortName,
      path: `/services/${service.slug}`,
      description: service.description,
    })),
  }, { locale })

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

        <BrandPageHero
          eyebrow={copy.chip}
          title={copy.pageTitle}
          description={copy.pageDescription}
          actions={
            <a href="#contact-form">
              <Button size="lg" className="rounded-full px-7">
                {copy.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          }
        />

        <ServicesCatalogSection />

        <section className="reading-shell">
          <div className="brand-chip">{copy.comparisonKicker}</div>
          <h2 className="text-3xl font-semibold text-slate-950">{copy.comparisonTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{copy.comparisonText}</p>
          <div className="uniform-grid-3 mt-6 gap-4">
            {copy.comparisonCards.map((item: any) => (
              <div key={item.title} className="uniform-card brand-card-soft p-5">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="reading-shell">
          <div className="brand-chip">{copy.faqKicker}</div>
          <h2 className="text-3xl font-semibold text-slate-950">{copy.faqTitle}</h2>
          <div className="mt-3 text-sm text-slate-500">{copy.faqCount}: {services.length}</div>

          <div className="uniform-grid-2 mt-6 gap-4">
            {copy.faq.map((item: any) => (
              <div key={item.question} className="uniform-card brand-card p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>
                <div className="mt-6 space-y-3">
                  <div className="brand-card-soft px-4 py-4 text-sm leading-7 text-slate-700">{copy.contactNoteA}</div>
                  <div className="brand-card px-4 py-4 text-sm leading-7 text-slate-700">{copy.contactNoteB}</div>
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
