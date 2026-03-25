import type { Locale } from '@/lib/i18n'

export type SeoToolCategory = 'URL' | 'Analytics' | 'Meta' | 'Technical SEO'

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

const seoToolsByLocale: Record<Locale, SeoToolDefinition[]> = {
  ru: [
    {
      slug: 'slug-generator',
      category: 'URL',
      title: 'Генератор ЧПУ-ссылок',
      description: 'Транслитерация русского текста в URL-friendly slug с очисткой пробелов, спецсимволов и быстрым копированием результата.',
      summary: 'Быстро превращает заголовок страницы или статьи в аккуратный slug для адреса.',
      intro: 'Подходит для страниц услуг, кейсов, статей и посадочных, где важно получить короткий и читаемый URL без ручной чистки.',
      highlights: ['Транслитерация кириллицы в латиницу.', 'Замена пробелов и мусорных символов на дефисы.', 'Мгновенное копирование готового slug.'],
      icon: 'link',
    },
    {
      slug: 'utm-builder',
      category: 'Analytics',
      title: 'Генератор UTM-меток',
      description: 'Собирает корректные UTM-параметры для рекламных кампаний, постов, рассылок и партнерских размещений.',
      summary: 'Помогает быстро собрать чистую ссылку для отслеживания трафика в аналитике.',
      intro: 'Удобен, когда нужно быстро подготовить ссылку под рекламу, Telegram, email-рассылку или интеграцию и не ошибиться в параметрах.',
      highlights: ['Поддержка utm_source, utm_medium, utm_campaign, utm_content и utm_term.', 'Автоматическая очистка лишних пробелов.', 'Сразу показывает итоговый URL и строку параметров.'],
      icon: 'tag',
    },
    {
      slug: 'meta-counter',
      category: 'Meta',
      title: 'Счетчик символов для meta-тегов',
      description: 'Показывает длину title и description, подсвечивает перегруз и помогает собрать более аккуратный сниппет.',
      summary: 'Проверяет длину meta-тегов до публикации и показывает, где текст уже начинает быть рискованным.',
      intro: 'Полезен перед выкладкой новых страниц и статей, когда нужно быстро проверить title и description без отдельного SEO-софта.',
      highlights: ['Подсветка безопасной, пограничной и длинной длины.', 'Предпросмотр сниппета для поисковой выдачи.', 'Отдельный контроль title и description.'],
      icon: 'type',
    },
    {
      slug: 'robots-generator',
      category: 'Technical SEO',
      title: 'Генератор robots.txt',
      description: 'Собирает robots.txt с основными директивами, sitemap и правилами для нескольких User-agent без ручного синтаксиса.',
      summary: 'Помогает быстро собрать черновик robots.txt под сайт и экспортировать готовый текст.',
      intro: 'Подходит для быстрого старта или перепроверки robots.txt, когда нужно собрать базовые правила индексации в понятном конструкторе.',
      highlights: ['Несколько User-agent в одном файле.', 'Директивы Allow, Disallow, Sitemap и Host.', 'Готовый текст можно сразу вставить на сайт.'],
      icon: 'file',
    },
    {
      slug: 'og-generator',
      category: 'Meta',
      title: 'Генератор Open Graph мета-тегов',
      description: 'Собирает OG-теги для красивого превью при шаринге страниц в соцсетях и мессенджерах.',
      summary: 'Генерирует Open Graph-разметку и показывает, как карточка страницы будет выглядеть в превью.',
      intro: 'Нужен для лендингов, статей, кейсов и коммерческих страниц, которые важно красиво показывать в Telegram, WhatsApp и соцсетях.',
      highlights: ['Поддержка title, description, image, url, type и site_name.', 'Чистый HTML-код для вставки в head.', 'Живой визуальный превью-блок.'],
      icon: 'share',
    },
  ],
  en: [
    {
      slug: 'slug-generator',
      category: 'URL',
      title: 'Slug generator',
      description: 'Turns a page or article title into a clean URL-friendly slug with transliteration, cleanup, and one-click copy.',
      summary: 'Quickly converts a heading into a readable slug for the final URL.',
      intro: 'Useful for service pages, case studies, articles, and landing pages where the URL has to stay short and clean.',
      highlights: ['Transliterates Cyrillic into Latin characters.', 'Replaces spaces and noisy symbols with a clean separator.', 'Lets you copy the finished slug instantly.'],
      icon: 'link',
    },
    {
      slug: 'utm-builder',
      category: 'Analytics',
      title: 'UTM builder',
      description: 'Builds clean UTM parameters for campaigns, posts, email sends, and partner placements.',
      summary: 'Helps you assemble a tracking-ready URL for analytics without manual query-string work.',
      intro: 'Useful when you need a link for ads, Telegram, email, or partner traffic and want the parameters to stay clean and consistent.',
      highlights: ['Supports utm_source, utm_medium, utm_campaign, utm_content, and utm_term.', 'Cleans up extra spaces automatically.', 'Shows both the final URL and the raw parameter string.'],
      icon: 'tag',
    },
    {
      slug: 'meta-counter',
      category: 'Meta',
      title: 'Meta tag length checker',
      description: 'Counts title and description length, highlights risky ranges, and helps shape a cleaner search snippet.',
      summary: 'Checks meta-tag length before publication and shows where the text starts becoming risky.',
      intro: 'Useful before publishing new pages or articles when you need a quick title and description check without separate SEO software.',
      highlights: ['Shows safe, borderline, and too-long states.', 'Includes a simple SERP snippet preview.', 'Keeps title and description checks separate.'],
      icon: 'type',
    },
    {
      slug: 'robots-generator',
      category: 'Technical SEO',
      title: 'robots.txt generator',
      description: 'Assembles a robots.txt draft with core directives, sitemap entries, and rules for several user agents.',
      summary: 'Helps you create a practical robots.txt draft and export the final text quickly.',
      intro: 'Useful for a fast start or a quick review of robots.txt when you need a clear interface instead of manual syntax editing.',
      highlights: ['Supports multiple user agents in one file.', 'Includes Allow, Disallow, Sitemap, and Host directives.', 'The final text is ready to paste into the project.'],
      icon: 'file',
    },
    {
      slug: 'og-generator',
      category: 'Meta',
      title: 'Open Graph tag generator',
      description: 'Builds OG tags for clean social previews when a page is shared in messengers and social platforms.',
      summary: 'Generates Open Graph markup and previews how the shared card may look.',
      intro: 'Useful for landing pages, articles, case studies, and commercial pages that need a strong preview in Telegram, WhatsApp, and social feeds.',
      highlights: ['Supports title, description, image, url, type, and site_name.', 'Outputs clean HTML for the head section.', 'Includes a live visual preview block.'],
      icon: 'share',
    },
  ],
}

export const seoTools = seoToolsByLocale.ru

export function getSeoTools(locale: Locale = 'ru') {
  return seoToolsByLocale[locale]
}

export function getSeoToolBySlug(slug: string, locale: Locale = 'ru') {
  return getSeoTools(locale).find((tool) => tool.slug === slug)
}
