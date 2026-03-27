import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, Clock3 } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import { getServicePageStrategy } from '@/lib/service-page-strategy'
import LazyContactForm from '@/components/LazyContactForm'
import { getServiceProofLinks, getServiceStartChecklist } from '@/lib/service-proof-data'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { createBreadcrumbSchema, createFaqSchema, createServiceSchema } from '@/lib/structured-data'
import { formatServiceBillingUnit, formatServicePrice, type ServicePricing } from '@/lib/service-pricing'
import { getServicePage, type ServicePageContent } from '@/lib/service-pages'
import { seoIntentLinksRu } from '@/lib/service-market-expansion'

type ServicePageTemplateProps = {
  service: ServicePageContent
  locale: Locale
  pricing?: ServicePricing | null
  customContent?: string | null
}

function VisualCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[30px] p-6">
      <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-orange-200/40 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl" />
      <div className="relative flex min-h-[220px] flex-1 flex-col justify-end rounded-[22px] border border-white/70 bg-gradient-to-br from-white via-orange-50 to-cyan-50 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{eyebrow}</div>
        <div className="mt-3 text-2xl font-semibold text-slate-950">{title}</div>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

const seoAuditDeliverables = [
  {
    title: 'Где сайт теряет спрос',
    text: 'В начале отчёта видно, какие типы страниц, шаблоны и служебные зоны больше всего мешают росту прямо сейчас.',
  },
  {
    title: 'Приоритеты на 30-60 дней',
    text: 'Замечания раскладываются по очередности внедрения: что чинить сразу, что брать следующей волной и что пока не стоит трогать.',
  },
  {
    title: 'Примеры URL и скриншоты',
    text: 'Каждый крупный вывод опирается на конкретные страницы и живые примеры, чтобы разработке и маркетингу не пришлось додумывать проблему.',
  },
  {
    title: 'Пакет для внедрения',
    text: 'Отчёт остаётся рабочим документом после созвона: его можно передать команде, подрядчику или использовать как основу следующего этапа.',
  },
]

const seoAuditSignals = [
  'Когда после редизайна, миграции или потока правок стало непонятно, что именно режет видимость и заявки.',
  'Когда у сайта есть трафик, но коммерческие страницы не дожимают пользователя до обращения.',
  'Когда нужен не список советов, а документ, по которому можно реально ставить задачи в работу.',
]

export default function ServicePageTemplate({ service, locale, pricing, customContent }: ServicePageTemplateProps) {
  const strategy = getServicePageStrategy(service.slug)
  const proofLinks = getServiceProofLinks(service.slug)
  const startChecklist = getServiceStartChecklist(service.slug)
  const localizeHref = (href: string) => (href.startsWith('/') ? prefixPathWithLocale(href, locale) : href)
  const decisionServices = strategy.decisions
    .map((item) => {
      const relatedService = getServicePage(item.slug)

      if (!relatedService) {
        return null
      }

      return {
        ...item,
        service: relatedService,
      }
    })
    .filter((item): item is { slug: string; reason: string; service: ServicePageContent } => Boolean(item))
  const faqSchema = createFaqSchema(service.faq)
  const serviceSchema = createServiceSchema(service, pricing, locale)
  const breadcrumbsSchema = createBreadcrumbSchema([
    { name: 'Главная', path: '/' },
    { name: 'Услуги', path: '/services' },
    { name: service.shortName, path: `/services/${service.slug}` },
  ], { locale })

  return (
    <>
      <JsonLd id={`service-${service.slug}`} data={serviceSchema} />
      <JsonLd id={`faq-${service.slug}`} data={faqSchema} />
      <JsonLd id={`breadcrumbs-${service.slug}`} data={breadcrumbsSchema} />

      <div className="page-shell pb-28 md:pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href={localizeHref('/')} className="transition hover:text-slate-900">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={localizeHref('/services')} className="transition hover:text-slate-900">
            Услуги
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{service.shortName}</span>
        </nav>

        <section className="surface-grid surface-pad overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <span className="warm-chip">{service.label}</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{service.h1}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{service.heroValue}</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{service.subheading}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    {service.ctas.rational}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href={localizeHref('/services')}>
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50">
                    Все услуги
                  </Button>
                </Link>
                {pricing ? (
                  <Link href={localizeHref('/calculator')}>
                    <Button size="lg" variant="outline" className="rounded-full border-orange-200 bg-[#fffaf5] px-7 text-slate-900 hover:bg-orange-50">
                      {pricing.priceLabel}
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Ответим в течение дня</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Без обязательств</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Скажем, с чего начинать</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-6">
                <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Ключевая задача</div>
                <p className="mt-3 text-base leading-8 text-slate-700">{service.intro}</p>
                {pricing ? (
                  <div className="mt-5 rounded-[24px] border border-orange-100 bg-white/80 p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Стартовая стоимость</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{formatServicePrice(pricing.priceFrom)}</div>
                    <div className="mt-1 text-sm text-slate-500">{formatServiceBillingUnit(pricing.unit)}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{pricing.calculatorHint}</p>
                  </div>
                ) : null}
              </div>

              <VisualCard
                eyebrow="Фокус услуги"
                title={service.images.heroAlt}
                description="Коротко о роли этой услуги в проекте и о том, какую задачу она закрывает."
              />
            </div>
          </div>
        </section>

        {service.slug === 'seo-audit' ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Формат аудита</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
                Аудит собирается как рабочий документ для внедрения
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Важна не только глубина проверки, но и то, как выводы переходят в работу. Поэтому внутри не просто crawl и список ошибок,
                а приоритетные страницы, примеры URL, бизнес-эффект замечаний и порядок внедрения на ближайшие недели.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {seoAuditDeliverables.map((item) => (
                  <div
                    key={item.title}
                    className="flex min-h-[260px] flex-col rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 md:min-h-[220px]"
                  >
                    <h3 className="text-2xl font-semibold leading-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-base leading-8 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6">
                <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Что получает клиент</div>
                <div className="mt-4 rounded-[26px] border border-white/70 bg-gradient-to-br from-white via-orange-50 to-cyan-50 p-6">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Формат выдачи</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">PDF, DOCX и HTML-версия отчёта</div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Такой комплект удобно обсуждать на созвоне, пересылать в команду и использовать как рабочее ТЗ без ручной
                    перепаковки и пересказов.
                  </p>
                </div>
              </div>

              <div className="page-card">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Когда особенно полезно</p>
                <div className="mt-4 space-y-3">
                  {seoAuditSignals.map((item) => (
                    <div key={item} className="rounded-2xl border border-cyan-100 bg-cyan-50/50 px-5 py-4 text-sm leading-7 text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-slate-950">Какие направления SEO чаще всего ищут отдельно</h3>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                На рынке часто выигрывают не самые длинные страницы, а те, где отдельными посадочными закрыты Google, Яндекс, новый сайт и корпоративный сайт. Эти сценарии вынесены в самостоятельные услуги, чтобы поисковое продвижение сайта закрывало спрос точнее и не расползалось в одну слишком общую страницу.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {seoIntentLinksRu.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href)}
                    className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/80"
                  >
                    <h4 className="text-xl font-semibold text-slate-950">{item.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                      Открыть страницу
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {service.slug === 'seo' ? (
          <section className="mt-8 page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Короткий ответ</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Что такое SEO-продвижение</h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
              SEO-продвижение сайта — это системная работа над технической базой, структурой страниц, контентом,
              внутренними сигналами доверия и логикой заявки, чтобы сайт лучше отвечал на поисковый спрос и получал
              больше целевых обращений из органики.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
                Техническая часть отвечает за индексацию, скорость, чистую структуру URL, sitemap и отсутствие
                критичных ошибок.
              </div>
              <div className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
                Содержательная часть помогает собрать сильные страницы услуг, экспертный контент и понятную логику
                ответа на интент пользователя.
              </div>
              <div className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
                Коммерческая часть усиливает доверие к сайту и помогает превратить поисковый трафик в заявку, а не
                просто в посещение.
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Как понять, подходит ли услуга</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{strategy.diagnosticTitle}</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{strategy.diagnosticIntro}</p>
            <div className="mt-6 space-y-4">
              {strategy.diagnostics.map((item) => (
                <div key={item.signal} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{item.signal}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    <span className="font-medium text-slate-900">Из-за чего это происходит:</span> {item.cause}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    <span className="font-medium text-slate-900">Почему здесь подходит именно эта услуга:</span> {item.fit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Когда не подходит</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{strategy.misfitTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">{strategy.misfitIntro}</p>
            <div className="mt-6 space-y-3">
              {strategy.misfits.map((item) => (
                <div key={item.title} className="rounded-2xl border border-cyan-100 bg-cyan-50/60 px-5 py-4">
                  <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {service.formats?.length ? (
          <section className="mt-8 page-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Форматы разработки</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Можно стартовать с понятного масштаба проекта</h2>
              </div>
              {pricing ? (
                <div className="rounded-full border border-orange-200 bg-[#fffaf5] px-4 py-2 text-sm font-medium text-slate-700">
                  {pricing.priceLabel}
                </div>
              ) : null}
            </div>

            <div className="uniform-grid-4 mt-6 gap-5">
              {service.formats.map((format) => (
                <div
                  key={`${format.title}-${format.price}`}
                  className="uniform-card rounded-[26px] border border-orange-100 bg-white/85 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{format.price}</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{format.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{format.description}</p>
                  {format.note ? (
                    <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-slate-700">
                      {format.note}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {customContent ? (
          <section className="reading-shell mt-8">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Дополнительный блок</p>
            <RichContent content={customContent} title={service.h1} className="editorial-prose mt-6 max-w-none" />
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Кому подходит</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Когда эта услуга особенно полезна</h2>
            <div className="mt-6 space-y-3">
              {service.audience.map((item) => (
                <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что входит</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Состав работ по услуге</h2>
            <div className="mt-6 grid gap-3">
              {service.includes.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/50 px-5 py-4">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Ограничения и компромиссы</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{strategy.frictionTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">{strategy.frictionIntro}</p>
            <div className="mt-6 space-y-4">
              {strategy.frictions.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-orange-100 bg-white/80 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Матрица выбора</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{strategy.decisionTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">{strategy.decisionIntro}</p>
            <div className="mt-6 space-y-4">
              {decisionServices.map((item) => (
                <Link
                  key={item.service.slug}
                  href={localizeHref(`/services/${item.service.slug}`)}
                  className="block rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/70"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{item.service.label}</div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.service.shortName}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.reason}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    Перейти к услуге
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что посмотреть до старта</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Материалы по теме услуги</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
              Ниже кейсы, статьи и соседние услуги, по которым можно быстро понять подход, глубину работ и соседние форматы.
            </p>
            <div className="mt-6 space-y-4">
              {proofLinks.map((item) => (
                <Link
                  key={`${service.slug}-${item.href}-${item.title}`}
                  href={localizeHref(item.href)}
                  className="block rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/70"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{item.kicker}</div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    Открыть материал
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Первое сообщение</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Что прислать сразу, чтобы быстрее получить ответ</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              Этого достаточно, чтобы быстро понять объём задачи, первый приоритет и нужен ли здесь именно этот формат работ.
            </p>
            <div className="mt-6 space-y-3">
              {startChecklist.map((item, index) => (
                <div key={`${service.slug}-start-${index}`} className="flex items-start gap-4 rounded-[24px] border border-orange-100 bg-[#fffaf5] px-5 py-4">
                  <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">{`0${index + 1}`}</div>
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-cyan-100 bg-cyan-50/60 p-5 text-sm leading-7 text-slate-700">
              Если доступов, цифр или материалов пока нет, хватит домена и короткого описания симптома. Этого уже достаточно,
              чтобы понять, нужен аудит, техработы, переработка страниц или новый сайт.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 surface-pad">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Без длинного созвона</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Можно начать с домена и короткого описания задачи</h2>
            </div>
            <a href="#contact-form">
              <Button className="rounded-full">{service.ctas.soft}</Button>
            </a>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Достаточно прислать домен, задачу и 2-3 фразы про текущий симптом. В ответ будет понятно, какой формат уместен сейчас и где лежит первый приоритет.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Этапы работы</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Как обычно строится работа</h2>
            <div className="mt-6 space-y-4">
              {service.steps.map((step, index) => (
                <div key={step.title} className="flex flex-col gap-4 rounded-[24px] border border-orange-100 bg-white/70 p-5 sm:flex-row sm:gap-5">
                  <div className="text-3xl font-semibold text-cyan-700">{`0${index + 1}`}</div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <VisualCard
              eyebrow="Процесс работы"
              title={service.images.processAlt}
              description="Как обычно идёт работа: от разбора задачи до внедрения и контроля результата."
            />
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что будет на выходе</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Что меняется в процессе и на сайте</h2>
              <div className="mt-6 space-y-3">
                {service.outcomes.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                    <span className="text-sm leading-7 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {service.stack?.length ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Технологии и интеграции</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Собираю сайт так, чтобы он не мешал дальнейшему развитию</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                Важно не только то, как выглядит первый экран, но и то, насколько гибко сайт можно развивать: добавлять новые разделы, подключать интеграции, усиливать контент и наращивать SEO-посадочные без полной пересборки.
              </p>
            </div>

            <div className="uniform-grid-3 gap-5">
              {service.stack.map((group) => (
                <div
                  key={group.label}
                  className="uniform-card rounded-[26px] border border-orange-100 bg-white/85 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{group.label}</div>
                  <div className="mt-5 space-y-3">
                    {group.items.map((item) => (
                      <div key={item} className="flex gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                        <span className="text-sm leading-6 text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Результаты</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">На что влияет эта работа</h2>
            <div className="mt-6 space-y-4">
              {service.results.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5">
                  <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <VisualCard
              eyebrow="Ожидаемый эффект"
              title={service.images.resultsAlt}
              description="Что обычно меняется после внедрения основных правок по услуге."
            />
            <div className="rounded-[30px] border border-orange-100 bg-gradient-to-r from-white via-orange-50 to-white p-6">
              <div className="flex items-center gap-3 text-slate-900">
                <Clock3 className="h-5 w-5 text-cyan-700" />
                <span className="font-medium">{service.ctas.fast}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Если задача срочная, можно быстро обсудить текущую ситуацию, получить первичный ориентир и понять, нужен ли проекту аудит, разработка, системное продвижение или точечная доработка.
              </p>
              <a href="#contact-form" className="mt-5 inline-flex">
                <Button className="rounded-full">Обсудить проект сегодня</Button>
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Вопросы перед стартом</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Что обычно уточняют до запуска работ</h2>
            </div>
            <a href="#contact-form" className="inline-flex">
              <Button variant="outline" className="rounded-full border-slate-300 bg-white">
                {service.ctas.soft}
              </Button>
            </a>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{strategy.faqLead}</p>
          <div className="mt-6 space-y-4">
            {service.faq.map((item) => (
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
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Консультация</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{service.ctas.rational}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Опишите сайт, задачу и текущую ситуацию. Я скажу, нужен ли здесь аудит, техработы, переработка страниц или новый сайт.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    Ответим в течение дня и сразу подскажем, какой формат работ здесь уместен.
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    Если задача точечная, так и скажем. Если нужен большой объём, тоже обозначим это сразу.
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <LazyContactForm />
              </div>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <a href="#contact-form" className="block">
            <Button className="w-full rounded-full">{service.ctas.fast}</Button>
          </a>
        </div>
      </div>
    </>
  )
}
