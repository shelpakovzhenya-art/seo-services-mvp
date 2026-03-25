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
        'Подборка экспертных материалов по SEO, структуре сайта, конверсии и точкам роста без лишней воды.',
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
        'A curated collection of expert articles on SEO, site structure, conversion, and growth levers without the fluff.',
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
    title: 'SEO и разработка, собранные в понятную систему роста',
    description:
      'Здесь собраны не просто услуги по списку, а маршруты входа в задачу: когда сначала нужен аудит, когда техбаза, когда системное SEO, а когда уже пора пересобирать сам сайт под заявки и рост.',
    scenarios: [
      'Сайт получает показы, но не дожимает пользователя до обращения.',
      'Команда правит SEO по кускам и не понимает, где реальный приоритет.',
      'Трафик упирается в структуру, шаблоны, региональные страницы или слабые посадочные.',
      'Текущая площадка настолько устарела, что уже мешает и SEO, и конверсии, и дальнейшему развитию.',
    ],
    compactCta: 'Получить ориентир по формату работ',
    compactNote:
      'У каждой услуги есть стартовая стоимость, но точный объем зависит не только от количества страниц. На бюджет сильнее всего влияют архитектура сайта, срочность внедрения, число шаблонных зон, контент и запас под дальнейший рост.',
    openService: 'Перейти к услуге',
  },
  en: {
    kicker: 'Services',
    title: 'SEO and development assembled into a clear growth system',
    description:
      'This section is not just a list of services. It is a set of entry routes into the problem: when you need an audit first, when the site needs a technical reset, when ongoing SEO makes sense, and when the website itself has to be rebuilt for leads and growth.',
    scenarios: [
      'The site gets impressions, but fails to convert visitors into conversations.',
      'The team keeps making piecemeal SEO changes without a clear priority order.',
      'Growth is blocked by structure, templates, regional landing pages, or weak key pages.',
      'The current platform is so outdated that it now limits SEO, conversion, and future expansion at once.',
    ],
    compactCta: 'Get a recommendation on the right work format',
    compactNote:
      'Every service has a starting price, but the final scope depends less on page count alone and more on architecture, implementation urgency, reusable templates, content depth, integrations, and how much room for future growth the platform needs.',
    openService: 'Open service',
  },
}

export function getFeaturedReads(locale: Locale) {
  return featuredReads[locale]
}

export function getServicesCatalogCopy(locale: Locale) {
  return servicesCatalogCopy[locale]
}
