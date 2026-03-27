import { defaultLocale, locales, type Locale } from '@/lib/i18n'

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

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

function normalizeHostHeader(value: string | null | undefined) {
  return (value || '').trim().toLowerCase().replace(/:\d+$/, '')
}

function normalizeProtocol(value: string | null | undefined) {
  return (value || '').trim().toLowerCase().replace(/:$/, '')
}

function getMirrorHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase()

  if (!normalizedHostname || LOOPBACK_HOSTS.has(normalizedHostname)) {
    return null
  }

  return normalizedHostname.startsWith('www.') ? normalizedHostname.slice(4) : `www.${normalizedHostname}`
}

function isRailwayPublicHostname(hostname: string) {
  return hostname.endsWith('.up.railway.app')
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

export function getCanonicalRedirectUrl(params: {
  requestUrl: URL
  requestHost?: string | null
  requestProtocol?: string | null
}) {
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  const canonicalSiteUrl = new URL(getSiteUrl())
  const requestHost = normalizeHostHeader(params.requestHost)
  const canonicalHostname = canonicalSiteUrl.hostname.toLowerCase()
  const requestProtocol = normalizeProtocol(params.requestProtocol || params.requestUrl.protocol)
  const canonicalProtocol = normalizeProtocol(canonicalSiteUrl.protocol)
  const mirrorHostname = getMirrorHostname(canonicalHostname)
  const shouldRedirectHost =
    requestHost === canonicalHostname ||
    requestHost === mirrorHostname ||
    (isRailwayPublicHostname(requestHost) && !isRailwayPublicHostname(canonicalHostname))
  const shouldRedirectProtocol = requestProtocol && requestProtocol !== canonicalProtocol

  if (!shouldRedirectHost || (requestHost === canonicalHostname && !shouldRedirectProtocol)) {
    return null
  }

  const redirectUrl = new URL(params.requestUrl.toString())
  redirectUrl.protocol = canonicalSiteUrl.protocol
  redirectUrl.host = canonicalSiteUrl.host

  return redirectUrl
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
