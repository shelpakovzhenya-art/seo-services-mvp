'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname } from '@/lib/i18n'

export default function LocaleHtmlSync() {
  const pathname = usePathname()

  useEffect(() => {
    const locale = getLocaleFromPathname(pathname) || 'ru'
    document.documentElement.lang = locale
  }, [pathname])

  return null
}

