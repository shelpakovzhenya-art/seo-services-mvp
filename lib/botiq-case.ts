import { serializeCaseGallery } from '@/lib/case-gallery'

const LEGACY_BOTIQ_TITLE = 'SEO-аудит Botiq: как партнёрский SaaS-проект получил понятную карту роста'
const LEGACY_BOTIQ_DESCRIPTION =
  'Партнёрский кейс Botiq: провели SEO-аудит сайта, собрали приоритеты, конкурентные разрывы и roadmap внедрения по структуре, сниппетам, контенту и конверсии.'
const LEGACY_BOTIQ_CONTENT_MARKER = 'Это кейс не про косметические правки и не про красивые обещания.'
const LEGACY_BOTIQ_GALLERY_MARKER = 'Краткий вывод, сильные стороны и приоритеты, с которых логично начинать внедрение.'

const galleryItems = [
  {
    src: '/cases/botiq/audit-summary.png',
    caption: 'Первая страница отчёта: короткий вывод и приоритеты, чтобы команде было понятно, с чего начинать.',
  },
  {
    src: '/cases/botiq/audit-architecture.png',
    caption: 'Технический блок: каноникализация, типы страниц, архитектура сайта и внутренняя перелинковка.',
  },
  {
    src: '/cases/botiq/audit-structured-data.png',
    caption: 'Раздел по микроразметке, коммерческим страницам, контактам и точкам входа в заявку.',
  },
  {
    src: '/cases/botiq/audit-competitor-gap.png',
    caption: 'Сравнение с конкурентами: где сайт уже выглядит нормально, а где есть разрыв по шаблонам и смыслу страниц.',
  },
  {
    src: '/cases/botiq/audit-roadmap.png',
    caption: 'Финальная часть: дорожная карта внедрения и задачи на ближайшие 60 дней.',
  },
]

export const botiqCase = {
  slug: 'botiq-seo-audit',
  url: '/cases/botiq-seo-audit',
  title: 'SEO-аудит сайта Botiq: рабочая карта доработок для партнёрского проекта',
  description:
    'Для Botiq подготовили SEO-аудит сайта: разобрали техническую базу, шаблоны страниц, микроразметку, коммерческие блоки и приоритеты внедрения на ближайшие 60 дней.',
  image: '/cases/botiq/audit-cover.png',
  order: 2,
  publishedAt: '2026-03-23T10:28:00.000Z',
  updatedAt: '2026-03-23T14:12:00.000Z',
  about: ['SEO-аудит', 'Technical SEO', 'Контентная стратегия', 'SaaS / AI product'],
  resultImages: serializeCaseGallery(galleryItems),
  content: `
<p><a href="https://www.botiq.tech/" target="_blank" rel="noopener noreferrer">Botiq</a> — партнёрский SaaS-проект. Для команды подготовили SEO-аудит не как формальный отчёт, а как рабочий документ: по нему можно ставить задачи в разработку, контент и SEO, не теряясь в разрозненных замечаниях.</p>

<p>На старте была нужна не красивая презентация, а ответ на три вопроса: где сайт уже собран нормально, какие шаблоны тормозят рост и что логично брать в работу первым без распыления команды.</p>

<h2>Что вошло в разбор</h2>
<ul>
  <li>Проверка обхода и индексации: robots.txt, sitemap, canonical и чистота технических сигналов.</li>
  <li>Разбор архитектуры сайта, внутренних ссылок и качества ключевых шаблонов.</li>
  <li>Аудит title, description, H1, контентного каркаса, изображений и микроразметки.</li>
  <li>Отдельный блок по коммерческим страницам, контактам, формам и точкам входа в заявку.</li>
  <li>Сравнение с прямыми конкурентами и перевод разрывов в конкретные задачи для внедрения.</li>
  <li>Быстрые исправления, среднесрочные улучшения и план работ по этапам.</li>
</ul>

<h2>Что показал аудит на старте</h2>
<p>Аудит от 23 марта 2026 года показал, что у проекта уже есть рабочая основа, но SEO-слой и коммерческие сценарии собраны неравномерно. Для SaaS-сайтов это типичная ситуация: продукт развивается, но часть важных шаблонов и сигналов не успевает за ним.</p>

<ul>
  <li>Индекс SEO-готовности проекта на момент аудита составил 52 из 100.</li>
  <li>В sitemap уже было 9 URL, но покрытие canonical по ключевой выборке оставалось на уровне 0%.</li>
  <li>Покрытие микроразметкой тоже было 0%: 11 проверенных страниц оказались без schema.</li>
  <li>У части страниц были проблемы с title, description, H1 и технической подачей изображений.</li>
  <li>Контакты и страницы заявок присутствовали, но выглядели слабо и для SEO, и для конверсии.</li>
</ul>

<h2>Какие задачи ушли в приоритет</h2>
<ol>
  <li>Сделать контакты и страницы заявок полноценными посадочными, а не служебными URL.</li>
  <li>Пересобрать шаблоны title, description, H1 и canonical по основным типам страниц.</li>
  <li>Добавить валидную микроразметку туда, где она действительно помогает понять сущность страницы.</li>
  <li>Усилить коммерческие страницы полезным слоем: FAQ, условия, доказательства, сценарии выбора.</li>
  <li>Собрать более заметные формы и точки входа в заявку там, где пользователь уже близок к решению.</li>
  <li>Использовать конкурентный разрыв как источник конкретных задач, а не как витрину для сравнения.</li>
</ol>

<h2>Что команда получила на выходе</h2>
<p>На выходе Botiq получил не длинный список замечаний, а карту доработок. В документе отдельно разложены быстрые исправления, шаблонные задачи и вещи, которые разумно внедрять поэтапно, не создавая хаос в продуктовой команде.</p>

<p>Это важно именно для SaaS-проекта: ценность аудита здесь не в объёме замечаний, а в том, что по нему можно принять решение, что делать сейчас, а что отложить на следующий цикл.</p>

<h2>Как устроен сам документ</h2>
<p>В отчёте сначала идёт краткий вывод с приоритетами, затем технический слой, после него — шаблоны страниц, микроразметка, коммерческие зоны, сравнение с конкурентами и план внедрения на 60 дней. Ниже можно открыть несколько экранов и посмотреть структуру документа ближе.</p>

<h2>Почему этот кейс полезен</h2>
<p>Это не история про "волшебный рост после аудита". Это пример того, как SEO-аудит помогает собрать управляемый план действий для продукта со сложными шаблонами, контентом и несколькими сценариями конверсии.</p>

<p>Если вам нужен похожий разбор для сайта, где уже накопились шаблоны, технические компромиссы и неочевидные разрывы между SEO и заявкой, посмотрите, как устроена услуга <a href="/services/seo-audit">SEO-аудита сайта</a>. А сам сайт партнёра можно открыть здесь: <a href="https://www.botiq.tech/" target="_blank" rel="noopener noreferrer">www.botiq.tech</a>.</p>
`,
}

export function getBuiltInCaseBySlug(slug: string) {
  return slug === botiqCase.slug ? botiqCase : null
}

type BotiqCaseRecord = {
  slug?: string | null
  title?: string | null
  description?: string | null
  content?: string | null
  image?: string | null
  resultImages?: string | null
  order?: number | null
}

export function hydrateBotiqCaseRecord<T extends BotiqCaseRecord>(caseItem: T): T {
  if (caseItem.slug !== botiqCase.slug) {
    return caseItem
  }

  const title = caseItem.title?.trim()
  const description = caseItem.description?.trim()
  const content = caseItem.content?.trim()
  const resultImages = caseItem.resultImages?.trim()

  return {
    ...caseItem,
    title: !title || title === LEGACY_BOTIQ_TITLE ? botiqCase.title : caseItem.title,
    description: !description || description === LEGACY_BOTIQ_DESCRIPTION ? botiqCase.description : caseItem.description,
    content: !content || content.includes(LEGACY_BOTIQ_CONTENT_MARKER) ? botiqCase.content : caseItem.content,
    image: caseItem.image || botiqCase.image,
    resultImages:
      !resultImages || resultImages.includes(LEGACY_BOTIQ_GALLERY_MARKER) ? botiqCase.resultImages : caseItem.resultImages,
    order: typeof caseItem.order === 'number' ? caseItem.order : botiqCase.order,
  }
}
