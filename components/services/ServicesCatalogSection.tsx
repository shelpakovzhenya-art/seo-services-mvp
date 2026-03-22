import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMergedServicePricingMap } from '@/lib/service-pricing-overrides'
import { getMergedServicePages } from '@/lib/service-overrides'

type ServicesCatalogSectionProps = {
  compact?: boolean
}

const serviceScenarios = [
  'Нужно понять, почему сайт не растет и где теряется потенциал.',
  'Нужно исправить технические и структурные ошибки, которые тормозят органику.',
  'Нужно системное SEO-продвижение под рост трафика и обращений.',
  'Нужен новый сайт или перезапуск текущей площадки под заявки, SEO и доверие.',
]

export default async function ServicesCatalogSection({ compact = false }: ServicesCatalogSectionProps) {
  const services = await getMergedServicePages()
  const pricingMap = await getMergedServicePricingMap(services.map((service) => service.slug))

  return (
    <section className={compact ? 'section-shell' : 'page-shell'}>
      <div className={compact ? 'surface-grid surface-pad' : 'surface-signal surface-pad'}>
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Услуги</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
                SEO и разработка, собранные в понятную систему роста
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Здесь собраны форматы работы под разные задачи бизнеса: от аудита и технической базы до системного SEO,
                контента, разработки нового сайта и перезапуска текущей площадки под заявки.
              </p>
            </div>

            <div className="space-y-3">
              {serviceScenarios.map((scenario, index) => (
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
                  У каждой услуги есть стартовая стоимость, но точный объем работ зависит от структуры сайта, сложности проекта, интеграций, контента и текущего состояния площадки.
                </p>
                <a href="#contact-form" className="mt-4 inline-flex">
                  <Button className="rounded-full">Получить ориентир по формату работ</Button>
                </a>
              </div>
            ) : null}
          </div>

          <div className="uniform-grid-3 gap-5">
            {services.map((service) => {
              const pricing = pricingMap.get(service.slug)

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="uniform-card glass-panel interactive-card p-6"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{service.label}</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{service.shortName}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{service.description || service.cardDescription}</p>
                  {pricing ? <div className="mt-4 text-sm font-semibold text-slate-900">{pricing.priceLabel}</div> : null}
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
