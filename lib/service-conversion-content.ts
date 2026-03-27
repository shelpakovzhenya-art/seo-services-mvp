import type { Locale } from '@/lib/i18n'
import type { ServicePricing } from '@/lib/service-pricing'

type NarrativeCard = {
  title: string
  text: string
}

export type ServiceTimingContent = {
  kicker: string
  title: string
  intro: string
  phases: NarrativeCard[]
  factorsTitle: string
  factors: NarrativeCard[]
}

export type ServicePricingModelContent = {
  kicker: string
  title: string
  intro: string
  includedTitle: string
  includedLead: string
  extraTitle: string
  extraLead: string
  extraItems: string[]
  factorTitle: string
  factorItems: string[]
}

export type ServiceDeliveryModelContent = {
  kicker: string
  title: string
  intro: string
  cards: NarrativeCard[]
}

const growthServiceSlugs = new Set([
  'seo',
  'google-seo',
  'yandex-seo',
  'young-site-seo',
  'corporate-site-seo',
  'local-seo',
  'ecommerce-seo',
  'b2b-seo',
])

const architectureHeavySlugs = new Set(['technical-seo', 'website-development', 'ecommerce-seo', 'corporate-site-seo'])
const contentHeavySlugs = new Set(['seo-content'])
const consultingSlugs = new Set(['seo-audit', 'seo-consulting'])
const linkHeavySlugs = new Set(['link-building'])

function getGrowthIntro(slug: string, locale: Locale) {
  if (locale === 'en') {
    switch (slug) {
      case 'google-seo':
        return 'Google SEO usually starts moving after the priority pages become meaningfully stronger, not after one round of cosmetic tweaks.'
      case 'yandex-seo':
        return 'Yandex growth depends on how quickly commercial trust signals, page fit, and regional logic are cleaned up and implemented.'
      case 'young-site-seo':
        return 'For new websites, the first success signal is usually a clean launch and better indexation, not instant top rankings.'
      case 'corporate-site-seo':
        return 'Corporate SEO tends to accelerate after the service architecture, trust pages, and decision-support content are rebuilt.'
      default:
        return 'Search growth usually compounds in stages. The first effect appears after critical fixes, priority pages, and implementation rhythm are in place.'
    }
  }

  switch (slug) {
    case 'google-seo':
      return 'В Google первые сдвиги обычно начинаются не после “разовой оптимизации”, а после заметного усиления ключевых страниц и качества их ответа на интент.'
    case 'yandex-seo':
      return 'Для Яндекса скорость роста сильно зависит от того, как быстро собраны коммерческие сигналы, доверительные блоки и региональная логика страниц.'
    case 'young-site-seo':
      return 'У нового сайта первым хорошим сигналом обычно становится чистый запуск и нормальная индексация, а не мгновенный выход в топ.'
    case 'corporate-site-seo':
      return 'Корпоративные сайты начинают расти заметнее после того, как перестраиваются ключевые услуги, trust layer и логика перехода к обращению.'
    default:
      return 'Рост из органики обычно развивается волнами. Первые сигналы появляются после исправления критичных ограничений, усиления приоритетных страниц и нормального темпа внедрения.'
  }
}

function getGrowthFactors(slug: string, locale: Locale): NarrativeCard[] {
  if (locale === 'en') {
    switch (slug) {
      case 'google-seo':
        return [
          { title: 'Page quality and intent fit', text: 'Google reacts faster when the main pages become more useful, clearer, and better aligned with the real search task.' },
          { title: 'Technical cleanliness', text: 'Indexation, canonicals, internal linking, and template stability still matter before stronger content can win.' },
          { title: 'Topical depth', text: 'Thin coverage slows down growth when the website lacks supporting pages, comparisons, and deeper explanations.' },
          { title: 'Authority signals', text: 'Brand mentions, citations, and stronger supporting assets help priority URLs become more stable over time.' },
        ]
      case 'yandex-seo':
        return [
          { title: 'Commercial trust layer', text: 'Stronger service pages, contacts, policies, reviews, and reassurance blocks often change the trajectory the most.' },
          { title: 'Regional logic', text: 'Yandex is sensitive to whether the site structure cleanly supports the cities, branches, and service geography it claims.' },
          { title: 'Behavior on key pages', text: 'Weak page clarity and a poor next-step path can suppress growth even when the page ranks.' },
          { title: 'Implementation speed', text: 'The faster the fixes are shipped, the sooner the search system can re-evaluate the new page state.' },
        ]
      case 'young-site-seo':
        return [
          { title: 'Launch without duplication', text: 'A clean indexation state, sane canonicals, and a careful launch structure protect the site from early drag.' },
          { title: 'Enough launch pages', text: 'A new website needs enough useful service and support pages to look like a real project, not a placeholder.' },
          { title: 'Publishing rhythm', text: 'Steady expansion into useful pages helps the site earn relevance instead of stalling after launch.' },
          { title: 'Trust accumulation', text: 'New domains need time and consistency before the stronger rankings become more stable.' },
        ]
      case 'corporate-site-seo':
        return [
          { title: 'Service architecture', text: 'Growth is slower when one general page tries to cover too many services, industries, or decision paths.' },
          { title: 'Trust and proof assets', text: 'Case studies, reviews, process clarity, and brand pages help complex sites convert visibility into real inquiries.' },
          { title: 'Approval speed', text: 'Corporate projects often slow themselves down when page changes, legal text, and design approvals sit too long.' },
          { title: 'Expert content depth', text: 'When the niche is complex, stronger explanatory and comparison pages support the money pages.' },
        ]
      default:
        return [
          { title: 'Implementation speed', text: 'Search growth accelerates when the high-impact fixes and page changes are released consistently.' },
          { title: 'Technical starting point', text: 'Indexation issues, duplicate templates, or migration scars can delay the first visible movement.' },
          { title: 'Strength of priority pages', text: 'The better the main commercial pages explain the offer, the faster search and users can reward them.' },
          { title: 'Competition and domain history', text: 'Tighter niches and weaker historical trust usually require a longer runway before the gains stabilize.' },
        ]
    }
  }

  switch (slug) {
    case 'google-seo':
      return [
        { title: 'Качество ключевых страниц', text: 'Google быстрее реагирует там, где страницы реально стали полезнее, понятнее и ближе к интенту запроса.' },
        { title: 'Техническая чистота', text: 'Индексация, каноникализация, перелинковка и стабильность шаблонов всё ещё критичны до того, как сработает усиленный контент.' },
        { title: 'Глубина покрытия темы', text: 'Если у сайта нет supporting pages, сравнений и поясняющих материалов, рост часто идёт медленнее.' },
        { title: 'Сигналы авторитетности', text: 'Брендовые упоминания, ссылки и сильные supporting assets помогают закреплять позиции по важным кластерам.' },
      ]
    case 'yandex-seo':
      return [
        { title: 'Коммерческие и trust-сигналы', text: 'Сильные страницы услуг, контакты, условия, отзывы и reassuring blocks часто меняют динамику сильнее метатегов.' },
        { title: 'Региональная логика', text: 'Яндексу важно, насколько чисто сайт поддерживает города, филиалы и географию услуг, на которые претендует.' },
        { title: 'Поведенческий сценарий', text: 'Даже при хорошей видимости слабая подача страницы и плохой следующий шаг могут тормозить рост.' },
        { title: 'Темп внедрения', text: 'Чем быстрее доработки реально выходят на сайт, тем раньше система переоценивает состояние страниц.' },
      ]
    case 'young-site-seo':
      return [
        { title: 'Запуск без дублей и мусора', text: 'Чистая индексация, адекватные canonical и аккуратная стартовая структура защищают проект от раннего техдолга.' },
        { title: 'Достаточность стартовой структуры', text: 'Новый сайт должен выглядеть как реальный проект с набором полезных услуг и supporting pages, а не как заготовка.' },
        { title: 'Ритм публикации полезных страниц', text: 'Постепенное расширение в правильные кластеры помогает накапливать релевантность, а не застывать после запуска.' },
        { title: 'Накопление доверия', text: 'Молодому домену всё равно нужно время и последовательность, прежде чем рост начнёт закрепляться.' },
      ]
    case 'corporate-site-seo':
      return [
        { title: 'Архитектура услуг и решений', text: 'Рост замедляется, когда одна общая страница пытается закрыть слишком много услуг, отраслей и сценариев выбора.' },
        { title: 'Trust layer и доказательства', text: 'Кейсы, отзывы, понятный процесс, страницы о компании и экспертные сигналы помогают превращать видимость в обращения.' },
        { title: 'Скорость согласований', text: 'Корпоративные проекты часто тормозят сами себя, когда правки по текстам, дизайну и юрчасти долго ждут выхода.' },
        { title: 'Глубина экспертного контента', text: 'В сложной нише supporting content и comparison pages помогают money pages получать более устойчивый спрос.' },
      ]
    default:
      return [
        { title: 'Скорость внедрения', text: 'Рост ускоряется, когда high-impact правки по страницам и технике выходят на сайт без больших задержек.' },
        { title: 'Техническое состояние на старте', text: 'Ошибки индексации, дублей и шаблонов могут заметно отодвигать первые видимые сигналы.' },
        { title: 'Сила ключевых страниц', text: 'Чем лучше money pages объясняют оффер и следующий шаг, тем быстрее поиску и пользователю становится проще их оценить.' },
        { title: 'Конкуренция и история домена', text: 'В плотных нишах и на слабом домене горизонт до стабильного роста обычно длиннее.' },
      ]
  }
}

function getPricingFactorItems(slug: string, locale: Locale): string[] {
  if (locale === 'en') {
    if (architectureHeavySlugs.has(slug)) {
      return [
        'How many templates, page types, or structural scenarios have to be reviewed or rebuilt.',
        'How much implementation work is needed from development, design, or QA.',
        'Whether the project includes migration risk, indexation cleanup, or complex integrations.',
      ]
    }

    if (contentHeavySlugs.has(slug)) {
      return [
        'How many landing pages, support articles, or demand clusters need to be built.',
        'How much research, interviewing, or source collection is required before writing.',
        'Whether the project needs only briefs or full writing and editorial support.',
      ]
    }

    if (consultingSlugs.has(slug)) {
      return [
        'The depth of the review and the number of problem areas that need a decision-ready answer.',
        'How many stakeholders, contractors, or in-house teams need alignment.',
        'Whether the work stops at diagnosis or extends into follow-up review and implementation QA.',
      ]
    }

    if (linkHeavySlugs.has(slug)) {
      return [
        'How aggressive or conservative the off-page pace should be.',
        'How ready the priority landing pages are before authority signals are added.',
        'How narrow the niche is and how difficult it is to find safe, relevant placements.',
      ]
    }

    return [
      'How many priority landing pages, clusters, or service directions have to be strengthened first.',
      'How heavy the technical debt is and how fast the implementation backlog can move.',
      'Whether the project also needs content, design, development, or off-page support around the SEO core.',
    ]
  }

  if (architectureHeavySlugs.has(slug)) {
    return [
      'Сколько шаблонов, типов страниц или сценариев структуры нужно разобрать или перестроить.',
      'Какой объём внедрения потребуется от разработки, дизайна и QA после подготовки решений.',
      'Есть ли миграционный риск, чистка индексации или сложные интеграции, которые влияют на объём.',
    ]
  }

  if (contentHeavySlugs.has(slug)) {
    return [
      'Сколько посадочных, supporting articles или кластеров спроса нужно подготовить.',
      'Насколько глубокими должны быть исследование темы, интервью и сбор источников перед написанием.',
      'Нужны только ТЗ и структура или полный цикл с текстами и редактурой.',
    ]
  }

  if (consultingSlugs.has(slug)) {
    return [
      'Насколько глубоким должен быть разбор и сколько зон нужно закрыть decision-grade ответом.',
      'Сколько участников, подрядчиков или внутренних команд нужно синхронизировать вокруг решений.',
      'Заканчивается ли работа диагностикой или продолжается follow-up разбором и QA внедрения.',
    ]
  }

  if (linkHeavySlugs.has(slug)) {
    return [
      'Насколько активным или осторожным должен быть темп ссылочного роста.',
      'Готовы ли ключевые посадочные к усилению внешними сигналами или сначала нужно доработать on-page.',
      'Насколько узкая ниша и как сложно находить безопасные и релевантные площадки.',
    ]
  }

  return [
    'Сколько приоритетных посадочных, кластеров и направлений нужно усиливать в первую очередь.',
    'Насколько тяжёл техдолг проекта и какой темп внедрения реально доступен внутри команды.',
    'Нужны ли вокруг SEO ещё тексты, дизайн, разработка или внешний контур усиления.',
  ]
}

function getExtraBudgetItems(slug: string, locale: Locale): string[] {
  if (locale === 'en') {
    if (architectureHeavySlugs.has(slug)) {
      return [
        'Design and frontend work when new templates, sections, or trust-heavy page blocks have to be built.',
        'Implementation work in the CMS, integrations, redirects, or technical QA after the strategy is ready.',
        'Content migration, cleanup, or reformatting if the site already carries heavy legacy material.',
      ]
    }

    if (contentHeavySlugs.has(slug)) {
      return [
        'Interviews, expert sourcing, or original research when the content has to be evidence-heavy.',
        'Writing and editing volume if the scope moves beyond outlines and briefs.',
        'Design or visual support for comparison pages, guides, or richer content assets.',
      ]
    }

    if (consultingSlugs.has(slug)) {
      return [
        'A second-stage implementation review if the team wants help after the roadmap is delivered.',
        'Separate technical QA, content rewrites, or template changes after the diagnosis is complete.',
        'Workshops or stakeholder sessions if the project needs alignment beyond the base review.',
      ]
    }

    if (linkHeavySlugs.has(slug)) {
      return [
        'Placement budgets and content creation for the publications themselves.',
        'Page rewrites when the landing pages are not yet strong enough to support safer link work.',
        'Extra monitoring or cleanup if the existing profile already contains risky patterns.',
      ]
    }

    return [
      'Copywriting, page rewrites, and editorial support when the key URLs need deeper rebuilding.',
      'Development, design, or CMS work if the recommendations require new blocks, templates, or fixes on the live site.',
      'Link acquisition or supporting promotion if the project needs an off-page layer in addition to the core SEO work.',
    ]
  }

  if (architectureHeavySlugs.has(slug)) {
    return [
      'Дизайн и фронтенд, если для роста нужны новые шаблоны, блоки или более сильные коммерческие секции.',
      'Внедрение в CMS, интеграциях, редиректах и технический QA после того, как стратегия уже собрана.',
      'Миграция, чистка и переработка старого контента, если проект тянет за собой большой legacy-layer.',
    ]
  }

  if (contentHeavySlugs.has(slug)) {
    return [
      'Интервью, сбор экспертных источников и исследование, если контент должен быть evidence-heavy, а не шаблонным.',
      'Объём копирайтинга и редактуры, если задача выходит за рамки структуры и ТЗ.',
      'Дизайн или визуальная упаковка для сравнительных страниц, гайдов и более сложных материалов.',
    ]
  }

  if (consultingSlugs.has(slug)) {
    return [
      'Второй этап с разбором внедрения, если после roadmap нужна повторная проверка или сопровождение команды.',
      'Отдельные техработы, переработка шаблонов или контента после завершения диагностики.',
      'Воркшопы и синхронизация участников, если проекту нужен не только аудит, но и выравнивание решений внутри команды.',
    ]
  }

  if (linkHeavySlugs.has(slug)) {
    return [
      'Бюджеты на размещения и подготовку материалов для самих публикаций.',
      'Доработка landing pages, если до ссылочного усиления нужно сначала поднять качество on-page.',
      'Дополнительный мониторинг или cleanup, если в профиле уже есть рискованные паттерны.',
    ]
  }

  return [
    'Копирайтинг, переработка посадочных и редакторская поддержка, если ключевые URL нужно серьёзно усиливать.',
    'Разработка, дизайн и внедрение в CMS, если рекомендации требуют новых блоков, шаблонов и правок на боевом сайте.',
    'Ссылочный или дополнительный промо-контур, если проекту нужен внешний слой усиления поверх базового SEO.',
  ]
}

export function getServiceTimingContent(slug: string, locale: Locale): ServiceTimingContent | null {
  if (!growthServiceSlugs.has(slug)) {
    return null
  }

  if (locale === 'en') {
    return {
      kicker: 'Timing and momentum',
      title: 'When the first meaningful SEO signals usually appear',
      intro: getGrowthIntro(slug, locale),
      phases: [
        { title: 'Weeks 1-4', text: 'The first stretch is usually about diagnosis, priority cleanup, and deciding which pages deserve attention first.' },
        { title: 'Months 1-3', text: 'This is where indexation signals, impressions, page quality, and early cluster movement usually start to become visible.' },
        { title: 'Months 3-6+', text: 'The stronger gains come after repeated implementation cycles, clearer service pages, and more stable supporting assets.' },
      ],
      factorsTitle: 'What usually changes the speed of growth the most',
      factors: getGrowthFactors(slug, locale),
    }
  }

  return {
    kicker: 'Сроки и динамика',
    title: 'Когда обычно появляются первые заметные сигналы роста',
    intro: getGrowthIntro(slug, locale),
    phases: [
      { title: 'Первые 2-4 недели', text: 'На этом этапе обычно собирается диагностика, чистятся критичные ограничения и становится понятен реальный приоритет страниц.' },
      { title: '1-3 месяца', text: 'Именно здесь чаще всего видны первые сдвиги по индексации, показам, качеству страниц и ранним кластерам спроса.' },
      { title: '3-6+ месяцев', text: 'Более ощутимый рост приходит после нескольких циклов внедрения, усиления money pages и стабилизации supporting layer.' },
    ],
    factorsTitle: 'Что сильнее всего влияет на скорость результата',
    factors: getGrowthFactors(slug, locale),
  }
}

export function getServicePricingModelContent(
  slug: string,
  pricing: ServicePricing | null | undefined,
  locale: Locale
): ServicePricingModelContent | null {
  if (!pricing) {
    return null
  }

  if (locale === 'en') {
    return {
      kicker: 'Budget and scope',
      title: 'How the budget for this service is usually structured',
      intro:
        pricing.unit === 'month'
          ? 'For ongoing work, the budget is shaped by the depth of the monthly implementation loop, the number of priority pages, and the surrounding support the project needs.'
          : 'For fixed-scope work, the budget is shaped by the depth of the diagnosis, the number of page types or issues involved, and how decision-ready the output needs to be.',
      includedTitle: 'What the core scope usually covers',
      includedLead:
        pricing.unit === 'month'
          ? 'This is the layer of recurring work that keeps the project moving instead of turning SEO into a stream of random tasks.'
          : 'This is the core package that turns the service into a practical outcome, not just a surface review.',
      extraTitle: 'What may sit outside the base scope',
      extraLead:
        'Not every project needs these add-ons, but they are often budgeted separately because the volume can vary a lot from one website to another.',
      extraItems: getExtraBudgetItems(slug, locale),
      factorTitle: 'What usually changes the price the most',
      factorItems: getPricingFactorItems(slug, locale),
    }
  }

  return {
    kicker: 'Стоимость и состав работ',
    title: 'Как обычно формируется бюджет по этой услуге',
    intro:
      pricing.unit === 'month'
        ? 'В ежемесячной работе бюджет зависит от глубины регулярного цикла, количества приоритетных страниц и того, какой дополнительный контур нужен проекту вокруг базового SEO.'
        : 'В фиксированном формате бюджет зависит от глубины разборa, количества типов страниц и того, насколько decision-grade результат нужен на выходе.',
    includedTitle: 'Что обычно входит в базовый контур',
    includedLead:
      pricing.unit === 'month'
        ? 'Это тот слой регулярной работы, который двигает проект, а не превращает SEO в поток случайных задач.'
        : 'Это базовый объём, который нужен, чтобы услуга закончилась практическим результатом, а не поверхностным обзором.',
    extraTitle: 'Что может считаться отдельным бюджетом',
    extraLead:
      'Не каждому проекту это нужно, но такие задачи часто считаются отдельно, потому что их объём сильно зависит от сайта, команды и текущего состояния платформы.',
    extraItems: getExtraBudgetItems(slug, locale),
    factorTitle: 'Что сильнее всего влияет на стоимость',
    factorItems: getPricingFactorItems(slug, locale),
  }
}

export function getServiceDeliveryModelContent(
  pricing: ServicePricing | null | undefined,
  locale: Locale
): ServiceDeliveryModelContent {
  const isRetainer = pricing?.unit === 'month'

  if (locale === 'en') {
    return isRetainer
      ? {
          kicker: 'Working model',
          title: 'How the project stays manageable instead of turning into noise',
          intro:
            'Conversion-sensitive service pages usually lose not because of a weak promise, but because the work rhythm becomes vague. The delivery model has to keep priorities clear.',
          cards: [
            { title: 'One accountable thread', text: 'There should be a clear owner of priorities, context, and tradeoffs rather than scattered suggestions from too many directions.' },
            { title: 'Priorities before volume', text: 'The strongest pages and highest-friction blockers move first instead of trying to fix the entire site at once.' },
            { title: 'Readable status, not vanity reporting', text: 'Progress is easier to trust when updates explain what changed, why it matters, and what should happen next.' },
            { title: 'A page-led growth focus', text: 'The work stays tied to real money pages, trust layers, and decision support instead of chasing abstract metrics alone.' },
          ],
        }
      : {
          kicker: 'Working model',
          title: 'How the work stays practical from the first review',
          intro:
            'For fixed-scope work, the value is not in producing more pages or more slides. It is in giving the project a result that is easy to act on immediately.',
          cards: [
            { title: 'A defined scope', text: 'The project starts with a clear outcome so the work does not drift into vague review territory.' },
            { title: 'A decision-ready output', text: 'Findings are packaged in a way that can be handed directly to a team, contractor, or stakeholder.' },
            { title: 'Clear prioritization', text: 'The result should make obvious what needs attention now, what can wait, and what is not worth doing yet.' },
            { title: 'A visible next step', text: 'The user should leave the service with a practical next move, not only a longer reading list.' },
          ],
        }
  }

  return isRetainer
    ? {
        kicker: 'Формат работы',
        title: 'Как устроить проект так, чтобы SEO не превращалось в шум',
        intro:
          'На конверсионных страницах часто проигрывают не из-за слабого оффера, а из-за расплывчатого ритма работ. Здесь важна понятная логика приоритетов и ведения проекта.',
        cards: [
          { title: 'Одна точка ответственности', text: 'У проекта должен быть понятный владелец приоритетов и решений, а не набор разрозненных советов с разных сторон.' },
          { title: 'Приоритеты раньше объёма', text: 'Сначала двигаются самые важные страницы и блокеры роста, а не весь сайт сразу без различия по влиянию.' },
          { title: 'Статус без vanity-отчётности', text: 'Отчётность полезна тогда, когда видно, что поменялось, почему это важно и какой следующий шаг идёт дальше.' },
          { title: 'Фокус на money pages', text: 'Работа держится вокруг реальных страниц спроса, trust layer и логики обращения, а не только вокруг абстрактных метрик.' },
        ],
      }
    : {
        kicker: 'Формат работы',
        title: 'Как сделать услугу практичной уже на первом этапе',
        intro:
          'В фиксированном формате ценность не в большем количестве слайдов или замечаний, а в результате, который можно сразу передать в работу команде или подрядчику.',
        cards: [
          { title: 'Понятный объём задачи', text: 'Работа стартует с ясного формата результата, чтобы не расползаться в бесконечный обзор без рамки.' },
          { title: 'Результат, по которому можно действовать', text: 'Выводы и материалы собираются так, чтобы их можно было сразу использовать в работе, а не перепаковывать вручную.' },
          { title: 'Чёткая приоритизация', text: 'На выходе должно быть видно, что делать сейчас, что позже и что пока не заслуживает ресурса.' },
          { title: 'Следующий шаг без догадок', text: 'После услуги у проекта остаётся не просто мнение, а понятное действие, которое можно запускать сразу.' },
        ],
      }
}
