'use client'

import Link from 'next/link'
import { LogOut, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminNav() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-primary">
              Админка
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/services" className="text-gray-700 hover:text-primary">
                Услуги
              </Link>
              <Link href="/admin/pages" className="text-gray-700 hover:text-primary">
                Страницы
              </Link>
              <Link href="/admin/blog" className="text-gray-700 hover:text-primary">
                Блог
              </Link>
              <Link href="/admin/cases" className="text-gray-700 hover:text-primary">
                Кейсы
              </Link>
              <Link href="/admin/reviews" className="text-gray-700 hover:text-primary">
                Отзывы
              </Link>
              <Link href="/admin/parsers" className="text-gray-700 hover:text-primary">
                Парсеры
              </Link>
              <Link href="/admin/seo-files" className="text-gray-700 hover:text-primary">
                SEO файлы
              </Link>
              <Link href="/admin/settings" className="text-gray-700 hover:text-primary">
                Настройки
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <ExternalLink className="w-4 h-4" />
              На сайт
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

