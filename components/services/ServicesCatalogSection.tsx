import { headers } from 'next/headers'
import { getServicesCatalogCopy } from '@/lib/public-copy'
import { getServicePagesForLocale } from '@/lib/service-page-localization'
import { getServicePageStrategy } from '@/lib/service-page-strategy'
import { getMergedServicePricingMap } from '@/lib/service-pricing-overrides'
import { getMergedServicePages } from '@/lib/service-overrides'
import { getRouteLocale, prefixPathWithLocale } from '@/lib/i18n'
import type { ServicePricing } from '@/lib/service-pricing'
import ServicesCarousel, { type ServicesCarouselCard } from '@/components/services/ServicesCarousel'

type ServicesCatalogSectionProps = {
  compact?: boolean
}

export default async function ServicesCatalogSection({ compact = false }: ServicesCatalogSectionProps) {
  const headersList = await headers()
  const locale = getRouteLocale(headersList.get('x-locale'))
  const copy = getServicesCatalogCopy(locale)
  const services = locale === 'en' ? getServicePagesForLocale(locale) : await getMergedServicePages()
  const pricingMap = await getMergedServicePricingMap(services.map((service) => service.slug))
  const autoScrollNote =
    locale === 'ru'
      ? 'Карточки движутся автоматически на десктопе. Наведите курсор, чтобы остановить движение и открыть нужную услугу.'
      : 'Cards move automatically on desktop. Hover to pause the motion and open the right service.'
  const countLabel = locale === 'ru' ? 'услуг' : 'services'

  function formatPricing(pricing?: ServicePricing | null) {
    if (!pricing) {
      return null
    }

    if (locale === 'ru') {
      return pricing.priceLabel
    }

    const amount = new Intl.NumberFormat('en-US').format(pricing.priceFrom)
    return `from ₽${amount} / ${pricing.unit === 'month' ? 'month' : 'project'}`
  }

  const cards: ServicesCarouselCard[] = services.map((service) => {
    const pricing = pricingMap.get(service.slug)
    const strategy = locale === 'ru' ? getServicePageStrategy(service.slug) : null
    const signal = locale === 'ru' ? strategy?.catalogTrigger ?? null : service.intro ?? null

    return {
      slug: service.slug,
      href: prefixPathWithLocale(`/services/${service.slug}`, locale),
      label: service.label,
      title: service.shortName,
      description: service.cardDescription || service.description,
      signal,
      pricing: formatPricing(pricing),
      cta: copy.openService,
    }
  })

  return (
    <section className={compact ? 'section-shell' : 'page-shell'}>
      <div className="surface-grid surface-pad space-y-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {copy.kicker}
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-slate-950">
              {copy.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-8 text-slate-600">{copy.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {copy.scenarios.slice(0, 4).map((scenario) => (
              <div key={scenario} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700 shadow-[0_16px_32px_rgba(15,23,42,0.06)]">
                {scenario}
              </div>
            ))}
          </div>
        </div>

        <ServicesCarousel
          cards={cards}
          autoScrollNote={autoScrollNote}
          countLabel={countLabel}
        />

        <div className="rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-5 text-white shadow-[0_26px_60px_rgba(15,23,42,0.18)] md:px-6">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
            <p className="text-sm leading-7 text-slate-200">{copy.compactNote}</p>
            <a
              href={prefixPathWithLocale('/contacts#contact-form', locale)}
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {copy.compactCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
