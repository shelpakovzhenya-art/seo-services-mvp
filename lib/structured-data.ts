import { getFullUrl, getSiteUrl } from '@/lib/site-url'
import type { ServiceFaqItem, ServicePageContent } from '@/lib/service-pages'
import type { ServicePricing } from '@/lib/service-pricing'

const ORGANIZATION_ID = `${getSiteUrl()}#organization`
const WEBSITE_ID = `${getSiteUrl()}#website`
const DEFAULT_EMAIL = 'shelpakovzhenya@gmail.com'
const DEFAULT_TELEGRAM_URL = 'https://t.me/whoamikon'
const DEFAULT_LOGO_PATH = '/android-chrome-512x512.png'

type BreadcrumbItem = {
  name: string
  path?: string
  url?: string
}

type LinkedService = {
  href: string
  label: string
}

function toAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : getFullUrl(value)
}

function normalizeImage(value?: string | null) {
  if (!value || value.startsWith('data:')) {
    return undefined
  }

  return toAbsoluteUrl(value)
}

export function createOrganizationSchema(options?: { email?: string | null; telegramUrl?: string | null }) {
  const email = options?.email || DEFAULT_EMAIL
  const telegramUrl = options?.telegramUrl || DEFAULT_TELEGRAM_URL

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Shelpakov Digital',
    url: getFullUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: getFullUrl(DEFAULT_LOGO_PATH),
    },
    email: `mailto:${email}`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email,
        availableLanguage: ['ru'],
        areaServed: 'RU',
      },
    ],
    sameAs: telegramUrl ? [telegramUrl] : undefined,
  }
}

export function createWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: getFullUrl('/'),
    name: 'Shelpakov Digital',
    inLanguage: 'ru-RU',
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url || (item.path ? toAbsoluteUrl(item.path) : undefined),
    })),
  }
}

export function createFaqSchema(items: ServiceFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function createServiceSchema(service: ServicePageContent, pricing?: ServicePricing | null) {
  const pageUrl = getFullUrl(`/services/${service.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    name: service.h1,
    serviceType: service.shortName,
    description: service.description,
    areaServed: 'RU',
    provider: {
      '@id': ORGANIZATION_ID,
    },
    brand: {
      '@id': ORGANIZATION_ID,
    },
    offers: pricing
      ? {
          '@type': 'Offer',
          url: pageUrl,
          availability: 'https://schema.org/InStock',
          priceCurrency: 'RUB',
          price: String(pricing.priceFrom),
          description: pricing.priceLabel,
        }
      : undefined,
  }
}

export function createCollectionPageSchema(input: {
  path: string
  name: string
  description: string
}) {
  const url = toAbsoluteUrl(input.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    about: {
      '@id': ORGANIZATION_ID,
    },
    inLanguage: 'ru-RU',
  }
}

export function createItemListSchema(input: {
  path: string
  name: string
  items: Array<{ name: string; path?: string; url?: string; description?: string }>
}) {
  const url = toAbsoluteUrl(input.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    name: input.name,
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url || (item.path ? toAbsoluteUrl(item.path) : undefined),
      name: item.name,
      description: item.description,
    })),
  }
}

export function createBlogPostingSchema(input: {
  slug: string
  title: string
  description: string
  coverImage?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  relatedServices?: LinkedService[]
}) {
  const url = getFullUrl(`/blog/${input.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: input.title,
    description: input.description,
    image: normalizeImage(input.coverImage) ? [normalizeImage(input.coverImage)] : undefined,
    author: {
      '@id': ORGANIZATION_ID,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    datePublished: input.publishedAt ? new Date(input.publishedAt).toISOString() : undefined,
    dateModified: input.updatedAt ? new Date(input.updatedAt).toISOString() : undefined,
    mainEntityOfPage: url,
    isAccessibleForFree: true,
    inLanguage: 'ru-RU',
    about: input.relatedServices?.length
      ? input.relatedServices.map((service) => ({
          '@type': 'Service',
          name: service.label,
          url: toAbsoluteUrl(service.href),
        }))
      : undefined,
  }
}

export function createCaseArticleSchema(input: {
  path: string
  title: string
  description: string
  image?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  about?: string[]
}) {
  const url = toAbsoluteUrl(input.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#case-study`,
    headline: input.title,
    description: input.description,
    genre: 'Case Study',
    image: normalizeImage(input.image) ? [normalizeImage(input.image)] : undefined,
    author: {
      '@id': ORGANIZATION_ID,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    datePublished: input.publishedAt ? new Date(input.publishedAt).toISOString() : undefined,
    dateModified: input.updatedAt ? new Date(input.updatedAt).toISOString() : undefined,
    mainEntityOfPage: url,
    inLanguage: 'ru-RU',
    about: input.about,
  }
}
