'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n'
import { formatServicePrice } from '@/lib/service-pricing'

interface Service {
  id?: string
  slug?: string
  name: string
  description?: string
  price: number
  unit: string
  hint?: string
  deliverables?: string[]
}

interface CalculatorProps {
  locale: Locale
  services: Service[]
}

const calculatorUiCopy: Record<
  Locale,
  {
    startingPrice: string
    estimateTitle: string
    estimateText: string
    selectedTitle: string
    emptySelected: string
    discuss: string
    summaryNotes: string[]
  }
> = {
  ru: {
    startingPrice: 'Стартовая стоимость',
    estimateTitle: 'Предварительная оценка',
    estimateText:
      'Это ориентир по выбранным услугам. Точный бюджет зависит от масштаба сайта, количества разделов, состояния текущей базы и объема внедрения.',
    selectedTitle: 'Выбрано направлений',
    emptySelected:
      'Отметьте услуги слева, и калькулятор соберет ориентировочную стоимость под ваш формат работ.',
    discuss: 'Обсудить расчет и получить план',
    summaryNotes: [
      'Отвечу в течение дня и подскажу, с чего логичнее стартовать именно в вашем проекте.',
      'Если задача смешанная, покажу, что делать сейчас, а что можно спокойно отложить на следующий этап.',
    ],
  },
  en: {
    startingPrice: 'Starting price',
    estimateTitle: 'Initial estimate',
    estimateText:
      'This is a benchmark for the selected services. The final budget depends on site scale, number of sections, current technical state, and implementation effort.',
    selectedTitle: 'Selected directions',
    emptySelected:
      'Choose the services on the left and the calculator will assemble a rough budget range for your work format.',
    discuss: 'Discuss the estimate and get a plan',
    summaryNotes: [
      'I will reply within one business day and show the most sensible starting point for your project.',
      'If the task is mixed, I will separate what should happen now from what can wait for the next stage.',
    ],
  },
}

export default function Calculator({ locale, services }: CalculatorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const copy = calculatorUiCopy[locale]

  const selectedItems = useMemo(
    () => services.filter((service) => selectedServices.includes(service.id || service.slug || service.name)),
    [selectedServices, services]
  )

  const total = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems])

  const toggleService = (serviceKey: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceKey) ? prev.filter((item) => item !== serviceKey) : [...prev, serviceKey]
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] xl:items-start">
      <div className="space-y-4">
        {services.map((service) => {
          const serviceKey = service.id || service.slug || service.name
          const isSelected = selectedServices.includes(serviceKey)

          return (
            <button
              key={serviceKey}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleService(serviceKey)}
              className={`uniform-card w-full rounded-[30px] border p-5 text-left transition md:p-6 ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-50 shadow-[0_16px_40px_rgba(34,211,238,0.16)]'
                  : 'border-orange-100 bg-white hover:border-orange-200 hover:bg-[#fffaf5]'
              }`}
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-orange-700">{service.unit}</div>
                  </div>

                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">{service.name}</h3>
                  {service.description ? <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p> : null}
                  {service.hint ? <p className="mt-3 text-sm leading-7 text-slate-500">{service.hint}</p> : null}
                </div>

                <div className="shrink-0 rounded-[24px] border border-white/80 bg-white/85 p-4 md:min-w-[228px]">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{copy.startingPrice}</div>
                  <div className="mt-2 text-3xl font-semibold text-slate-950">{formatServicePrice(service.price)}</div>
                  <div className="mt-1 text-sm text-slate-500">{service.unit}</div>
                </div>
              </div>

              {service.deliverables && service.deliverables.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.deliverables.map((item) => (
                    <span key={item} className="rounded-full border border-orange-100 bg-white px-3 py-2 text-xs text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>

      <aside className="h-fit rounded-[32px] border border-orange-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] xl:sticky xl:top-32">
        <div className="rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-cyan-50 p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-orange-700">{copy.estimateTitle}</div>
          <div className="mt-3 text-4xl font-semibold text-slate-950">{formatServicePrice(total)}</div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{copy.estimateText}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">{copy.selectedTitle}</h3>
            <span className="rounded-full border border-orange-100 bg-[#fffaf5] px-3 py-1 text-sm text-slate-700">
              {selectedItems.length}
            </span>
          </div>

          {selectedItems.length > 0 ? (
            <div className="mt-4 space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id || item.slug || item.name} className="rounded-2xl border border-slate-200 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium text-slate-950">{item.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.unit}</div>
                    </div>
                    <div className="shrink-0 text-right text-sm font-semibold text-slate-900">{formatServicePrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm leading-7 text-slate-500">
              {copy.emptySelected}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          {copy.summaryNotes.map((item) => (
            <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-4">
              {item}
            </div>
          ))}
        </div>

        <a href="#contact-form" className="mt-6 block w-full">
          <Button size="lg" className="w-full rounded-full">
            {copy.discuss}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </aside>
    </div>
  )
}
