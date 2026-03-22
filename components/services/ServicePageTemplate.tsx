import Link from 'next/link'
import Script from 'next/script'
import { ArrowRight, Check, ChevronRight, Clock3 } from 'lucide-react'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import LazyContactForm from '@/components/LazyContactForm'
import { getFullUrl } from '@/lib/site-url'
import { formatServiceBillingUnit, formatServicePrice, type ServicePricing } from '@/lib/service-pricing'
import { getRelatedServices, type ServicePageContent } from '@/lib/service-pages'

type ServicePageTemplateProps = {
  service: ServicePageContent
  pricing?: ServicePricing | null
  customContent?: string | null
}

function JsonLd({ data, id }: { data: object; id: string }) {
  return <Script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
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
      <div className="relative flex min-h-[220px] flex-col justify-end rounded-[22px] border border-white/70 bg-gradient-to-br from-white via-orange-50 to-cyan-50 p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{eyebrow}</div>
        <div className="mt-3 text-2xl font-semibold text-slate-950">{title}</div>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

export default function ServicePageTemplate({ service, pricing, customContent }: ServicePageTemplateProps) {
  const relatedServices = getRelatedServices(service.related)
  const pageUrl = getFullUrl(`/services/${service.slug}`)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.h1,
    description: service.description,
    serviceType: service.shortName,
    areaServed: 'RU',
    provider: {
      '@type': 'Organization',
      name: 'Shelpakov Digital',
      url: getFullUrl('/'),
    },
    url: pageUrl,
    offers: pricing
      ? {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          price: pricing.priceFrom,
          description: pricing.priceLabel,
        }
      : undefined,
  }

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: getFullUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: getFullUrl('/services') },
      { '@type': 'ListItem', position: 3, name: service.shortName, item: pageUrl },
    ],
  }

  return (
    <>
      <JsonLd id={`service-${service.slug}`} data={serviceSchema} />
      <JsonLd id={`faq-${service.slug}`} data={faqSchema} />
      <JsonLd id={`breadcrumbs-${service.slug}`} data={breadcrumbsSchema} />

      <div className="page-shell pb-28 md:pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-slate-900">
            Главная
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/services" className="transition hover:text-slate-900">
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
                <Link href="/services">
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50">
                    Все услуги
                  </Button>
                </Link>
                {pricing ? (
                  <Link href="/calculator">
                    <Button size="lg" variant="outline" className="rounded-full border-orange-200 bg-[#fffaf5] px-7 text-slate-900 hover:bg-orange-50">
                      {pricing.priceLabel}
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Ответим в течение дня</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Без обязательств</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Покажем точки роста</span>
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
                description="Основной смысл услуги, ее роль в проекте и тот результат, к которому она должна привести сайт."
              />
            </div>
          </div>
        </section>

        <section className="uniform-grid-4 mt-8">
          {service.benefits.map((item) => (
            <div key={item.title} className="uniform-card glass-panel interactive-card p-6">
              <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
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
                  <p className="mt-3 text-sm leading-7 text-slate-600">{format.description}</p>
                  {format.note ? (
                    <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-slate-700">
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

        <section className="mt-8 rounded-[32px] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 surface-pad">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Быстрый вход</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Нужен понятный ориентир без долгого созвона?</h2>
            </div>
            <a href="#contact-form">
              <Button className="rounded-full">{service.ctas.soft}</Button>
            </a>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            Достаточно коротко описать задачу, сайт и текущую ситуацию. В ответ покажу, где у проекта основной потенциал и какой формат работы будет уместен именно сейчас.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Этапы работы</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Как обычно строится работа</h2>
            <div className="mt-6 space-y-4">
              {service.steps.map((step, index) => (
                <div key={step.title} className="flex gap-5 rounded-[24px] border border-orange-100 bg-white/70 p-5">
                  <div className="text-3xl font-semibold text-cyan-700">{`0${index + 1}`}</div>
                  <div>
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
              description="Этапы реализации, по которым услуга переходит от анализа к внедрению и контролю результата."
            />
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что получает клиент</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Результат на уровне процесса и сайта</h2>
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
              description="Итоговое усиление структуры, индексации, подачи и тех зон сайта, которые помогают проекту расти стабильнее."
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
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Экспертный блок</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">{service.seoBlockTitle}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {service.seoParagraphs.map((paragraph) => (
              <p key={paragraph} className="rounded-[24px] border border-orange-100 bg-white/70 p-5 text-sm leading-8 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8 reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Частые вопросы по услуге</h2>
            </div>
            <a href="#contact-form" className="inline-flex">
              <Button variant="outline" className="rounded-full border-slate-300 bg-white">
                {service.ctas.soft}
              </Button>
            </a>
          </div>
          <div className="mt-6 space-y-4">
            {service.faq.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 reading-shell">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Смежные услуги</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Что усилит результат</h2>
          <div className="uniform-grid-4 mt-6 gap-5">
            {relatedServices.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="uniform-card interactive-card rounded-[24px] border border-orange-100 bg-white/80 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{item.label}</div>
                <div className="mt-3 text-xl font-semibold text-slate-950">{item.shortName}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.cardDescription}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  Перейти к услуге
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Консультация</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{service.ctas.rational}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Опишите сайт, задачу и текущую ситуацию. Я помогу понять, какой формат работ подойдет, покажу точки роста и скажу, с чего логичнее начать.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    Ответим в течение дня и подскажем, нужен ли проекту аудит, сопровождение, разработка или точечная задача.
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    Без лишних обязательств: сначала разбираем задачу, потом предлагаем уместный формат работы.
                  </div>
                </div>
              </div>

              <div className="p-8">
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
