import Link from 'next/link'
import { headers } from 'next/headers'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getServicesCatalogCopy } from '@/lib/public-copy'
import { getServicePageStrategy } from '@/lib/service-page-strategy'
import { getMergedServicePricingMap } from '@/lib/service-pricing-overrides'
import { getMergedServicePages } from '@/lib/service-overrides'
import { getRouteLocale, prefixPathWithLocale } from '@/lib/i18n'

type ServicesCatalogSectionProps = {
  compact?: boolean
}

export default async function ServicesCatalogSection({ compact = false }: ServicesCatalogSectionProps) {
  const headersList = await headers()
  const locale = getRouteLocale(headersList.get('x-locale'))
  const copy = getServicesCatalogCopy(locale)
  const services = await getMergedServicePages()
  const pricingMap = await getMergedServicePricingMap(services.map((service) => service.slug))

  return (
    <section className={compact ? 'section-shell' : 'page-shell'}>
      <div className={compact ? 'surface-grid surface-pad' : 'surface-signal surface-pad'}>
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                {copy.description}
              </p>
            </div>

            <div className="space-y-3">
              {copy.scenarios.map((scenario, index) => (
                <div
                  key={scenario}
                  className="interactive-card flex items-start gap-4 rounded-[24px] border border-orange-100 bg-white/90 px-5 py-4"
                >
                  <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">{`0${index + 1}`}</div>
                  <p className="text-sm leading-7 text-slate-700">{scenario}</p>
                </div>
              ))}
            </div>

            {!compact ? (
              <div className="rounded-[28px] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 p-6">
                <p className="text-sm leading-7 text-slate-600">
                  {copy.compactNote}
                </p>
                <a href="#contact-form" className="mt-4 inline-flex">
                  <Button className="rounded-full">{copy.compactCta}</Button>
                </a>
              </div>
            ) : null}
          </div>

          <div className="uniform-grid-3 gap-5">
            {services.map((service) => {
              const pricing = pricingMap.get(service.slug)
              const strategy = getServicePageStrategy(service.slug)

              return (
                <Link
                  key={service.slug}
                  href={prefixPathWithLocale(`/services/${service.slug}`, locale)}
                  className="uniform-card glass-panel interactive-card p-6"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{service.label}</div>
                  <div className="mt-4 flex flex-1 flex-col gap-5">
                    <div className="space-y-3">
                      <div className="md:min-h-[6rem]">
                        <h3 className="text-2xl font-semibold text-slate-950">{service.shortName}</h3>
                      </div>
                      <p className="text-sm leading-7 text-slate-600 md:min-h-[13.5rem] xl:min-h-[12rem]">
                        {service.description || service.cardDescription}
                      </p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm leading-6 text-slate-700 md:flex md:min-h-[8.5rem] md:items-start">
                        {strategy.catalogTrigger}
                      </div>
                      <div className="border-t border-slate-200/70 pt-4">
                        {pricing ? <div className="text-sm font-semibold text-slate-900">{pricing.priceLabel}</div> : null}
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                          {copy.openService}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
