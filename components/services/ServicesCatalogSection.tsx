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
  const sectionTitle = locale === 'ru' ? 'Услуги' : 'Services'
  const previousLabel = locale === 'ru' ? 'Предыдущая услуга' : 'Previous service'
  const nextLabel = locale === 'ru' ? 'Следующая услуга' : 'Next service'

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
      <div className="surface-grid surface-pad space-y-5">
        <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{sectionTitle}</h2>

        <ServicesCarousel
          cards={cards}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
        />
      </div>
    </section>
  )
}
