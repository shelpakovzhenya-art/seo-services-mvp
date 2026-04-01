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
import { prefixPathWithLocale } from '@/lib/i18n'
import { getServicePageForLocale } from '@/lib/service-page-localization'
import { createBreadcrumbSchema, createFaqSchema, createServiceSchema } from '@/lib/structured-data'
import type { ServicePageContent } from '@/lib/service-pages'
import type { ServicePricing } from '@/lib/service-pricing'

type EnglishServicePageTemplateProps = {
  service: ServicePageContent
  pricing?: ServicePricing | null
}

export default function EnglishServicePageTemplate({ service, pricing }: EnglishServicePageTemplateProps) {
  const relatedServices = service.related
    .map((slug) => getServicePageForLocale(slug, 'en'))
    .filter((item): item is ServicePageContent => Boolean(item))
    .slice(0, 3)
  const contextLinks = [
    {
      href: '/cases',
      title: 'Case studies',
      description: 'Examples of how site structure, SEO, and page changes translate into practical results.',
    },
    {
      href: '/blog',
      title: 'Blog',
      description: 'Articles on structure, migrations, page quality, and demand coverage.',
    },
    {
      href: '/reviews',
      title: 'Reviews',
      description: 'Shorter trust signals about communication style, clarity, and project flow.',
    },
  ]
  const timingContent = getServiceTimingContent(service.slug, 'en')
  const pricingModelContent = getServicePricingModelContent(service.slug, pricing, 'en')
  const deliveryModelContent = getServiceDeliveryModelContent(pricing, 'en')

  const faqSchema = createFaqSchema(service.faq)
  const breadcrumbsSchema = createBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.shortName, path: `/services/${service.slug}` },
    ],
    { locale: 'en' }
  )
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
          <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{service.h1}</h1>
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

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-semibold text-slate-950">{service.shortName}</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">{service.intro}</p>

              <div className="mt-6 space-y-3">
                {pricing ? (
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-950">{pricing.priceLabel}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{pricing.calculatorHint}</p>
                  </div>
                ) : null}
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  Reply within one business day and help clarify whether this is the right format to start with.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 surface-grid surface-pad">
          <div className="uniform-grid-3 gap-4">
            {service.benefits.slice(0, 3).map((item) => (
              <article key={item.title} className="uniform-card rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
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
            <h2 className="text-3xl font-semibold text-slate-950">A strong fit for</h2>
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
            <h2 className="text-3xl font-semibold text-slate-950">What is included</h2>
            <div className="mt-6 space-y-3">
              {service.includes.map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="page-card">
            <h2 className="text-3xl font-semibold text-slate-950">How the work moves</h2>
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
            <h2 className="text-3xl font-semibold text-slate-950">What changes</h2>
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

        {(contextLinks.length > 0 || relatedServices.length > 0) ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            {contextLinks.length > 0 ? (
              <div className="page-card">
                <h2 className="text-3xl font-semibold text-slate-950">Useful context</h2>
                <div className="mt-6 space-y-4">
                  {contextLinks.map((item) => (
                    <Link
                      key={`${service.slug}-${item.href}-${item.title}`}
                      href={prefixPathWithLocale(item.href, 'en')}
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
                <h2 className="text-3xl font-semibold text-slate-950">Related services</h2>
                <div className="mt-6 space-y-4">
                  {relatedServices.map((item) => (
                    <Link
                      key={item.slug}
                      href={prefixPathWithLocale(`/services/${item.slug}`, 'en')}
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

        <section className="mt-8 reading-shell">
          <h2 className="text-3xl font-semibold text-slate-950">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {service.faq.map((item) => (
              <div key={item.question} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className="mt-8 scroll-mt-32 surface-grid p-4 md:p-6">
          <div className="soft-section overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{service.ctas.rational}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                  Send the site and the task. I will tell you whether this format fits and what the most sensible next step looks like.
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
