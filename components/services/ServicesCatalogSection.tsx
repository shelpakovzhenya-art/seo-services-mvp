import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { servicePages, serviceScenarios } from '@/lib/service-pages'
import { getServicePricing } from '@/lib/service-pricing'
import { getMergedServicePages } from '@/lib/service-overrides'

type ServicesCatalogSectionProps = {
  compact?: boolean
}

export default async function ServicesCatalogSection({ compact = false }: ServicesCatalogSectionProps) {
  const services = await getMergedServicePages()

  return (
    <section className={compact ? 'container mx-auto px-4 py-20' : 'page-shell'}>
      <div className={compact ? 'surface-grid p-8 md:p-10' : 'surface-signal p-8 md:p-10'}>
      <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">SEO-услуги</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              SEO-услуги, собранные в понятную систему роста
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Здесь собраны отдельные форматы SEO-работ под разные задачи бизнеса: от диагностики и технической базы до
              системного продвижения, контента, локального спроса и стратегического консалтинга.
            </p>
          </div>

          <div className="space-y-3">
            {serviceScenarios.map((scenario, index) => (
              <div
                key={scenario}
                className="interactive-card flex items-start gap-4 rounded-[24px] border border-orange-100 bg-white/90 px-5 py-4"
              >
                <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">0{index + 1}</div>
                <p className="text-sm leading-7 text-slate-700">{scenario}</p>
              </div>
            ))}
          </div>

          {!compact && (
            <div className="rounded-[28px] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 p-6">
              <p className="text-sm leading-7 text-slate-600">
                По каждой услуге есть стартовая цена, но точный объём работ всё равно зависит от сайта, внедрения и
                текущего состояния проекта.
              </p>
              <a href="#contact-form" className="mt-4 inline-flex">
                <Button className="rounded-full">Получить ориентир по формату работ</Button>
              </a>
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const pricing = getServicePricing(service.slug)

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="glass-panel interactive-card flex h-full flex-col p-6"
              >
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{service.label}</div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">{service.h1 || service.shortName}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{service.description || service.cardDescription}</p>
                {pricing && <div className="mt-4 text-sm font-semibold text-slate-900">{pricing.priceLabel}</div>}
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  {service.cardCta}
                  <ArrowRight className="h-4 w-4" />
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
