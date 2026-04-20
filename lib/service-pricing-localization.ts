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
    calculatorHint:
      'For online stores where scale and templates matter, with either a fixed monthly retainer or a revenue-share model when analytics are transparent.',
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
  'google-seo': {
    name: 'Google SEO',
    shortDescription: 'SEO growth in Google with a focus on demand clusters, stronger pages, and cleaner visibility.',
    calculatorHint: 'Fits projects where Google already matters as a growth channel or needs its own search strategy.',
    deliverables: ['Google-focused demand clusters', 'Priority landing page improvements', 'Visibility growth plan'],
  },
  'yandex-seo': {
    name: 'Yandex SEO',
    shortDescription: 'SEO growth in Yandex around commercial, regional, and trust-sensitive demand.',
    calculatorHint: 'Useful for projects where Yandex remains a major source of commercial or geo-dependent traffic.',
    deliverables: ['Commercial and regional pages', 'Trust-layer improvements', 'Yandex growth priorities'],
  },
  'young-site-seo': {
    name: 'SEO for new websites',
    shortDescription: 'Launch-focused SEO for new or young websites: structure, indexation, key pages, and demand mapping.',
    calculatorHint: 'Best for new and young websites that need a cleaner SEO start without stacking avoidable mistakes.',
    deliverables: ['Launch demand structure', 'Indexation and template review', 'Launch and expansion plan'],
  },
  'corporate-site-seo': {
    name: 'Corporate website SEO',
    shortDescription: 'SEO growth for corporate and commercial websites through service architecture, trust layers, and qualified demand.',
    calculatorHint: 'Relevant for corporate, B2B, and expert websites with a complex service structure and a long decision cycle.',
    deliverables: ['Service and solution architecture', 'Commercial page improvements', 'Corporate SEO growth plan'],
  },
  'lead-generation': {
    name: 'Lead generation',
    shortDescription: 'A managed acquisition system focused on qualified leads and predictable channel economics.',
    calculatorHint: 'Budget depends on niche, geo, sales cycle complexity, and target SQL volume.',
    deliverables: ['Hypothesis and media plan', 'Offer and landing-page layer', 'End-to-end MQL/SQL/CAC tracking'],
  },
  'online-reputation': {
    name: 'Online reputation management',
    shortDescription: 'Trust-layer management across reviews, branded search results, and external mentions.',
    calculatorHint: 'Pricing depends on sentiment baseline, number of platforms, and mention frequency.',
    deliverables: ['Reputation risk map', 'Review and platform workflow', 'Response governance and analytics'],
  },
  'performance-ads': {
    name: 'Performance ads',
    shortDescription: 'Paid growth management based on SQL quality, CAC, ROMI, and revenue contribution.',
    calculatorHint: 'Cost depends on channel count, media budget, analytics maturity, and testing depth.',
    deliverables: ['Channel and segment strategy', 'Campaign optimization cycle', 'Deal-level tracking integration'],
  },
  'digital-growth': {
    name: 'Digital growth',
    shortDescription: 'A unified growth layer combining SEO, content, and performance priorities.',
    calculatorHint: 'Scope depends on channel stack, site condition, implementation depth, and team setup.',
    deliverables: ['Growth audit and roadmap', 'Cross-channel KPI framework', 'Regular implementation sprint cycle'],
  },
  'marketplace-sellers': {
    name: 'Marketplace seller growth',
    shortDescription: 'Marketplace growth through card optimization, trust signals, and SKU-focused scaling.',
    calculatorHint:
      'Can be fixed monthly, fixed + revenue share, or revenue share when KPI analytics are transparent and agreed.',
    deliverables: ['Card and assortment audit', 'Priority SKU optimization plan', 'Regular growth iterations and analytics'],
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
      priceLabel: pricing.priceLabel.trim() || formatLocalizedServicePriceLabel(pricing.priceFrom, pricing.unit, locale),
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
