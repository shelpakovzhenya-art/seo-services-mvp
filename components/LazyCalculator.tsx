'use client'

import { useEffect, useState, type ComponentType } from 'react'
import type { Locale } from '@/lib/i18n'

type Service = {
  id?: string
  slug?: string
  name: string
  description?: string
  price: number
  unit: string
  hint?: string
  deliverables?: string[]
}

type CalculatorProps = {
  locale: Locale
  services: Service[]
}

type CalculatorComponent = ComponentType<CalculatorProps>

function CalculatorSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4 animate-pulse">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[28px] border border-slate-200 bg-white/80 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-28 rounded-full bg-slate-200/80" />
                <div className="h-8 w-3/4 rounded-full bg-slate-200/80" />
                <div className="h-4 w-full rounded-full bg-slate-100" />
                <div className="h-4 w-5/6 rounded-full bg-slate-100" />
              </div>
              <div className="h-24 min-w-[220px] rounded-[22px] bg-slate-100/90" />
            </div>
          </div>
        ))}
      </div>
      <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="animate-pulse rounded-[24px] bg-slate-100/90 p-5">
          <div className="h-4 w-40 rounded-full bg-slate-200/80" />
          <div className="mt-4 h-10 w-44 rounded-full bg-slate-200/80" />
          <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
        </div>
      </aside>
    </div>
  )
}

export default function LazyCalculator({ locale, services }: CalculatorProps) {
  const [CalculatorComponent, setCalculatorComponent] = useState<CalculatorComponent | null>(null)

  useEffect(() => {
    let active = true

    import('@/components/Calculator').then((module) => {
      if (active) {
        setCalculatorComponent(() => module.default)
      }
    })

    return () => {
      active = false
    }
  }, [])

  return CalculatorComponent ? <CalculatorComponent locale={locale} services={services} /> : <CalculatorSkeleton />
}
