import type {
  SeoMonthlyReportConfig,
  SeoRecognizedMetric,
  SeoReportMetricKey,
  SeoReportMetricUnit,
  SeoReportTableRow,
} from '@/lib/seo-report-types'
import { createStableId } from '@/lib/seo-report-utils'

type SearchSystemSection = {
  sourceLabel: string
  rows: SeoReportTableRow[]
}

const SEARCH_SYSTEM_ORDER = ['Google', 'Яндекс']

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim() && value.trim() !== '—')
}

function parseChangePercent(value: string) {
  const match = value.match(/[-+]?\d+(?:[.,]\d+)?/)
  if (!match) {
    return null
  }

  const parsed = Number(match[0].replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function isInversePositive(key: SeoReportMetricKey) {
  return key === 'bounce_rate' || key === 'average_position' || key === 'google_average_position'
}

function findRow(rows: SeoReportTableRow[], key: SeoReportMetricKey) {
  return rows.find((row) => row.key === key)
}

function findSection(sections: SearchSystemSection[], sourceLabel: string) {
  return sections.find((section) => section.sourceLabel === sourceLabel)
}

function findSectionRow(sections: SearchSystemSection[], sourceLabel: string, key: SeoReportMetricKey) {
  return findSection(sections, sourceLabel)?.rows.find((row) => row.key === key)
}

function formatChange(metric: SeoRecognizedMetric) {
  if (metric.changePercent === null || metric.changePercent === undefined || Number.isNaN(metric.changePercent)) {
    return '—'
  }

  const sign = metric.changePercent > 0 ? '+' : ''
  return `${sign}${formatNumber(metric.changePercent)}%`
}

function ensureSentence(value: string) {
  if (!value) {
    return value
  }

  const trimmed = value.trim()
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function getTrendWord(row: SeoReportTableRow, positiveWord: string, negativeWord: string, neutralWord = 'не изменилась') {
  if (row.changeTone === 'positive') {
    return positiveWord
  }

  if (row.changeTone === 'negative') {
    return negativeWord
  }

  return neutralWord
}

function combineTrafficLine(rows: SeoReportTableRow[]) {
  const visits = findRow(rows, 'visits') || findRow(rows, 'organic_traffic')
  const users = findRow(rows, 'users')

  if (visits && users && hasValue(visits.previousRaw) && hasValue(visits.currentRaw) && hasValue(users.previousRaw) && hasValue(users.currentRaw)) {
    const intro =
      visits.changeTone === 'positive' && users.changeTone !== 'negative'
        ? 'Поисковый трафик продолжил рост'
        : visits.changeTone === 'negative' && users.changeTone !== 'positive'
          ? 'Поисковый трафик снизился'
          : 'Динамика по трафику разнонаправленная'

    return ensureSentence(
      `${intro}: визиты ${visits.changeRaw} (${visits.previousRaw} → ${visits.currentRaw}), посетители ${users.changeRaw} (${users.previousRaw} → ${users.currentRaw})`
    )
  }

  if (visits && hasValue(visits.previousRaw) && hasValue(visits.currentRaw)) {
    return ensureSentence(
      `Визиты ${getTrendWord(visits, 'выросли', 'снизились')}: ${visits.previousRaw} → ${visits.currentRaw} (${visits.changeRaw})`
    )
  }

  if (users && hasValue(users.previousRaw) && hasValue(users.currentRaw)) {
    return ensureSentence(
      `Посетители ${getTrendWord(users, 'выросли', 'снизились')}: ${users.previousRaw} → ${users.currentRaw} (${users.changeRaw})`
    )
  }

  return ''
}

function buildQualityLine(rows: SeoReportTableRow[]) {
  const bounceRate = findRow(rows, 'bounce_rate')
  if (bounceRate && hasValue(bounceRate.previousRaw) && hasValue(bounceRate.currentRaw)) {
    return ensureSentence(
      `Отказы ${getTrendWord(bounceRate, 'снизились', 'выросли')}: ${bounceRate.previousRaw} → ${bounceRate.currentRaw}`
    )
  }

  return ''
}

function buildEngagementLine(rows: SeoReportTableRow[]) {
  const pageDepth = findRow(rows, 'page_depth')
  const timeOnSite = findRow(rows, 'time_on_site')

  if (pageDepth && hasValue(pageDepth.previousRaw) && hasValue(pageDepth.currentRaw)) {
    return ensureSentence(
      `Глубина просмотра ${getTrendWord(pageDepth, 'выросла', 'снизилась')}: ${pageDepth.previousRaw} → ${pageDepth.currentRaw} (${pageDepth.changeRaw})`
    )
  }

  if (timeOnSite && hasValue(timeOnSite.currentRaw)) {
    return ensureSentence(`Время на сайте: ${timeOnSite.currentRaw}`)
  }

  return ''
}

function buildLeadLine(rows: SeoReportTableRow[]) {
  const leads = findRow(rows, 'leads')
  const conversionRate = findRow(rows, 'conversion_rate')
  const goalCompletions = findRow(rows, 'goal_completions')

  if (leads && hasValue(leads.previousRaw) && hasValue(leads.currentRaw)) {
    return ensureSentence(
      `Заявки ${getTrendWord(leads, 'выросли', 'снизились')}: ${leads.previousRaw} → ${leads.currentRaw} (${leads.changeRaw})`
    )
  }

  if (conversionRate && hasValue(conversionRate.previousRaw) && hasValue(conversionRate.currentRaw)) {
    return ensureSentence(
      `Конверсия ${getTrendWord(conversionRate, 'выросла', 'снизилась')}: ${conversionRate.previousRaw} → ${conversionRate.currentRaw} (${conversionRate.changeRaw})`
    )
  }

  if (goalCompletions && hasValue(goalCompletions.previousRaw) && hasValue(goalCompletions.currentRaw)) {
    return ensureSentence(
      `Достижения целей ${getTrendWord(goalCompletions, 'выросли', 'снизились')}: ${goalCompletions.previousRaw} → ${goalCompletions.currentRaw} (${goalCompletions.changeRaw})`
    )
  }

  return ''
}

function buildEngineComparisonLine(sections: SearchSystemSection[]) {
  const googleVisits = findSectionRow(sections, 'Google', 'visits')
  const yandexVisits = findSectionRow(sections, 'Яндекс', 'visits')

  if (
    googleVisits &&
    yandexVisits &&
    hasValue(googleVisits.changeRaw) &&
    hasValue(yandexVisits.changeRaw) &&
    googleVisits.changeRaw !== '—' &&
    yandexVisits.changeRaw !== '—'
  ) {
    const googleChange = parseChangePercent(googleVisits.changeRaw)
    const yandexChange = parseChangePercent(yandexVisits.changeRaw)

    if (googleVisits.changeTone === 'positive' && yandexVisits.changeTone === 'positive') {
      if (googleChange !== null && yandexChange !== null && googleChange !== yandexChange) {
        return ensureSentence(
          `Обе поисковые системы прибавили по визитам, при этом ${googleChange > yandexChange ? 'Google' : 'Яндекс'} рос быстрее`
        )
      }

      return ensureSentence('Обе поисковые системы дали положительную динамику по визитам')
    }

    if (googleVisits.changeTone !== yandexVisits.changeTone) {
      const betterSource = googleVisits.changeTone === 'positive' ? 'Google' : 'Яндекс'
      const weakerSource = betterSource === 'Google' ? 'Яндекс' : 'Google'
      return ensureSentence(`${betterSource} показал более сильную динамику по визитам, чем ${weakerSource}`)
    }
  }

  return ''
}

function buildEngineQualityLine(sections: SearchSystemSection[], sourceLabel: string) {
  const bounceRate = findSectionRow(sections, sourceLabel, 'bounce_rate')
  const pageDepth = findSectionRow(sections, sourceLabel, 'page_depth')

  if (bounceRate && pageDepth && bounceRate.changeTone === 'positive' && pageDepth.changeTone === 'positive') {
    return ensureSentence(`${sourceLabel}: отказы снизились, а глубина просмотра выросла`)
  }

  if (bounceRate && pageDepth && bounceRate.changeTone === 'positive' && pageDepth.changeTone === 'negative') {
    return ensureSentence(`${sourceLabel}: отказы снизились, но глубина просмотра просела`)
  }

  if (bounceRate && bounceRate.changeTone === 'negative') {
    return ensureSentence(`${sourceLabel}: показатель отказов вырос и требует проверки посадочных страниц`)
  }

  return ''
}

function buildRepeatVisitsLine(rows: SeoReportTableRow[]) {
  const visits = findRow(rows, 'visits')
  const users = findRow(rows, 'users')

  if (!visits || !users) {
    return ''
  }

  const visitsChange = parseChangePercent(visits.changeRaw)
  const usersChange = parseChangePercent(users.changeRaw)

  if (visitsChange === null || usersChange === null) {
    return ''
  }

  if (visitsChange - usersChange > 5) {
    return 'Рост визитов опережает рост посетителей, значит доля повторных заходов стала выше.'
  }

  if (usersChange - visitsChange > 5) {
    return 'Рост посетителей идет быстрее визитов, значит проект расширяет охват новой аудитории.'
  }

  return ''
}

function buildFinalSummaryLine(config: SeoMonthlyReportConfig) {
  const visits = findRow(config.keyMetrics, 'visits')
  const bounceRate = findRow(config.keyMetrics, 'bounce_rate')

  const positiveTraffic = visits?.changeTone === 'positive'
  const positiveQuality = bounceRate?.changeTone === 'positive'

  if (positiveTraffic && positiveQuality && !config.missingBlocks.length) {
    return 'Месяц завершился с положительной динамикой по трафику и качеству входящего спроса.'
  }

  if (positiveTraffic || positiveQuality) {
    return 'Месяц в целом рабочий: есть точки роста, которые уже можно закреплять в следующем цикле работ.'
  }

  if (visits?.changeTone === 'negative' || bounceRate?.changeTone === 'negative') {
    return 'Месяц прошел неровно: ключевые метрики требуют более внимательной проверки и точечных доработок.'
  }

  return 'Отчет собран как рабочая база для обсуждения результатов и планирования следующего месяца.'
}

function buildDataGapLine(config: SeoMonthlyReportConfig) {
  if (!config.missingBlocks.length && !config.parserWarnings.length) {
    return ''
  }

  if (config.missingBlocks.length) {
    return ensureSentence(`Часть данных требует ручной проверки: ${config.missingBlocks.join(', ')}`)
  }

  return 'В отчете есть предупреждения парсера, поэтому спорные значения лучше проверить перед отправкой клиенту.'
}

export function formatMetricDisplay(value: number | null | undefined, unit: SeoReportMetricUnit) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—'
  }

  if (unit === 'duration') {
    const totalSeconds = Math.max(0, Math.round(value))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (unit === 'percent') {
    return `${formatNumber(value)}%`
  }

  return formatNumber(value)
}

export function getChangeTone(metric: SeoRecognizedMetric): SeoReportTableRow['changeTone'] {
  if (metric.changePercent === null || metric.changePercent === undefined || Number.isNaN(metric.changePercent)) {
    return 'neutral'
  }

  if (metric.changePercent === 0) {
    return 'neutral'
  }

  const positiveChange = metric.changePercent > 0
  const inverse = isInversePositive(metric.key)
  const isPositive = inverse ? !positiveChange : positiveChange

  return isPositive ? 'positive' : 'negative'
}

export function buildTableRow(metric: SeoRecognizedMetric): SeoReportTableRow {
  return {
    id: createStableId('metric-row'),
    key: metric.key,
    label: metric.label,
    sourceLabel: metric.sourceLabel,
    unit: metric.unit,
    previousRaw: metric.previousRaw || formatMetricDisplay(metric.previousValue ?? null, metric.unit),
    currentRaw: metric.currentRaw || formatMetricDisplay(metric.currentValue ?? null, metric.unit),
    changeRaw: formatChange(metric),
    changeTone: getChangeTone(metric),
    requiresReview: metric.requiresReview,
    notes: metric.notes,
  }
}

export function buildMetricLine(row: SeoReportTableRow) {
  const note = row.requiresReview ? ' Требует проверки.' : ''

  if (hasValue(row.previousRaw) && hasValue(row.currentRaw) && row.previousRaw !== row.currentRaw) {
    const change = hasValue(row.changeRaw) && row.changeRaw !== '—' ? ` (${row.changeRaw})` : ''
    return `${row.label}: ${row.previousRaw} → ${row.currentRaw}${change}.${note}`.trim()
  }

  if (hasValue(row.currentRaw)) {
    return `${row.label}: ${row.currentRaw}.${note}`.trim()
  }

  return `${row.label}: нет данных.${note}`.trim()
}

export function groupSearchSystemRows(rows: SeoReportTableRow[]): SearchSystemSection[] {
  const grouped = new Map<string, SeoReportTableRow[]>()

  rows.forEach((row) => {
    const sourceLabel = row.sourceLabel || 'Прочий источник'
    const bucket = grouped.get(sourceLabel) || []
    bucket.push(row)
    grouped.set(sourceLabel, bucket)
  })

  return Array.from(grouped.entries())
    .sort((left, right) => {
      const leftIndex = SEARCH_SYSTEM_ORDER.indexOf(left[0])
      const rightIndex = SEARCH_SYSTEM_ORDER.indexOf(right[0])

      if (leftIndex !== -1 || rightIndex !== -1) {
        return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex)
      }

      return left[0].localeCompare(right[0], 'ru')
    })
    .map(([sourceLabel, sectionRows]) => ({
      sourceLabel,
      rows: sectionRows.sort((left, right) => {
        const order: SeoReportMetricKey[] = ['visits', 'users', 'bounce_rate', 'page_depth', 'time_on_site']
        const leftIndex = order.includes(left.key) ? order.indexOf(left.key) : 99
        const rightIndex = order.includes(right.key) ? order.indexOf(right.key) : 99
        return leftIndex - rightIndex
      }),
    }))
}

export function buildTextBlocks(config: SeoMonthlyReportConfig) {
  const sections = groupSearchSystemRows(config.searchSystemRows)

  const overviewParagraphs = [
    combineTrafficLine(config.keyMetrics),
    buildQualityLine(config.keyMetrics),
    buildEngagementLine(config.keyMetrics),
    buildLeadLine(config.keyMetrics),
  ].filter(Boolean)

  const analyticalParagraphs = [
    buildEngineComparisonLine(sections),
    buildEngineQualityLine(sections, 'Google'),
    buildEngineQualityLine(sections, 'Яндекс'),
    buildRepeatVisitsLine(config.keyMetrics),
    buildDataGapLine(config),
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 4)

  const finalParagraphs = [buildFinalSummaryLine(config), buildDataGapLine(config)].filter(Boolean).slice(0, 2)

  const recommendationItems = buildRecommendationItems(config)

  return {
    overview: {
      title: '1. Итоги месяца',
      content: overviewParagraphs.length
        ? overviewParagraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
        : '<p>Данных для краткого вывода пока недостаточно.</p>',
    },
    analyticalConclusions: {
      title: '4. Показатели',
      content: analyticalParagraphs.length
        ? analyticalParagraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join('')
        : '<p>Для аналитических комментариев пока не хватает подтвержденных метрик.</p>',
    },
    finalSummary: {
      title: '5. Итог',
      content: finalParagraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join(''),
    },
    recommendations: {
      title: '6. Рекомендации',
      content: `<ul>${recommendationItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`,
    },
  }
}

export function buildRecommendationItems(config: SeoMonthlyReportConfig) {
  const recommendations: string[] = []
  const negativeRows = [...config.keyMetrics, ...config.seoHighlightRows].filter((row) => row.changeTone === 'negative')

  if (negativeRows.some((row) => row.key === 'bounce_rate')) {
    recommendations.push('Проверить посадочные страницы с ростом отказов и пересобрать связку запрос → страница → оффер.')
  }

  if (negativeRows.some((row) => row.key === 'leads' || row.key === 'conversion_rate')) {
    recommendations.push('Разобрать точки входа в заявку: формы, CTA и сценарии, где пользователь теряется перед конверсией.')
  }

  if (negativeRows.some((row) => row.key === 'visibility' || row.key === 'average_position')) {
    recommendations.push('Отдельно пройтись по семантике, индексируемым шаблонам и приоритетным страницам, если просела видимость.')
  }

  if (config.missingBlocks.length) {
    recommendations.push(`Догрузить или перепроверить данные по блокам: ${config.missingBlocks.join(', ')}.`)
  }

  if (!recommendations.length && config.keyMetrics.length) {
    recommendations.push('Сохранить темп работ по зонам, которые уже дали движение по трафику и качеству посещений.')
  }

  if (!recommendations.length) {
    recommendations.push('Сначала догрузить исходники и заново прогнать парсер, чтобы рекомендации опирались на полный набор метрик.')
  }

  return recommendations
}

export function updateConfigTextBlocks(config: SeoMonthlyReportConfig) {
  return {
    ...config,
    textBlocks: buildTextBlocks(config),
  }
}

export type { SearchSystemSection }
