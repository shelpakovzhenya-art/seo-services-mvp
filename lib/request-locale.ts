import { headers } from 'next/headers'
import { getRouteLocale, type Locale } from '@/lib/i18n'

export async function getRequestLocale(): Promise<Locale> {
  const headersList = await headers()
  return getRouteLocale(headersList.get('x-locale'))
}

