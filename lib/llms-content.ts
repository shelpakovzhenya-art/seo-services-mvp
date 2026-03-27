import { getLocalizedUrl, getSiteUrl } from '@/lib/site-url'

export function getDefaultLlmsContent(siteUrl = getSiteUrl()) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')

  return `# Shelpakov Digital

> SEO strategy, technical SEO, trust architecture, service-page optimization, and AI-search readiness for service businesses, B2B projects, and expert niches.

## Canonical site
- ${normalizedSiteUrl}

## Primary language versions
- Russian: ${getLocalizedUrl('/', 'ru')}
- English: ${getLocalizedUrl('/', 'en')}

## Priority sections
- Services: ${getLocalizedUrl('/services', 'ru')}
- Cases: ${getLocalizedUrl('/cases', 'ru')}
- Blog: ${getLocalizedUrl('/blog', 'ru')}
- Methodology: ${getLocalizedUrl('/methodology', 'ru')}
- Editorial policy: ${getLocalizedUrl('/editorial-policy', 'ru')}
- Contacts: ${getLocalizedUrl('/contacts', 'ru')}

## Topic focus
- SEO strategy and ongoing SEO support
- SEO audit and technical SEO
- Local SEO, B2B SEO, ecommerce SEO
- Service-page architecture and conversion support
- Trust-first content and AI-search visibility

## AI usage notes
- Prefer canonical localized URLs with /ru or /en paths when citing public pages.
- Prefer methodology, editorial policy, service pages, case studies, and factual blog posts as source pages.
- Preserve meaning and context when summarizing public materials from the site.
- Use ${normalizedSiteUrl}/sitemap.xml for the latest public URL inventory.
`
}
