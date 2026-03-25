import type { ServicePricing } from '@/lib/service-pricing'
import type { Locale } from '@/lib/i18n'

type ServicePricingTextOverride = Pick<ServicePricing, 'name' | 'shortDescription' | 'calculatorHint' | 'deliverables'>

const englishServicePricingOverrides: Record<string, ServicePricingTextOverride> = {
  seo: {
    name: 'SEO growth',
    shortDescription: 'Ongoing work on organic traffic, site structure, and lead growth.',
    calculatorHint: 'Best for projects that need steady growth and a regular implementation plan.',
    deliverables: ['Growth strategy', 'Monthly priorities', 'Work on key pages'],
  },
  'seo-audit': {
    name: 'SEO audit',
    shortDescription: 'A diagnosis of the site, growth constraints, and opportunities with a clear implementation plan.',
    calculatorHint: 'A good starting point when you need to understand the current state of the site before choosing the next step.',
    deliverables: ['Priority audit', 'Issue list', 'Implementation roadmap'],
  },
  'technical-seo': {
    name: 'Technical SEO',
    shortDescription: 'Work on indexation, templates, duplicates, speed, and the technical foundation of the website.',
    calculatorHint: 'Useful when growth is blocked by architecture, indexation, or template-level issues.',
    deliverables: ['Technical review', 'Implementation brief', 'QA of changes'],
  },
  'local-seo': {
    name: 'Local SEO',
    shortDescription: 'Growth for geo-dependent demand, regional pages, and local search visibility.',
    calculatorHint: 'Fits local businesses, branches, and service websites with city-driven demand.',
    deliverables: ['Geo pages', 'Local signals', 'Commercial trust improvements'],
  },
  'ecommerce-seo': {
    name: 'Ecommerce SEO',
    shortDescription: 'SEO for stores and catalogs: categories, filters, product cards, and listing pages.',
    calculatorHint: 'For catalog-heavy projects where scale, templates, and demand structure matter most.',
    deliverables: ['Categories and filters', 'Product templates', 'SEO catalog growth'],
  },
  'b2b-seo': {
    name: 'B2B SEO',
    shortDescription: 'SEO for complex services and long sales cycles with a focus on trust and qualified leads.',
    calculatorHint: 'Relevant for B2B, manufacturing, integrators, and expert-driven niches.',
    deliverables: ['Service pages', 'Offer refinement', 'Content for complex demand'],
  },
  'seo-content': {
    name: 'SEO content',
    shortDescription: 'A content system for landing pages, expert materials, and demand expansion.',
    calculatorHint: 'Useful when you need structured content tied to search intent, not a loose set of texts.',
    deliverables: ['Content plan', 'Page structure', 'Briefs and copy by intent'],
  },
  'link-building': {
    name: 'Link building',
    shortDescription: 'An off-page strategy for priority pages and stronger site authority.',
    calculatorHint: 'Usually part of a larger growth strategy when external signals need reinforcement.',
    deliverables: ['Link plan', 'Placement research', 'Profile control'],
  },
  'seo-consulting': {
    name: 'SEO consulting',
    shortDescription: 'Strategic support, solution reviews, and oversight of the team or contractors.',
    calculatorHint: 'Fits teams that implement in-house but need strong SEO expertise and control.',
    deliverables: ['Project review', 'Strategic guidance', 'Decision support'],
  },
  'website-development': {
    name: 'Website development',
    shortDescription: 'Website builds focused on leads, SEO foundations, and future growth.',
    calculatorHint: 'Useful for a new service site, a relaunch of the current project, or a new platform with SEO-ready structure.',
    deliverables: ['Structure and prototype', 'Design and frontend', 'Forms and integrations', 'Basic SEO setup'],
  },
}

function formatLocalizedPrice(price: number, locale: Locale) {
  return `${price.toLocaleString('ru-RU')} ${locale === 'ru' ? '₽' : 'RUB'}`
}

export function formatLocalizedServicePriceLabel(price: number, unit: ServicePricing['unit'], locale: Locale) {
  const unitLabel = locale === 'ru' ? (unit === 'month' ? 'мес' : 'проект') : unit === 'month' ? 'month' : 'project'
  const prefix = locale === 'ru' ? 'от' : 'from'

  return `${prefix} ${formatLocalizedPrice(price, locale)} / ${unitLabel}`
}

export function localizeServicePricing(pricing: ServicePricing, locale: Locale): ServicePricing {
  if (locale !== 'en') {
    return {
      ...pricing,
      priceLabel: formatLocalizedServicePriceLabel(pricing.priceFrom, pricing.unit, locale),
    }
  }

  const textOverride = englishServicePricingOverrides[pricing.slug]

  if (!textOverride) {
    return {
      ...pricing,
      priceLabel: formatLocalizedServicePriceLabel(pricing.priceFrom, pricing.unit, locale),
    }
  }

  return {
    ...pricing,
    ...textOverride,
    priceLabel: formatLocalizedServicePriceLabel(pricing.priceFrom, pricing.unit, locale),
  }
}

export function localizeServicePricingList(pricingList: ServicePricing[], locale: Locale) {
  return pricingList.map((pricing) => localizeServicePricing(pricing, locale))
}
