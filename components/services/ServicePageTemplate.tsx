import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import {
  getServiceDeliveryModelContent,
  getServicePricingModelContent,
  getServiceTimingContent,
} from '@/lib/service-conversion-content'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { getServicePage, type ServicePageContent } from '@/lib/service-pages'
import { getServiceProofLinks } from '@/lib/service-proof-data'
import { createBreadcrumbSchema, createFaqSchema, createServiceSchema } from '@/lib/structured-data'
import { type ServicePricing } from '@/lib/service-pricing'

type ServicePageTemplateProps = {
  service: ServicePageContent
  locale: Locale
  pricing?: ServicePricing | null
  customContent?: string | null
}

export default function ServicePageTemplate({ service, locale, pricing, customContent }: ServicePageTemplateProps) {
  const localizeHref = (href: string) => (href.startsWith('/') ? prefixPathWithLocale(href, locale) : href)
  const relatedServices = service.related
    .map((slug) => getServicePage(slug))
    .filter((item): item is ServicePageContent => Boolean(item))
    .slice(0, 3)
  const proofLinks = getServiceProofLinks(service.slug).slice(0, 3)
  const timingContent = getServiceTimingContent(service.slug, locale)
  const pricingModelContent = getServicePricingModelContent(service.slug, pricing, locale)
  const deliveryModelContent = getServiceDeliveryModelContent(pricing, locale)
  const heroHighlights = service.benefits.slice(0, 3).map((item) => item.title)
  const heroResultCards = service.benefits.slice(0, 3).map((item, index) => ({
    eyebrow: service.results[index]?.title || `0${index + 1}`,
    title: item.title,
    text: item.text,
    metric: service.outcomes[index] || service.audience[index] || service.includes[index] || '',
  }))

  const faqSchema = createFaqSchema(service.faq)
  const serviceSchema = createServiceSchema(service, pricing, locale)
  const breadcrumbsSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'Услуги', path: '/services' },
      { name: service.shortName, path: `/services/${service.slug}` },
    ],
    { locale }
  )

  return (
    <>
      <JsonLd id={`service-${service.slug}`} data={serviceSchema} />
      <JsonLd id={`faq-${service.slug}`} data={faqSchema} />
      <JsonLd id={`breadcrumbs-${service.slug}`} data={breadcrumbsSchema} />

      <div className="page-shell pb-24 md:pb-16">
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

        <section className="page-hero-shell surface-pad overflow-hidden">
          <div>
            <div>
              <span className="brand-chip">{service.label}</span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.94] text-slate-950 md:text-6xl">{service.h1}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{service.heroValue}</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{service.subheading}</p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {heroHighlights.map((item) => (
                  <span key={item} className="brand-badge">
                    {item}
                  </span>
                ))}
              </div>

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
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 surface-grid surface-pad">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="brand-chip">Первые ориентиры</span>
              <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-slate-950">
                Что обычно даёт эффект на первых этапах продвижения
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 lg:justify-self-end">
              На сильных SEO-страницах важна не абстрактная услуга, а понятный расклад: какие точки влияния есть у проекта, что меняется в первую очередь и где лежит коммерческий результат.
            </p>
          </div>

          <div className="uniform-grid-3 mt-7 gap-4">
            {heroResultCards.map((item) => (
              <article key={`${item.eyebrow}-${item.title}`} className="uniform-card brand-card p-5">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.eyebrow}</div>
                <h2 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                {item.metric ? <div className="mt-4 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{item.metric}</div> : null}
              </article>
            ))}
          </div>

          <div className="brand-card-dark mt-6 p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#d5b08d]">Следующий шаг</div>
                <p className="mt-3 max-w-3xl text-base leading-8 text-slate-200">
                  Опишите сайт и задачу. Я скажу, нужен ли здесь именно этот формат работы и какой слой сайта логичнее разбирать первым.
                </p>
              </div>
              <a href="#contact-form" className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Обсудить проект
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="page-card">
            <h2 className="text-3xl font-semibold text-slate-950">Как идёт работа</h2>
            <div className="mt-6 space-y-4">
              {service.steps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="text-2xl font-semibold text-slate-900">{`0${index + 1}`}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <h2 className="text-3xl font-semibold text-slate-950">Что меняется</h2>
            <div className="mt-6 space-y-3">
              {service.outcomes.map((item) => (
                <div key={item} className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-slate-900" />
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {service.results.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {(proofLinks.length > 0 || relatedServices.length > 0) ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            {proofLinks.length > 0 ? (
              <div className="page-card">
                <h2 className="text-3xl font-semibold text-slate-950">Что посмотреть по теме</h2>
                <div className="mt-6 space-y-4">
                  {proofLinks.map((item) => (
                    <Link
                      key={`${service.slug}-${item.href}-${item.title}`}
                      href={localizeHref(item.href)}
                      className="block rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {relatedServices.length > 0 ? (
              <div className="page-card">
                <h2 className="text-3xl font-semibold text-slate-950">Соседние услуги</h2>
                <div className="mt-6 space-y-4">
                  {relatedServices.map((item) => (
                    <Link
                      key={item.slug}
                      href={localizeHref(`/services/${item.slug}`)}
                      className="block rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                    >
                      <h3 className="text-xl font-semibold text-slate-950">{item.shortName}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {pricingModelContent ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="page-card">
              <h2 className="text-3xl font-semibold text-slate-950">{pricingModelContent.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{pricingModelContent.intro}</p>

              {(pricing?.deliverables ?? []).length > 0 ? (
                <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">{pricingModelContent.includedTitle}</h3>
                  <div className="mt-4 space-y-3">
                    {(pricing?.deliverables ?? []).map((item) => (
                      <div key={`${service.slug}-deliverable-${item}`} className="flex gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-slate-900" />
                        <span className="text-sm leading-6 text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-950">{pricingModelContent.factorTitle}</h3>
                <div className="mt-4 space-y-3">
                  {pricingModelContent.factorItems.map((item) => (
                    <div key={`${service.slug}-price-factor-${item}`} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm leading-7 text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="page-card">
              <h2 className="text-3xl font-semibold text-slate-950">{deliveryModelContent.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{deliveryModelContent.intro}</p>
              <div className="mt-6 space-y-4">
                {deliveryModelContent.cards.map((item) => (
                  <div key={`${service.slug}-delivery-${item.title}`} className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {timingContent ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="page-card">
              <h2 className="text-3xl font-semibold text-slate-950">{timingContent.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{timingContent.intro}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {timingContent.phases.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-card">
              <h2 className="text-3xl font-semibold text-slate-950">{timingContent.factorsTitle}</h2>
              <div className="mt-6 space-y-4">
                {timingContent.factors.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <div className="page-card">
            <h2 className="text-3xl font-semibold text-slate-950">Кому подходит</h2>
            <div className="mt-6 space-y-3">
              {service.audience.map((item) => (
                <div key={item} className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-slate-900" />
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <h2 className="text-3xl font-semibold text-slate-950">Что входит</h2>
            <div className="mt-6 space-y-3">
              {service.includes.map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 reading-shell">
          <h2 className="text-3xl font-semibold text-slate-950">{service.seoBlockTitle}</h2>
          <div className="mt-6 space-y-4">
            {service.seoParagraphs.map((paragraph) => (
              <p key={`${service.slug}-${paragraph}`} className="max-w-4xl text-base leading-8 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8 reading-shell">
          <h2 className="text-3xl font-semibold text-slate-950">Частые вопросы</h2>
          <div className="mt-6 space-y-4">
            {service.faq.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {customContent ? (
          <section className="mt-8 reading-shell">
            <div className="editorial-prose max-w-none">
              <RichContent content={customContent} />
            </div>
          </section>
        ) : null}

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{service.ctas.rational}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Опишите сайт и задачу. Я скажу, нужен ли здесь именно этот формат работы и с чего лучше начинать.
                </p>
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
