import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EnglishServicePageTemplate from '@/components/services/EnglishServicePageTemplate'
import ServicePageTemplate from '@/components/services/ServicePageTemplate'
import { getServicePageForLocale } from '@/lib/service-page-localization'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getServicePage, servicePages } from '@/lib/service-pages'
import { localizeServicePricing } from '@/lib/service-pricing-localization'
import { getMergedServicePricing } from '@/lib/service-pricing-overrides'
import { getServiceOverrideMap, mergeServiceWithOverride } from '@/lib/service-overrides'
import { getLocaleAlternates, getLocalizedUrl } from '@/lib/site-url'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

const serviceMetadata: Record<string, { title: string; description: string }> = {
  seo: {
    title: 'SEO-продвижение сайтов | Shelpakov Digital',
    description:
      'SEO-продвижение сайтов для услуг и B2B: приоритетные страницы, структура спроса, коммерческие блоки и внедрение задач, которые влияют на заявки.',
  },
  'seo-audit': {
    title: 'SEO-аудит сайта | Shelpakov Digital',
    description:
      'SEO-аудит сайта: индексация, шаблоны, страницы спроса, коммерческие факторы и список правок по приоритету внедрения.',
  },
  'technical-seo': {
    title: 'Technical SEO и техоптимизация | Shelpakov Digital',
    description:
      'Technical SEO для индексации, архитектуры и стабильной базы сайта: разбор технических ограничений, шаблонов, дублей и логики внутренних URL.',
  },
  'local-seo': {
    title: 'Local SEO для геозапросов | Shelpakov Digital',
    description:
      'Local SEO для геозапросов: региональные страницы, контакты, карта спроса и локальные сигналы, которые влияют на видимость и обращения.',
  },
  'ecommerce-seo': {
    title: 'Ecommerce SEO для интернет-магазина | Shelpakov Digital',
    description:
      'Ecommerce SEO для интернет-магазинов: категории, фильтры, карточки товаров, шаблоны каталога и рост органического трафика без архитектурного хаоса.',
  },
  'b2b-seo': {
    title: 'B2B SEO для сложных услуг | Shelpakov Digital',
    description:
      'B2B SEO для сложных услуг: страницы решений, доверительные блоки, структура спроса и поддержка длинного цикла сделки.',
  },
  'seo-content': {
    title: 'SEO-контент для сайта | Shelpakov Digital',
    description:
      'SEO-контент для сайта: структура посадочных, тексты услуг и статьи, которые закрывают спрос и помогают довести пользователя до заявки.',
  },
  'link-building': {
    title: 'Link Building и ссылочная стратегия | Shelpakov Digital',
    description:
      'Link Building как часть SEO-стратегии: приоритетные URL, тематики площадок и логика ссылочного роста без случайных размещений.',
  },
  'seo-consulting': {
    title: 'SEO-консалтинг для бизнеса | Shelpakov Digital',
    description:
      'SEO-консалтинг для бизнеса и команд: разбор решений, контроль подрядчиков, приоритеты внедрения и помощь в спорных точках роста.',
  },
}

export async function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getRequestLocale()
  const alternates = getLocaleAlternates(`/services/${slug}`)

  if (locale === 'en') {
    const service = getServicePageForLocale(slug, locale)

    if (!service) {
      return {}
    }

    const title = normalizeMetaTitle(service.title, service.shortName)
    const description = normalizeMetaDescription(service.description, service.heroValue)

    return {
      title,
      description,
      alternates,
      openGraph: {
        title,
        description,
        url: getLocalizedUrl(`/services/${slug}`, 'en'),
        type: 'article',
      },
    }
  }

  const service = getServicePage(slug)
  const overrideMap = await getServiceOverrideMap([slug])
  const override = overrideMap.get(slug)

  if (!service) {
    return {}
  }

  const mergedService = mergeServiceWithOverride(service, 0, override)
  const fallbackMeta = serviceMetadata[mergedService.slug]
  const metaTitle = normalizeMetaTitle(
    override?.title || fallbackMeta?.title || mergedService.title,
    mergedService.title
  )
  const metaDescription = normalizeMetaDescription(
    override?.description || fallbackMeta?.description || mergedService.description,
    mergedService.description
  )

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: mergedService.overrideKeywords
      ? mergedService.overrideKeywords.split(',').map((item) => item.trim()).filter(Boolean)
      : undefined,
    alternates,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: getLocalizedUrl(`/services/${slug}`, 'ru'),
      type: 'article',
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const locale = await getRequestLocale()

  if (locale === 'en') {
    const service = getServicePageForLocale(slug, locale)
    const basePricing = await getMergedServicePricing(slug)
    const pricing = basePricing ? localizeServicePricing(basePricing, locale) : basePricing

    if (!service) {
      notFound()
    }

    return <EnglishServicePageTemplate service={service} pricing={pricing} />
  }

  const service = getServicePage(slug)
  const overrideMap = await getServiceOverrideMap([slug])
  const pricing = await getMergedServicePricing(slug)
  const override = overrideMap.get(slug)

  if (!service) {
    notFound()
  }

  const mergedService = mergeServiceWithOverride(service, 0, override)

  return <ServicePageTemplate service={mergedService} locale={locale} pricing={pricing} customContent={mergedService.overrideContent} />
}
