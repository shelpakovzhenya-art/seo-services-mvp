import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
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

type StructuredDataLocaleOptions = {
  locale?: Locale
}

function getSchemaLanguage(locale?: string) {
  return locale?.toLowerCase().startsWith('en') ? 'en-US' : 'ru-RU'
}

function toAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : getFullUrl(value)
}

function getOfferDescription(pricing: ServicePricing, locale?: Locale) {
  if (locale === 'en') {
    const amount = new Intl.NumberFormat('en-US').format(pricing.priceFrom)
    return `from ₽${amount} / ${pricing.unit === 'month' ? 'month' : 'project'}`
  }

  return pricing.priceLabel
}

function normalizeImage(value?: string | null) {
  if (!value || value.startsWith('data:')) {
    return undefined
  }

  return toAbsoluteUrl(value)
}

function toLocalizedAbsoluteUrl(path: string, locale?: Locale) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return locale ? getFullUrl(prefixPathWithLocale(cleanPath, locale)) : getFullUrl(cleanPath)
}

function normalizeSameAs(values: Array<string | null | undefined>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))
}

export function createOrganizationSchema(
  options?: StructuredDataLocaleOptions & {
    email?: string | null
    telegramUrl?: string | null
    vkUrl?: string | null
    whatsappUrl?: string | null
    maxUrl?: string | null
  }
) {
  const email = options?.email?.trim() || DEFAULT_EMAIL
  const sameAs = normalizeSameAs([
    options?.telegramUrl || DEFAULT_TELEGRAM_URL,
    options?.vkUrl,
    options?.whatsappUrl,
    options?.maxUrl,
  ])

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Shelpakov Digital',
    url: getSiteUrl(),
    logo: {
      '@type': 'ImageObject',
      url: getFullUrl(DEFAULT_LOGO_PATH),
    },
    email,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email,
        availableLanguage: options?.locale === 'en' ? ['en', 'ru'] : ['ru', 'en'],
        areaServed: 'RU',
      },
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }
}

export function createWebsiteSchema(options?: StructuredDataLocaleOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: getSiteUrl(),
    name: 'Shelpakov Digital',
    inLanguage: getSchemaLanguage(options?.locale),
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  }
}

export function createBreadcrumbSchema(items: BreadcrumbItem[], options?: StructuredDataLocaleOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url || (item.path ? toLocalizedAbsoluteUrl(item.path, options?.locale) : undefined),
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

export function createServiceSchema(service: ServicePageContent, pricing?: ServicePricing | null, locale?: Locale) {
  const pageUrl = toLocalizedAbsoluteUrl(`/services/${service.slug}`, locale)

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
    inLanguage: getSchemaLanguage(locale),
    offers: pricing
      ? {
          '@type': 'Offer',
          url: pageUrl,
          availability: 'https://schema.org/InStock',
          priceCurrency: 'RUB',
          price: String(pricing.priceFrom),
          description: getOfferDescription(pricing, locale),
        }
      : undefined,
  }
}

export function createCollectionPageSchema(input: {
  path: string
  name: string
  description: string
}, options?: StructuredDataLocaleOptions) {
  const url = toLocalizedAbsoluteUrl(input.path, options?.locale)

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
    inLanguage: getSchemaLanguage(options?.locale),
  }
}

export function createItemListSchema(input: {
  path: string
  name: string
  items: Array<{ name: string; path?: string; url?: string; description?: string }>
}, options?: StructuredDataLocaleOptions) {
  const url = toLocalizedAbsoluteUrl(input.path, options?.locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    url,
    name: input.name,
    numberOfItems: input.items.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url || (item.path ? toLocalizedAbsoluteUrl(item.path, options?.locale) : undefined),
      name: item.name,
      description: item.description,
    })),
  }
}

export function createBlogPostingSchema(input: {
  slug: string
  title: string
  description: string
  path?: string
  locale?: string
  coverImage?: string | null
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  relatedServices?: LinkedService[]
}) {
  const url = getFullUrl(input.path || `/blog/${input.slug}`)

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
    inLanguage: getSchemaLanguage(input.locale),
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
  locale?: string
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
    inLanguage: getSchemaLanguage(input.locale),
    about: input.about,
  }
}
