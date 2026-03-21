export type SeoToolCategory = 'URL' | 'Аналитика' | 'Мета' | 'Технический SEO'

export type SeoToolSlug =
  | 'slug-generator'
  | 'utm-builder'
  | 'meta-counter'
  | 'robots-generator'
  | 'og-generator'

export type SeoToolDefinition = {
  slug: SeoToolSlug
  category: SeoToolCategory
  title: string
  description: string
  summary: string
  intro: string
  highlights: string[]
  icon: 'link' | 'tag' | 'type' | 'file' | 'share'
}

export const seoTools: SeoToolDefinition[] = [
  {
    slug: 'slug-generator',
    category: 'URL',
    title: 'Генератор ЧПУ-ссылок',
    description:
      'Транслитерация русского текста в URL-friendly slug с очисткой пробелов, спецсимволов и быстрым копированием результата.',
    summary: 'Быстро превращает заголовок страницы или статьи в аккуратный slug для адреса.',
    intro:
      'Подходит для страниц услуг, кейсов, статей и посадочных, где важно получить короткий и читаемый URL без ручной чистки.',
    highlights: [
      'Транслитерация кириллицы в латиницу.',
      'Замена пробелов и мусорных символов на дефисы.',
      'Мгновенное копирование готового slug.',
    ],
    icon: 'link',
  },
  {
    slug: 'utm-builder',
    category: 'Аналитика',
    title: 'Генератор UTM-меток',
    description:
      'Собирает корректные UTM-параметры для рекламных кампаний, постов, рассылок и партнерских размещений.',
    summary: 'Помогает быстро собрать чистую ссылку для отслеживания трафика в аналитике.',
    intro:
      'Удобен, когда нужно быстро подготовить ссылку под рекламу, Telegram, email-рассылку или интеграцию и не ошибиться в параметрах.',
    highlights: [
      'Поддержка utm_source, utm_medium, utm_campaign, utm_content и utm_term.',
      'Автоматическая очистка лишних пробелов.',
      'Сразу показывает итоговый URL и строку параметров.',
    ],
    icon: 'tag',
  },
  {
    slug: 'meta-counter',
    category: 'Мета',
    title: 'Счётчик символов для meta-тегов',
    description:
      'Показывает длину title и description, подсвечивает перегруз и помогает собрать более аккуратный сниппет.',
    summary: 'Проверяет длину meta-тегов до публикации и показывает, где текст уже начинает быть рискованным.',
    intro:
      'Полезен перед выкладкой новых страниц и статей, когда нужно быстро проверить title и description без отдельного SEO-софта.',
    highlights: [
      'Подсветка безопасной, пограничной и длинной длины.',
      'Предпросмотр сниппета для поисковой выдачи.',
      'Отдельный контроль title и description.',
    ],
    icon: 'type',
  },
  {
    slug: 'robots-generator',
    category: 'Технический SEO',
    title: 'Генератор robots.txt',
    description:
      'Собирает robots.txt с основными директивами, sitemap и правилами для нескольких User-agent без ручного синтаксиса.',
    summary: 'Помогает быстро собрать черновик robots.txt под сайт и экспортировать готовый текст.',
    intro:
      'Подходит для быстрого старта или перепроверки robots.txt, когда нужно собрать базовые правила индексации в понятном конструкторе.',
    highlights: [
      'Несколько User-agent в одном файле.',
      'Директивы Allow, Disallow, Sitemap и Host.',
      'Готовый текст можно сразу вставить на сайт.',
    ],
    icon: 'file',
  },
  {
    slug: 'og-generator',
    category: 'Мета',
    title: 'Генератор Open Graph мета-тегов',
    description:
      'Собирает OG-теги для красивого превью при шаринге страниц в соцсетях и мессенджерах.',
    summary: 'Генерирует Open Graph-разметку и показывает, как карточка страницы будет выглядеть в превью.',
    intro:
      'Нужен для лендингов, статей, кейсов и коммерческих страниц, которые важно красиво показывать в Telegram, WhatsApp и соцсетях.',
    highlights: [
      'Поддержка title, description, image, url, type и site_name.',
      'Чистый HTML-код для вставки в head.',
      'Живой визуальный превью-блок.',
    ],
    icon: 'share',
  },
]

export function getSeoToolBySlug(slug: string) {
  return seoTools.find((tool) => tool.slug === slug)
}
