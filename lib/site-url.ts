/**
 * Get the base URL of the site
 * Works in both development and production
 */
function normalizeSiteUrl(value: string) {
  return value.replace(/\/$/, '').replace(/^https:\/\/www\./i, 'https://')
}

export function getSiteUrl(): string {
  if (process.env.SITE_URL) {
    return normalizeSiteUrl(process.env.SITE_URL)
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://shelpakov.online'
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

