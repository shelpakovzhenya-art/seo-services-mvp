type ServiceImageSet = {
  hero: string
  process: string
  results: string
  heroAlt: string
  processAlt: string
  resultsAlt: string
}

type ServiceFaqItem = {
  question: string
  answer: string
}

type ServiceSectionItem = {
  title: string
  text: string
}

type ServicePageEntry = {
  slug: string
  shortName: string
  label: string
  h1: string
  title: string
  description: string
  intro: string
  heroValue: string
  subheading: string
  angle: string
  cardDescription: string
  cardCta: string
  benefits: ServiceSectionItem[]
  audience: string[]
  includes: string[]
  steps: ServiceSectionItem[]
  outcomes: string[]
  results: ServiceSectionItem[]
  faq: ServiceFaqItem[]
  seoBlockTitle: string
  seoParagraphs: string[]
  ctas: {
    soft: string
    rational: string
    fast: string
  }
  related: string[]
  images: ServiceImageSet
}

type ServicePricingEntry = {
  slug: string
  name: string
  shortDescription: string
  priceFrom: number
  unit: 'project' | 'month'
  priceLabel: string
  calculatorHint: string
  deliverables: string[]
}

function imageSet(slug: string, heroAlt: string, processAlt: string, resultsAlt: string): ServiceImageSet {
  return {
    hero: `/services/${slug}/hero.webp`,
    process: `/services/${slug}/process.webp`,
    results: `/services/${slug}/results.webp`,
    heroAlt,
    processAlt,
    resultsAlt,
  }
}

export const categoryExpansionRuServices: ServicePageEntry[] = [
  {
    slug: 'lead-generation',
    shortName: 'Лидогенерация',
    label: 'Коммерческий спрос и заявки',
    h1: 'Лидогенерация под KPI продаж и качество заявок',
    title: 'Лидогенерация под KPI продаж',
    description:
      'Выстраиваю лидогенерацию как управляемую систему: оффер, посадочные, каналы, аналитика и контроль качества лидов до SQL и сделки.',
    intro:
      'Подходит проектам, где заявок может быть много, но коммерческой пользы мало: лиды слабо квалифицируются, отдел продаж не успевает обрабатывать поток или канал не окупается.',
    heroValue:
      'Фокус не на формальном CPL, а на связке маркетинга с реальной выручкой: MQL, SQL, CAC, ROMI и скорость перехода лида в сделку.',
    subheading:
      'Собираю систему, в которой каждое действие в маркетинге видно в бизнес-метриках и не превращается в хаотичный набор запусков.',
    angle: 'Качество лидов и окупаемость',
    cardDescription: 'Лидогенерация с опорой на коммерческий результат, а не на отчетные метрики верхнего уровня.',
    cardCta: 'Открыть услугу',
    benefits: [
      { title: 'Качественнее входящий поток', text: 'Кампании оптимизируются под SQL и продажи, а не под количество форм.' },
      { title: 'Прозрачная экономика канала', text: 'По каждому источнику фиксируются CPL, CAC, ROMI и вклад в выручку.' },
      { title: 'Быстрые итерации без хаоса', text: 'Гипотезы проверяются короткими циклами, а бюджет перераспределяется по фактам.' },
      { title: 'Синхронизация с отделом продаж', text: 'В работу берутся только те изменения, которые улучшают качество диалога и сделок.' },
    ],
    audience: [
      'B2B-компаниям с длинным циклом сделки и высокой ценой лида.',
      'Сервисным бизнесам, которым нужен стабильный поток заявок с контролируемой стоимостью.',
      'Проектам, где есть трафик, но низкая конверсия из обращения в продажу.',
      'Командам, которые хотят связать маркетинг и CRM в единую систему принятия решений.',
    ],
    includes: [
      'Диагностику текущей воронки, каналов и стоимости привлечения.',
      'Проработку ICP, офферов, лид-магнитов и сценариев первого контакта.',
      'Доработку посадочных страниц и ключевых коммерческих блоков.',
      'Настройку сквозной аналитики по MQL, SQL, CAC и ROMI.',
      'Регулярную оптимизацию каналов по качеству, а не по объему.',
    ],
    steps: [
      { title: 'Диагностика и KPI', text: 'Фиксируем бизнес-цели, критерии качественного лида и целевую экономику.' },
      { title: 'Проектирование системы', text: 'Собираем структуру каналов, офферов, посадочных и аналитических событий.' },
      { title: 'Запуск и управление', text: 'Запускаем кампании, валидируем гипотезы и отсекаем слабые сегменты.' },
      { title: 'Масштабирование', text: 'Усиливаем рабочие связки и расширяем воронку без потери качества.' },
    ],
    outcomes: [
      'Стабильный поток более релевантных лидов.',
      'Снижение доли нецелевых обращений в CRM.',
      'Понятный прогноз по каналам и бюджету на квартал.',
      'Устойчивый рост SQL и качества коммерческого диалога.',
    ],
    results: [
      { title: 'Меньше мусорных лидов', text: 'Сегментация и офферная логика отсекают слабый спрос еще на входе.' },
      { title: 'Выше конверсия в продажу', text: 'Посадочные и процесс квалификации усиливают переход к SQL и сделке.' },
      { title: 'Управляемый рост', text: 'Маркетинг масштабируется по данным, а не по ощущению.' },
    ],
    faq: [
      {
        question: 'Через сколько видны первые сигналы результата?',
        answer:
          'Первые рабочие сигналы обычно видны в течение 2-4 недель, устойчивую динамику по качеству и экономике чаще получают за 2-3 месяца.',
      },
      {
        question: 'Вы работаете только с рекламой?',
        answer:
          'Нет. Если для качества лидов нужны SEO-страницы, контент или доработка посадочных, подключаю эти слои в рамках общей модели.',
      },
      {
        question: 'Можно ли подключиться к действующей команде и подрядчикам?',
        answer:
          'Да. Могу работать как growth-слой: выстраивать KPI, контроль качества лидов и приоритеты оптимизации поверх текущего процесса.',
      },
      {
        question: 'Что нужно от клиента на старте?',
        answer:
          'Доступы к аналитике и CRM, обратная связь от продаж по качеству лидов и понимание целевой экономики по сделке.',
      },
    ],
    seoBlockTitle: 'Лидогенерация как рабочая система, а не набор запусков',
    seoParagraphs: [
      'Сильная лидогенерация строится на связке спроса, оффера, посадочных, аналитики и продаж. Если хотя бы один слой выпадает, канал быстро теряет окупаемость и предсказуемость.',
      'Поэтому в фокусе не объем трафика сам по себе, а качество перехода по воронке: от клика к обращению, от обращения к SQL, от SQL к сделке.',
    ],
    ctas: {
      soft: 'Разобрать текущую воронку и потери',
      rational: 'Получить план лидогенерации с KPI',
      fast: 'Запустить пилот в ближайшие недели',
    },
    related: ['performance-ads', 'digital-growth', 'seo', 'seo-content'],
    images: imageSet(
      'lead-generation',
      'Иллюстрация лидогенерации и коммерческой воронки',
      'Схема этапов лидогенерации от гипотез до SQL',
      'Визуал результата лидогенерации по качеству заявок'
    ),
  },
  {
    slug: 'online-reputation',
    shortName: 'Онлайн-репутация',
    label: 'Trust layer и бренд-выдача',
    h1: 'Управление онлайн-репутацией для роста доверия и конверсии',
    title: 'Управление онлайн-репутацией бренда',
    description:
      'Собираю репутационный слой вокруг бренда: отзывы, брендовая выдача, сценарии реакции на негатив и контент, который поддерживает доверие до заявки.',
    intro:
      'Услуга полезна, когда клиент выбирает не только по цене и услуге, но и по тому, как компания выглядит в поиске, на площадках с отзывами и в обсуждениях.',
    heroValue:
      'Репутация в интернете превращается в управляемый актив: меньше рисков, сильнее доверие, выше конверсия из брендового и коммерческого спроса.',
    subheading:
      'Подход строится на регулярном мониторинге, внятном процессе ответов и укреплении позитивного репутационного фона в ключевых точках выбора.',
    angle: 'Репутация как часть продаж',
    cardDescription: 'Системная работа с отзывами, упоминаниями и бренд-выдачей без хаотичных реакций.',
    cardCta: 'Открыть услугу',
    benefits: [
      { title: 'Сильнее trust layer', text: 'Клиент получает более убедительную картину бренда в поиске и на внешних площадках.' },
      { title: 'Контроль репутационных рисков', text: 'Негатив не игнорируется, а обрабатывается по правилам и в нужной очередности.' },
      { title: 'Стабильная работа с отзывами', text: 'Формируется процесс сбора, модерации и ответов, а не разовые ручные реакции.' },
      { title: 'Влияние на конверсию', text: 'Укрепление доверия снижает отток на этапе сравнения подрядчиков.' },
    ],
    audience: [
      'Компании с заметной долей брендового трафика и поисковых запросов по названию.',
      'Бизнесы, где отзывы и репутация критично влияют на решение о покупке.',
      'Проекты после конфликтных или кризисных кейсов в публичном поле.',
      'Команды, которым нужен регулярный контроль репутационного фона.',
    ],
    includes: [
      'Аудит текущего репутационного поля и тональности упоминаний.',
      'Приоритизацию площадок и сценариев риска для бренда.',
      'Работу с отзывами и карточками компаний на ключевых сервисах.',
      'Усиление бренд-выдачи через контентные и SEO-решения.',
      'Регулярную аналитику по динамике доверия и влиянию на обращения.',
    ],
    steps: [
      { title: 'Диагностика фона', text: 'Фиксируем, где и как бренд упоминается, какие сигналы мешают доверию.' },
      { title: 'Стратегия и регламент', text: 'Определяем площадки, тон коммуникации, SLA ответов и процесс эскалации.' },
      { title: 'Внедрение', text: 'Запускаем мониторинг, обработку отзывов и корректировку брендового SERP.' },
      { title: 'Поддержка и развитие', text: 'Укрепляем репутационный слой и обновляем тактику под новые сценарии.' },
    ],
    outcomes: [
      'Рост доли позитивных и нейтральных упоминаний.',
      'Снижение влияния негативных факторов на выбор клиента.',
      'Более сильная бренд-выдача по коммерческим запросам.',
      'Понятная модель контроля репутационного слоя.',
    ],
    results: [
      { title: 'Сильнее доверие до контакта', text: 'Пользователь видит управляемую и более убедительную картину бренда.' },
      { title: 'Меньше репутационных провалов', text: 'Команда получает ясный процесс реакции вместо хаотичных действий.' },
      { title: 'Выше конверсия из брендового спроса', text: 'Укрепление репутации напрямую поддерживает коммерческий результат.' },
    ],
    faq: [
      {
        question: 'Можно ли быстро убрать любой негатив?',
        answer:
          'Быстрых универсальных решений не бывает. Рабочий подход — системная коммуникация, контент и законные механики управления брендовым фоном.',
      },
      {
        question: 'Вы отвечаете на отзывы от имени компании?',
        answer:
          'Да, по согласованному tone of voice и репутационному регламенту, чтобы ответы усиливали доверие, а не провоцировали конфликты.',
      },
      {
        question: 'С какими площадками работаете?',
        answer:
          'С профильными каталогами, картами, маркетплейсами, поисковой выдачей по бренду и другими площадками, где аудитория принимает решение.',
      },
      {
        question: 'Как измеряется эффект?',
        answer:
          'По динамике тональности, структуре брендовой выдачи, качеству репутационных сигналов и изменению конверсии в обращение.',
      },
    ],
    seoBlockTitle: 'Онлайн-репутация как коммерческий фактор, а не PR-дополнение',
    seoParagraphs: [
      'Клиент оценивает бренд до первого контакта: по отзывам, карточкам, результатам поиска и общему информационному фону. Этот слой напрямую влияет на решение оставить заявку.',
      'Поэтому репутацией важно управлять как операционной функцией: с мониторингом, приоритетами, регламентом ответов и понятной аналитикой влияния на бизнес-метрики.',
    ],
    ctas: {
      soft: 'Проверить текущий репутационный фон',
      rational: 'Получить 90-дневный план trust layer',
      fast: 'Подключить мониторинг и регламент ответов',
    },
    related: ['seo', 'seo-content', 'digital-growth', 'marketplace-sellers'],
    images: imageSet(
      'online-reputation',
      'Иллюстрация управления онлайн-репутацией бренда',
      'Схема процесса работы с репутационным фоном и отзывами',
      'Визуал результата по trust layer и брендовой выдаче'
    ),
  },
  {
    slug: 'performance-ads',
    shortName: 'Performance-реклама',
    label: 'Реклама под выручку',
    h1: 'Performance-реклама с фокусом на SQL, CAC и ROMI',
    title: 'Performance-реклама под бизнес-метрики',
    description:
      'Настраиваю и веду performance-каналы так, чтобы решения принимались по выручке и качеству лидов, а не по поверхностным метрикам.',
    intro:
      'Подходит бизнесу, где реклама уже есть, но канал нестабилен: стоимость растет, качество обращений падает, а масштабирование дает мало коммерческой пользы.',
    heroValue:
      'Ключевая задача — управляемая performance-модель: понятные KPI, регулярные тесты, прозрачная аналитика и масштаб только эффективных связок.',
    subheading:
      'Вместо “крутить кампании” формируется рабочая система роста: источники, сегменты, офферы, посадки и экономика канала.',
    angle: 'Управляемый paid growth',
    cardDescription: 'Performance-реклама, где приоритетом становятся продажи и unit-экономика.',
    cardCta: 'Открыть услугу',
    benefits: [
      { title: 'Фокус на коммерческих KPI', text: 'Кампании оцениваются по SQL, CAC, ROMI и доле выручки.' },
      { title: 'Улучшение качества потока', text: 'Оптимизация идет по посткликовым сигналам и данным из CRM.' },
      { title: 'Бюджет под контролем', text: 'Слабые связки отключаются, рабочие сегменты получают масштаб.' },
      { title: 'Стабильнее результат', text: 'Реклама перестает зависеть от случайных решений и “ручного тушения пожаров”.' },
    ],
    audience: [
      'Компаниям с активными paid-каналами и задачей роста выручки.',
      'Проектам, где стоимость заявки нестабильна и сложно прогнозировать поток.',
      'B2B и B2C-бизнесам с задачей увеличения доли SQL.',
      'Командам, которым нужна прозрачная система медиабюджета.',
    ],
    includes: [
      'Аудит текущих кабинетов, воронки и потерь бюджета.',
      'Сборку структуры кампаний под коммерческие сценарии.',
      'Настройку трекинга событий и синхронизацию с CRM.',
      'Тестирование креативов, офферов и посадочных гипотез.',
      'Еженедельную оптимизацию и перераспределение бюджета.',
    ],
    steps: [
      { title: 'Аудит и целевая экономика', text: 'Фиксируем KPI, границы CAC и условия масштабирования.' },
      { title: 'Сборка рекламной системы', text: 'Настраиваем кампании, сегменты, события и структуру отчетности.' },
      { title: 'Оптимизация по данным', text: 'Регулярно улучшаем связки по фактическому качеству лидов и сделок.' },
      { title: 'Масштабирование', text: 'Расширяем работающие направления без потери маржинальности.' },
    ],
    outcomes: [
      'Рост объема качественных обращений из рекламы.',
      'Снижение неэффективных затрат в медиабюджете.',
      'Улучшение ROMI и предсказуемости канала.',
      'Понятная модель управления paid growth.',
    ],
    results: [
      { title: 'Точнее распределение бюджета', text: 'Инвестиции идут в сегменты, которые реально приносят продажи.' },
      { title: 'Сильнее воронка качества', text: 'Выше доля лидов, которые доходят до квалификации и сделки.' },
      { title: 'Более прогнозируемый канал', text: 'Появляется стабильный ритм оптимизации и роста без резких провалов.' },
    ],
    faq: [
      {
        question: 'С какими рекламными каналами вы работаете?',
        answer:
          'Подбор каналов зависит от экономики и типа бизнеса: контекст, соцсети, ретаргетинг и другие источники, где можно прозрачно считать коммерческий результат.',
      },
      {
        question: 'Можно стартовать с существующих кампаний?',
        answer:
          'Да. Часто первый шаг — аудит текущей структуры и перезапуск с более правильной логикой KPI и сегментации.',
      },
      {
        question: 'Как быстро можно масштабироваться?',
        answer:
          'После подтверждения экономики на тестовом объеме. Обычно масштабирование идет поэтапно, чтобы не терять качество.',
      },
      {
        question: 'Вы подключаете работу с посадочными страницами?',
        answer:
          'Да. Если посадка режет конверсию, корректируем оффер, структуру блоков и следующий шаг вместе с рекламой.',
      },
    ],
    seoBlockTitle: 'Performance-реклама, которую можно масштабировать без потери качества',
    seoParagraphs: [
      'Если paid-канал управляется только по кликам и CTR, бизнес получает красивую витрину метрик без устойчивого коммерческого эффекта.',
      'Рабочая performance-модель строится на глубокой аналитике, связке с CRM и регулярной приоритизации гипотез по влиянию на SQL и выручку.',
    ],
    ctas: {
      soft: 'Проверить слабые места текущей рекламы',
      rational: 'Получить план performance-оптимизации',
      fast: 'Перезапустить paid-канал под KPI продаж',
    },
    related: ['lead-generation', 'digital-growth', 'seo', 'seo-content'],
    images: imageSet(
      'performance-ads',
      'Иллюстрация performance-рекламы и коммерческих KPI',
      'Схема оптимизации performance-кампаний по воронке',
      'Визуал результата performance-рекламы по качеству лидов'
    ),
  },
  {
    slug: 'digital-growth',
    shortName: 'Digital Growth',
    label: 'Единый слой роста',
    h1: 'Digital Growth: связка SEO, контента и product-мышления',
    title: 'Digital Growth для управляемого роста спроса и заявок',
    description:
      'Собираю единый growth-контур для сайта: SEO, контент, коммерческая логика страниц и аналитика, чтобы рост не дробился по разным подрядчикам.',
    intro:
      'Услуга полезна, когда проекту уже тесно в рамках одного канала, а бизнесу нужен единый подход к росту спроса, качества лидов и конверсии.',
    heroValue:
      'Digital Growth помогает синхронизировать SEO, контент и performance-активности в одну систему приоритетов с прозрачным влиянием на бизнес.',
    subheading:
      'Главная цель — убрать разрыв между трафиком, смыслом страницы и коммерческим действием пользователя.',
    angle: 'Cross-channel рост',
    cardDescription: 'Объединяющий digital-формат, где каналы работают на общий результат, а не конкурируют между собой.',
    cardCta: 'Открыть услугу',
    benefits: [
      { title: 'Единая стратегия роста', text: 'SEO, контент и paid-слой управляются через общие KPI и приоритеты.' },
      { title: 'Меньше потерь на стыках каналов', text: 'Убираются конфликтующие задачи между маркетингом, продажами и разработкой.' },
      { title: 'Быстрее внедрение рабочих гипотез', text: 'Тесты и доработки запускаются в одном ритме без распыления ресурса.' },
      { title: 'Выше качество коммерческих страниц', text: 'Страницы усиливаются как с точки зрения спроса, так и с точки зрения конверсии.' },
    ],
    audience: [
      'Командам, где одновременно работают SEO, контент и платные каналы.',
      'Проектам с ростом трафика, но слабой конверсией в продажи.',
      'B2B и сервисным бизнесам со сложным путём принятия решения.',
      'Компаниям, которым нужен внешний growth-слой управления.',
    ],
    includes: [
      'Диагностику текущего digital-контура и конфликтов между каналами.',
      'Сборку общей карты роста по спросу, страницам и воронке.',
      'Приоритизацию работ по SEO, контенту и performance-активностям.',
      'Настройку единой аналитической рамки по качеству и выручке.',
      'Регулярный цикл внедрения и контроля гипотез.',
    ],
    steps: [
      { title: 'Аудит и синхронизация', text: 'Определяем точки потерь и согласуем единые KPI между функциями.' },
      { title: 'Growth-архитектура', text: 'Формируем roadmap, где каждый канал закрывает свою роль в общей системе.' },
      { title: 'Внедрение и тесты', text: 'Запускаем приоритетные гипотезы по страницам, контенту и трафику.' },
      { title: 'Масштаб и контроль', text: 'Закрепляем рабочие сценарии и развиваем их без потери управляемости.' },
    ],
    outcomes: [
      'Согласованная digital-модель роста на уровне бизнеса.',
      'Устойчивый прирост спроса и качества обращений.',
      'Снижение хаоса в планировании и внедрении.',
      'Более предсказуемая воронка от трафика к выручке.',
    ],
    results: [
      { title: 'Сильнее эффект от каждого канала', text: 'SEO, контент и реклама перестают работать изолированно.' },
      { title: 'Быстрее принятие решений', text: 'Появляется единая картина по приоритетам и бизнес-эффекту гипотез.' },
      { title: 'Управляемый рост без перегрева команды', text: 'Ресурс тратится на точки с наибольшим влиянием на результат.' },
    ],
    faq: [
      {
        question: 'Чем Digital Growth отличается от обычного SEO?',
        answer:
          'SEO — это один важный слой, а Digital Growth объединяет SEO, контент, paid-активности и продуктовую логику страниц в общую систему роста.',
      },
      {
        question: 'Это формат для больших команд?',
        answer:
          'Не обязательно. Даже небольшой команде нужен единый growth-подход, чтобы не терять ресурс на разрозненные действия.',
      },
      {
        question: 'Можно подключить только часть каналов?',
        answer:
          'Да. Формат масштабируется: можно начать с ключевых каналов и расширять контур по мере роста проекта.',
      },
      {
        question: 'Как измеряется результат?',
        answer:
          'По связке метрик спроса, качества лидов, конверсии страниц и влияния на выручку в единой аналитической рамке.',
      },
    ],
    seoBlockTitle: 'Digital Growth как единая операционная система маркетинга',
    seoParagraphs: [
      'Когда SEO, контент и paid работают отдельно, проект теряет скорость и деньги на стыках: приоритеты конфликтуют, а бизнес-результат становится размытым.',
      'Digital Growth собирает эти слои в один управляемый контур, где каждое действие привязано к метрикам качества спроса и коммерческому эффекту.',
    ],
    ctas: {
      soft: 'Оценить текущий growth-контур',
      rational: 'Получить карту digital-роста на квартал',
      fast: 'Собрать единый план роста за 2 недели',
    },
    related: ['seo', 'lead-generation', 'performance-ads', 'online-reputation'],
    images: imageSet(
      'digital-growth',
      'Иллюстрация digital growth и связки каналов',
      'Схема digital growth от диагностики до масштабирования',
      'Визуал результата digital growth по спросу и заявкам'
    ),
  },
  {
    slug: 'marketplace-sellers',
    shortName: 'Маркетплейсы для продавцов',
    label: 'Рост карточек и продаж',
    h1: 'Продвижение продавцов на маркетплейсах: карточки, рейтинг и продажи',
    title: 'Продвижение продавцов на маркетплейсах',
    description:
      'Помогаю продавцам маркетплейсов усиливать карточки, выдачу и репутационные сигналы, чтобы рост продаж был управляемым и маржинальным.',
    intro:
      'Подходит брендам и селлерам, которым важно не просто наращивать показы, а повышать качество карточек, конверсию и устойчивость позиции в выдаче площадки.',
    heroValue:
      'Основной акцент — на коммерческих факторах карточки: контент, цена, рейтинг, отзывы, ассортиментная логика и аналитика unit-экономики.',
    subheading:
      'Формат можно вести в фиксированном бюджете или в модели фикс + процент / процент от результата при прозрачной аналитике.',
    angle: 'Маркетплейс-рост без хаоса',
    cardDescription: 'Системная работа для продавцов маркетплейсов: карточки, репутация, позиции и коммерческая эффективность.',
    cardCta: 'Открыть услугу',
    benefits: [
      { title: 'Сильнее карточки товара', text: 'Контент карточек и визуальная подача лучше закрывают интент и повышают конверсию.' },
      { title: 'Управление рейтингом и отзывами', text: 'Репутационные сигналы работают как фактор выдачи и выбора.' },
      { title: 'Рост по приоритетным SKU', text: 'Фокус на ассортименте, который влияет на маржу и оборот, а не на весь каталог сразу.' },
      { title: 'Гибкая модель оплаты', text: 'Возможен фиксированный формат или работа за процент при договоренных KPI.' },
    ],
    audience: [
      'Продавцам на Ozon, Wildberries и других крупных маркетплейсах.',
      'Брендам с большим ассортиментом и задачей повысить оборачиваемость SKU.',
      'Селлерам с нестабильной выдачей и высокой зависимостью от рейтинга.',
      'Командам, которым нужна системная аналитика эффективности карточек.',
    ],
    includes: [
      'Аудит карточек, ассортимента, рейтинга и текущей позиции в выдаче.',
      'Оптимизацию контента карточек и коммерческих элементов.',
      'Работу с отзывами, репутационными сигналами и CTR карточек.',
      'Приоритизацию SKU по марже, спросу и вероятности роста.',
      'Регулярный цикл аналитики и корректировки гипотез.',
    ],
    steps: [
      { title: 'Диагностика', text: 'Определяем узкие места карточек, ассортимента и репутационных факторов.' },
      { title: 'Приоритеты роста', text: 'Выбираем SKU и категории для первой волны усиления.' },
      { title: 'Внедрение гипотез', text: 'Обновляем карточки, отзывы и коммерческие триггеры по плану тестов.' },
      { title: 'Масштабирование', text: 'Тиражируем успешные сценарии на следующий слой ассортимента.' },
    ],
    outcomes: [
      'Рост конверсии карточек и качества коммерческих сигналов.',
      'Усиление позиций по приоритетным SKU.',
      'Снижение потерь из-за слабой репутации и контента карточек.',
      'Понятная модель роста продаж на маркетплейсе.',
    ],
    results: [
      { title: 'Более сильная карточка в выдаче', text: 'Пользователь получает больше аргументов для покупки прямо в карточке товара.' },
      { title: 'Выше доля целевых продаж', text: 'Работа фокусируется на товарах с лучшей экономикой, а не на “показателях ради показателей”.' },
      { title: 'Устойчивее репутационный контур', text: 'Отзывы и рейтинг становятся управляемым фактором, а не источником постоянных просадок.' },
    ],
    faq: [
      {
        question: 'Можно ли работать по модели за процент?',
        answer:
          'Да. Для продавцов маркетплейсов возможна модель фикс + процент или процент от согласованного результата, если есть прозрачная аналитика по KPI.',
      },
      {
        question: 'Какие KPI обычно фиксируются?',
        answer:
          'Чаще всего это рост продаж по приоритетным SKU, конверсия карточек, доля выкупа, рейтинг и позиции в выдаче категории.',
      },
      {
        question: 'Вы работаете только с контентом карточек?',
        answer:
          'Нет. Помимо карточек важны ассортиментная логика, отзывы, коммерческие факторы и ритм аналитических итераций.',
      },
      {
        question: 'Подойдет ли услуга небольшому продавцу?',
        answer:
          'Да. На небольшом ассортименте можно быстрее проверить рабочие гипотезы и затем масштабировать их на новые позиции.',
      },
    ],
    seoBlockTitle: 'Рост продавца на маркетплейсе требует системы, а не разовых правок карточек',
    seoParagraphs: [
      'На маркетплейсах результат редко зависит от одного фактора. Важна связка контента карточки, репутации, цены, ассортимента и регулярной оптимизации по данным.',
      'Именно поэтому эффективный формат работы — это не “разово переписать карточки”, а управляемый цикл гипотез с фокусом на приоритетные SKU и коммерческий эффект.',
    ],
    ctas: {
      soft: 'Проверить текущие карточки и KPI',
      rational: 'Получить план роста по приоритетным SKU',
      fast: 'Запустить формат фикс + % или % по KPI',
    },
    related: ['ecommerce-seo', 'online-reputation', 'performance-ads', 'seo'],
    images: imageSet(
      'marketplace-sellers',
      'Иллюстрация продвижения продавцов на маркетплейсах',
      'Схема оптимизации карточек и репутационных сигналов',
      'Визуал результата по карточкам и продажам на маркетплейсе'
    ),
  },
]

export const categoryExpansionEnServices: ServicePageEntry[] = [
  {
    slug: 'lead-generation',
    shortName: 'Lead Generation',
    label: 'Commercial demand and qualified leads',
    h1: 'Lead generation aligned with sales KPIs and lead quality',
    title: 'Lead generation focused on sales KPIs',
    description:
      'I build lead generation as a managed system: offer, landing pages, channels, analytics, and lead-quality control through SQL and deal stages.',
    intro:
      'This format is useful when lead volume exists but commercial value is weak: poor qualification, unstable costs, or low conversion to real sales.',
    heroValue:
      'The focus is not vanity CPL alone, but the full business chain: MQL, SQL, CAC, ROMI, and predictable movement toward closed deals.',
    subheading:
      'Instead of scattered launches, you get one working acquisition model tied to business outcomes and clear optimization priorities.',
    angle: 'Lead quality and acquisition economics',
    cardDescription: 'Lead generation managed by commercial impact, not only top-of-funnel metrics.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Higher-quality lead flow', text: 'Campaigns are optimized for SQL and sales potential, not just form submissions.' },
      { title: 'Transparent channel economics', text: 'Every source is measured by CPL, CAC, ROMI, and revenue contribution.' },
      { title: 'Fast iteration cycle', text: 'Hypotheses are validated quickly and budget moves to proven combinations.' },
      { title: 'Sales alignment', text: 'Marketing decisions are connected to CRM feedback and real qualification outcomes.' },
    ],
    audience: [
      'B2B companies with longer and more expensive sales cycles.',
      'Service businesses needing a stable flow of qualified leads.',
      'Projects with traffic growth but weak conversion to sales outcomes.',
      'Teams that need one acquisition framework across marketing and CRM.',
    ],
    includes: [
      'Audit of funnel performance, channels, and acquisition costs.',
      'ICP, offer, and lead-magnet structuring for better intent fit.',
      'Landing-page improvements for stronger conversion quality.',
      'End-to-end analytics around MQL, SQL, CAC, and ROMI.',
      'Ongoing optimization based on quality, not lead count alone.',
    ],
    steps: [
      { title: 'Diagnosis and KPI framing', text: 'We define business goals, quality criteria, and target acquisition economics.' },
      { title: 'System design', text: 'We structure channels, offers, pages, and tracking into one model.' },
      { title: 'Launch and active management', text: 'We run campaigns, validate hypotheses, and remove weak segments.' },
      { title: 'Scale with control', text: 'Winning combinations are expanded without degrading quality.' },
    ],
    outcomes: [
      'A more stable flow of relevant leads.',
      'Lower share of low-intent inquiries in CRM.',
      'Clear quarterly channel and budget predictability.',
      'Higher SQL quality and sales readiness.',
    ],
    results: [
      { title: 'Less junk demand', text: 'Segmentation and offer logic filter weak demand earlier in the funnel.' },
      { title: 'Stronger lead-to-sale progression', text: 'Pages and qualification structure improve movement toward SQL and deals.' },
      { title: 'Managed growth model', text: 'Scaling is based on proven economics, not channel intuition.' },
    ],
    faq: [
      {
        question: 'How fast do first signals usually appear?',
        answer:
          'Initial signals often show up in 2-4 weeks, while stable lead quality and economics usually require 2-3 months of iteration.',
      },
      {
        question: 'Is this only paid traffic?',
        answer:
          'No. If SEO pages or content are required to improve lead quality and conversion, those layers are integrated into the same model.',
      },
      {
        question: 'Can you work with our in-house team and vendors?',
        answer:
          'Yes. I can operate as a growth layer on top of your current setup, with KPI control and prioritization support.',
      },
      {
        question: 'What is needed from our side?',
        answer:
          'Analytics and CRM access, sales feedback on lead quality, and clarity on target acquisition economics.',
      },
    ],
    seoBlockTitle: 'Lead generation works best as an operating system',
    seoParagraphs: [
      'A strong acquisition engine depends on connected layers: demand, offer, landing pages, analytics, and sales process. If one layer is weak, performance and predictability collapse quickly.',
      'That is why the core objective is not lead count alone, but quality progression through the funnel: click to inquiry, inquiry to SQL, SQL to closed revenue.',
    ],
    ctas: {
      soft: 'Review your current funnel leaks',
      rational: 'Get a KPI-based lead plan',
      fast: 'Launch a pilot in the next weeks',
    },
    related: ['performance-ads', 'digital-growth', 'seo', 'seo-content'],
    images: imageSet(
      'lead-generation',
      'Lead generation and commercial funnel concept',
      'Lead generation workflow from hypotheses to SQL',
      'Lead generation results focused on quality and sales impact'
    ),
  },
  {
    slug: 'online-reputation',
    shortName: 'Online Reputation',
    label: 'Trust layer and branded search control',
    h1: 'Online reputation management for stronger trust and conversion',
    title: 'Online reputation management for brands',
    description:
      'I build and manage your reputation layer across reviews, branded SERP, and external mentions to support conversion before first contact.',
    intro:
      'This is useful when customers evaluate vendors through search results, review platforms, and public brand signals before submitting a request.',
    heroValue:
      'Reputation becomes an operational asset: lower risk, stronger trust, and better conversion from branded and commercial demand.',
    subheading:
      'The model combines monitoring, response workflows, and SERP/content adjustments to improve trust where decisions are made.',
    angle: 'Reputation as a growth and conversion factor',
    cardDescription: 'Systematic work with reviews, mentions, and branded search visibility.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Stronger trust layer', text: 'Users see a more credible brand footprint across search and review platforms.' },
      { title: 'Reputation-risk control', text: 'Negative signals are handled through a defined process, not ad hoc responses.' },
      { title: 'Structured review operations', text: 'Collection, moderation, and response become a repeatable workflow.' },
      { title: 'Conversion support', text: 'Improved trust reduces drop-off during vendor comparison.' },
    ],
    audience: [
      'Brands with meaningful share of branded search demand.',
      'Businesses where reviews heavily influence purchase decisions.',
      'Projects recovering from public or reputational issues.',
      'Teams needing ongoing reputation governance.',
    ],
    includes: [
      'Reputation baseline audit and sentiment mapping.',
      'Platform prioritization by risk and decision impact.',
      'Review-response process and company-card improvements.',
      'Branded SERP improvements through content and SEO layers.',
      'Regular analytics on trust signals and conversion influence.',
    ],
    steps: [
      { title: 'Baseline analysis', text: 'We map brand mentions, sentiment, and trust blockers across critical platforms.' },
      { title: 'Strategy and playbooks', text: 'We define channels, tone, response SLA, and escalation rules.' },
      { title: 'Implementation', text: 'We launch monitoring, review operations, and branded SERP corrections.' },
      { title: 'Stabilization and growth', text: 'We strengthen positive trust signals and update scenarios as context changes.' },
    ],
    outcomes: [
      'Higher share of positive and neutral mentions.',
      'Lower impact of negative reputation factors.',
      'Stronger branded SERP credibility.',
      'A clearer operating model for trust management.',
    ],
    results: [
      { title: 'More trust before contact', text: 'Potential clients see a clearer and more reliable brand narrative.' },
      { title: 'Fewer reputation breakdowns', text: 'Teams follow a structured response process instead of chaotic reactions.' },
      { title: 'Better conversion from branded demand', text: 'Trust improvements directly support commercial outcomes.' },
    ],
    faq: [
      {
        question: 'Can negative content be removed quickly?',
        answer:
          'There are no universal shortcuts. Practical work relies on lawful methods, communication quality, and systematic reputation operations.',
      },
      {
        question: 'Do you reply to reviews on our behalf?',
        answer:
          'Yes, with an approved tone of voice and response framework aligned with your brand and risk policy.',
      },
      {
        question: 'Which platforms are covered?',
        answer:
          'Relevant directories, map listings, marketplaces, branded search results, and other channels where customers evaluate your brand.',
      },
      {
        question: 'How is impact measured?',
        answer:
          'By sentiment trends, branded SERP composition, trust-signal quality, and conversion changes on branded traffic.',
      },
    ],
    seoBlockTitle: 'Online reputation is not a PR add-on, it is a revenue signal',
    seoParagraphs: [
      'Customers evaluate your company before they speak with sales. Reviews, listings, and branded search results shape trust and strongly influence conversion decisions.',
      'That is why reputation should be managed as an operating function with monitoring, prioritization, response governance, and measurable business impact.',
    ],
    ctas: {
      soft: 'Assess your current trust layer',
      rational: 'Get a 90-day reputation plan',
      fast: 'Start monitoring and response operations',
    },
    related: ['seo', 'seo-content', 'digital-growth', 'marketplace-sellers'],
    images: imageSet(
      'online-reputation',
      'Online reputation management concept',
      'Online reputation workflow for reviews and trust signals',
      'Online reputation results for branded trust and conversion'
    ),
  },
  {
    slug: 'performance-ads',
    shortName: 'Performance Ads',
    label: 'Paid growth driven by business metrics',
    h1: 'Performance ads focused on SQL, CAC, and ROMI',
    title: 'Performance ads aligned with business outcomes',
    description:
      'I run performance channels through commercial metrics so decisions are based on revenue impact and lead quality, not surface-level campaign stats.',
    intro:
      'This format is useful when paid traffic exists but the channel is unstable: rising costs, weak lead quality, and poor scaling discipline.',
    heroValue:
      'The objective is a controlled paid-growth model: clear KPIs, rapid testing, transparent analytics, and scale only where economics hold.',
    subheading:
      'Instead of just “managing campaigns,” you get a structured system across channels, segments, offers, pages, and budget governance.',
    angle: 'Managed paid growth',
    cardDescription: 'Performance advertising operated by sales impact and channel economics.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Commercial KPI focus', text: 'Campaign success is judged by SQL, CAC, ROMI, and revenue share.' },
      { title: 'Better lead quality', text: 'Optimization uses downstream CRM signals, not clicks alone.' },
      { title: 'Budget discipline', text: 'Weak combinations are cut and strong segments are scaled with control.' },
      { title: 'More stable outcomes', text: 'Paid growth no longer depends on reactive campaign decisions.' },
    ],
    audience: [
      'Companies already using paid channels and targeting revenue growth.',
      'Projects with unstable cost-per-lead and weak forecast quality.',
      'B2B and B2C teams aiming to increase SQL share.',
      'Businesses that need transparent media-budget governance.',
    ],
    includes: [
      'Audit of current accounts, funnel, and budget leakage.',
      'Campaign architecture built around commercial scenarios.',
      'Event tracking and CRM signal integration.',
      'Testing cycle for creatives, offers, and landing pages.',
      'Weekly optimization and budget reallocation by impact.',
    ],
    steps: [
      { title: 'Audit and target economics', text: 'We define KPI ranges, CAC boundaries, and scale conditions.' },
      { title: 'System setup', text: 'We structure channels, segments, events, and reporting logic.' },
      { title: 'Data-driven optimization', text: 'We improve combinations through CRM-backed quality signals.' },
      { title: 'Scale', text: 'Profitable directions are expanded without losing quality control.' },
    ],
    outcomes: [
      'Higher volume of quality paid leads.',
      'Reduced waste in media spend.',
      'More stable ROMI and channel predictability.',
      'A clear paid-growth operating model.',
    ],
    results: [
      { title: 'Better budget allocation', text: 'Spend is concentrated on segments that produce real sales outcomes.' },
      { title: 'Stronger quality funnel', text: 'A larger share of leads reaches qualification and deal stages.' },
      { title: 'Predictable paid channel', text: 'Optimization follows a stable rhythm instead of firefighting.' },
    ],
    faq: [
      {
        question: 'Which ad channels do you work with?',
        answer:
          'Channel mix is selected by your economics and demand model: search, social, remarketing, and other measurable paid sources.',
      },
      {
        question: 'Can we start from existing campaigns?',
        answer:
          'Yes. Many projects begin with an account audit and a structured rebuild around better KPI logic.',
      },
      {
        question: 'How fast can scale happen?',
        answer:
          'After economics are validated on a test volume. Scaling is typically staged to protect lead quality.',
      },
      {
        question: 'Do you work on landing pages too?',
        answer:
          'Yes. If landing friction limits performance, page offer and structure are optimized together with campaigns.',
      },
    ],
    seoBlockTitle: 'Performance ads that can scale without quality collapse',
    seoParagraphs: [
      'When paid channels are run by clicks and CTR only, teams often get attractive dashboards with weak commercial outcomes.',
      'A stronger model depends on deep analytics, CRM integration, and strict prioritization of hypotheses by SQL and revenue contribution.',
    ],
    ctas: {
      soft: 'Audit your current paid setup',
      rational: 'Get a performance optimization roadmap',
      fast: 'Relaunch paid growth around sales KPIs',
    },
    related: ['lead-generation', 'digital-growth', 'seo', 'seo-content'],
    images: imageSet(
      'performance-ads',
      'Performance ads and commercial KPI concept',
      'Performance optimization workflow across funnel stages',
      'Performance ads results for lead quality and ROI'
    ),
  },
  {
    slug: 'digital-growth',
    shortName: 'Digital Growth',
    label: 'Unified growth layer',
    h1: 'Digital growth by combining SEO, content, and product logic',
    title: 'Digital growth for demand and qualified inquiries',
    description:
      'I design a unified growth layer for your site: SEO, content, commercial page logic, and analytics in one roadmap instead of fragmented vendor streams.',
    intro:
      'This works best when one channel is no longer enough and the business needs a shared model for demand growth, lead quality, and conversion.',
    heroValue:
      'Digital growth aligns SEO, content, and paid activity under one priority framework with transparent business impact.',
    subheading:
      'The main objective is to remove the gap between traffic, page meaning, and the user’s commercial next step.',
    angle: 'Cross-channel growth model',
    cardDescription: 'A unified digital format where channels reinforce each other instead of competing.',
    cardCta: 'Open service',
    benefits: [
      { title: 'One growth strategy', text: 'SEO, content, and paid layers are managed through shared KPIs and priorities.' },
      { title: 'Lower cross-team friction', text: 'Conflicting tasks between marketing, sales, and product are reduced.' },
      { title: 'Faster implementation loops', text: 'Hypotheses move in one operating rhythm instead of separate backlogs.' },
      { title: 'Stronger commercial pages', text: 'Pages improve for both demand capture and conversion quality.' },
    ],
    audience: [
      'Teams running SEO, content, and paid channels in parallel.',
      'Projects with traffic growth but weak lead conversion quality.',
      'B2B and service businesses with complex decision paths.',
      'Companies needing an external growth-control layer.',
    ],
    includes: [
      'Diagnosis of channel conflicts and growth bottlenecks.',
      'Unified demand/page/funnel growth map.',
      'Priority model across SEO, content, and paid actions.',
      'Shared analytics framework tied to quality and revenue.',
      'Regular implementation and review cycle for hypotheses.',
    ],
    steps: [
      { title: 'Audit and alignment', text: 'We define leak points and align KPI ownership across functions.' },
      { title: 'Growth architecture', text: 'We build a roadmap where each channel has a clear role.' },
      { title: 'Execution and testing', text: 'Priority hypotheses are implemented across pages, content, and acquisition.' },
      { title: 'Scale and governance', text: 'Winning scenarios are scaled while preserving delivery control.' },
    ],
    outcomes: [
      'A business-level digital growth model.',
      'More stable demand and lead quality growth.',
      'Less planning and execution chaos.',
      'Better predictability from traffic to revenue.',
    ],
    results: [
      { title: 'Higher channel synergy', text: 'SEO, content, and paid begin to reinforce each other consistently.' },
      { title: 'Faster strategic decisions', text: 'One performance picture improves priority and budget choices.' },
      { title: 'Controlled growth pace', text: 'Team capacity is focused on changes with strongest business impact.' },
    ],
    faq: [
      {
        question: 'How is this different from regular SEO support?',
        answer:
          'SEO is one key layer. Digital growth combines SEO, content, paid activity, and page/product logic into one operating model.',
      },
      {
        question: 'Is this only for large teams?',
        answer:
          'No. Even smaller teams benefit from a unified growth framework to avoid fragmented execution.',
      },
      {
        question: 'Can this start with only part of the channels?',
        answer:
          'Yes. The model can start from priority channels and expand as capacity and maturity grow.',
      },
      {
        question: 'How is impact measured?',
        answer:
          'Through a combined view of demand capture, lead quality, page conversion, and revenue influence.',
      },
    ],
    seoBlockTitle: 'Digital growth as an operating system for marketing',
    seoParagraphs: [
      'When SEO, content, and paid teams operate separately, growth slows down at channel boundaries and business impact becomes blurry.',
      'A unified digital growth layer connects priorities, implementation rhythm, and commercial measurement into one manageable system.',
    ],
    ctas: {
      soft: 'Assess your current growth system',
      rational: 'Get a quarterly digital growth map',
      fast: 'Build a unified growth plan in two weeks',
    },
    related: ['seo', 'lead-generation', 'performance-ads', 'online-reputation'],
    images: imageSet(
      'digital-growth',
      'Digital growth concept with connected channels',
      'Digital growth workflow from diagnosis to scale',
      'Digital growth results for demand and lead quality'
    ),
  },
  {
    slug: 'marketplace-sellers',
    shortName: 'Marketplace Sellers',
    label: 'Card quality, ranking, and sell-through',
    h1: 'Marketplace growth for sellers: cards, reputation, and profitable SKU focus',
    title: 'Marketplace growth services for sellers',
    description:
      'I help marketplace sellers improve card quality, ranking stability, and commercial performance through structured optimization and analytics.',
    intro:
      'This format is useful for brands and sellers that need more than visibility: better card conversion, stronger trust signals, and controlled growth by SKU economics.',
    heroValue:
      'The core focus is card-level commercial factors: content quality, price logic, rating, reviews, assortment structure, and margin-aware prioritization.',
    subheading:
      'The service can run on fixed monthly terms or fixed + revenue-share / revenue-share only, when KPI analytics are transparent.',
    angle: 'Marketplace growth with margin control',
    cardDescription: 'Systematic marketplace growth: card quality, reputation signals, ranking, and sell-through performance.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Stronger product cards', text: 'Card content and visual structure improve intent fit and conversion rate.' },
      { title: 'Rating and review governance', text: 'Reputation signals are managed as ranking and trust factors.' },
      { title: 'SKU-priority growth', text: 'Effort is focused on categories and items with strongest margin impact.' },
      { title: 'Flexible pricing model', text: 'Fixed retainer or revenue-share model is possible with agreed KPI transparency.' },
    ],
    audience: [
      'Sellers on major marketplaces such as Ozon and Wildberries.',
      'Brands with larger assortments needing better SKU turnover.',
      'Teams with unstable ranking and high rating dependency.',
      'Businesses that need card-level performance analytics discipline.',
    ],
    includes: [
      'Audit of cards, assortment, rating, and current ranking profile.',
      'Optimization of product-card content and commercial blocks.',
      'Review-management and reputation-signal workflow.',
      'SKU prioritization by demand, margin, and growth probability.',
      'Regular test cycle and performance adjustments.',
    ],
    steps: [
      { title: 'Diagnosis', text: 'We identify bottlenecks in card quality, assortment logic, and trust signals.' },
      { title: 'Priority setup', text: 'We select SKU and categories for the first growth wave.' },
      { title: 'Implementation', text: 'Cards, reviews, and commercial triggers are updated through structured testing.' },
      { title: 'Scale', text: 'Winning patterns are rolled out across the next SKU layer.' },
    ],
    outcomes: [
      'Higher card conversion and stronger commercial signals.',
      'Better ranking positions for priority SKU.',
      'Lower losses from weak card content and trust gaps.',
      'A clearer growth model for marketplace revenue.',
    ],
    results: [
      { title: 'Stronger card competitiveness', text: 'Buyers get clearer purchase arguments directly on product cards.' },
      { title: 'Higher share of profitable sales', text: 'Growth is focused on SKU economics, not only top-line visibility.' },
      { title: 'More resilient trust layer', text: 'Reviews and ratings become managed factors instead of recurring volatility.' },
    ],
    faq: [
      {
        question: 'Can we work on a revenue-share model?',
        answer:
          'Yes. For marketplace sellers, fixed + revenue-share or revenue-share-only models are possible when KPI tracking is transparent and agreed in advance.',
      },
      {
        question: 'Which KPI are typically tracked?',
        answer:
          'Usually card conversion, sales growth by priority SKU, buyout rate, rating dynamics, and category-level ranking positions.',
      },
      {
        question: 'Is this only card-content work?',
        answer:
          'No. Card content is one layer; assortment priorities, trust signals, and iterative analytics are equally important.',
      },
      {
        question: 'Is this useful for smaller sellers?',
        answer:
          'Yes. Smaller assortments often allow faster testing and cleaner rollout of winning optimization patterns.',
      },
    ],
    seoBlockTitle: 'Marketplace growth needs a system, not one-time card edits',
    seoParagraphs: [
      'Marketplace performance depends on a connected set of factors: card content, trust signals, pricing logic, assortment focus, and regular data-driven iteration.',
      'That is why strong seller growth is built as a repeatable optimization system around priority SKU and commercial outcomes, not as isolated card rewrites.',
    ],
    ctas: {
      soft: 'Audit your current card and KPI setup',
      rational: 'Get a priority SKU growth plan',
      fast: 'Start fixed + % or % KPI model',
    },
    related: ['ecommerce-seo', 'online-reputation', 'performance-ads', 'seo'],
    images: imageSet(
      'marketplace-sellers',
      'Marketplace seller growth concept',
      'Marketplace card and reputation optimization workflow',
      'Marketplace growth results for cards and sales'
    ),
  },
]

export const categoryExpansionPricing: ServicePricingEntry[] = [
  {
    slug: 'lead-generation',
    name: 'Лидогенерация',
    shortDescription: 'Система привлечения целевых заявок с контролем качества лидов и коммерческой окупаемости канала.',
    priceFrom: 70000,
    unit: 'month',
    priceLabel: 'от 70 000 ₽ / мес',
    calculatorHint: 'Бюджет зависит от ниши, географии, цикла сделки и требуемого объема SQL.',
    deliverables: ['План гипотез и медиамодель', 'Офферы и посадочные страницы', 'Сквозная аналитика MQL/SQL/CAC'],
  },
  {
    slug: 'online-reputation',
    name: 'Управление онлайн-репутацией',
    shortDescription: 'Системная работа с отзывами, брендовой выдачей и trust layer для роста доверия и конверсии.',
    priceFrom: 60000,
    unit: 'month',
    priceLabel: 'от 60 000 ₽ / мес',
    calculatorHint: 'Стоимость зависит от репутационного фона, числа площадок и регулярности публичных упоминаний.',
    deliverables: ['Карта репутационных рисков', 'План работы с отзывами и площадками', 'Регламент реакции и аналитика'],
  },
  {
    slug: 'performance-ads',
    name: 'Performance-реклама',
    shortDescription: 'Управление рекламой по бизнес-метрикам: SQL, CAC, ROMI и вклад в выручку.',
    priceFrom: 80000,
    unit: 'month',
    priceLabel: 'от 80 000 ₽ / мес',
    calculatorHint: 'Цена зависит от числа каналов, рекламного бюджета, зрелости аналитики и объема тестов.',
    deliverables: ['Стратегия каналов и сегментов', 'Запуск и оптимизация кампаний', 'Сквозной трекинг до сделки'],
  },
  {
    slug: 'digital-growth',
    name: 'Digital Growth',
    shortDescription: 'Объединяющий слой роста: SEO, контент и performance в единой системе приоритетов.',
    priceFrom: 90000,
    unit: 'month',
    priceLabel: 'от 90 000 ₽ / мес',
    calculatorHint: 'Формат зависит от числа каналов, состояния сайта, глубины внедрения и структуры команды.',
    deliverables: ['Growth-аудит и roadmap', 'Единая KPI-рамка по каналам', 'Регулярный цикл внедрения гипотез'],
  },
  {
    slug: 'marketplace-sellers',
    name: 'Маркетплейсы для продавцов',
    shortDescription: 'Рост карточек и продаж на маркетплейсах через контент, рейтинг, отзывы и приоритетные SKU.',
    priceFrom: 30000,
    unit: 'month',
    priceLabel: 'от 30 000 ₽ / мес или работа за процент',
    calculatorHint:
      'Для продавцов маркетплейсов возможны фиксированный формат, фикс + процент или работа за процент при прозрачной аналитике KPI.',
    deliverables: ['Аудит карточек и ассортимента', 'План оптимизации по SKU', 'Регулярная аналитика и итерации роста'],
  },
]
