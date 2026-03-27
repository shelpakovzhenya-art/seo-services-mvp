import Link from 'next/link'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import { Button } from '@/components/ui/button'
import {
  getServiceDeliveryModelContent,
  getServicePricingModelContent,
  getServiceTimingContent,
} from '@/lib/service-conversion-content'
import { getServicePageForLocale } from '@/lib/service-page-localization'
import { prefixPathWithLocale } from '@/lib/i18n'
import { seoIntentLinksEn } from '@/lib/service-market-expansion'
import { createBreadcrumbSchema, createFaqSchema, createServiceSchema } from '@/lib/structured-data'
import type { ServicePageContent } from '@/lib/service-pages'
import type { ServicePricing } from '@/lib/service-pricing'

type EnglishServicePageTemplateProps = {
  service: ServicePageContent
  pricing?: ServicePricing | null
}

function formatEnglishPrice(pricing?: ServicePricing | null) {
  if (!pricing) {
    return null
  }

  const amount = new Intl.NumberFormat('en-US').format(pricing.priceFrom)
  return `from ₽${amount} / ${pricing.unit === 'month' ? 'month' : 'project'}`
}

export default function EnglishServicePageTemplate({ service, pricing }: EnglishServicePageTemplateProps) {
  const relatedServices = service.related
    .map((slug) => getServicePageForLocale(slug, 'en'))
    .filter((item): item is ServicePageContent => Boolean(item))
  const priceLabel = formatEnglishPrice(pricing)
  const timingContent = getServiceTimingContent(service.slug, 'en')
  const pricingModelContent = getServicePricingModelContent(service.slug, pricing, 'en')
  const deliveryModelContent = getServiceDeliveryModelContent(pricing, 'en')
  const faqSchema = createFaqSchema(service.faq)
  const breadcrumbsSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.shortName, path: `/services/${service.slug}` },
  ], { locale: 'en' })
  const serviceSchema = createServiceSchema(service, pricing, 'en')

  return (
    <>
      <JsonLd id={`service-en-${service.slug}`} data={serviceSchema} />
      <JsonLd id={`service-en-faq-${service.slug}`} data={faqSchema} />
      <JsonLd id={`service-en-breadcrumbs-${service.slug}`} data={breadcrumbsSchema} />

      <div className="page-shell pb-20 md:pb-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/en" className="transition hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/en/services" className="transition hover:text-slate-900">
            Services
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">{service.shortName}</span>
        </nav>

        <section className="surface-grid surface-pad overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
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
                <Link href="/en/services">
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50">
                    All services
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-6">
                <div className="text-sm uppercase tracking-[0.24em] text-orange-700">Service angle</div>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{service.angle}</div>
                <p className="mt-4 text-base leading-8 text-slate-700">{service.intro}</p>
                {priceLabel ? (
                  <div className="mt-5 rounded-[24px] border border-orange-100 bg-white/85 p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Starting scope</div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">{priceLabel}</div>
                    {pricing?.calculatorHint ? <p className="mt-3 text-sm leading-7 text-slate-600">{pricing.calculatorHint}</p> : null}
                  </div>
                ) : null}
              </div>

              <div className="page-card">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Why this format is chosen</p>
                <div className="mt-4 space-y-3">
                  {service.benefits.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-cyan-100 bg-cyan-50/60 px-5 py-4">
                      <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {service.slug === 'seo' ? (
          <section className="mt-8 page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Search directions</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Which SEO formats are often worth separating</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
              Separate landing pages often outperform one oversized general service page when the site needs clearer intent coverage. These directions now break out Google, Yandex, new websites, and corporate websites into their own service layers.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {seoIntentLinksEn.map((item) => (
                <Link
                  key={item.href}
                  href={prefixPathWithLocale(item.href, 'en')}
                  className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/80"
                >
                  <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                    Open page
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 reading-shell">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Service context</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">{service.seoBlockTitle}</h2>
          <div className="mt-6 space-y-4">
            {service.seoParagraphs.map((paragraph) => (
              <p key={`${service.slug}-${paragraph}`} className="max-w-4xl text-base leading-8 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {timingContent ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{timingContent.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{timingContent.title}</h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{timingContent.intro}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {timingContent.phases.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Growth factors</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{timingContent.factorsTitle}</h2>
              <div className="mt-6 space-y-4">
                {timingContent.factors.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">A strong fit for</p>
            <div className="mt-6 space-y-3">
              {service.audience.map((item) => (
                <div key={item} className="flex gap-3 rounded-[24px] border border-orange-100 bg-[#fffaf5] px-5 py-4">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">What is included</p>
            <div className="mt-6 space-y-3">
              {service.includes.map((item) => (
                <div key={item} className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 px-5 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {pricingModelContent ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{pricingModelContent.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{pricingModelContent.title}</h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{pricingModelContent.intro}</p>

              <div className="mt-6 rounded-[26px] border border-orange-100 bg-[#fffaf5] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{pricingModelContent.includedTitle}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pricingModelContent.includedLead}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {(pricing?.deliverables ?? []).map((item) => (
                    <div key={`${service.slug}-deliverable-${item}`} className="flex gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                      <span className="text-sm leading-6 text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-cyan-100 bg-cyan-50/50 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{pricingModelContent.extraTitle}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pricingModelContent.extraLead}</p>
                <div className="mt-4 space-y-3">
                  {pricingModelContent.extraItems.map((item) => (
                    <div key={`${service.slug}-extra-${item}`} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm leading-7 text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-orange-100 bg-white/80 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{pricingModelContent.factorTitle}</div>
                <div className="mt-4 space-y-3">
                  {pricingModelContent.factorItems.map((item) => (
                    <div key={`${service.slug}-price-factor-${item}`} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3 text-sm leading-7 text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="page-card">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{deliveryModelContent.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{deliveryModelContent.title}</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">{deliveryModelContent.intro}</p>
              <div className="mt-6 space-y-4">
                {deliveryModelContent.cards.map((item) => (
                  <div key={`${service.slug}-delivery-${item.title}`} className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 page-card">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">How the work usually moves</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {service.steps.map((step, index) => (
              <div key={step.title} className="rounded-[24px] border border-orange-100 bg-white/80 p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">{`Step ${index + 1}`}</div>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">What changes as a result</p>
            <div className="mt-6 space-y-3">
              {service.outcomes.map((item) => (
                <div key={item} className="flex gap-3 rounded-[24px] border border-orange-100 bg-[#fffaf5] px-5 py-4">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                  <span className="text-sm leading-7 text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-card">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Expected effect</p>
            <div className="mt-6 space-y-4">
              {service.results.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-cyan-100 bg-cyan-50/50 p-5">
                  <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedServices.length ? (
          <section className="mt-8 reading-shell">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Related services</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">What often sits next to this format</h2>
              </div>
              <Link href="/en/services" className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
                Open all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug}
                  href={prefixPathWithLocale(`/services/${item.slug}`, 'en')}
                  className="uniform-card rounded-[28px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{item.label}</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">{item.shortName}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 reading-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Questions before the work starts</h2>
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

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-orange-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Consultation</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{service.ctas.rational}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Send the domain, the task, and the current situation. I will tell you whether this format fits and what the most practical first move looks like.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    Reply within one business day with a concrete next step.
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-700">
                    If the project needs another format first, I will say that directly instead of stretching the scope.
                  </div>
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
