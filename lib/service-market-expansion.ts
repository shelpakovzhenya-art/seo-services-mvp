function imageSet(slug: string, heroAlt: string, processAlt: string, resultsAlt: string) {
  return {
    hero: `/services/${slug}/hero.webp`,
    process: `/services/${slug}/process.webp`,
    results: `/services/${slug}/results.webp`,
    heroAlt,
    processAlt,
    resultsAlt,
  }
}

export const marketExpansionRuServices = [
  {
    slug: 'google-seo',
    shortName: 'SEO в Google',
    label: 'Продвижение под Google',
    h1: 'SEO продвижение сайта в Google для проектов, которым нужна стабильная видимость по коммерческому и информационному спросу',
    title: 'SEO продвижение сайта в Google под коммерческий и информационный спрос',
    description:
      'SEO продвижение сайта в Google: поисковая оптимизация под коммерческий и информационный спрос, усиление посадочных, контента и технической базы.',
    intro:
      'Отдельный контур под Google нужен там, где бизнесу важна не абстрактная раскрутка сайта, а рост по конкретным кластерам спроса, страницам услуг и экспертным материалам.',
    heroValue:
      'Работаю с Google как с отдельной поисковой средой: собираю карту спроса, усиливаю посадочные, контентные связки, техническую базу и помогаю сайту занимать более сильные позиции по нужным сценариям выбора.',
    subheading:
      'Формат подходит проектам, где доля органики из Google уже заметна либо стратегически важна: услуги, B2B, экспертные проекты, международные и мультиязычные сайты.',
    angle: 'Видимость и спрос в Google',
    cardDescription:
      'Поисковое продвижение в Google с фокусом на кластеры спроса, качество страниц и рост видимости без шаблонных действий.',
    cardCta: 'Открыть услугу',
    benefits: [
      {
        title: 'Рост по важным кластерам',
        text: 'Приоритет идет не в случайные запросы, а в направления, где Google реально может приводить бизнесу спрос и обращения.',
      },
      {
        title: 'Сильнее ключевые посадочные',
        text: 'Усиливаются страницы услуг, экспертные материалы и связки между ними, чтобы поисковая оптимизация работала не в отрыве от конверсии.',
      },
      {
        title: 'Контент без пустой раскрутки',
        text: 'Продвижение строится вокруг интента и структуры, а не вокруг механического наращивания текста и метатегов.',
      },
      {
        title: 'Чище техническая база',
        text: 'Индексация, внутренние ссылки, шаблоны и подача страницы приводятся в порядок, чтобы рост не упирался в базовые ограничения сайта.',
      },
    ],
    audience: [
      'Компаниям, у которых значимая часть органики уже приходит из Google или должна приходить именно оттуда.',
      'Экспертным и B2B-проектам, где важны тематические кластеры, экспертный контент и качество посадочных.',
      'Сайтам услуг, которым нужно усилить поисковое продвижение в Google без отрыва от лидогенерации.',
      'Проектам с мультиязычной, федеральной или международной логикой спроса.',
    ],
    includes: [
      'Разбор спроса и структуры страниц под Google с приоритетом по коммерческим и информационным кластерам.',
      'Усиление посадочных, контентных хабов, внутренних ссылок и логики next step на ключевых URL.',
      'Проверку технической базы: индексация, шаблоны, canonical, sitemap, качество сниппетов и структурная чистота.',
      'Приоритизацию задач по влиянию на видимость и обращение, а не по формальному чек-листу.',
      'Рекомендации по внедрению и контролю роста по выбранным направлениям спроса.',
    ],
    steps: [
      {
        title: 'Разбор спроса под Google',
        text: 'Смотрю, какие темы и типы страниц реально могут расти, где уже есть база и где сайт недобирает релевантность.',
      },
      {
        title: 'Усиление ключевых URL',
        text: 'Перестраиваю посадочные, контентные связи и внутреннюю навигацию вокруг нужного интента и сценария выбора.',
      },
      {
        title: 'Техническая и шаблонная доработка',
        text: 'Убираю ограничения индексации и слабые места шаблонов, которые мешают стабильному росту в Google.',
      },
      {
        title: 'Контроль и развитие',
        text: 'Оцениваю результат, корректирую приоритеты и расширяю покрытие спроса по следующему слою страниц.',
      },
    ],
    outcomes: [
      'Более понятную карту спроса и ролей страниц именно под Google.',
      'Усиленные страницы услуг и материалов, которые лучше отвечают на интент пользователя.',
      'Чище техническую основу для роста видимости и сниппетов.',
      'Более устойчивый рост органики по важным кластерам, а не только по случайным фразам.',
    ],
    results: [
      {
        title: 'Лучше видимость по нужным темам',
        text: 'Сайт получает больше шансов расти там, где Google особенно чувствителен к качеству страниц и тематическому покрытию.',
      },
      {
        title: 'Сильнее входы в спрос',
        text: 'Органика приходит на более релевантные посадочные, а не на случайные страницы с размытым смыслом.',
      },
      {
        title: 'Меньше хаотичной оптимизации',
        text: 'Поисковое продвижение в Google превращается в понятную систему приоритетов, а не в набор разрозненных задач.',
      },
    ],
    faq: [
      {
        question: 'Чем SEO в Google отличается от общего SEO-продвижения сайта?',
        answer:
          'Общее SEO может закрывать весь поисковый контур сразу, а отдельное продвижение в Google полезно, когда именно эта система уже дает заметный спрос или требует отдельной стратегии по страницам, контенту и структуре.',
      },
      {
        question: 'Нужно ли отдельно делать оптимизацию сайта под Google, если уже идет работа под Яндекс?',
        answer:
          'Зависит от проекта. Если доля спроса из Google существенная, часто выгодно отдельно усиливать посадочные, контентные кластеры и технические сигналы именно под эту выдачу.',
      },
      {
        question: 'Подходит ли услуга сайтам услуг и B2B?',
        answer:
          'Да. Особенно там, где важны экспертные материалы, качественные сервисные страницы и более широкий негеозависимый спрос.',
      },
      {
        question: 'Это про раскрутку сайта ссылками?',
        answer:
          'Нет. Ссылочный слой может быть частью стратегии, но база здесь в спросе, страницах, технической чистоте и качестве контента.',
      },
    ],
    seoBlockTitle: 'Как работает поисковое продвижение в Google без шаблонной раскрутки сайта',
    seoParagraphs: [
      'Продвижение сайта в Google требует не только базовой оптимизации сайта, но и точной работы с интентом, качеством посадочных, тематическими кластерами и логикой перехода к обращению. Если раскрутка сайта сводится только к метатегам, рост быстро упирается в потолок.',
      'Поисковое продвижение в Google особенно эффективно там, где бизнес готов усиливать страницы услуг, экспертный контент, внутренние ссылки и техническую чистоту сайта параллельно. Тогда оптимизация сайта начинает работать как система, а не как разовая правка.',
    ],
    ctas: {
      soft: 'Обсудить SEO в Google',
      rational: 'Получить план продвижения сайта в Google',
      fast: 'Разобрать, как расти в Google уже сейчас',
    },
    related: ['seo', 'technical-seo', 'seo-content', 'yandex-seo'],
    images: imageSet(
      'google-seo',
      'Иллюстрация продвижения сайта в Google и роста тематической видимости',
      'Схема работ по SEO в Google от спроса до усиления посадочных',
      'Визуал результата поискового продвижения в Google для услуг и B2B'
    ),
  },
  {
    slug: 'yandex-seo',
    shortName: 'SEO в Яндексе',
    label: 'Продвижение под Яндекс',
    h1: 'SEO продвижение сайта в Яндексе для проектов, где важны коммерческие, региональные и поведенческие сигналы',
    title: 'SEO продвижение сайта в Яндексе под коммерческий и региональный спрос',
    description:
      'SEO продвижение сайта в Яндексе: оптимизация под коммерческие и региональные факторы, структура спроса, доверие к сайту и ключевые посадочные.',
    intro:
      'Отдельное продвижение в Яндексе полезно там, где бизнесу важно расти по коммерческим и геозависимым запросам, а сайт должен лучше объяснять оффер, условия работы и следующий шаг.',
    heroValue:
      'Собираю SEO-контур под Яндекс вокруг спроса, коммерческих сигналов, региональной логики, качества страниц и технической стабильности сайта, чтобы рост шел не только по позициям, но и по обращениям.',
    subheading:
      'Формат особенно подходит сайтам услуг, локальному бизнесу, филиальным структурам и проектам, где Яндекс остается важным каналом по коммерческим запросам.',
    angle: 'Коммерческий рост в Яндексе',
    cardDescription:
      'Продвижение сайта в Яндексе с фокусом на коммерческий спрос, региональные сигналы, доверие и усиление посадочных.',
    cardCta: 'Открыть услугу',
    benefits: [
      {
        title: 'Сильнее коммерческие страницы',
        text: 'Усиливаются оффер, блоки доверия, сценарий заявки и структура ключевых URL, которые важны именно для коммерческой выдачи.',
      },
      {
        title: 'Региональная логика без геоспама',
        text: 'Геоспрос раскладывается по рабочим страницам и локальным сигналам без лишних шаблонных дублей.',
      },
      {
        title: 'Четче работа с Яндекс-сигналами',
        text: 'Оптимизация сайта учитывает качество посадочных, понятность навигации, индексируемость и связку с коммерческими факторами.',
      },
      {
        title: 'Больше контроля над ростом',
        text: 'Работы идут по приоритетам, а не по хаотичному набору задач из разных источников.',
      },
    ],
    audience: [
      'Сайтам услуг, которые получают или хотят получать больше коммерческого трафика именно из Яндекса.',
      'Локальному и региональному бизнесу, где важны филиалы, адреса, контакты и доверительные сигналы.',
      'Компаниям с просадкой по коммерческим запросам в Яндексе несмотря на базовую SEO-работу.',
      'Проектам, которым нужна отдельная оптимизация сайта под Яндекс после редизайна, миграции или расширения структуры.',
    ],
    includes: [
      'Разбор коммерческого и регионального спроса, структуры посадочных и слабых мест сайта под Яндекс.',
      'Усиление страниц услуг, региональных URL, блоков доверия и сценария обращения.',
      'Проверку технической базы: индексация, шаблоны, служебные URL, canonical, robots и sitemap.',
      'Приоритизацию доработок по влиянию на коммерческую выдачу и видимость по геозапросам.',
      'Контроль внедрения и развитие покрытия спроса по следующим направлениям.',
    ],
    steps: [
      {
        title: 'Разбор спроса и выдачи',
        text: 'Смотрю, какие типы страниц реально выигрывают по нужным запросам в Яндексе и где сайт уступает по качеству подачи.',
      },
      {
        title: 'Усиление коммерческого слоя',
        text: 'Перестраиваю ключевые посадочные, региональные блоки и доверительные сигналы под логику выбора пользователя.',
      },
      {
        title: 'Техническая и шаблонная корректировка',
        text: 'Убираю ограничения, которые мешают индексации, управляемости структуры и чистой подаче страниц в поиске.',
      },
      {
        title: 'Рост по приоритетам',
        text: 'Расширяю покрытие спроса и добавляю новые точки роста по мере укрепления базовых разделов.',
      },
    ],
    outcomes: [
      'Более сильный коммерческий слой сайта под Яндекс.',
      'Понятные региональные и сервисные страницы без лишнего шаблонного шума.',
      'Чище техническую базу и лучше управляемую структуру.',
      'Рост видимости по запросам, которые ближе к обращению и покупке.',
    ],
    results: [
      {
        title: 'Выше релевантность коммерческой выдаче',
        text: 'Сайт лучше соответствует ожиданиям пользователя по сервису, доверию и следующему шагу.',
      },
      {
        title: 'Сильнее региональные входы',
        text: 'Региональные и геозависимые запросы закрываются более точными страницами, а не одним общим URL.',
      },
      {
        title: 'Меньше случайных просадок',
        text: 'Оптимизация под Яндекс становится системной и понятной по приоритетам, а не реактивной.',
      },
    ],
    faq: [
      {
        question: 'Когда нужно отдельно делать продвижение сайта в Яндексе?',
        answer:
          'Когда именно из Яндекса идет значимый коммерческий спрос, проект зависит от региональной выдачи или сайт уступает по коммерческим факторам и качеству посадочных.',
      },
      {
        question: 'Это подходит только локальному бизнесу?',
        answer:
          'Нет. Но особенно полезно локальным и сервисным проектам, где региональные и коммерческие сигналы сильно влияют на выдачу.',
      },
      {
        question: 'Отдельная оптимизация под Яндекс заменяет общее SEO?',
        answer:
          'Не всегда. Часто это отдельный слой внутри общей стратегии, когда Яндекс требует более точной работы со структурой, коммерческими страницами и регионом.',
      },
      {
        question: 'Что важнее: техническая база или страницы услуг?',
        answer:
          'Обычно обе части. Если техническая база мешает индексации, ее надо чинить первой, но рост по коммерческим запросам редко приходит без сильных посадочных.',
      },
    ],
    seoBlockTitle: 'Почему продвижение сайта в Яндексе нельзя сводить только к базовой оптимизации',
    seoParagraphs: [
      'Продвижение сайта в Яндексе особенно чувствительно к качеству коммерческих страниц, структуре регионального спроса, доверию к сайту и понятности следующего шага для пользователя. Если оптимизация сайта ограничивается техническими правками, коммерческий рост часто остается слабым.',
      'Поэтому поисковое продвижение в Яндексе обычно требует не только техработ, но и переработки посадочных, блоков доверия, структуры услуг и локальной логики. Именно это помогает сайту закрепляться по запросам ближе к заявке.',
    ],
    ctas: {
      soft: 'Обсудить SEO в Яндексе',
      rational: 'Получить план продвижения сайта в Яндексе',
      fast: 'Разобрать, как усилить видимость в Яндексе',
    },
    related: ['seo', 'local-seo', 'technical-seo', 'google-seo'],
    images: imageSet(
      'yandex-seo',
      'Иллюстрация продвижения сайта в Яндексе и коммерческой выдачи',
      'Схема работ по SEO в Яндексе для коммерческих и региональных страниц',
      'Визуал результата оптимизации сайта под Яндекс и рост обращений'
    ),
  },
  {
    slug: 'young-site-seo',
    shortName: 'SEO нового сайта',
    label: 'Новый и молодой сайт',
    h1: 'SEO продвижение нового и молодого сайта, чтобы с самого старта собрать правильную структуру и не копить ошибки',
    title: 'SEO продвижение нового и молодого сайта под правильный старт',
    description:
      'SEO продвижение нового и молодого сайта: структура, семантика, индексация, ключевые посадочные и стартовая оптимизация без накопления ошибок.',
    intro:
      'Продвижение нового сайта и продвижение молодого сайта редко начинается с гонки за быстрыми позициями. На старте важнее собрать правильную архитектуру, сильные страницы и чистую техническую базу, чтобы потом не переделывать основу.',
    heroValue:
      'Помогаю запустить поисковое продвижение сайта с нуля или на раннем этапе: от структуры спроса и приоритетных URL до индексации, коммерческой подачи и первого слоя контента.',
    subheading:
      'Формат особенно полезен новым сайтам услуг, молодым B2B-проектам, обновленным площадкам после запуска и бизнесам, которые хотят сразу строить сайт под рост, а не под последующий ремонт.',
    angle: 'Правильный SEO-старт',
    cardDescription:
      'Продвижение нового сайта с фокусом на структуру, индексацию, первые посадочные и стартовую карту спроса без хаотичной раскрутки.',
    cardCta: 'Открыть услугу',
    benefits: [
      {
        title: 'Меньше дорогих переделок потом',
        text: 'Базовая архитектура, шаблоны и ключевые страницы собираются сразу под рост, а не чинятся спустя месяцы после запуска.',
      },
      {
        title: 'Правильная стартовая семантика',
        text: 'Спрос раскладывается по рабочим страницам и приоритетам, а не теряется в одном общем разделе.',
      },
      {
        title: 'Чистая индексация с начала',
        text: 'Сайт получает более аккуратную техническую базу, чтобы молодому проекту не мешали дубли и служебный шум.',
      },
      {
        title: 'Понятная логика заявки',
        text: 'Страницы сразу строятся так, чтобы не только ранжироваться, но и вести пользователя к следующему шагу.',
      },
    ],
    audience: [
      'Новым сайтам услуг, которым нужен грамотный старт поискового продвижения без накопления технического долга.',
      'Молодым B2B- и экспертным проектам, где важны структура услуг, доверие и содержательные страницы.',
      'Недавно запущенным сайтам после редизайна или переезда, которые хотят сразу собрать базу под рост.',
      'Командам, которые не хотят тратить первые месяцы на хаотичную раскрутку молодого сайта без понятной системы.',
    ],
    includes: [
      'Разбор стартовой семантики, структуры разделов и приоритетных посадочных под ранний рост.',
      'Проверку индексации, шаблонов, robots, sitemap, canonical и других базовых технических сигналов.',
      'Усиление первых ключевых страниц услуг, оффера, доверительных блоков и сценария обращения.',
      'План контента и расширения структуры на ближайшие месяцы без размытия фокуса.',
      'Приоритизацию задач, чтобы молодой сайт рос от сильной базы, а не от случайных действий.',
    ],
    steps: [
      {
        title: 'Собрать основу спроса',
        text: 'Определяю, какие страницы нужны на старте, какие запросы важнее и где нельзя терять смысл уже в первой версии сайта.',
      },
      {
        title: 'Проверить запуск и индексацию',
        text: 'Смотрю, как сайт открывается поиску, нет ли лишних дублей, слабых шаблонов и технических ограничений.',
      },
      {
        title: 'Усилить стартовые посадочные',
        text: 'Дорабатываю страницы услуг, навигацию, внутренние связи и коммерческую подачу, чтобы сайт был готов к первому спросу.',
      },
      {
        title: 'Построить следующую волну роста',
        text: 'Формирую понятный план, как расширять структуру и контент без хаотичной раскрутки молодого сайта.',
      },
    ],
    outcomes: [
      'Более сильную стартовую архитектуру для нового проекта.',
      'Чистую индексацию и понятную техническую базу с самого запуска.',
      'Ключевые посадочные, которые закрывают спрос и ведут к обращению.',
      'План развития нового сайта без накопления структурных ошибок.',
    ],
    results: [
      {
        title: 'Быстрее появляется рабочая база',
        text: 'Сайт начинает расти от правильно собранных страниц и шаблонов, а не от случайного набора фраз и правок.',
      },
      {
        title: 'Меньше риска застрять на старте',
        text: 'Продвижение молодого сайта идет от структуры и приоритетов, а не от неопределенности и хаоса.',
      },
      {
        title: 'Легче масштабировать дальше',
        text: 'Когда стартовая оптимизация сделана аккуратно, следующий слой SEO и контента внедрять заметно проще.',
      },
    ],
    faq: [
      {
        question: 'Когда начинать SEO для нового сайта?',
        answer:
          'Лучше до запуска или сразу после него. Чем раньше собрать структуру, семантику и техническую базу, тем меньше придется переделывать потом.',
      },
      {
        question: 'Продвижение молодого сайта может дать результат быстро?',
        answer:
          'Первые сигналы могут появляться довольно рано, но главная цель на старте не мгновенная раскрутка, а правильная база под устойчивый рост.',
      },
      {
        question: 'Нужно ли сразу делать много страниц?',
        answer:
          'Не обязательно. Важнее запустить правильные приоритетные посадочные и расширять структуру осмысленно, а не штамповать пустые URL.',
      },
      {
        question: 'Подходит ли это после редизайна или переезда?',
        answer:
          'Да. Если сайт технически новый или недавно перезапущен, логика работы очень похожа: важно не перенести старые ошибки в молодой контур.',
      },
    ],
    seoBlockTitle: 'Почему продвижение нового сайта не равно быстрой раскрутке любой ценой',
    seoParagraphs: [
      'Продвижение нового сайта и продвижение молодого сайта начинается не с погони за максимальным числом запросов, а с правильной структуры, индексации, ключевых посадочных и стартовой логики спроса. Если на этом этапе допустить хаос, потом поисковое продвижение сайта становится дороже и медленнее.',
      'Поэтому оптимизация сайта на старте должна помогать будущему росту: собирать смысловые разделы, усиливать первые страницы услуг и оставлять проекту пространство для масштабирования без тотальной пересборки.',
    ],
    ctas: {
      soft: 'Обсудить SEO нового сайта',
      rational: 'Получить стартовый план для нового или молодого сайта',
      fast: 'Разобрать, как правильно стартовать с SEO',
    },
    related: ['seo', 'seo-audit', 'technical-seo', 'website-development'],
    images: imageSet(
      'young-site-seo',
      'Иллюстрация продвижения нового и молодого сайта с правильного старта',
      'Схема запуска SEO для нового сайта от структуры до индексации',
      'Визуал результата оптимизации молодого сайта и роста базы'
    ),
  },
  {
    slug: 'corporate-site-seo',
    shortName: 'SEO корпоративного сайта',
    label: 'Корпоративный и коммерческий сайт',
    h1: 'SEO продвижение корпоративного сайта для услуг, производства и сложных коммерческих направлений',
    title: 'SEO продвижение корпоративных и коммерческих сайтов',
    description:
      'SEO продвижение корпоративных и коммерческих сайтов: структура услуг, экспертность, страницы направлений, доверие и рост заявок из поиска.',
    intro:
      'SEO корпоративного сайта отличается от продвижения небольшого лендинга: здесь важны структура разделов, страницы услуг, экспертиза, кейсы, доверительные блоки и логика длинного выбора.',
    heroValue:
      'Помогаю выстроить поисковое продвижение корпоративного сайта вокруг сервисных и отраслевых страниц, экспертной подачи, структуры спроса и коммерческих сценариев, которые реально ведут к обращению.',
    subheading:
      'Формат подходит производственным компаниям, интеграторам, агентствам, экспертным услугам и проектам, где один сайт должен одновременно объяснять компетенции, решения и следующий шаг для клиента.',
    angle: 'Структура и доверие для корпоративного спроса',
    cardDescription:
      'Продвижение корпоративного сайта с фокусом на архитектуру услуг, доверие, экспертизу и рост заявок из поиска.',
    cardCta: 'Открыть услугу',
    benefits: [
      {
        title: 'Сильнее архитектура услуг',
        text: 'Разделы и страницы собираются так, чтобы корпоративный сайт закрывал разные сценарии спроса, а не сваливал все в один общий блок.',
      },
      {
        title: 'Больше доверия к компании',
        text: 'Кейсы, экспертиза, процесс работы и коммерческие сигналы встраиваются в страницы там, где пользователь принимает решение.',
      },
      {
        title: 'Лучше квалификация обращения',
        text: 'Сайт не только привлекает трафик, но и помогает клиенту понять fit, ограничения и формат работы еще до первого контакта.',
      },
      {
        title: 'Понятнее масштабирование',
        text: 'Новые услуги, отрасли, кейсы и экспертные материалы встраиваются в структуру без архитектурного хаоса.',
      },
    ],
    audience: [
      'Корпоративным сайтам услуг и производства, где важно объяснять несколько направлений и компетенций.',
      'B2B-проектам с длинным циклом сделки и высокой ролью доверия к компании.',
      'Коммерческим сайтам, которым нужно усилить страницы услуг, кейсы, отраслевые разделы и путь к заявке.',
      'Компаниям, у которых структура сайта уже выросла, но органика и обращения не поспевают за масштабом.',
    ],
    includes: [
      'Разбор структуры услуг, отраслевых страниц, страниц решений и слабых мест корпоративной архитектуры.',
      'Усиление ключевых коммерческих разделов: оффер, trust layer, кейсы, CTA, экспертная подача и next step.',
      'Проработку семантики по услугам, отраслям и сценариям выбора, которые важны для бизнеса.',
      'Проверку технической и шаблонной базы, чтобы сайт не терял рост на уровне архитектуры.',
      'План расширения корпоративного SEO-контура без распыления ресурса.',
    ],
    steps: [
      {
        title: 'Разобрать сервисную архитектуру',
        text: 'Определяю, как спрос должен раскладываться по услугам, решениям, отраслям и вспомогательным страницам компании.',
      },
      {
        title: 'Усилить ключевые коммерческие разделы',
        text: 'Перерабатываю страницы услуг и доверия так, чтобы корпоративный сайт лучше отвечал на вопросы клиента и вел к следующему шагу.',
      },
      {
        title: 'Собрать SEO-контур роста',
        text: 'Связываю структуру, контент, внутренние ссылки и приоритеты внедрения в одну рабочую систему.',
      },
      {
        title: 'Масштабировать без хаоса',
        text: 'Добавляю новые точки роста в архитектуру сайта так, чтобы коммерческий слой становился сильнее, а не расползался.',
      },
    ],
    outcomes: [
      'Более сильную структуру корпоративного сайта под спрос и лидогенерацию.',
      'Усиленные страницы услуг, решений и доверительных сценариев.',
      'Лучше квалифицированные обращения из поиска.',
      'Понятную систему масштабирования новых направлений и страниц.',
    ],
    results: [
      {
        title: 'Сайт лучше объясняет компетенции',
        text: 'Пользователь быстрее понимает, чем компания занимается, кому подходит и почему ей можно доверять.',
      },
      {
        title: 'Сильнее коммерческие страницы',
        text: 'Поисковое продвижение корпоративного сайта начинает работать не только на трафик, но и на качество обращения.',
      },
      {
        title: 'Меньше разрывов между SEO и продажей',
        text: 'Структура и контент помогают связать поисковый спрос с реальным бизнес-сценарием, а не оставляют пользователя на полпути.',
      },
    ],
    faq: [
      {
        question: 'Чем SEO корпоративного сайта отличается от общего SEO-продвижения?',
        answer:
          'Здесь обычно выше роль структуры услуг, страниц решений, доверия, кейсов и квалификации обращения. Просто наращивать трафик без усиления этих слоев малоэффективно.',
      },
      {
        question: 'Это подходит только B2B-компаниям?',
        answer:
          'Нет. Но особенно полезно B2B, производству, экспертным и сервисным компаниям, где сайт должен подробно объяснять оффер и процесс работы.',
      },
      {
        question: 'Можно ли на одной услуге закрыть и корпоративный, и коммерческий сайт?',
        answer:
          'Да, если логика спроса и структура похожи. На практике корпоративный и коммерческий сайт часто решают одну задачу: превращать сложный спрос в качественное обращение.',
      },
      {
        question: 'Что важнее: кейсы, страницы услуг или блог?',
        answer:
          'Обычно сначала усиливаются страницы услуг и логика выбора, затем рядом подключаются кейсы и экспертный контент, которые помогают доводить пользователя до заявки.',
      },
    ],
    seoBlockTitle: 'Как работает SEO продвижение корпоративного и коммерческого сайта',
    seoParagraphs: [
      'SEO продвижение корпоративного сайта отличается от раскрутки небольшого лендинга: здесь важны структура разделов, страницы услуг, отраслевые сценарии, кейсы, доверие и ясная коммерческая подача. Если эти слои не собраны, один только рост трафика не даст сильного результата.',
      'Поисковое продвижение коммерческого сайта работает заметно лучше, когда рядом с SEO идут переработка ключевых страниц, внутренняя перелинковка, экспертный контент и понятный путь к обращению. Тогда сайт не просто получает визиты, а помогает клиенту принять решение.',
    ],
    ctas: {
      soft: 'Обсудить SEO корпоративного сайта',
      rational: 'Получить план продвижения корпоративного сайта',
      fast: 'Разобрать, как усилить корпоративный сайт',
    },
    related: ['seo', 'b2b-seo', 'seo-content', 'seo-consulting'],
    images: imageSet(
      'corporate-site-seo',
      'Иллюстрация продвижения корпоративного сайта и структуры услуг',
      'Схема SEO для корпоративного сайта от архитектуры до доверия',
      'Визуал результата продвижения корпоративного и коммерческого сайта'
    ),
  },
]

export const marketExpansionEnServices = [
  {
    slug: 'google-seo',
    shortName: 'Google SEO',
    label: 'Search growth focused on Google',
    h1: 'Google SEO for projects that need stronger visibility across commercial and informational demand',
    title: 'Google SEO built around demand clusters, landing pages, and growth quality',
    description:
      'Google SEO for companies that need stronger landing pages, better demand coverage, cleaner technical signals, and search growth tied to real inquiries.',
    intro:
      'A dedicated Google SEO layer is useful when the business already depends on Google traffic or needs a clearer strategy for growing there.',
    heroValue:
      'The work treats Google as a distinct search environment: demand clusters, landing-page quality, content support, internal links, and a cleaner technical base all have to work together.',
    subheading:
      'It is a strong fit for service businesses, B2B projects, expert websites, and multilingual or wider-market demand structures.',
    angle: 'Visibility and qualified demand in Google',
    cardDescription:
      'Google SEO for companies that need stronger page quality, clearer demand mapping, and search growth without checkbox optimization.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Growth around the right clusters', text: 'The focus stays on demand that matters commercially, not on loose traffic volume.' },
      { title: 'Stronger landing pages', text: 'Key service and expert pages are improved so they work for visibility and inquiry quality together.' },
      { title: 'Cleaner content logic', text: 'Content is tied to user intent and nearby pages instead of added as isolated text.' },
      { title: 'A healthier technical base', text: 'Indexation, templates, snippets, and structure are refined so growth is less fragile.' },
    ],
    audience: [
      'Projects where Google is already an important traffic source or should become one.',
      'Service and B2B websites that need stronger page quality and topical coverage.',
      'Companies expanding into broader, multilingual, or less region-bound demand.',
      'Teams that want Google growth tied to real commercial outcomes.',
    ],
    includes: [
      'Review of demand clusters and page roles in Google search.',
      'Improvements to landing pages, content relationships, and internal links.',
      'Technical review of templates, snippets, indexation, canonical signals, and site cleanliness.',
      'A priority map based on impact rather than on a generic SEO checklist.',
      'Recommendations and support around implementation and the next growth layer.',
    ],
    steps: [
      { title: 'Map the demand', text: 'We define where Google visibility can grow and which page types deserve the first effort.' },
      { title: 'Strengthen the key pages', text: 'Service pages and related content are rebuilt around intent clarity and conversion support.' },
      { title: 'Clean up the technical layer', text: 'Template and indexation issues that limit visibility are addressed in priority order.' },
      { title: 'Extend the growth system', text: 'After the strongest layer improves, the next demand clusters are added more safely.' },
    ],
    outcomes: [
      'A clearer Google-facing demand structure.',
      'Stronger pages around priority commercial and expert topics.',
      'A healthier technical base for sustainable search growth.',
      'More consistent organic visibility tied to useful demand.',
    ],
    results: [
      { title: 'Better topic visibility', text: 'The site grows more naturally where Google expects stronger page quality and topic coverage.' },
      { title: 'Stronger entry pages', text: 'Traffic reaches pages that are closer to the right question and the right next step.' },
      { title: 'Less scattered SEO effort', text: 'Google growth becomes a system of priorities instead of a list of disconnected tasks.' },
    ],
    faq: [
      {
        question: 'When does it make sense to separate Google SEO from broader SEO work?',
        answer:
          'When Google is already strategically important or when the site needs specific work around page quality, content relationships, and technical signals for that search environment.',
      },
      {
        question: 'Is this mainly for content-heavy websites?',
        answer:
          'No. It is also useful for service and B2B sites where landing-page quality and demand structure matter more than content volume alone.',
      },
      {
        question: 'Does this replace general SEO?',
        answer:
          'Not always. In many projects it becomes a dedicated layer inside a broader SEO roadmap.',
      },
      {
        question: 'Is this mostly about links?',
        answer:
          'No. External authority can matter, but the base is still demand mapping, page quality, content structure, and technical consistency.',
      },
    ],
    seoBlockTitle: 'Why Google SEO works best as a quality system, not a patchwork of tweaks',
    seoParagraphs: [
      'Google SEO usually depends on how well the site matches demand clusters, how strong the landing pages are, and how cleanly content and technical signals support those pages.',
      'That is why growth in Google works better when structure, pages, content, and technical clarity are improved together instead of treated as separate tasks.',
    ],
    ctas: {
      soft: 'Discuss Google SEO',
      rational: 'Get a Google SEO starting plan',
      fast: 'Review Google growth opportunities now',
    },
    related: ['seo', 'technical-seo', 'seo-content', 'yandex-seo'],
    images: imageSet(
      'google-seo',
      'Google SEO concept for demand growth',
      'Google SEO workflow from demand mapping to implementation',
      'Google SEO results for stronger visibility and inquiry quality'
    ),
  },
  {
    slug: 'yandex-seo',
    shortName: 'Yandex SEO',
    label: 'Search growth focused on Yandex',
    h1: 'Yandex SEO for projects that depend on commercial, regional, and trust-sensitive search demand',
    title: 'Yandex SEO for commercial demand, regional structure, and stronger landing pages',
    description:
      'Yandex SEO for service businesses that need stronger commercial pages, regional logic, cleaner technical signals, and search growth tied to inquiries.',
    intro:
      'A dedicated Yandex SEO format is useful when the project depends on commercial search, regional demand, or trust-heavy service pages.',
    heroValue:
      'The work connects Yandex-facing demand, commercial page quality, trust signals, regional structure, and technical consistency into one practical growth layer.',
    subheading:
      'It fits local and regional businesses, service websites, branch-based projects, and companies where Yandex remains a core channel for qualified demand.',
    angle: 'Commercial and regional visibility in Yandex',
    cardDescription:
      'Yandex SEO for stronger service pages, regional logic, and commercial search performance without generic optimization.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Stronger commercial pages', text: 'Key service pages become more convincing, clearer, and better aligned with commercial search intent.' },
      { title: 'Cleaner regional logic', text: 'Regional demand is supported without turning the site into a pile of template-driven geo pages.' },
      { title: 'Better alignment with Yandex signals', text: 'Structure, trust, and technical quality are improved around the search environment that matters.' },
      { title: 'A more manageable roadmap', text: 'The work stays focused on meaningful growth priorities instead of reactive fixes.' },
    ],
    audience: [
      'Service businesses where Yandex is still central to qualified demand.',
      'Local and regional projects that need stronger geo-sensitive structure.',
      'Companies with weak commercial pages despite existing SEO work.',
      'Teams recovering after redesigns, launches, or structural changes.',
    ],
    includes: [
      'Review of Yandex-facing demand, landing pages, and structural weak spots.',
      'Improvements to service pages, trust blocks, regional logic, and inquiry paths.',
      'Technical review of templates, indexation, canonical behavior, robots, and sitemaps.',
      'Prioritization of changes based on commercial impact and visibility growth.',
      'Support around implementation and the next search-growth layer.',
    ],
    steps: [
      { title: 'Review the demand and the SERP fit', text: 'We assess what page types win in Yandex and where the site loses ground now.' },
      { title: 'Rebuild the commercial layer', text: 'Service and regional pages are strengthened around trust, clarity, and the next step.' },
      { title: 'Clean up technical blockers', text: 'The site is checked for structural issues that limit indexation and control.' },
      { title: 'Extend the working structure', text: 'After the core pages improve, the site can expand into adjacent demand more safely.' },
    ],
    outcomes: [
      'A stronger commercial search layer for Yandex.',
      'More useful regional and service pages.',
      'A cleaner technical base and better site control.',
      'Search growth around demand that is closer to inquiry.',
    ],
    results: [
      { title: 'Better SERP fit', text: 'The site aligns more closely with what Yandex expects from commercial and regional pages.' },
      { title: 'Stronger local entry points', text: 'Relevant traffic lands on pages that better match city, service, and trust expectations.' },
      { title: 'Less reactive SEO work', text: 'The roadmap becomes easier to manage because the priorities are clearer.' },
    ],
    faq: [
      {
        question: 'When is a separate Yandex SEO layer worth it?',
        answer:
          'When Yandex already drives meaningful commercial demand, when regional structure matters, or when the project is underperforming on service-page quality and trust signals.',
      },
      {
        question: 'Is this only for local businesses?',
        answer:
          'No, but local and regional businesses benefit the most when geography and commercial page quality matter directly in search.',
      },
      {
        question: 'Does Yandex SEO replace broader SEO work?',
        answer:
          'Not necessarily. It is often a dedicated layer inside a broader roadmap when the project needs sharper work for Yandex specifically.',
      },
      {
        question: 'What matters more here: technical cleanup or page quality?',
        answer:
          'Usually both. If technical signals are broken they need fixing first, but commercial growth rarely happens without stronger landing pages.',
      },
    ],
    seoBlockTitle: 'Why Yandex SEO depends on stronger commercial pages, not only on technical cleanup',
    seoParagraphs: [
      'Yandex SEO often depends on how well the site handles service-page quality, regional relevance, trust signals, and a clean route to inquiry.',
      'That is why technical work alone is rarely enough: the commercial layer of the website usually needs to improve at the same time.',
    ],
    ctas: {
      soft: 'Discuss Yandex SEO',
      rational: 'Get a Yandex SEO starting plan',
      fast: 'Review Yandex growth opportunities now',
    },
    related: ['seo', 'local-seo', 'technical-seo', 'google-seo'],
    images: imageSet(
      'yandex-seo',
      'Yandex SEO concept for commercial and regional visibility',
      'Yandex SEO workflow for service pages and structure',
      'Yandex SEO results for stronger qualified demand'
    ),
  },
  {
    slug: 'young-site-seo',
    shortName: 'SEO for New Websites',
    label: 'New and young websites',
    h1: 'SEO for new and young websites that need a stronger structure from the very beginning',
    title: 'SEO for new and young websites built around the right launch base',
    description:
      'SEO for new and young websites: demand structure, indexation, key landing pages, and launch-stage optimization without creating future SEO debt.',
    intro:
      'This format is useful when the website is new, recently relaunched, or still young enough that the strongest next move is building the right base before scaling.',
    heroValue:
      'The work focuses on early-stage structure, key landing pages, technical cleanliness, and the first demand map so the site can grow without expensive rework later.',
    subheading:
      'It is a strong fit for new service websites, younger B2B projects, recent launches, and teams that want a cleaner search foundation from the start.',
    angle: 'A healthier SEO start',
    cardDescription:
      'SEO for new and young websites focused on launch structure, clean indexation, and the first landing-page layer.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Less expensive rework later', text: 'The initial structure is planned around growth instead of patched months after launch.' },
      { title: 'A better first demand map', text: 'Important topics and landing pages are defined before the site starts drifting into noise.' },
      { title: 'Cleaner indexation from the start', text: 'Young websites benefit when technical signals are kept simple and clean early on.' },
      { title: 'A clearer path to inquiry', text: 'The first page layer is built to support both search and the next user action.' },
    ],
    audience: [
      'New service websites that need a stronger SEO base from launch.',
      'Young B2B and expert projects where structure and trust matter early.',
      'Recently relaunched sites that want to avoid carrying old mistakes into a new phase.',
      'Teams that want a practical SEO start rather than chaotic launch-stage promotion.',
    ],
    includes: [
      'Review of launch structure, core topics, and early landing-page priorities.',
      'Technical checks around indexation, templates, robots, sitemaps, canonical behavior, and site cleanliness.',
      'Improvements to the first key service pages, offer clarity, trust blocks, and internal relationships.',
      'A realistic content and structure roadmap for the next expansion wave.',
      'Priority guidance so the young site grows from a stronger foundation.',
    ],
    steps: [
      { title: 'Define the first demand layer', text: 'We decide which pages need to exist first and where the site cannot afford weak coverage.' },
      { title: 'Check the launch state', text: 'The website is reviewed for indexation, template, and structural issues that are common early on.' },
      { title: 'Strengthen the first key pages', text: 'Core service pages and their message layer are rebuilt around search and inquiry logic.' },
      { title: 'Plan the next stage', text: 'The site gets a practical roadmap for safer expansion instead of improvised growth.' },
    ],
    outcomes: [
      'A stronger early-stage architecture for the project.',
      'Cleaner technical and indexation foundations from the start.',
      'Key landing pages that actually support demand and inquiry quality.',
      'A more realistic roadmap for the next SEO wave.',
    ],
    results: [
      { title: 'A stronger working base', text: 'The site starts growing from the right pages and structure instead of from guesswork.' },
      { title: 'Less risk at the launch stage', text: 'The project avoids many of the mistakes that make young websites expensive to fix later.' },
      { title: 'Easier scale later', text: 'Once the launch base is sound, future SEO and content layers are much easier to add.' },
    ],
    faq: [
      {
        question: 'When should SEO start for a new website?',
        answer:
          'Ideally before launch or immediately after. The earlier structure and technical signals are aligned, the less rework the project needs later.',
      },
      {
        question: 'Can a young website grow quickly?',
        answer:
          'Some early signals can appear quite fast, but the main goal is to build the right foundation rather than chase fragile short-term wins.',
      },
      {
        question: 'Do we need many pages right away?',
        answer:
          'Not always. The stronger move is usually launching the right pages first and expanding deliberately afterward.',
      },
      {
        question: 'Does this help after a relaunch or migration too?',
        answer:
          'Yes. Newly relaunched sites often face the same early-stage risks as brand-new projects and benefit from the same discipline.',
      },
    ],
    seoBlockTitle: 'Why young websites need structure first and scale second',
    seoParagraphs: [
      'New and young websites often lose momentum because they try to scale before the first landing pages, indexation signals, and demand structure are stable.',
      'A cleaner launch base makes future SEO and content work easier, cheaper, and more useful.',
    ],
    ctas: {
      soft: 'Discuss SEO for a new website',
      rational: 'Get a launch-stage SEO plan',
      fast: 'Review the site launch base now',
    },
    related: ['seo', 'seo-audit', 'technical-seo', 'website-development'],
    images: imageSet(
      'young-site-seo',
      'SEO concept for new and young websites',
      'Launch-stage SEO workflow for a new website',
      'SEO results for a young website with a stronger base'
    ),
  },
  {
    slug: 'corporate-site-seo',
    shortName: 'Corporate Website SEO',
    label: 'Corporate and commercial website growth',
    h1: 'Corporate website SEO for service, production, and complex commercial structures',
    title: 'Corporate website SEO built around structure, trust, and qualified demand',
    description:
      'Corporate website SEO for service and B2B projects that need stronger service architecture, expertise signals, trust pages, and qualified search demand.',
    intro:
      'This format is useful when the website has to explain several services or capabilities clearly and support a longer, more trust-sensitive buying process.',
    heroValue:
      'The work focuses on service architecture, expertise presentation, trust-building pages, and a stronger route from search visibility to a qualified conversation.',
    subheading:
      'It fits corporate service websites, B2B companies, production, integrators, and expert businesses where the site has to educate and qualify at the same time.',
    angle: 'Structure and trust for corporate search demand',
    cardDescription:
      'Corporate website SEO for stronger service architecture, trust pages, and search growth tied to qualified inquiries.',
    cardCta: 'Open service',
    benefits: [
      { title: 'Stronger service architecture', text: 'Services, solutions, industries, and supporting pages are organized around real demand instead of site-internal logic only.' },
      { title: 'A better trust layer', text: 'Cases, expertise signals, process clarity, and decision support are placed where the user actually needs them.' },
      { title: 'Better inquiry qualification', text: 'The site helps users understand fit, constraints, and the next step before they get in touch.' },
      { title: 'Safer growth at scale', text: 'New services, cases, and expert pages can be added without turning the structure into noise.' },
    ],
    audience: [
      'Corporate service websites with multiple service lines or complex offerings.',
      'B2B and production companies with longer sales cycles.',
      'Commercial websites that need stronger service pages and trust signals.',
      'Teams whose site has grown in scale but not in clarity or demand capture quality.',
    ],
    includes: [
      'Review of service architecture, solution pages, industry pages, and weak structural points.',
      'Improvements to key commercial pages, trust blocks, cases, expertise presentation, and the next-step path.',
      'Demand mapping across services, industries, and decision scenarios.',
      'Technical review so the architecture supports growth instead of blocking it.',
      'A plan for expanding the corporate SEO layer without diluting focus.',
    ],
    steps: [
      { title: 'Review the architecture', text: 'We define how services, solutions, and supporting pages should relate to real demand.' },
      { title: 'Strengthen the key commercial layer', text: 'Core pages are rebuilt around trust, clarity, and decision support.' },
      { title: 'Connect structure and growth', text: 'Content, internal links, and implementation priorities are aligned into one roadmap.' },
      { title: 'Scale more safely', text: 'The site gets a cleaner model for adding new search entry points without structural chaos.' },
    ],
    outcomes: [
      'A stronger service architecture for complex commercial demand.',
      'Better trust and expertise signals across key pages.',
      'More qualified inquiries from search.',
      'A clearer system for scaling new services and supporting assets.',
    ],
    results: [
      { title: 'Clearer capability presentation', text: 'Users understand the company, the offer, and the next step more quickly.' },
      { title: 'Stronger commercial pages', text: 'Traffic lands on pages that support a better decision rather than leaving users uncertain.' },
      { title: 'Less disconnect between SEO and sales', text: 'The site becomes more useful as both a search asset and a qualification tool.' },
    ],
    faq: [
      {
        question: 'How is this different from standard SEO?',
        answer:
          'The emphasis is stronger on service architecture, trust, qualification, and how the website supports a more complex buying journey.',
      },
      {
        question: 'Is this only for B2B companies?',
        answer:
          'No, but it is especially effective for B2B, production, expert services, and other businesses where trust and structure matter heavily.',
      },
      {
        question: 'Can one service cover both a corporate and a commercial website?',
        answer:
          'Often yes. In practice, both formats usually need the same thing: pages that turn complex demand into a confident next step.',
      },
      {
        question: 'What should improve first: service pages, case studies, or blog content?',
        answer:
          'Usually the service and decision pages come first, then cases and supporting content are added around them.',
      },
    ],
    seoBlockTitle: 'Why corporate SEO depends on structure, trust, and decision support',
    seoParagraphs: [
      'Corporate websites rarely grow through traffic volume alone. They grow when service architecture, expertise signals, trust pages, and page clarity support the search journey together.',
      'That is why this format works best when SEO is tied directly to how the company explains its offer and guides the user toward contact.',
    ],
    ctas: {
      soft: 'Discuss corporate website SEO',
      rational: 'Get a corporate SEO starting plan',
      fast: 'Review the corporate site now',
    },
    related: ['seo', 'b2b-seo', 'seo-content', 'seo-consulting'],
    images: imageSet(
      'corporate-site-seo',
      'Corporate website SEO concept for structure and trust',
      'Corporate SEO workflow from service architecture to page growth',
      'Corporate SEO results for stronger qualified demand'
    ),
  },
]

export const marketExpansionServiceStrategies = {
  'google-seo': {
    catalogTrigger: 'Подходит, когда Google уже важен как канал спроса или проекту нужна отдельная стратегия роста именно в этой системе.',
    diagnosticTitle: 'Когда проекту нужен отдельный SEO-контур под Google',
    diagnosticIntro:
      'Отдельное продвижение в Google полезно там, где сайт уже зависит от этой выдачи или заметно проигрывает по качеству страниц и тематическому покрытию.',
    diagnostics: [
      {
        signal: 'Google уже дает показы и переходы, но ключевые страницы растут слишком медленно.',
        cause: 'Сайт недобирает по качеству посадочных, тематическим связкам и ясности интента на важных URL.',
        fit: 'Google SEO помогает усилить именно те страницы и кластеры, которые важны для роста в этой системе.',
      },
      {
        signal: 'На сайте есть контент, но он не собирается в сильные тематические хабы.',
        cause: 'Материалы существуют отдельно друг от друга и не работают как единая карта спроса.',
        fit: 'Услуга связывает страницы услуг, статьи и внутренние ссылки в более сильную систему.',
      },
      {
        signal: 'Технически сайт живой, но видимость в Google все равно фрагментарная.',
        cause: 'Проблема лежит не только в технике, а в связке спроса, структуры и качества самих страниц.',
        fit: 'Отдельный контур под Google позволяет работать именно с этой комбинацией ограничений.',
      },
    ],
    misfitTitle: 'Когда отдельный Google-контур брать рано',
    misfitIntro:
      'Есть ситуации, где сначала важнее не специальная стратегия под Google, а диагностика или ремонт базовой архитектуры сайта.',
    misfits: [
      {
        title: 'Неясно, где именно главный блокер роста.',
        text: 'Если еще не понятно, что сильнее режет проект: структура, индексация, контент или коммерческие страницы, логичнее начать с аудита.',
      },
      {
        title: 'Сайт ломается на уровне шаблонов и индексации.',
        text: 'Когда техническая база нестабильна, отдельное продвижение в Google не даст сильного эффекта без initial cleanup.',
      },
      {
        title: 'Бизнесу пока важнее общий SEO-контур, а не отдельная система.',
        text: 'Если проект только выстраивает базу, бывает полезнее сначала взять комплексное SEO, а не делить усилия по системам.',
      },
    ],
    frictionTitle: 'Что чаще всего тормозит рост в Google',
    frictionIntro:
      'Проблема обычно не в одном факторе, а в слабой связке между спросом, страницами, контентом и техническим слоем сайта.',
    frictions: [
      {
        title: 'Слабые посадочные под нужный интент',
        text: 'Страницы не до конца отвечают на вопрос пользователя и проигрывают по качеству ближайшим конкурентам.',
      },
      {
        title: 'Контент без тематической системы',
        text: 'Даже хороший материал работает хуже, если он не поддерживает важные сервисные страницы и не встроен в архитектуру.',
      },
      {
        title: 'Хаотичное внедрение',
        text: 'Когда команда не понимает очередность задач, поисковое продвижение начинает распадаться на разрозненные действия.',
      },
    ],
    decisionTitle: 'Что выбрать рядом с Google SEO',
    decisionIntro: 'Иногда самый полезный следующий шаг лежит в соседнем формате. Ниже короткая развилка.',
    decisions: [
      {
        slug: 'seo',
        reason: 'Берите, если проекту нужен не отдельный Google-контур, а системный рост сразу по всей органике и сервисным страницам.',
      },
      {
        slug: 'technical-seo',
        reason: 'Подходит, если основной блокер лежит в шаблонах, индексации и технической архитектуре, а не в самой карте спроса.',
      },
      {
        slug: 'seo-content',
        reason: 'Нужен, если страница уже индексируется, но проигрывает по качеству подачи, структуре ответа и контентному покрытию.',
      },
    ],
    faqLead:
      'Перед стартом обычно хотят понять, когда имеет смысл выделять Google в отдельный контур, что сильнее всего влияет на рост и насколько здесь важны контент и техбаза.',
  },
  'yandex-seo': {
    catalogTrigger: 'Подходит, когда проект зависит от Яндекса по коммерческим или региональным запросам и сайту нужен более точный сервисный слой.',
    diagnosticTitle: 'Когда бизнесу нужен отдельный SEO-контур под Яндекс',
    diagnosticIntro:
      'Эта услуга полезна там, где Яндекс остается важным источником спроса, а сайт недобирает по коммерческим, региональным или доверительным факторам.',
    diagnostics: [
      {
        signal: 'Сайт получает показы в Яндексе, но коммерческие страницы не дожимают до обращения.',
        cause: 'Проблема часто лежит в слабом оффере, доверии, структуре страницы и размытом следующем шаге.',
        fit: 'Yandex SEO помогает усилить сервисные и региональные страницы именно под коммерческий сценарий выбора.',
      },
      {
        signal: 'Региональный спрос есть, но структура сайта не поддерживает его качественно.',
        cause: 'Один общий URL или шаблонный геоспам не закрывают разные сценарии выбора по городам и услугам.',
        fit: 'Услуга помогает собрать рабочую региональную архитектуру без лишнего шума.',
      },
      {
        signal: 'После обновлений сайт стал хуже управляться в Яндексе.',
        cause: 'Техническая база, шаблоны и логика коммерческих страниц перестали работать как единая система.',
        fit: 'Отдельный контур под Яндекс помогает вернуть контроль над видимостью и приоритетами роста.',
      },
    ],
    misfitTitle: 'Когда отдельное продвижение в Яндексе брать не первым',
    misfitIntro:
      'Иногда сначала нужно прояснить корень проблемы или починить базовую архитектуру сайта, а не сразу брать отдельный контур под Яндекс.',
    misfits: [
      {
        title: 'Корневая проблема еще не локализована.',
        text: 'Если неясно, режет ли рост техника, структура, спрос или сам оффер, лучше сначала сделать аудит.',
      },
      {
        title: 'Сайт технически нестабилен.',
        text: 'Когда шаблоны, индексация и служебные URL конфликтуют, сперва полезнее technical SEO.',
      },
      {
        title: 'Проекту сейчас важнее общий рост органики.',
        text: 'Если Яндекс не требует отдельной стратегии как канал, логичнее сначала взять системное SEO-продвижение.',
      },
    ],
    frictionTitle: 'Что чаще всего мешает росту в Яндексе',
    frictionIntro:
      'В Яндексе сайт часто проигрывает не числом ключей, а качеством коммерческих страниц, региональной логикой и слабой управляемостью структуры.',
    frictions: [
      {
        title: 'Пустые коммерческие блоки',
        text: 'Страница ранжируется хуже, когда не объясняет, как работает компания, сколько это стоит и почему ей можно доверять.',
      },
      {
        title: 'Размытая региональная структура',
        text: 'Если геозапросы не поддержаны реальными страницами и сигналами, проект недобирает даже при хорошем спросе.',
      },
      {
        title: 'Реактивное внедрение',
        text: 'Когда команда реагирует на просадки точечно, вместо приоритетной работы, рост остается нестабильным.',
      },
    ],
    decisionTitle: 'Что выбрать рядом с Yandex SEO',
    decisionIntro: 'Ниже короткая развилка, если не до конца ясно, этот ли формат нужен проекту первым.',
    decisions: [
      {
        slug: 'seo',
        reason: 'Берите, если нужен единый SEO-контур для роста всей органики, а не только отдельная стратегия под Яндекс.',
      },
      {
        slug: 'local-seo',
        reason: 'Подходит, если основная задача упирается именно в локальную и филиальную упаковку бизнеса.',
      },
      {
        slug: 'technical-seo',
        reason: 'Нужен, когда проблема лежит в индексации, шаблонах и архитектуре, а не в коммерческой логике страниц.',
      },
    ],
    faqLead:
      'До старта обычно уточняют, когда Яндекс стоит выделять отдельно, что важнее для роста: коммерческие страницы или техбаза, и как работать с регионом без шаблонного спама.',
  },
  'young-site-seo': {
    catalogTrigger: 'Подходит, когда сайт новый или недавно перезапущен и важно с самого старта собрать сильную SEO-базу.',
    diagnosticTitle: 'Когда новому или молодому сайту нужен отдельный SEO-старт',
    diagnosticIntro:
      'Эта услуга особенно полезна, если проект только выходит в поиск и важно не повторить типичные стартовые ошибки со структурой, индексацией и посадочными.',
    diagnostics: [
      {
        signal: 'Сайт только запустился, но структура уже выглядит слишком общей.',
        cause: 'Спрос пока не разложен по рабочим страницам, из-за чего проект быстро теряет ясность и будущие точки роста.',
        fit: 'Формат помогает собрать стартовую архитектуру сразу под реальные сценарии выбора.',
      },
      {
        signal: 'Есть риск накопить технический шум еще на старте.',
        cause: 'Новые проекты часто запускаются с лишними URL, слабыми шаблонами и неочевидной индексацией.',
        fit: 'SEO для молодого сайта помогает вычистить базу до того, как проблемы разрастутся.',
      },
      {
        signal: 'Команда не понимает, какие страницы и темы делать первыми.',
        cause: 'Без стартовой карты спроса запуск быстро превращается в хаотичную раскрутку без понятного результата.',
        fit: 'Услуга дает приоритеты по первым посадочным, контенту и развитию структуры.',
      },
    ],
    misfitTitle: 'Когда отдельный SEO-старт молодому сайту не нужен',
    misfitIntro:
      'Иногда проекту сперва полезнее решить платформенную или продуктовую проблему, а не собирать SEO-контур.',
    misfits: [
      {
        title: 'Сайт еще не определился с продуктом или структурой услуг.',
        text: 'Если оффер и разделы постоянно меняются, SEO-архитектура быстро устаревает и требует повторной пересборки.',
      },
      {
        title: 'Проблема лежит в самой платформе.',
        text: 'Когда сайт технически сырой и требует полноценной пересборки, логичнее сначала обсуждать разработку.',
      },
      {
        title: 'Бизнесу пока нужен не рост из поиска, а проверка продукта другими каналами.',
        text: 'Если спрос еще тестируется и сайт не готов к роли основного канала, отдельный SEO-слой может быть преждевременным.',
      },
    ],
    frictionTitle: 'Что чаще всего ломает старт нового сайта',
    frictionIntro:
      'Новый проект редко проигрывает только из-за возраста домена. Гораздо чаще его тормозят ранние структурные и технические ошибки.',
    frictions: [
      {
        title: 'Слишком общая структура',
        text: 'Один универсальный раздел не закрывает разные намерения и мешает сайту нарастить сильные входы в спрос.',
      },
      {
        title: 'Пустые стартовые посадочные',
        text: 'Если первые страницы не объясняют оффер, доверие и следующий шаг, трафик не превращается в полезное действие.',
      },
      {
        title: 'Отсутствие стартовых приоритетов',
        text: 'Когда команда не понимает, что делать сначала, раскрутка молодого сайта быстро становится дорогой и хаотичной.',
      },
    ],
    decisionTitle: 'Что выбрать рядом с SEO для нового сайта',
    decisionIntro: 'Иногда соседний формат дает проекту больший эффект на старте. Ниже короткая развилка.',
    decisions: [
      {
        slug: 'website-development',
        reason: 'Подходит, если сайт еще слишком сырой на уровне платформы, шаблонов и общей архитектуры.',
      },
      {
        slug: 'seo-audit',
        reason: 'Берите, если сайт уже запущен, но неясно, где именно он теряет рост: в структуре, технике или качестве страниц.',
      },
      {
        slug: 'seo',
        reason: 'Нужен, если базовая стартовая архитектура уже собрана и проекту пора переходить к системному ежемесячному росту.',
      },
    ],
    faqLead:
      'Перед стартом чаще всего спрашивают, когда начинать SEO для нового сайта, сколько страниц нужно запускать сразу и что важнее на первом этапе: структура, техбаза или контент.',
  },
  'corporate-site-seo': {
    catalogTrigger: 'Подходит, когда у компании сложная структура услуг, высокий порог доверия и длинный путь к обращению.',
    diagnosticTitle: 'Когда корпоративному сайту нужен отдельный SEO-контур',
    diagnosticIntro:
      'Отдельное SEO для корпоративного сайта полезно там, где проект уже вырос по масштабу, но сервисные страницы и trust layer не успевают за сложностью спроса.',
    diagnostics: [
      {
        signal: 'На сайте много услуг и направлений, но органика концентрируется только в нескольких разделах.',
        cause: 'Архитектура не раскладывает спрос по понятным сервисным и отраслевым страницам.',
        fit: 'Формат помогает собрать корпоративную структуру под реальные сценарии выбора клиента.',
      },
      {
        signal: 'Трафик есть, но заявки слабее, чем могли бы быть.',
        cause: 'Коммерческие страницы плохо объясняют компетенции, процесс, ограничения и следующий шаг.',
        fit: 'SEO корпоративного сайта усиливает не только видимость, но и trust layer ключевых разделов.',
      },
      {
        signal: 'Команда добавляет новые страницы, а сайт становится все менее управляемым.',
        cause: 'Новые услуги, отрасли и кейсы растут без единой логики и начинают конкурировать между собой.',
        fit: 'Услуга помогает масштабировать структуру без архитектурного хаоса.',
      },
    ],
    misfitTitle: 'Когда отдельный контур для корпоративного сайта брать рано',
    misfitIntro:
      'Если проблема лежит не в сервисной архитектуре и доверии, а в базовой платформе или в полном отсутствии диагноза, сначала полезнее другой шаг.',
    misfits: [
      {
        title: 'Неясно, где именно сайт теряет рост.',
        text: 'Если пока непонятно, корень проблемы в технике, структуре или коммерческих страницах, лучше стартовать с аудита.',
      },
      {
        title: 'Платформа мешает любым доработкам.',
        text: 'Когда даже базовые изменения ломают сайт, разработка или пересборка дадут больший эффект, чем отдельное SEO-направление.',
      },
      {
        title: 'Проекту важнее не структура, а экспертный контент вокруг уже сильных страниц.',
        text: 'В таком случае логичнее сначала усилить content layer или консультационный контур, а не весь корпоративный сайт сразу.',
      },
    ],
    frictionTitle: 'Что чаще всего тормозит корпоративные сайты в SEO',
    frictionIntro:
      'Проблема обычно не в отсутствии ключей, а в слабой архитектуре услуг, разрыве между SEO и продажей и недостатке доверительных слоев на страницах.',
    frictions: [
      {
        title: 'Слабая структура услуг и решений',
        text: 'Когда несколько направлений свалены в общий раздел, сайт недобирает и по видимости, и по качеству обращения.',
      },
      {
        title: 'Недостаток trust layer',
        text: 'Без кейсов, процесса, экспертизы и понятного next step корпоративная страница выглядит слишком общей.',
      },
      {
        title: 'Несвязанное масштабирование',
        text: 'Новые страницы добавляются без общей модели, из-за чего растет шум и падает управляемость всей структуры.',
      },
    ],
    decisionTitle: 'Что выбрать рядом с SEO корпоративного сайта',
    decisionIntro: 'Ниже короткая развилка, если проект стоит между соседними форматами работы.',
    decisions: [
      {
        slug: 'b2b-seo',
        reason: 'Подходит, если главный акцент не в корпоративной архитектуре как таковой, а в квалификации спроса и длинном B2B-цикле сделки.',
      },
      {
        slug: 'seo-content',
        reason: 'Нужен, если базовая структура уже есть, а главная слабость лежит в качестве страниц и экспертной подаче.',
      },
      {
        slug: 'seo',
        reason: 'Берите, если проекту нужен более широкий системный рост органики, а не только усиление корпоративного слоя.',
      },
    ],
    faqLead:
      'До старта обычно хотят понять, чем такой формат отличается от обычного SEO, когда усиливать доверие и кейсы и как не превратить корпоративный сайт в перегруженный каталог без внятной логики.',
  },
}

export const marketExpansionPricing = [
  {
    slug: 'google-seo',
    name: 'SEO в Google',
    shortDescription: 'Продвижение сайта в Google с фокусом на спрос, качество страниц и рост видимости по приоритетным кластерам.',
    priceFrom: 45000,
    unit: 'month' as const,
    priceLabel: 'от 45 000 ₽ / мес',
    calculatorHint: 'Подходит, когда Google уже важен как канал роста или проекту нужна отдельная стратегия именно под эту систему.',
    deliverables: ['Кластеры спроса под Google', 'Усиление ключевых посадочных', 'План роста видимости и внедрения'],
  },
  {
    slug: 'yandex-seo',
    name: 'SEO в Яндексе',
    shortDescription: 'Продвижение сайта в Яндексе под коммерческие, региональные и доверительные сигналы важных страниц.',
    priceFrom: 45000,
    unit: 'month' as const,
    priceLabel: 'от 45 000 ₽ / мес',
    calculatorHint: 'Полезно проектам, где Яндекс остается сильным каналом по коммерческим и геозависимым запросам.',
    deliverables: ['Коммерческие и региональные страницы', 'План доработки trust layer', 'Приоритеты роста в Яндексе'],
  },
  {
    slug: 'young-site-seo',
    name: 'SEO нового сайта',
    shortDescription: 'Стартовая оптимизация нового или молодого сайта: структура, индексация, ключевые страницы и карта спроса.',
    priceFrom: 35000,
    unit: 'month' as const,
    priceLabel: 'от 35 000 ₽ / мес',
    calculatorHint: 'Подходит новым и молодым сайтам, которым важен сильный SEO-старт без накопления ошибок.',
    deliverables: ['Стартовая структура спроса', 'Проверка индексации и шаблонов', 'План запуска и расширения'],
  },
  {
    slug: 'corporate-site-seo',
    name: 'SEO корпоративного сайта',
    shortDescription: 'Продвижение корпоративного и коммерческого сайта через архитектуру услуг, trust layer и квалифицированный спрос.',
    priceFrom: 55000,
    unit: 'month' as const,
    priceLabel: 'от 55 000 ₽ / мес',
    calculatorHint: 'Актуально для корпоративных, B2B и экспертных сайтов со сложной структурой услуг и длинным циклом сделки.',
    deliverables: ['Архитектура услуг и решений', 'Усиление ключевых коммерческих страниц', 'План роста корпоративного SEO-контура'],
  },
]

export const seoIntentLinksRu = [
  {
    href: '/services/google-seo',
    title: 'Продвижение сайта в Google',
    description:
      'Подходит, когда нужно отдельно усилить поисковое продвижение в Google: кластеры спроса, качество посадочных и контентную связку.',
  },
  {
    href: '/services/yandex-seo',
    title: 'Продвижение сайта в Яндексе',
    description:
      'Нужен отдельный контур под Яндекс, если важны коммерческие и региональные запросы, доверие к сайту и сильные сервисные страницы.',
  },
  {
    href: '/services/young-site-seo',
    title: 'Продвижение нового сайта',
    description:
      'Для нового и молодого сайта, когда главная задача не хаотичная раскрутка, а правильная структура, индексация и первые посадочные.',
  },
  {
    href: '/services/corporate-site-seo',
    title: 'SEO корпоративного сайта',
    description:
      'Для корпоративных и коммерческих сайтов, где нужно усилить структуру услуг, страницы решений, доверие и квалификацию заявки.',
  },
]

export const seoIntentLinksEn = [
  {
    href: '/services/google-seo',
    title: 'Google SEO',
    description: 'A dedicated Google search-growth layer for demand clusters, landing pages, and better page quality.',
  },
  {
    href: '/services/yandex-seo',
    title: 'Yandex SEO',
    description: 'A dedicated Yandex layer for commercial pages, regional demand, and trust-sensitive search scenarios.',
  },
  {
    href: '/services/young-site-seo',
    title: 'SEO for New Websites',
    description: 'A healthier launch-stage SEO format for new and young projects that need the right base first.',
  },
  {
    href: '/services/corporate-site-seo',
    title: 'Corporate Website SEO',
    description: 'A structure-and-trust SEO format for service, B2B, and more complex commercial websites.',
  },
]
