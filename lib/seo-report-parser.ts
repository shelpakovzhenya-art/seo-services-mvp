import { buildTableRow, updateConfigTextBlocks } from '@/lib/seo-report-text'
import {
  createSourceDataUrl,
  getSourceKindLabel,
  type SeoMonthlyReportConfig,
  type SeoRecognizedMetric,
  type SeoReportMetricKey,
  type SeoReportMetricUnit,
  type SeoReportSource,
  type SeoReportSourceKind,
} from '@/lib/seo-report-types'
import { createStableId } from '@/lib/seo-report-utils'

type MetricDefinition = {
  key: SeoReportMetricKey
  label: string
  aliases: string[]
  unit: SeoReportMetricUnit
  sourceKinds?: SeoReportSourceKind[]
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'visits',
    label: 'Визиты',
    aliases: ['визиты', 'сеансы', 'sessions', 'visits'],
    unit: 'number',
    sourceKinds: ['yandex_metrica', 'ga4', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'users',
    label: 'Посетители',
    aliases: ['посетители', 'пользователи', 'users', 'visitors'],
    unit: 'number',
    sourceKinds: ['yandex_metrica', 'ga4', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'bounce_rate',
    label: 'Отказы',
    aliases: ['отказы', 'bounce rate', 'показатель отказов'],
    unit: 'percent',
  },
  {
    key: 'page_depth',
    label: 'Глубина просмотра',
    aliases: ['глубина просмотра', 'page depth', 'pages/session', 'страниц за визит'],
    unit: 'number',
  },
  {
    key: 'time_on_site',
    label: 'Время на сайте',
    aliases: ['время на сайте', 'avg. visit duration', 'avg session duration', 'среднее время'],
    unit: 'duration',
  },
  {
    key: 'leads',
    label: 'Заявки',
    aliases: ['заявки', 'лиды', 'leads'],
    unit: 'number',
  },
  {
    key: 'goal_completions',
    label: 'Достижения целей',
    aliases: ['достижения целей', 'goal completions', 'цели'],
    unit: 'number',
  },
  {
    key: 'conversion_rate',
    label: 'Конверсия',
    aliases: ['конверсия', 'conversion rate', 'cvr', 'conversion'],
    unit: 'percent',
  },
  {
    key: 'organic_traffic',
    label: 'Органический трафик',
    aliases: ['органический трафик', 'organic traffic'],
    unit: 'number',
  },
  {
    key: 'visibility',
    label: 'Видимость',
    aliases: ['видимость', 'visibility'],
    unit: 'percent',
    sourceKinds: ['topvisor', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'average_position',
    label: 'Средняя позиция',
    aliases: ['средняя позиция', 'avg position', 'average position'],
    unit: 'position',
    sourceKinds: ['topvisor', 'google_search_console', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'top_10_keywords',
    label: 'Запросы в топ-10',
    aliases: ['топ-10', 'top 10', 'в топ 10'],
    unit: 'number',
    sourceKinds: ['topvisor', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'top_3_keywords',
    label: 'Запросы в топ-3',
    aliases: ['топ-3', 'top 3', 'в топ 3'],
    unit: 'number',
    sourceKinds: ['topvisor', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'indexed_pages',
    label: 'Страницы в индексе',
    aliases: ['страницы в индексе', 'indexed pages', 'в индексе'],
    unit: 'pages',
  },
  {
    key: 'google_clicks',
    label: 'Клики',
    aliases: ['clicks', 'клики'],
    unit: 'number',
    sourceKinds: ['google_search_console'],
  },
  {
    key: 'google_impressions',
    label: 'Показы',
    aliases: ['impressions', 'показы'],
    unit: 'number',
    sourceKinds: ['google_search_console'],
  },
  {
    key: 'google_ctr',
    label: 'CTR',
    aliases: ['ctr'],
    unit: 'percent',
    sourceKinds: ['google_search_console'],
  },
  {
    key: 'google_average_position',
    label: 'Средняя позиция',
    aliases: ['average position', 'средняя позиция'],
    unit: 'position',
    sourceKinds: ['google_search_console'],
  },
  {
    key: 'yandex_clicks',
    label: 'Клики',
    aliases: ['клики из яндекса', 'yandex clicks'],
    unit: 'number',
    sourceKinds: ['yandex_metrica', 'excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'yandex_impressions',
    label: 'Показы',
    aliases: ['показы в яндексе', 'yandex impressions'],
    unit: 'number',
    sourceKinds: ['excel', 'pdf', 'csv', 'docx', 'screenshot'],
  },
  {
    key: 'branded_traffic',
    label: 'Брендовый трафик',
    aliases: ['брендовый трафик', 'brand traffic'],
    unit: 'number',
  },
  {
    key: 'non_branded_traffic',
    label: 'Небрендовый трафик',
    aliases: ['небрендовый трафик', 'non brand', 'non-branded'],
    unit: 'number',
  },
]

const MONTH_PATTERN =
  /\b(январ[ьяе]|феврал[ьяе]|март[ае]?|апрел[ьяе]|ма[йея]|июн[ьяе]|июл[ьяе]|август[ае]?|сентябр[ьяе]|октябр[ьяе]|ноябр[ьяе]|декабр[ьяе]|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi

const SEARCH_SYSTEM_LABELS = new Map<string, string>([
  ['google', 'Google'],
  ['гугл', 'Google'],
  ['яндекс', 'Яндекс'],
  ['yandex', 'Яндекс'],
])

function normalizeWhitespace(value: string) {
  return value.replace(/\r/g, '\n').replace(/[ \t\u00a0]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/ё/g, 'е').trim()
}

function parseNumberToken(rawValue: string, unit: SeoReportMetricUnit) {
  const trimmed = rawValue.trim()
  const normalized = trimmed.replace(/\s/g, '').replace(',', '.').replace('%', '')

  if (unit === 'duration') {
    if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(trimmed)) {
      const parts = trimmed.split(':').map((item) => Number(item))
      if (parts.some((item) => Number.isNaN(item))) {
        return null
      }

      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]
      }

      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
      }
    }

    const minutesMatch = trimmed.match(/(\d+)\s*мин/i)
    const secondsMatch = trimmed.match(/(\d+)\s*с/i)

    if (minutesMatch || secondsMatch) {
      const minutes = minutesMatch ? Number(minutesMatch[1]) : 0
      const seconds = secondsMatch ? Number(secondsMatch[1]) : 0
      return minutes * 60 + seconds
    }
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function findPeriods(text: string) {
  const seen = new Set<string>()
  const matches = text.match(MONTH_PATTERN) || []

  matches.forEach((item) => seen.add(item.toLowerCase()))

  return Array.from(seen)
}

function getValueTokens(value: string) {
  const matches =
    value.match(
      /\d+\s*мин(?:\s*\d+\s*с)?|\d+\s*с|\d{1,2}:\d{2}(?::\d{2})?|[-+]?\d+(?:[\s\u00a0]\d{3})*(?:[.,]\d+)?%?/gi
    ) || []

  return matches.filter((item) => /\d/.test(item))
}

function shouldHandleDefinition(definition: MetricDefinition, sourceKind: SeoReportSourceKind) {
  return !definition.sourceKinds || definition.sourceKinds.includes(sourceKind)
}

function sourceKindFromMime(source: SeoReportSource) {
  if (source.sourceKind !== 'other') {
    return source.sourceKind
  }

  if (source.mimeType.startsWith('image/')) {
    return 'screenshot'
  }

  if (source.mimeType.includes('pdf')) {
    return 'pdf'
  }

  if (source.mimeType.includes('word')) {
    return 'docx'
  }

  if (source.mimeType.includes('sheet') || source.mimeType.includes('excel')) {
    return 'excel'
  }

  if (source.mimeType.includes('csv')) {
    return 'csv'
  }

  return 'other'
}

function resolveSearchSystemLabel(rawLine: string) {
  const normalized = normalizeForMatch(rawLine)
  return SEARCH_SYSTEM_LABELS.get(normalized) || null
}

function splitMetricSegments(line: string) {
  return line
    .split(/\s*;\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean)
}

function resolveMetricSourceLabel(
  definition: MetricDefinition,
  sourceKind: SeoReportSourceKind,
  explicitSourceLabel?: string | null
) {
  if (explicitSourceLabel) {
    return explicitSourceLabel
  }

  if (definition.key.startsWith('google_')) {
    return 'Google'
  }

  if (definition.key.startsWith('yandex_')) {
    return 'Яндекс'
  }

  return getSourceKindLabel(sourceKind)
}

function buildMetricFromSegment(input: {
  segment: string
  nextLine?: string
  definition: MetricDefinition
  sourceKind: SeoReportSourceKind
  sourceLabel?: string | null
}) {
  const combinedLine = [input.segment, input.nextLine].filter(Boolean).join(' ')
  const tokens = getValueTokens(combinedLine)

  if (!tokens.length) {
    return null
  }

  const previousRaw = tokens.length > 1 ? tokens[0] : undefined
  const currentRaw = tokens.length > 1 ? tokens[1] : tokens[0]
  const previousValue = previousRaw ? parseNumberToken(previousRaw, input.definition.unit) : null
  const currentValue = currentRaw ? parseNumberToken(currentRaw, input.definition.unit) : null

  const hasComparableValues = previousValue !== null && currentValue !== null && tokens.length > 1
  const changeAbsolute = hasComparableValues ? currentValue - previousValue : null
  const changePercent =
    hasComparableValues && previousValue !== 0
      ? ((currentValue - previousValue) / Math.abs(previousValue)) * 100
      : null

  return {
    id: createStableId('recognized-metric'),
    key: input.definition.key,
    label: input.definition.label,
    sourceLabel: resolveMetricSourceLabel(input.definition, input.sourceKind, input.sourceLabel),
    sourceKind: input.sourceKind,
    unit: input.definition.unit,
    previousRaw,
    currentRaw,
    previousValue,
    currentValue,
    changeAbsolute,
    changePercent,
    confidence: tokens.length > 1 ? 'high' : 'medium',
    requiresReview: tokens.length < 2,
    notes:
      tokens.length < 2
        ? 'Найдено только одно значение без явного сравнения периодов.'
        : combinedLine.toLowerCase().includes('нет')
          ? 'Во фрагменте есть упоминание о неполных данных.'
          : undefined,
  } satisfies SeoRecognizedMetric
}

function dedupeMetrics(metrics: SeoRecognizedMetric[]) {
  const map = new Map<string, SeoRecognizedMetric>()

  metrics.forEach((metric) => {
    const key = `${metric.sourceKind}:${metric.sourceLabel}:${metric.key}`
    const existing = map.get(key)

    if (!existing) {
      map.set(key, metric)
      return
    }

    const existingScore =
      (existing.confidence === 'high' ? 3 : existing.confidence === 'medium' ? 2 : 1) +
      (existing.requiresReview ? 0 : 2)
    const nextScore =
      (metric.confidence === 'high' ? 3 : metric.confidence === 'medium' ? 2 : 1) +
      (metric.requiresReview ? 0 : 2)

    if (nextScore >= existingScore) {
      map.set(key, metric)
    }
  })

  return Array.from(map.values())
}

async function extractTextFromPdf(buffer: Buffer) {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    return normalizeWhitespace(result.text || '')
  } finally {
    await parser.destroy()
  }
}

async function extractTextFromDocx(buffer: Buffer) {
  const mammoth = await import('mammoth')
  const data = await mammoth.extractRawText({ buffer })
  return normalizeWhitespace(data.value || '')
}

async function extractTextFromSpreadsheet(buffer: Buffer) {
  const xlsx = await import('xlsx')
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const parts: string[] = []

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows = xlsx.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    })

    parts.push(`# ${sheetName}`)
    rows.forEach((row) => {
      parts.push(row.map((item) => String(item || '')).join(' | '))
    })
  })

  return normalizeWhitespace(parts.join('\n'))
}

async function extractTextFromCsv(buffer: Buffer) {
  return normalizeWhitespace(buffer.toString('utf-8'))
}

async function extractTextFromImage(buffer: Buffer) {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('rus+eng', 1, {
    logger: () => undefined,
  })

  try {
    const result = await worker.recognize(buffer)
    return normalizeWhitespace(result.data.text || '')
  } finally {
    await worker.terminate()
  }
}

async function extractTextFromSource(source: SeoReportSource) {
  const buffer = Buffer.from(source.dataBase64, 'base64')
  const sourceKind = sourceKindFromMime(source)

  if (source.mimeType.startsWith('image/') || sourceKind === 'screenshot') {
    return extractTextFromImage(buffer)
  }

  if (source.mimeType.includes('pdf') || sourceKind === 'pdf') {
    return extractTextFromPdf(buffer)
  }

  if (
    source.mimeType.includes('word') ||
    source.mimeType.includes('officedocument.wordprocessingml') ||
    sourceKind === 'docx'
  ) {
    return extractTextFromDocx(buffer)
  }

  if (source.mimeType.includes('sheet') || source.mimeType.includes('excel') || sourceKind === 'excel') {
    return extractTextFromSpreadsheet(buffer)
  }

  if (source.mimeType.includes('csv') || sourceKind === 'csv') {
    return extractTextFromCsv(buffer)
  }

  return normalizeWhitespace(buffer.toString('utf-8'))
}

function extractMetricsFromText(text: string, sourceKind: SeoReportSourceKind) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const metrics: SeoRecognizedMetric[] = []
  let currentSearchSystemLabel: string | null = null

  lines.forEach((line, index) => {
    const searchSystemLabel = resolveSearchSystemLabel(line)
    if (searchSystemLabel) {
      currentSearchSystemLabel = searchSystemLabel
      return
    }

    if (/^\d+\./.test(line) || /^(итоги|показатели|итог|рекомендации)/i.test(normalizeForMatch(line))) {
      currentSearchSystemLabel = null
    }

    const segments = splitMetricSegments(line)

    segments.forEach((segment) => {
      const normalizedSegment = normalizeForMatch(segment)

      METRIC_DEFINITIONS.forEach((definition) => {
        if (!shouldHandleDefinition(definition, sourceKind)) {
          return
        }

        if (!definition.aliases.some((alias) => normalizedSegment.includes(alias))) {
          return
        }

        const metric = buildMetricFromSegment({
          segment,
          nextLine: lines[index + 1],
          definition,
          sourceKind,
          sourceLabel: currentSearchSystemLabel,
        })

        if (metric) {
          metrics.push(metric)
        }
      })
    })
  })

  return dedupeMetrics(metrics)
}

function buildMissingBlocks(config: SeoMonthlyReportConfig) {
  const missing: string[] = []

  if (!config.keyMetrics.length) {
    missing.push('ключевые показатели')
  }

  if (!config.searchSystemRows.length) {
    missing.push('разрез по поисковым системам')
  }

  if (!config.seoHighlightRows.length) {
    missing.push('дополнительные SEO-блоки')
  }

  return missing
}

function selectRowsForTable(metrics: SeoRecognizedMetric[], keys: SeoReportMetricKey[], options?: { onlySearchSystems?: boolean }) {
  return metrics
    .filter((metric) => keys.includes(metric.key))
    .filter((metric) => {
      if (options?.onlySearchSystems) {
        return metric.sourceLabel === 'Google' || metric.sourceLabel === 'Яндекс'
      }

      return metric.sourceLabel !== 'Google' && metric.sourceLabel !== 'Яндекс'
    })
    .map((metric) => buildTableRow(metric))
}

function sortMetrics(metrics: SeoRecognizedMetric[]) {
  const order: SeoReportMetricKey[] = [
    'visits',
    'users',
    'bounce_rate',
    'page_depth',
    'time_on_site',
    'leads',
    'goal_completions',
    'conversion_rate',
    'google_clicks',
    'google_impressions',
    'google_ctr',
    'google_average_position',
    'yandex_clicks',
    'yandex_impressions',
    'visibility',
    'average_position',
    'top_3_keywords',
    'top_10_keywords',
    'indexed_pages',
    'branded_traffic',
    'non_branded_traffic',
    'organic_traffic',
  ]

  return [...metrics].sort((left, right) => {
    const sourcePriority = left.sourceLabel.localeCompare(right.sourceLabel, 'ru')
    if (sourcePriority !== 0) {
      const leftSystem = left.sourceLabel === 'Google' ? 0 : left.sourceLabel === 'Яндекс' ? 1 : 2
      const rightSystem = right.sourceLabel === 'Google' ? 0 : right.sourceLabel === 'Яндекс' ? 1 : 2
      if (leftSystem !== rightSystem) {
        return leftSystem - rightSystem
      }

      return sourcePriority
    }

    return order.indexOf(left.key) - order.indexOf(right.key)
  })
}

export async function parseSeoReportConfig(config: SeoMonthlyReportConfig) {
  const parserWarnings: string[] = []
  const parsingLog: string[] = []
  const allMetrics: SeoRecognizedMetric[] = []

  const updatedSources = await Promise.all(
    config.sources.map(async (source) => {
      try {
        const extractedText = await extractTextFromSource(source)
        const detectedPeriods = findPeriods(extractedText)
        const metrics = extractMetricsFromText(extractedText, source.sourceKind)
        const warnings = [...source.warnings]

        if (!extractedText) {
          warnings.push('Из файла не удалось извлечь текст.')
        }

        if (!metrics.length) {
          warnings.push('Метрики не распознаны автоматически.')
        }

        allMetrics.push(...metrics)
        parsingLog.push(`${source.name}: найдено ${metrics.length} метрик.`)

        return {
          ...source,
          extractedText,
          detectedPeriods,
          recognizedMetrics: metrics,
          warnings,
          status: warnings.length ? 'needs_review' : 'parsed',
        } satisfies SeoReportSource
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка парсинга.'
        parserWarnings.push(`${source.name}: ${message}`)
        parsingLog.push(`${source.name}: ошибка парсинга.`)

        return {
          ...source,
          extractedText: source.extractedText || '',
          recognizedMetrics: [],
          warnings: [...source.warnings, message],
          status: 'needs_review',
        } satisfies SeoReportSource
      }
    })
  )

  const sortedMetrics = sortMetrics(dedupeMetrics(allMetrics))
  const nextConfig: SeoMonthlyReportConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
    lastParsedAt: new Date().toISOString(),
    sources: updatedSources,
    keyMetrics: selectRowsForTable(
      sortedMetrics,
      ['visits', 'users', 'bounce_rate', 'page_depth', 'time_on_site', 'leads', 'goal_completions', 'conversion_rate'],
      { onlySearchSystems: false }
    ),
    searchSystemRows: selectRowsForTable(
      sortedMetrics,
      ['visits', 'users', 'bounce_rate', 'page_depth', 'time_on_site', 'google_clicks', 'google_impressions', 'google_ctr', 'google_average_position', 'yandex_clicks', 'yandex_impressions'],
      { onlySearchSystems: true }
    ),
    seoHighlightRows: selectRowsForTable(
      sortedMetrics,
      ['visibility', 'average_position', 'top_3_keywords', 'top_10_keywords', 'indexed_pages', 'branded_traffic', 'non_branded_traffic'],
      { onlySearchSystems: false }
    ),
    parserWarnings,
    parsingLog,
    missingBlocks: [],
  }

  const withMissingBlocks = {
    ...nextConfig,
    missingBlocks: buildMissingBlocks(nextConfig),
  }

  return updateConfigTextBlocks(withMissingBlocks)
}

export function buildSourceFromUpload(input: {
  name: string
  mimeType: string
  size: number
  dataBase64: string
  sourceKind: SeoReportSourceKind
}) {
  const extension = input.name.includes('.') ? input.name.split('.').pop()?.toLowerCase() || '' : ''

  return {
    id: createStableId('seo-source'),
    name: input.name,
    mimeType: input.mimeType,
    extension,
    sourceKind: input.sourceKind,
    size: input.size,
    uploadedAt: new Date().toISOString(),
    dataBase64: input.dataBase64,
    extractedText: '',
    recognizedMetrics: [],
    detectedPeriods: [],
    warnings: [],
    status: 'uploaded',
  } satisfies SeoReportSource
}

export function getPreviewableSourceUrl(source: SeoReportSource) {
  if (!source.mimeType.startsWith('image/')) {
    return null
  }

  return createSourceDataUrl(source)
}
