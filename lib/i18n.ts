export const locales = ['ru', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ru'

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  return isLocale(firstSegment) ? firstSegment : null
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)

  if (!locale) {
    return pathname || '/'
  }

  const stripped = pathname.replace(new RegExp(`^/${locale}`), '')
  return stripped || '/'
}

export function prefixPathWithLocale(pathname: string, locale: Locale) {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const strippedPath = stripLocaleFromPathname(cleanPath)

  if (strippedPath === '/') {
    return `/${locale}`
  }

  return `/${locale}${strippedPath}`
}

export function getRouteLocale(input: string | null | undefined): Locale {
  return isLocale(input) ? input : defaultLocale
}
