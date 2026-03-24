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
      'Здесь собраны форматы работы под разные задачи бизнеса: от аудита и технической базы до системного SEO, контента, разработки нового сайта и перезапуска текущей площадки под заявки.',
    scenarios: [
      'Нужно понять, почему сайт не растет и где теряется потенциал.',
      'Нужно исправить технические и структурные ошибки, которые тормозят органику.',
      'Нужно системное SEO-продвижение под рост трафика и обращений.',
      'Нужен новый сайт или перезапуск текущей площадки под заявки, SEO и доверие.',
    ],
    compactCta: 'Получить ориентир по формату работ',
    compactNote:
      'У каждой услуги есть стартовая стоимость, но точный объем работ зависит от структуры сайта, сложности проекта, интеграций, контента и текущего состояния площадки.',
    openService: 'Перейти к услуге',
  },
  en: {
    kicker: 'Services',
    title: 'SEO and development assembled into a clear growth system',
    description:
      'This section brings together work formats for different business tasks: from audits and technical foundations to ongoing SEO, content, new website development, and relaunching an existing platform for stronger lead flow.',
    scenarios: [
      'You need to understand why the website is underperforming and where growth potential is being lost.',
      'You need to fix technical and structural issues that are holding back organic performance.',
      'You need ongoing SEO built around traffic growth and qualified inquiries.',
      'You need a new website or a relaunch of the current one with leads, SEO, and trust in mind.',
    ],
    compactCta: 'Get a recommendation on the right work format',
    compactNote:
      'Every service has a starting price, but the final scope depends on the site structure, project complexity, integrations, content volume, and the current state of the platform.',
    openService: 'Open service',
  },
}

export function getFeaturedReads(locale: Locale) {
  return featuredReads[locale]
}

export function getServicesCatalogCopy(locale: Locale) {
  return servicesCatalogCopy[locale]
}
