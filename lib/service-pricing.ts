import { websiteDevelopmentPricing } from './website-development-pricing-data'

export type ServicePricing = {
  slug: string
  name: string
  shortDescription: string
  priceFrom: number
  unit: 'project' | 'month'
  priceLabel: string
  calculatorHint: string
  deliverables: string[]
}

export const servicePricing: ServicePricing[] = [
  {
    slug: 'seo',
    name: 'SEO-продвижение',
    shortDescription: 'Системная работа над органическим трафиком, структурой сайта и ростом заявок.',
    priceFrom: 60000,
    unit: 'month',
    priceLabel: 'от 60 000 ₽ / мес',
    calculatorHint: 'Подходит проектам, которым нужен постоянный рост и регулярный план внедрения.',
    deliverables: ['Стратегия роста', 'Приоритеты на месяц', 'Работа с ключевыми страницами'],
  },
  {
    slug: 'seo-audit',
    name: 'SEO-аудит',
    shortDescription: 'Диагностика сайта, точек роста и ограничений с понятным планом внедрения.',
    priceFrom: 45000,
    unit: 'project',
    priceLabel: 'от 45 000 ₽ / проект',
    calculatorHint: 'Удобный старт, если нужно понять текущее состояние сайта и порядок дальнейших действий.',
    deliverables: ['Аудит приоритетов', 'Список ошибок', 'План внедрения'],
  },
  {
    slug: 'technical-seo',
    name: 'Техническое SEO',
    shortDescription: 'Работа с индексацией, шаблонами, дублями, скоростью и технической базой сайта.',
    priceFrom: 35000,
    unit: 'project',
    priceLabel: 'от 35 000 ₽ / проект',
    calculatorHint: 'Полезно, когда рост упирается в архитектуру, индексацию или шаблонные ошибки.',
    deliverables: ['Техразбор', 'ТЗ на исправления', 'Контроль внедрения'],
  },
  {
    slug: 'local-seo',
    name: 'Local SEO',
    shortDescription: 'Продвижение по геозапросам, работа с региональными страницами и локальным спросом.',
    priceFrom: 30000,
    unit: 'month',
    priceLabel: 'от 30 000 ₽ / мес',
    calculatorHint: 'Подходит локальному бизнесу, филиалам и сайтам услуг с привязкой к городам.',
    deliverables: ['Геостраницы', 'Локальные сигналы', 'Усиление коммерческих факторов'],
  },
  {
    slug: 'ecommerce-seo',
    name: 'Ecommerce SEO',
    shortDescription: 'SEO для интернет-магазинов: категории, фильтры, карточки товаров и листинги.',
    priceFrom: 75000,
    unit: 'month',
    priceLabel: 'от 75 000 ₽ / мес',
    calculatorHint: 'Для каталогов и интернет-магазинов, где важны масштаб, шаблоны и структура спроса.',
    deliverables: ['Категории и фильтры', 'Товарные шаблоны', 'Рост SEO-каталога'],
  },
  {
    slug: 'b2b-seo',
    name: 'B2B SEO',
    shortDescription: 'SEO для сложных услуг и длинного цикла сделки с фокусом на доверие и заявки.',
    priceFrom: 55000,
    unit: 'month',
    priceLabel: 'от 55 000 ₽ / мес',
    calculatorHint: 'Актуально для B2B, производств, интеграторов и экспертных ниш.',
    deliverables: ['Страницы услуг', 'Усиление оффера', 'Контент под сложный спрос'],
  },
  {
    slug: 'seo-content',
    name: 'SEO-контент',
    shortDescription: 'Контентная система для посадочных, экспертных материалов и расширения спроса.',
    priceFrom: 30000,
    unit: 'project',
    priceLabel: 'от 30 000 ₽ / проект',
    calculatorHint: 'Когда нужен не набор текстов, а контент под структуру сайта и поисковый спрос.',
    deliverables: ['Контент-план', 'Структура страниц', 'ТЗ и тексты под интент'],
  },
  {
    slug: 'link-building',
    name: 'Link Building',
    shortDescription: 'Ссылочная стратегия под приоритетные страницы и усиление авторитетности сайта.',
    priceFrom: 35000,
    unit: 'month',
    priceLabel: 'от 35 000 ₽ / мес',
    calculatorHint: 'Используется как часть стратегии роста, когда проекту нужно усиление внешних сигналов.',
    deliverables: ['Ссылочный план', 'Подбор площадок', 'Контроль профиля'],
  },
  {
    slug: 'seo-consulting',
    name: 'SEO-консалтинг',
    shortDescription: 'Стратегическая поддержка, разбор решений и контроль подрядчиков или команды.',
    priceFrom: 25000,
    unit: 'project',
    priceLabel: 'от 25 000 ₽ / проект',
    calculatorHint: 'Подходит, если внедряет ваша команда, а вам нужна сильная SEO-экспертиза и контроль.',
    deliverables: ['Разбор проекта', 'Стратегические рекомендации', 'Сопровождение решений'],
  },
  websiteDevelopmentPricing,
]

export const servicePricingMap = Object.fromEntries(servicePricing.map((item) => [item.slug, item]))

export function getServicePricing(slug: string) {
  return servicePricingMap[slug]
}

export function formatServicePrice(price: number) {
  return `${price.toLocaleString('ru-RU')} ₽`
}

export function formatServicePriceLabel(price: number, unit: ServicePricing['unit']) {
  return `от ${formatServicePrice(price)} / ${unit === 'month' ? 'мес' : 'проект'}`
}

export function formatServiceBillingUnit(unit: ServicePricing['unit']) {
  return unit === 'month' ? 'в месяц' : 'за проект'
}
