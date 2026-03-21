import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicePageTemplate from '@/components/services/ServicePageTemplate'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getServicePage, servicePages } from '@/lib/service-pages'
import { getMergedServicePricing } from '@/lib/service-pricing-overrides'
import { getServiceOverrideMap, mergeServiceWithOverride } from '@/lib/service-overrides'
import { getFullUrl } from '@/lib/site-url'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

const serviceMetadata: Record<string, { title: string; description: string }> = {
  seo: {
    title: 'SEO-продвижение сайтов | Shelpakov Digital',
    description:
      'SEO-продвижение сайтов под рост органического трафика, заявок и доверия: структура, ключевые страницы, коммерческие факторы и понятный план работ.',
  },
  'seo-audit': {
    title: 'SEO-аудит сайта | Shelpakov Digital',
    description:
      'SEO-аудит сайта с приоритетами и планом внедрения: технические ошибки, структура, контент, коммерческие факторы и точки роста без лишней воды.',
  },
  'technical-seo': {
    title: 'Technical SEO и техоптимизация | Shelpakov Digital',
    description:
      'Technical SEO для индексации, архитектуры и стабильной базы сайта: разбор технических ограничений, шаблонов, дублей и логики внутренних URL.',
  },
  'local-seo': {
    title: 'Local SEO для геозапросов | Shelpakov Digital',
    description:
      'Local SEO для геозапросов и локального спроса: региональные страницы, контакты, коммерческие сигналы и структура сайта под продвижение в выдаче.',
  },
  'ecommerce-seo': {
    title: 'Ecommerce SEO для интернет-магазина | Shelpakov Digital',
    description:
      'Ecommerce SEO для интернет-магазинов: категории, фильтры, карточки товаров, шаблоны каталога и рост органического трафика без архитектурного хаоса.',
  },
  'b2b-seo': {
    title: 'B2B SEO для сложных услуг | Shelpakov Digital',
    description:
      'B2B SEO для сложных услуг и экспертных ниш: смысловая структура, доверие, коммерческая подача и работа со спросом под качественные лиды.',
  },
  'seo-content': {
    title: 'SEO-контент для сайта | Shelpakov Digital',
    description:
      'SEO-контент для сайта: структура страниц, тексты, посадочные и экспертные материалы под спрос, поиск и более сильную подачу услуги.',
  },
  'link-building': {
    title: 'Link Building и ссылочная стратегия | Shelpakov Digital',
    description:
      'Link Building как часть SEO-стратегии: ссылочный профиль, приоритетные страницы, логика размещений и усиление авторитетности сайта без случайных ссылок.',
  },
  'seo-consulting': {
    title: 'SEO-консалтинг для бизнеса | Shelpakov Digital',
    description:
      'SEO-консалтинг для бизнеса и команд: стратегия, приоритеты, контроль подрядчиков, проверка гипотез и поддержка решений по развитию сайта.',
  },
}

export async function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServicePage(slug)
  const overrideMap = await getServiceOverrideMap([slug])
  const override = overrideMap.get(slug)

  if (!service) {
    return {}
  }

  const mergedService = mergeServiceWithOverride(service, 0, override)
  const canonical = getFullUrl(`/services/${mergedService.slug}`)
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
    alternates: {
      canonical,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      type: 'article',
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServicePage(slug)
  const overrideMap = await getServiceOverrideMap([slug])
  const pricing = await getMergedServicePricing(slug)
  const override = overrideMap.get(slug)

  if (!service) {
    notFound()
  }

  const mergedService = mergeServiceWithOverride(service, 0, override)

  return <ServicePageTemplate service={mergedService} pricing={pricing} customContent={mergedService.overrideContent} />
}
