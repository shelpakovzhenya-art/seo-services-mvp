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
    title: 'Услуги под конкретную задачу сайта',
    description:
      'Здесь проще выбрать не “пакет”, а первый рабочий шаг: аудит, техработы, переработку страниц или новый сайт.',
    scenarios: [
      'Сайт получает показы, но не доводит человека до обращения.',
      'Команда что-то правит, но неясно, какая проблема реально главная.',
      'Рост упирается в структуру, шаблоны, региональные страницы или слабые посадочные.',
      'Текущая площадка мешает и SEO, и конверсии, и дальнейшим доработкам.',
    ],
    compactCta: 'Получить ориентир по формату работ',
    compactNote:
      'Стартовая стоимость зависит не от голого количества страниц, а от шаблонов, объёма правок, срочности и того, сколько нужно делать руками.',
    openService: 'Перейти к услуге',
  },
  en: {
    kicker: 'Services',
    title: 'Services built around the actual site problem',
    description:
      'This section is meant to help choose the first practical move: an audit, technical work, page rewrites, or a new site.',
    scenarios: [
      'The site gets impressions, but fails to turn visitors into inquiries.',
      'The business keeps making changes without knowing which issue matters most.',
      'Growth is blocked by structure, templates, regional pages, or weak key pages.',
      'The current platform now limits SEO, conversion, and future development at once.',
    ],
    compactCta: 'Get a recommendation on the right work format',
    compactNote:
      'Starting prices depend less on raw page count and more on template complexity, scope of fixes, urgency, and how much has to be done manually.',
    openService: 'Open service',
  },
}

export function getFeaturedReads(locale: Locale) {
  return featuredReads[locale]
}

export function getServicesCatalogCopy(locale: Locale) {
  return servicesCatalogCopy[locale]
}
