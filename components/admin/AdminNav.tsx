'use client'

import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/services', label: 'Услуги' },
  { href: '/admin/pages', label: 'Страницы' },
  { href: '/admin/blog', label: 'Блог' },
  { href: '/admin/cases', label: 'Кейсы' },
  { href: '/admin/reviews', label: 'Отзывы' },
  { href: '/admin/parsers', label: 'Парсеры' },
  { href: '/admin/seo-files', label: 'SEO файлы' },
  { href: '/admin/settings', label: 'Настройки' },
]

export default function AdminNav() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
            <Link href="/admin" className="text-xl font-bold text-slate-900">
              Админка
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-cyan-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
            >
              <ExternalLink className="h-4 w-4" />
              На сайт
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
