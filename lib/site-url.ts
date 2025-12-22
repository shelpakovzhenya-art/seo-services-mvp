/**
 * Get the base URL of the site
 * Works in both development and production
 */
export function getSiteUrl(): string {
  // In production, use SITE_URL from environment or construct from request
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '') // Remove trailing slash
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // Fallback for production (should not happen if SITE_URL is set)
  return 'https://seo-update.ru'
}

/**
 * Get full URL for a path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

