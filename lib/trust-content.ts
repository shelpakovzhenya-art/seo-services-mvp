import type { Locale } from '@/lib/i18n'

export type TrustLink = {
  href: string
  title: string
  description: string
}

type TrustCard = {
  title: string
  text: string
}

type TrustBullet = {
  title: string
  text: string
}

export type TrustPageCopy = {
  chip: string
  title: string
  description: string
  introTitle: string
  introBody: string[]
  cardsTitle: string
  cards: TrustCard[]
  bulletsTitle: string
  bullets: TrustBullet[]
  linksTitle: string
}

const trustLinks: Record<Locale, { heading: string; links: TrustLink[] }> = {
  ru: {
    heading: 'Доверие и методология',
    links: [
      {
        href: '/about',
        title: 'О подходе Shelpakov Digital',
        description: 'Кто отвечает за стратегию, как устроена работа и на чем держится практическая экспертиза.',
      },
      {
        href: '/methodology',
        title: 'Методология работы',
        description: 'Как принимаются SEO-решения, какие данные используются и как приоритизируются изменения.',
      },
      {
        href: '/editorial-policy',
        title: 'Редакционная политика',
        description: 'Как готовятся статьи, как обновляются материалы и как отделяются факты, гипотезы и рекомендации.',
      },
    ],
  },
  en: {
    heading: 'Trust and methodology',
    links: [
      {
        href: '/about',
        title: 'About Shelpakov Digital',
        description: 'Who is accountable for the strategy, how the work is run, and what practical expertise it relies on.',
      },
      {
        href: '/methodology',
        title: 'Working methodology',
        description: 'How SEO decisions are made, what evidence is used, and how implementation priorities are set.',
      },
      {
        href: '/editorial-policy',
        title: 'Editorial policy',
        description: 'How articles are prepared, updated, and separated into facts, assumptions, and recommendations.',
      },
    ],
  },
}

const editorialTeam: Record<
  Locale,
  {
    name: string
    role: string
    summary: string
    trustPoints: string[]
    methodologyLabel: string
    editorialLabel: string
    contactLabel: string
  }
> = {
  ru: {
    name: 'Shelpakov Digital',
    role: 'SEO-стратегия, структура сайта, коммерческие страницы и AI-ready architecture',
    summary:
      'Материалы и рекомендации основаны на практической работе с аудитами, миграциями, шаблонными страницами, контентными сценариями и усилением коммерческого слоя сайта.',
    trustPoints: [
      'Выводы опираются на реальные внедрения, а не только на пересказ общих SEO-тезисов.',
      'Приоритеты связываются с бизнес-риском: индексируемость, спрос, структура, конверсия и доверие.',
      'Материалы пересматриваются, когда меняется поисковая среда, архитектура AI-search или рабочая методология.',
    ],
    methodologyLabel: 'Смотреть методологию',
    editorialLabel: 'Смотреть редакционную политику',
    contactLabel: 'Обсудить проект',
  },
  en: {
    name: 'Shelpakov Digital',
    role: 'SEO strategy, site architecture, commercial pages, and AI-ready website systems',
    summary:
      'The guidance is based on hands-on work with audits, migrations, template-heavy websites, content systems, and commercial page improvements.',
    trustPoints: [
      'Recommendations come from implementation work, not from recycled generic SEO commentary.',
      'Priorities are tied to business risk: indexation, demand coverage, page structure, conversion, and trust.',
      'Materials are revisited when search behavior, AI interfaces, or the working methodology materially change.',
    ],
    methodologyLabel: 'View methodology',
    editorialLabel: 'View editorial policy',
    contactLabel: 'Discuss a project',
  },
}

const aboutPageCopy: Record<Locale, TrustPageCopy> = {
  ru: {
    chip: 'О подходе',
    title: 'Кто отвечает за стратегию, внедрение и качество рекомендаций',
    description:
      'Shelpakov Digital строит SEO и развитие сайта не вокруг обещаний “роста трафика”, а вокруг решений, которые улучшают структуру, индексируемость, коммерческий слой, доверие и вероятность заявки.',
    introTitle: 'Что важно знать о формате работы',
    introBody: [
      'Работа строится вокруг практической SEO-стратегии для сайтов услуг, B2B-проектов, локального спроса и сложных страниц, где важны не только позиции, но и понятность предложения.',
      'Фокус не на “производстве контента ради контента”, а на том, чтобы сайт был пригоден для поиска, для пользователя и для AI-ориентированной выдачи одновременно.',
    ],
    cardsTitle: 'Принципы, на которых держится trust-layer',
    cards: [
      {
        title: 'Одна логика для SEO, бренда и конверсии',
        text: 'Структура сайта, контент, доказательства и CTA рассматриваются как единая система, а не как отдельные задачи разных подрядчиков.',
      },
      {
        title: 'Приоритеты через риск и эффект',
        text: 'Сначала устраняются точки, которые мешают индексации, искажают спрос или ломают доверие к офферу. Только потом масштабируется контент и расширяется спрос.',
      },
      {
        title: 'Практика сильнее общих чек-листов',
        text: 'Рекомендации связываются с типом проекта: услуги, локальные страницы, B2B-лендинги, миграции, шаблонные разделы и коммерческие сценарии.',
      },
    ],
    bulletsTitle: 'Какие сигналы доверия здесь принципиальны',
    bullets: [
      {
        title: 'Прозрачность роли',
        text: 'На сайте должно быть понятно, кто формирует стратегию, кто отвечает за рекомендации и почему этим выводам можно доверять.',
      },
      {
        title: 'Связка с доказательствами',
        text: 'Кейсы, отзывы, методология, публикации и архитектура страниц должны подтверждать друг друга, а не существовать отдельно.',
      },
      {
        title: 'Ясные ограничения',
        text: 'Корректная trust-архитектура прямо показывает, что именно делается, что не обещается и где рекомендации зависят от исходных данных проекта.',
      },
    ],
    linksTitle: 'Следующие trust-assets',
  },
  en: {
    chip: 'About',
    title: 'Who is accountable for the strategy, implementation, and recommendation quality',
    description:
      'Shelpakov Digital approaches SEO and website growth through concrete decisions that improve structure, indexation, commercial clarity, trust, and lead readiness rather than through vague traffic promises.',
    introTitle: 'What matters about the work format',
    introBody: [
      'The work is designed for service websites, B2B projects, local demand, and page systems where rankings alone are not enough and trust needs to support conversion.',
      'The goal is not content volume for its own sake, but a website that is usable for search engines, users, and AI-oriented interfaces at the same time.',
    ],
    cardsTitle: 'Principles behind the trust layer',
    cards: [
      {
        title: 'One logic for SEO, brand, and conversion',
        text: 'Site architecture, content, proof, and calls to action are handled as one system instead of fragmented contractor tasks.',
      },
      {
        title: 'Priorities through risk and impact',
        text: 'The work starts with issues that block indexation, distort demand capture, or weaken trust in the offer before scaling content or coverage.',
      },
      {
        title: 'Practical work over generic checklists',
        text: 'Recommendations are tied to the project type: services, local pages, B2B landing pages, migrations, template systems, and commercial page flows.',
      },
    ],
    bulletsTitle: 'Trust signals that matter most',
    bullets: [
      {
        title: 'Role transparency',
        text: 'The site should make it obvious who forms the strategy, who is accountable for recommendations, and why those conclusions deserve trust.',
      },
      {
        title: 'Connected proof',
        text: 'Case studies, reviews, methodology, publications, and page architecture need to reinforce each other rather than live as isolated assets.',
      },
      {
        title: 'Clear boundaries',
        text: 'A strong trust architecture explains what is actually done, what is not promised, and where advice depends on project-specific constraints.',
      },
    ],
    linksTitle: 'Next trust assets',
  },
}

const methodologyPageCopy: Record<Locale, TrustPageCopy> = {
  ru: {
    chip: 'Методология',
    title: 'Как принимаются SEO-решения и почему рекомендации не строятся на догадках',
    description:
      'Методология Shelpakov Digital связывает поисковый спрос, архитектуру страниц, коммерческие сигналы, техническую базу и поведение пользователя. Это нужно, чтобы рекомендации были внедряемыми, а не декоративными.',
    introTitle: 'Из чего складывается рабочая логика',
    introBody: [
      'Решения принимаются не по одному сигналу. Используются данные индексации, структура сайта, шаблонные ограничения, поисковый спрос, качество коммерческого слоя, поведение пользователей и ресурс команды.',
      'Цель методологии не в том, чтобы “написать побольше текстов”, а в том, чтобы выстроить правильную очередность действий: что исправлять сейчас, что масштабировать позже и что вообще не даст эффекта в текущем контексте.',
    ],
    cardsTitle: 'Основные шаги в работе',
    cards: [
      {
        title: 'Диагностика спроса и структуры',
        text: 'Определяется, какие типы страниц реально нужны, где спрос смешан, где отсутствует посадочная логика и какие кластеры стоит разводить.',
      },
      {
        title: 'Проверка технической пригодности',
        text: 'Оцениваются индексация, каноникализация, шаблоны, дубли, миграционные риски, служебные страницы и ограничения CMS.',
      },
      {
        title: 'Приоритизация по влиянию на бизнес',
        text: 'Работа сортируется по влиянию на видимость, доверие и заявки. Не все SEO-задачи одинаково важны на старте, и методология это фиксирует.',
      },
    ],
    bulletsTitle: 'Какие источники данных обычно используются',
    bullets: [
      {
        title: 'Первичные сигналы сайта',
        text: 'Сюда относятся страницы, шаблоны, структура, карта сайта, служебные файлы, индексационные статусы и текущие точки потери спроса.',
      },
      {
        title: 'Поведенческий и бизнес-контекст',
        text: 'Учитываются заявки, приоритетные услуги, сильные офферы, локальность спроса, качество коммерческих элементов и тип реального решения, которое продает сайт.',
      },
      {
        title: 'Поисковая и AI-среда',
        text: 'Берутся в расчет требования классической выдачи, сниппетной конкуренции, citation-readiness и factual clarity для AI-ответов.',
      },
    ],
    linksTitle: 'Связанные trust-assets',
  },
  en: {
    chip: 'Methodology',
    title: 'How SEO decisions are made and why the recommendations are not guesswork',
    description:
      'The Shelpakov Digital methodology connects demand, page architecture, commercial signals, technical foundations, and user behavior so the output is implementable rather than decorative.',
    introTitle: 'What the working logic is built from',
    introBody: [
      'Decisions are not based on a single signal. They combine indexation data, site structure, template constraints, demand patterns, commercial clarity, user behavior, and the team’s execution capacity.',
      'The goal is not to publish more content for the sake of activity. It is to establish the right sequence: what to fix now, what to scale later, and what is unlikely to matter in the current situation.',
    ],
    cardsTitle: 'Core workflow steps',
    cards: [
      {
        title: 'Demand and structure diagnosis',
        text: 'The work identifies which page types are truly needed, where intent is mixed, where landing logic is missing, and which clusters should be separated.',
      },
      {
        title: 'Technical fitness review',
        text: 'Indexation, canonicalization, templates, duplication, migration risk, utility pages, and CMS limits are reviewed before strategic expansion.',
      },
      {
        title: 'Business-impact prioritization',
        text: 'The roadmap is sorted by likely impact on visibility, trust, and lead generation because not every SEO task deserves the same urgency.',
      },
    ],
    bulletsTitle: 'Evidence sources typically used',
    bullets: [
      {
        title: 'Primary website signals',
        text: 'This includes page types, templates, site structure, sitemap files, service pages, indexation states, and visible points of demand leakage.',
      },
      {
        title: 'Behavior and business context',
        text: 'Leads, priority services, strong offers, local demand patterns, commercial page quality, and the real problem the site needs to solve are all part of the decision model.',
      },
      {
        title: 'Search and AI environment',
        text: 'The methodology also takes classic SERP competition, snippet pressure, citation readiness, and factual clarity for AI answers into account.',
      },
    ],
    linksTitle: 'Related trust assets',
  },
}

const editorialPolicyPageCopy: Record<Locale, TrustPageCopy> = {
  ru: {
    chip: 'Редакционная политика',
    title: 'Как готовятся материалы и как отделяются факты, опыт и гипотезы',
    description:
      'Редакционный слой нужен не для формальности. Он показывает, на чем основан материал, когда статья обновлялась, где выводы опираются на опыт внедрения, а где речь идет о рабочей гипотезе или рынке в целом.',
    introTitle: 'Базовые редакционные правила',
    introBody: [
      'Материалы строятся на сочетании практического опыта, анализа сайтов, разборов страниц, кейсов, документации поисковых систем и рабочих наблюдений по AI-поиску.',
      'Если в теме есть высокая зависимость от исходных данных проекта, статья должна это прямо обозначать. Если тезис является предположением, он не подается как гарантированный факт.',
    ],
    cardsTitle: 'Что должен закрывать сильный editorial layer',
    cards: [
      {
        title: 'Источник рекомендации',
        text: 'Читателю должно быть понятно, идет ли вывод из кейсов, реальных внедрений, поисковой документации, анализа SERP или практики работы с типовыми проблемами.',
      },
      {
        title: 'Дата и актуализация',
        text: 'Статьи должны показывать дату публикации и дату обновления, если подход materially changed из-за алгоритмов, интерфейсов поиска или смены рабочего процесса.',
      },
      {
        title: 'Независимость рекомендаций',
        text: 'Контент не должен маскировать рекламу под экспертный совет. Если когда-либо появятся спонсорские материалы, их нужно явно маркировать.',
      },
    ],
    bulletsTitle: 'Что дополнительно усиливает доверие к материалам',
    bullets: [
      {
        title: 'Связка со страницами методологии и кейсов',
        text: 'Когда статья показывает, как вывод связан с подходом и реальной практикой, она лучше работает и на доверие, и на citation-потенциал.',
      },
      {
        title: 'Понятные ограничения',
        text: 'Материалы по SEO не должны выдавать универсальные обещания. Результат зависит от ниши, базы сайта, конкуренции и готовности команды внедрять изменения.',
      },
      {
        title: 'Фактическая ясность',
        text: 'Чем чище формулировки, тем выше шанс, что страницу будут корректно понимать поисковые системы, сниппеты и AI-ответчики.',
      },
    ],
    linksTitle: 'Связанные trust-assets',
  },
  en: {
    chip: 'Editorial policy',
    title: 'How materials are prepared and how facts, experience, and assumptions are separated',
    description:
      'The editorial layer is not a formality. It shows what the material is based on, when it was updated, where it reflects implementation experience, and where it expresses a working assumption or a market-level observation.',
    introTitle: 'Baseline editorial rules',
    introBody: [
      'Materials combine implementation experience, site analysis, page breakdowns, case studies, search-engine documentation, and ongoing observations about AI search behavior.',
      'If the topic depends heavily on project-specific inputs, the article should say so clearly. If a point is an assumption, it should not be framed as a guaranteed fact.',
    ],
    cardsTitle: 'What a strong editorial layer needs to cover',
    cards: [
      {
        title: 'Source of the recommendation',
        text: 'Readers should understand whether the conclusion comes from case work, implementation experience, search documentation, SERP analysis, or repeated work with common site problems.',
      },
      {
        title: 'Dates and updates',
        text: 'Articles should show publication and update dates whenever the approach materially changes because of algorithm shifts, search interfaces, or updated working methods.',
      },
      {
        title: 'Recommendation independence',
        text: 'Content should not disguise promotion as expert guidance. If sponsored materials ever appear, they should be clearly labeled.',
      },
    ],
    bulletsTitle: 'Signals that further strengthen trust',
    bullets: [
      {
        title: 'Connection to methodology and case pages',
        text: 'When an article explains how a conclusion is tied to the working method and to real practice, it becomes more trustworthy and more citation-ready.',
      },
      {
        title: 'Explicit constraints',
        text: 'SEO materials should not promise universal outcomes. Results depend on the niche, site foundation, competition, and the team’s ability to implement changes.',
      },
      {
        title: 'Factual clarity',
        text: 'The cleaner the wording, the easier it is for search engines, snippets, and AI systems to interpret the page correctly.',
      },
    ],
    linksTitle: 'Related trust assets',
  },
}

const articleTrustCopy: Record<
  Locale,
  {
    kicker: string
    title: string
    evidenceTitle: string
    methodologyNote: string
  }
> = {
  ru: {
    kicker: 'Почему этому материалу можно доверять',
    title: 'Практический editorial и methodology layer',
    evidenceTitle: 'На чем основан этот материал',
    methodologyNote:
      'Если статья касается спорного сценария, приоритет всегда у контекста проекта: ниши, архитектуры, спроса, технических ограничений и готовности команды внедрять изменения.',
  },
  en: {
    kicker: 'Why this material is trustworthy',
    title: 'Practical editorial and methodology layer',
    evidenceTitle: 'What this material is based on',
    methodologyNote:
      'If the topic involves trade-offs, project context takes priority: niche, architecture, demand pattern, technical constraints, and the team’s implementation capacity.',
  },
}

export function getTrustLinks(locale: Locale) {
  return trustLinks[locale]
}

export function getEditorialTeam(locale: Locale) {
  return editorialTeam[locale]
}

export function getAboutPageCopy(locale: Locale) {
  return aboutPageCopy[locale]
}

export function getMethodologyPageCopy(locale: Locale) {
  return methodologyPageCopy[locale]
}

export function getEditorialPolicyPageCopy(locale: Locale) {
  return editorialPolicyPageCopy[locale]
}

export function getArticleTrustCopy(locale: Locale) {
  return articleTrustCopy[locale]
}

export function getLocaleLanguageTag(locale: Locale) {
  return locale === 'en' ? 'en-US' : 'ru-RU'
}
