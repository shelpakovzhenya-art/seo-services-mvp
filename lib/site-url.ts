import { defaultLocale, locales, type Locale } from '@/lib/i18n'

/**
 * Get the base URL of the site
 * Works in both development and production
 */
function normalizeSiteUrl(value: string) {
  const trimmed = value.replace(/\/$/, '')

  try {
    const url = new URL(trimmed)

    // Keep the canonical base on www until the apex domain is moved to Railway.
    if (process.env.NODE_ENV !== 'development' && url.hostname === 'shelpakov.online') {
      url.hostname = 'www.shelpakov.online'
    }

    return url.toString().replace(/\/$/, '')
  } catch {
    return trimmed
  }
}

export function getSiteUrl(): string {
  if (process.env.SITE_URL) {
    return normalizeSiteUrl(process.env.SITE_URL)
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://www.shelpakov.online'
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

export function getLocalizedPath(path: string, locale: Locale = defaultLocale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`
}

export function getLocalizedUrl(path: string, locale: Locale = defaultLocale) {
  return getFullUrl(getLocalizedPath(path, locale))
}

export function getLocaleAlternates(path: string) {
  const languages = Object.fromEntries(locales.map((locale) => [locale, getLocalizedUrl(path, locale)]))

  return {
    canonical: getLocalizedUrl(path, defaultLocale),
    languages: {
      ...languages,
      'x-default': getLocalizedUrl(path, defaultLocale),
    },
  }
}
