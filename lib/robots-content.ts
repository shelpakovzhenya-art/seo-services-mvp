import { getSiteUrl } from '@/lib/site-url'

const YANDEX_CLEAN_PARAMS_PRIMARY = 'utm_source&utm_medium&utm_campaign&utm_content&utm_term&utm_id&utm_referrer'
const YANDEX_CLEAN_PARAMS_SECONDARY = 'gclid&yclid&ymclid&ysclid&fbclid&roistat&roistat_visit&_openstat&openstat'

export function getDefaultRobotsContent(siteUrl = getSiteUrl()) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  const host = new URL(normalizedSiteUrl).host

  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Clean-param: ${YANDEX_CLEAN_PARAMS_PRIMARY} /
Clean-param: ${YANDEX_CLEAN_PARAMS_SECONDARY} /

Host: ${host}
Sitemap: ${normalizedSiteUrl}/sitemap.xml

# AI discovery
LLMS: ${normalizedSiteUrl}/llms.txt
AI-Policy: ${normalizedSiteUrl}/llms.txt
AI-Sitemap: ${normalizedSiteUrl}/sitemap.xml`
}
