'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { stripLocaleFromPathname } from '@/lib/i18n'

type SiteChromeGateProps = {
  atmosphere: ReactNode
  children: ReactNode
  footer: ReactNode
  header: ReactNode
  scrollTop: ReactNode
}

function isStandaloneHome(pathname: string | null) {
  const normalized = stripLocaleFromPathname(pathname || '/').replace(/\/$/, '') || '/'

  return normalized === '/'
}

export default function SiteChromeGate({ atmosphere, children, footer, header, scrollTop }: SiteChromeGateProps) {
  const pathname = usePathname()
  const hideChrome = isStandaloneHome(pathname)

  return (
    <>
      {!hideChrome ? atmosphere : null}
      {!hideChrome ? header : null}
      {children}
      {!hideChrome ? scrollTop : null}
      {!hideChrome ? footer : null}
    </>
  )
}
