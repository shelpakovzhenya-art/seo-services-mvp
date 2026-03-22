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
