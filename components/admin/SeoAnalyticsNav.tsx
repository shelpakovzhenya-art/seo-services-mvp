'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/admin/seo-analytics', label: 'SEO / Аналитика' },
  { href: '/admin/seo-analytics/audit', label: 'Аудит' },
  { href: '/admin/seo-analytics/reports', label: 'Отчеты' },
  { href: '/admin/seo-analytics/monthly-report', label: 'Месячный SEO-отчет' },
  { href: '/admin/seo-analytics/report-parser', label: 'Парсер отчетов' },
]

export default function SeoAnalyticsNav() {
  const pathname = usePathname()

  return (
    <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
