import Link from 'next/link'
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button'
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
  const helperCopy =
    locale === 'ru'
      ? {
          announcementTitle: 'Быстрый выбор формата',
          compactAnnouncement:
            'Собрал услуги в один аккуратный ряд, чтобы можно было быстро пролистать направления и открыть нужный формат без перегруза сеткой.',
          fullAnnouncement:
            'Ниже все основные форматы работ в одном горизонтальном ряду: так проще сравнить, что именно подходит проекту, и сразу перейти к нужной услуге.',
          swipeHint: 'Листайте карточки влево и вправо или используйте стрелки.',
          swipeBadge: 'Свайп и быстрый выбор',
          countLabel: `${services.length} услуг`,
          viewAll: 'Открыть все услуги',
          previousLabel: 'Предыдущая услуга',
          nextLabel: 'Следующая услуга',
        }
      : {
          announcementTitle: 'Quick service picker',
          compactAnnouncement:
            'The services now live in one clean row, so it is easier to swipe through the options instead of scanning a heavy grid.',
          fullAnnouncement:
            'All main work formats are grouped into one horizontal row, making it easier to compare the options and open the right service.',
          swipeHint: 'Swipe left or right, or use the arrows.',
          swipeBadge: 'Swipe through services',
          countLabel: `${services.length} services`,
          viewAll: 'Open all services',
          previousLabel: 'Previous service',
          nextLabel: 'Next service',
        }

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
      <div className={compact ? 'surface-grid surface-pad' : 'surface-signal surface-pad'}>
        <div className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.kicker}</p>
              <h2 className="mt-3 max-w-4xl text-3xl font-semibold text-slate-950 md:text-5xl">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                {copy.description}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {helperCopy.announcementTitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {compact ? helperCopy.compactAnnouncement : helperCopy.fullAnnouncement}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-orange-200 bg-[#fffaf5] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                  {helperCopy.countLabel}
                </span>
                <span className="rounded-full border border-cyan-200 bg-cyan-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  {helperCopy.swipeBadge}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {copy.scenarios.slice(0, compact ? 3 : 4).map((scenario) => (
              <div
                key={scenario}
                className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm leading-6 text-slate-700"
              >
                {scenario}
              </div>
            ))}
          </div>

          <ServicesCarousel
            cards={cards}
            previousLabel={helperCopy.previousLabel}
            nextLabel={helperCopy.nextLabel}
            swipeHint={helperCopy.swipeHint}
          />

          <div className="flex flex-col gap-4 rounded-[28px] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-7 text-slate-600">{copy.compactNote}</p>

            {compact ? (
              <Link href={prefixPathWithLocale('/services', locale)}>
                <Button variant="outline" className="rounded-full border-slate-300 bg-white px-6 text-slate-900 hover:bg-slate-50">
                  {helperCopy.viewAll}
                </Button>
              </Link>
            ) : (
              <a href="#contact-form">
                <Button className="rounded-full px-6">{copy.compactCta}</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
