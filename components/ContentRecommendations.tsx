'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { servicePages } from '@/lib/service-pages'

type Props = {
  currentPath?: string
}

export default function ContentRecommendations({ currentPath }: Props) {
  const pathname = usePathname() || currentPath || ''

  if (!pathname || pathname.startsWith('/admin')) {
    return null
  }

  const recommendedServices = servicePages
    .filter((service) => !pathname.startsWith(`/services/${service.slug}`))
    .slice(0, 3)

  return (
    <section className="border-t border-orange-100/80 bg-white/70">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 rounded-[28px] border border-orange-100 bg-[#fffaf5] p-5 shadow-[0_18px_48px_rgba(188,120,58,0.06)] md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-orange-700">Услуги по теме</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Что можно подключить следующим шагом</h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition hover:text-slate-950"
            >
              Все услуги
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {recommendedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-[22px] border border-orange-100 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_12px_30px_rgba(49,149,181,0.08)]"
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-orange-700">{service.shortName}</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{service.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.cardDescription}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  {service.cardCta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
