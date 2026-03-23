export const SEO_PROJECT_CONFIG_TYPE = 'seo_project'
export const SEO_MONTHLY_REPORT_JOB_TYPE = 'seo_monthly_report'

export const REPORT_SOURCE_KINDS = [
  'yandex_metrica',
  'topvisor',
  'google_search_console',
  'ga4',
  'excel',
  'pdf',
  'docx',
  'csv',
  'screenshot',
  'other',
] as const

export type SeoReportSourceKind = (typeof REPORT_SOURCE_KINDS)[number]

export const SEO_REPORT_BLOCK_IDS = [
  'overview',
  'key_metrics',
  'search_systems',
  'seo_highlights',
  'analytical_conclusions',
  'final_summary',
  'recommendations',
] as const

export type SeoReportBlockId = (typeof SEO_REPORT_BLOCK_IDS)[number]

export const SEO_REPORT_ALLOWED_STATUSES = ['draft', 'running', 'completed', 'published', 'failed'] as const
export type SeoReportJobStatus = (typeof SEO_REPORT_ALLOWED_STATUSES)[number]

export type SeoReportMetricUnit = 'number' | 'percent' | 'duration' | 'position' | 'pages'

export type SeoReportMetricKey =
  | 'visits'
  | 'users'
  | 'bounce_rate'
  | 'page_depth'
  | 'time_on_site'
  | 'leads'
  | 'goal_completions'
  | 'conversion_rate'
  | 'organic_traffic'
  | 'visibility'
  | 'average_position'
  | 'top_10_keywords'
  | 'top_3_keywords'
  | 'indexed_pages'
  | 'google_clicks'
  | 'google_impressions'
  | 'google_ctr'
  | 'google_average_position'
  | 'yandex_clicks'
  | 'yandex_impressions'
  | 'branded_traffic'
  | 'non_branded_traffic'
  | 'unknown'

export type SeoProjectConfig = {
  id: string
  name: string
  siteUrl: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type SeoRecognizedMetric = {
  id: string
  key: SeoReportMetricKey
  label: string
  sourceLabel: string
  sourceKind: SeoReportSourceKind
  unit: SeoReportMetricUnit
  previousRaw?: string
  currentRaw?: string
  previousValue?: number | null
  currentValue?: number | null
  changeAbsolute?: number | null
  changePercent?: number | null
  confidence: 'high' | 'medium' | 'low'
  requiresReview: boolean
  notes?: string
}

export type SeoReportSource = {
  id: string
  name: string
  mimeType: string
  extension: string
  sourceKind: SeoReportSourceKind
  size: number
  uploadedAt: string
  dataBase64: string
  extractedText?: string
  recognizedMetrics: SeoRecognizedMetric[]
  detectedPeriods: string[]
  warnings: string[]
  status: 'uploaded' | 'parsed' | 'needs_review'
}

export type SeoReportTableRow = {
  id: string
  key: SeoReportMetricKey
  label: string
  sourceLabel: string
  unit: SeoReportMetricUnit
  previousRaw: string
  currentRaw: string
  changeRaw: string
  changeTone: 'positive' | 'negative' | 'neutral'
  requiresReview: boolean
  notes?: string
}

export type SeoReportTextBlock = {
  title: string
  content: string
}

export type SeoMonthlyReportConfig = {
  version: number
  projectId?: string
  projectName: string
  siteUrl: string
  periodPreset: 'current_month' | 'previous_month' | 'custom'
  periodStart: string
  periodEnd: string
  comparePeriodStart: string
  comparePeriodEnd: string
  title: string
  subtitle: string
  brandName: string
  createdAt: string
  updatedAt: string
  lastParsedAt?: string
  lastGeneratedAt?: string
  blockOrder: SeoReportBlockId[]
  hiddenBlocks: SeoReportBlockId[]
  textBlocks: {
    overview: SeoReportTextBlock
    analyticalConclusions: SeoReportTextBlock
    finalSummary: SeoReportTextBlock
    recommendations: SeoReportTextBlock
  }
  keyMetrics: SeoReportTableRow[]
  searchSystemRows: SeoReportTableRow[]
  seoHighlightRows: SeoReportTableRow[]
  sources: SeoReportSource[]
  parserWarnings: string[]
  missingBlocks: string[]
  manualOverrides: string[]
  parsingLog: string[]
}

export type SeoMonthlyReportStoredResult = {
  kind: 'seo_monthly_report'
  generatedAt: string
  fileBaseName: string
  previewHtml: string
  pdfBase64?: string
  docxBase64?: string
  report: SeoMonthlyReportConfig
}

function parseJson<T>(value: string | null | undefined): T | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function isWholeMonth(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return false
  }

  const expectedStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const expectedEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getTime() === expectedStart.getTime() &&
    endDate.getTime() === expectedEnd.getTime()
  )
}

function formatPeriodLabel(start: string, end: string) {
  if (!start || !end) {
    return 'период не задан'
  }

  if (isWholeMonth(start, end)) {
    const date = new Date(start)
    return new Intl.DateTimeFormat('ru-RU', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return `${formatShortDate(start)} — ${formatShortDate(end)}`
}

export function parseSeoProjectConfig(value: string | null | undefined) {
  return parseJson<SeoProjectConfig>(value)
}

export function parseSeoMonthlyReportConfig(value: string | null | undefined) {
  return parseJson<SeoMonthlyReportConfig>(value)
}

export function parseSeoMonthlyReportResult(value: string | null | undefined) {
  const parsed = parseJson<SeoMonthlyReportStoredResult>(value)
  if (!parsed || parsed.kind !== 'seo_monthly_report') {
    return null
  }

  return parsed
}

export function buildDefaultSeoMonthlyReportConfig(input: {
  projectId?: string
  projectName: string
  siteUrl: string
  periodPreset: SeoMonthlyReportConfig['periodPreset']
  periodStart: string
  periodEnd: string
  comparePeriodStart: string
  comparePeriodEnd: string
}) {
  const now = new Date().toISOString()
  const domainLabel = input.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return {
    version: 1,
    projectId: input.projectId,
    projectName: input.projectName,
    siteUrl: input.siteUrl,
    periodPreset: input.periodPreset,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    comparePeriodStart: input.comparePeriodStart,
    comparePeriodEnd: input.comparePeriodEnd,
    title: `SEO-отчет для сайта ${domainLabel}`,
    subtitle: `Сравнение: ${formatPeriodLabel(input.comparePeriodStart, input.comparePeriodEnd)} и ${formatPeriodLabel(
      input.periodStart,
      input.periodEnd
    )}`,
    brandName: 'Shelpakov Digital',
    createdAt: now,
    updatedAt: now,
    blockOrder: [
      'overview',
      'key_metrics',
      'search_systems',
      'analytical_conclusions',
      'final_summary',
      'seo_highlights',
      'recommendations',
    ],
    hiddenBlocks: ['seo_highlights', 'recommendations'],
    textBlocks: {
      overview: {
        title: '1. Итоги месяца',
        content: '<p>После загрузки исходников здесь появится краткий вывод по месяцу.</p>',
      },
      analyticalConclusions: {
        title: '4. Показатели',
        content: '<p>После распознавания здесь появятся короткие аналитические комментарии по динамике.</p>',
      },
      finalSummary: {
        title: '5. Итог',
        content: '<p>Финальное резюме по отчетному периоду будет собрано после проверки данных.</p>',
      },
      recommendations: {
        title: '6. Рекомендации',
        content: '<p>Здесь можно зафиксировать задачи на следующий месяц.</p>',
      },
    },
    keyMetrics: [],
    searchSystemRows: [],
    seoHighlightRows: [],
    sources: [],
    parserWarnings: [],
    missingBlocks: [],
    manualOverrides: [],
    parsingLog: [],
  } satisfies SeoMonthlyReportConfig
}

export function getSourceKindLabel(sourceKind: SeoReportSourceKind) {
  switch (sourceKind) {
    case 'yandex_metrica':
      return 'Яндекс.Метрика'
    case 'topvisor':
      return 'Топвизор'
    case 'google_search_console':
      return 'Google Search Console'
    case 'ga4':
      return 'Google Analytics / GA4'
    case 'excel':
      return 'Excel / Google Sheets'
    case 'pdf':
      return 'PDF'
    case 'docx':
      return 'DOCX'
    case 'csv':
      return 'CSV'
    case 'screenshot':
      return 'Скриншот'
    default:
      return 'Прочий источник'
  }
}

export function createSourceDataUrl(source: Pick<SeoReportSource, 'mimeType' | 'dataBase64'>) {
  return `data:${source.mimeType};base64,${source.dataBase64}`
}
