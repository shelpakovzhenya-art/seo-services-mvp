import JsonLd from '@/components/JsonLd'
import BrandPageHero from '@/components/BrandPageHero'
import LazyCalculator from '@/components/LazyCalculator'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { localizeServicePricingList } from '@/lib/service-pricing-localization'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { getMergedServicePricingList } from '@/lib/service-pricing-overrides'

const calculatorCopy: Record<Locale, any> = {
  ru: {
    title: 'Калькулятор SEO-услуг',
    description:
      'Калькулятор SEO-услуг для предварительной оценки бюджета на аудит, техническую базу, контент, сопровождение и рост органического канала.',
    heroTitle: 'Подберите формат SEO-работ и получите ориентир по бюджету',
    heroDescription:
      'Собрал калькулятор по текущей линейке услуг: от аудита и технической базы до системного SEO, контента и запуска новых разделов под рост заявок.',
    highlights: ['Рыночный ориентир по стоимости', 'Без навязывания лишних задач', 'Понятный старт под ваш проект'],
    howTo: 'Как пользоваться',
    steps: [
      { title: 'Соберите нужные направления', description: 'Отметьте услуги, которые сейчас действительно нужны проекту: от аудита и техбазы до системного SEO или разработки.' },
      { title: 'Получите ориентир по бюджету', description: 'Калькулятор показывает стартовую стоимость по выбранной связке услуг и помогает быстро сверить сценарии запуска.' },
      { title: 'Уточним состав работ вручную', description: 'После заявки я смотрю масштаб сайта, число разделов, состояние базы и подсказываю, что брать сейчас, а что можно отложить.' },
    ],
    estimateKicker: 'Предварительный расчёт',
    estimateTitle: 'Соберите рабочую связку услуг под ваш сайт',
    estimateText: 'Калькулятор не заменяет разбор проекта, но помогает быстро понять порядок бюджета и выбрать разумный старт без лишних этапов.',
    pricingKicker: 'Что влияет на стоимость',
    pricingTitle: 'Цена зависит не только от услуги, но и от масштаба проекта',
    pricingFactors: [
      'Чем больше шаблонов, разделов и точек входа в спрос, тем выше объём аналитики, контента и внедрения.',
      'Для eCommerce, B2B и геозависимых проектов обычно требуется более глубокая структура и отдельная работа с коммерческими страницами.',
      'Если часть базы уже сделана, можно начать с точечной услуги и не брать полное сопровождение с первого шага.',
    ],
    cautionKicker: 'Где калькулятор упрощает реальность',
    cautionTitle: 'Предварительная сумма полезна как ориентир, но три фактора почти всегда сильнее всего двигают бюджет',
    cautionCards: [
      'Старый сайт с хаотичной архитектурой почти всегда требует больше работ, чем кажется по числу страниц.',
      'Срочные внедрения, переезд, фильтры, шаблонные доработки и нестандартные интеграции резко поднимают стоимость сильнее, чем “ещё один текст”.',
      'Если проекту нужен запас под будущий рост, бюджет надо считать не только на запуск, но и на то, чтобы сайт не пришлось пересобирать через несколько месяцев.',
    ],
    contactKicker: 'Обсудить задачу',
    contactTitle: 'Оставьте заявку, если нужен точный расчёт',
    contactText: 'Напишите сайт, текущую задачу и что уже делали. В ответ покажу, какой формат работ подойдёт именно сейчас и где можно не переплачивать.',
  },
  en: {
    title: 'SEO services calculator',
    description:
      'An SEO services calculator for estimating the budget for audits, technical foundations, content, ongoing support, and organic growth.',
    heroTitle: 'Choose the right SEO format and get a budget estimate',
    heroDescription:
      'This calculator covers the current service line: from audits and technical foundations to ongoing SEO, content, and launching new growth-focused sections.',
    highlights: ['A realistic market benchmark', 'No unnecessary scope inflation', 'A clear starting point for your project'],
    howTo: 'How it works',
    steps: [
      { title: 'Select the service lines you need', description: 'Choose the services that genuinely fit the current stage of the project: from audit and technical setup to ongoing SEO or development.' },
      { title: 'Get an initial budget range', description: 'The calculator shows a starting estimate for the selected service mix and helps compare launch scenarios quickly.' },
      { title: 'Refine the scope manually', description: 'After the request, I review the project scale, number of sections, and the current state of the site to clarify what should happen now and what can wait.' },
    ],
    estimateKicker: 'Initial estimate',
    estimateTitle: 'Build a practical service mix for your website',
    estimateText: 'The calculator does not replace an expert review, but it helps you understand the budget range and choose a sensible starting point without unnecessary stages.',
    pricingKicker: 'What affects pricing',
    pricingTitle: 'Price depends not only on the service, but on the scale of the project',
    pricingFactors: [
      'The more templates, sections, and demand entry points a website has, the more analysis, content, and implementation effort it needs.',
      'eCommerce, B2B, and geo-dependent projects usually require deeper structure and separate work on commercial pages.',
      'If part of the foundation is already in place, it is often possible to start with a narrower service instead of full support from day one.',
    ],
    cautionKicker: 'Where the calculator simplifies reality',
    cautionTitle: 'The estimate is useful as a benchmark, but three factors almost always move the budget the most',
    cautionCards: [
      'An old website with chaotic architecture almost always needs more work than its page count suggests.',
      'Urgent implementation, migrations, filters, template-level changes, and custom integrations usually raise cost more than “one more text”.',
      'If the project needs room for future growth, the budget should cover not only launch, but also the ability to expand without rebuilding the site a few months later.',
    ],
    contactKicker: 'Discuss the task',
    contactTitle: 'Send a request if you need a precise estimate',
    contactText: 'Share the website, the current task, and what has already been done. I will show which work format fits right now and where the budget can stay efficient.',
  },
}

export default async function CalculatorPage() {
  const locale = await getRequestLocale()
  const copy = calculatorCopy[locale]
  let page: any = null
  const pricing = localizeServicePricingList(await getMergedServicePricingList(), locale)

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    console.error('Error loading calculator page:', error)
  }

  const localizedPage = locale === 'ru' ? page : null
  const pageContent = stripLeadingMarkdownH1(localizedPage?.content, localizedPage?.h1 || localizedPage?.title || copy.title)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: copy.title, path: '/calculator' },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id="calculator-breadcrumbs-schema" data={breadcrumbSchema} />

      <BrandPageHero
        eyebrow={locale === 'ru' ? 'Калькулятор' : 'Calculator'}
        title={localizedPage?.h1 || copy.heroTitle}
        description={localizedPage?.description || copy.heroDescription}
        badges={copy.highlights}
        aside={
          <div className="page-aside-card">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.howTo}</div>
            <div className="mt-4 space-y-3">
              {copy.steps.map((item: any, index: number) => (
                <div key={item.title} className="rounded-[20px] border border-slate-200 bg-white/75 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="brand-badge text-[11px] tracking-[0.18em] uppercase">{`0${index + 1}`}</span>
                    <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="mt-8 surface-grid p-4 md:p-6">
        <h2 className="mb-6 text-3xl font-semibold text-slate-950 md:text-4xl">{copy.estimateTitle}</h2>

        <LazyCalculator
          locale={locale}
          services={pricing.map((service) => ({
            id: service.slug,
            slug: service.slug,
            name: service.name,
            description: service.shortDescription,
            price: service.priceFrom,
            unit: service.priceLabel,
            hint: service.calculatorHint,
            deliverables: service.deliverables,
          }))}
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <div className="reading-shell h-full">
          <h2 className="text-3xl font-semibold text-slate-950">{copy.pricingTitle}</h2>
          <div className="mt-6 space-y-3">
            {copy.pricingFactors.map((item: string) => (
              <div key={item} className="brand-card-soft px-5 py-4 text-sm leading-7 text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="page-card h-full">
          <h2 className="text-3xl font-semibold text-slate-950">{copy.cautionTitle}</h2>
          <div className="mt-6 space-y-3">
            {copy.cautionCards.map((item: string) => (
              <div key={item} className="brand-card px-5 py-4 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div id="contact-form" className="soft-section h-full scroll-mt-32 overflow-hidden md:scroll-mt-36">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>
            </div>
            <div className="p-5 sm:p-8">
              <LazyContactForm />
            </div>
          </div>
        </div>
      </section>

      {pageContent ? (
        <section className="mt-8 reading-shell">
          <div className="editorial-prose max-w-none">
            <RichContent content={pageContent} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = calculatorCopy[locale]
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    page = null
  }

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/calculator')
  const title = normalizeMetaTitle(localizedPage?.title, `${copy.title} | Shelpakov Digital`)
  const description = normalizeMetaDescription(localizedPage?.description, copy.description)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
