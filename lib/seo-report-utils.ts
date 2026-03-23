import { SEO_REPORT_BLOCK_IDS, type SeoMonthlyReportConfig, type SeoReportBlockId } from '@/lib/seo-report-types'

export function createStableId(prefix: string) {
  const base =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  return `${prefix}-${base}`
}

function parseDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateLabel(value: string) {
  const date = parseDate(value)
  if (!date) {
    return value || '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function isFullMonthRange(start: string, end: string) {
  const startDate = parseDate(start)
  const endDate = parseDate(end)

  if (!startDate || !endDate) {
    return false
  }

  const monthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getTime() === monthStart.getTime() &&
    endDate.getTime() === monthEnd.getTime()
  )
}

export function formatPeriodLabel(start: string, end: string) {
  if (!start || !end) {
    return 'период не задан'
  }

  if (isFullMonthRange(start, end)) {
    const date = parseDate(start)
    if (date) {
      return new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric',
      }).format(date)
    }
  }

  return `${formatDateLabel(start)} — ${formatDateLabel(end)}`
}

export function formatRangeLabel(start: string, end: string) {
  return `${formatDateLabel(start)} — ${formatDateLabel(end)}`
}

export function formatComparisonLabel(
  comparePeriodStart: string,
  comparePeriodEnd: string,
  periodStart: string,
  periodEnd: string
) {
  return `Сравнение: ${formatPeriodLabel(comparePeriodStart, comparePeriodEnd)} и ${formatPeriodLabel(
    periodStart,
    periodEnd
  )}`
}

export function formatReportDateTime(value: string | Date | null | undefined) {
  if (!value) {
    return '—'
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function buildMonthlyPeriods(preset: SeoMonthlyReportConfig['periodPreset']) {
  const now = new Date()
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const beforePreviousStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const beforePreviousEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0)

  const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

  if (preset === 'current_month') {
    return {
      periodStart: toIsoDate(currentStart),
      periodEnd: toIsoDate(currentEnd),
      comparePeriodStart: toIsoDate(previousStart),
      comparePeriodEnd: toIsoDate(previousEnd),
    }
  }

  return {
    periodStart: toIsoDate(previousStart),
    periodEnd: toIsoDate(previousEnd),
    comparePeriodStart: toIsoDate(beforePreviousStart),
    comparePeriodEnd: toIsoDate(beforePreviousEnd),
  }
}

export function getBlockLabel(blockId: SeoReportBlockId) {
  switch (blockId) {
    case 'overview':
      return '1. Итоги месяца'
    case 'key_metrics':
      return '2. Ключевые показатели поискового трафика'
    case 'search_systems':
      return '3. Разрез по поисковым системам'
    case 'seo_highlights':
      return 'Дополнительные SEO-показатели'
    case 'analytical_conclusions':
      return '4. Показатели'
    case 'final_summary':
      return '5. Итог'
    case 'recommendations':
      return '6. Рекомендации'
  }
}

export function normalizeBlockOrder(blockOrder?: SeoReportBlockId[]) {
  const unique = new Set<SeoReportBlockId>()
  const nextOrder: SeoReportBlockId[] = []

  ;(blockOrder || []).forEach((item) => {
    if (SEO_REPORT_BLOCK_IDS.includes(item) && !unique.has(item)) {
      unique.add(item)
      nextOrder.push(item)
    }
  })

  SEO_REPORT_BLOCK_IDS.forEach((item) => {
    if (!unique.has(item)) {
      nextOrder.push(item)
    }
  })

  return nextOrder
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
