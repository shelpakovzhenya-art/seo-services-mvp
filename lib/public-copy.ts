import type { Locale } from '@/lib/i18n'

type LocaleRecord<T> = Record<Locale, T>

const featuredReads: LocaleRecord<
  Array<{
    href: string
    kicker: string
    title: string
    description: string
    cta: string
  }>
> = {
  ru: [
    {
      href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
      kicker: 'Блог',
      title: 'Каким должен быть современный сайт для SEO и заявок',
      description:
        'Материал о структуре, скорости, коммерческих факторах и технической базе, которые влияют на трафик и обращения.',
      cta: 'Читать материал',
    },
    {
      href: '/cases/podocenter-kzn-seo-growth',
      kicker: 'Кейс',
      title: 'Кейс подологического центра в Казани',
      description:
        'Разбор проекта с гибридной структурой сайта, ростом видимости и усилением потока заявок из поиска.',
      cta: 'Открыть кейс',
    },
    {
      href: '/blog',
      kicker: 'Блог',
      title: 'Все статьи по SEO и развитию сайта',
      description:
        'Подборка статей по структуре сайта, миграциям, GEO, коммерческим страницам и контентным сценариям.',
      cta: 'Перейти в блог',
    },
  ],
  en: [
    {
      href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
      kicker: 'Blog',
      title: 'What a modern website needs for SEO and lead generation',
      description:
        'A practical piece on structure, speed, commercial signals, and technical foundations that shape traffic and inquiries.',
      cta: 'Read article',
    },
    {
      href: '/cases/podocenter-kzn-seo-growth',
      kicker: 'Case study',
      title: 'Podiatry center case study from Kazan',
      description:
        'A project breakdown covering hybrid site architecture, visibility growth, and stronger inbound leads from search.',
      cta: 'Open case study',
    },
    {
      href: '/blog',
      kicker: 'Blog',
      title: 'All articles on SEO and website growth',
      description:
        'A practical collection of articles on structure, migrations, GEO, commercial pages, and content strategy.',
      cta: 'Go to blog',
    },
  ],
}

const servicesCatalogCopy: LocaleRecord<{
  kicker: string
  title: string
  description: string
  scenarios: string[]
  compactCta: string
  compactNote: string
  openService: string
}> = {
  ru: {
    kicker: 'Услуги',
    title: 'Услуги под реальные задачи сайта',
    description:
      'Здесь удобнее выбирать не “что купить”, а какой формат решает текущий узкий момент: индексацию, слабые посадочные, просадку заявок или устаревшую платформу.',
    scenarios: [
      'Сайт получает показы, но не дожимает пользователя до обращения.',
      'Команда правит SEO по кускам и не понимает, где реальный приоритет.',
      'Трафик упирается в структуру, шаблоны, региональные страницы или слабые посадочные.',
      'Текущая площадка настолько устарела, что уже мешает и SEO, и конверсии, и дальнейшему развитию.',
    ],
    compactCta: 'Получить ориентир по формату работ',
    compactNote:
      'Стартовая стоимость зависит не столько от числа страниц, сколько от шаблонов, глубины структуры, срочности внедрения, контента и запаса под масштабирование.',
    openService: 'Перейти к услуге',
  },
  en: {
    kicker: 'Services',
    title: 'Services built around real website bottlenecks',
    description:
      'This section is meant to help choose the right first move: fixing indexation, rebuilding weak landing pages, recovering lead flow, or replacing an outdated platform.',
    scenarios: [
      'The site gets impressions, but fails to convert visitors into conversations.',
      'The team keeps making piecemeal SEO changes without a clear priority order.',
      'Growth is blocked by structure, templates, regional landing pages, or weak key pages.',
      'The current platform is so outdated that it now limits SEO, conversion, and future expansion at once.',
    ],
    compactCta: 'Get a recommendation on the right work format',
    compactNote:
      'Starting prices depend less on raw page count and more on template complexity, structural depth, implementation urgency, content scope, and room for future scale.',
    openService: 'Open service',
  },
}

export function getFeaturedReads(locale: Locale) {
  return featuredReads[locale]
}

export function getServicesCatalogCopy(locale: Locale) {
  return servicesCatalogCopy[locale]
}
