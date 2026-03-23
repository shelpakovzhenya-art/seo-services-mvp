import { buildMetricLine, groupSearchSystemRows } from '@/lib/seo-report-text'
import type { SeoMonthlyReportConfig, SeoReportBlockId, SeoReportTableRow } from '@/lib/seo-report-types'
import { formatComparisonLabel, formatPeriodLabel, getBlockLabel } from '@/lib/seo-report-utils'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderComparisonTable(options: {
  title: string
  rows: SeoReportTableRow[]
  emptyState: string
  includeSource?: boolean
}) {
  const { title, rows, emptyState, includeSource = false } = options

  if (!rows.length) {
    return `
      <section class="section-card">
        <h2>${escapeHtml(title)}</h2>
        <div class="empty-state">${escapeHtml(emptyState)}</div>
      </section>
    `
  }

  return `
    <section class="section-card">
      <h2>${escapeHtml(title)}</h2>
      <table class="metric-table">
        <thead>
          <tr>
            <th>Метрика</th>
            ${includeSource ? '<th>Источник</th>' : ''}
            <th>Прошлый период</th>
            <th>Текущий период</th>
            <th>Изменение</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>
                    <div class="metric-name">${escapeHtml(row.label)}</div>
                    ${row.notes ? `<div class="metric-note">${escapeHtml(row.notes)}</div>` : ''}
                  </td>
                  ${includeSource ? `<td>${escapeHtml(row.sourceLabel)}</td>` : ''}
                  <td>${escapeHtml(row.previousRaw)}</td>
                  <td>${escapeHtml(row.currentRaw)}</td>
                  <td class="tone-${row.changeTone}">
                    ${escapeHtml(row.changeRaw)}
                    ${row.requiresReview ? '<div class="metric-note">Требует проверки</div>' : ''}
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `
}

function renderTextCard(title: string, content: string) {
  return `
    <section class="section-card">
      <h2>${escapeHtml(title)}</h2>
      <div class="rich-text">${content}</div>
    </section>
  `
}

function renderSearchSystems(config: SeoMonthlyReportConfig) {
  const sections = groupSearchSystemRows(config.searchSystemRows)

  if (!sections.length) {
    return `
      <section class="section-card">
        <h2>${escapeHtml(getBlockLabel('search_systems'))}</h2>
        <div class="empty-state">По Google и Яндексу пока нет подтвержденных значений.</div>
      </section>
    `
  }

  return `
    <section class="section-card">
      <h2>${escapeHtml(getBlockLabel('search_systems'))}</h2>
      <div class="system-stack">
        ${sections
          .map(
            (section) => `
              <div class="system-card">
                <h3>${escapeHtml(section.sourceLabel)}</h3>
                <ul class="system-list">
                  ${section.rows.map((row) => `<li>${escapeHtml(buildMetricLine(row))}</li>`).join('')}
                </ul>
              </div>
            `
          )
          .join('')}
      </div>
    </section>
  `
}

function renderWarnings(config: SeoMonthlyReportConfig) {
  if (!config.parserWarnings.length && !config.missingBlocks.length) {
    return ''
  }

  return `
    <section class="warning-card">
      <h2>Проверка данных</h2>
      ${
        config.missingBlocks.length
          ? `<p>Автоматически не заполнены блоки: ${escapeHtml(config.missingBlocks.join(', '))}.</p>`
          : ''
      }
      ${
        config.parserWarnings.length
          ? `<ul>${config.parserWarnings.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
          : ''
      }
    </section>
  `
}

function renderBlock(blockId: SeoReportBlockId, config: SeoMonthlyReportConfig) {
  switch (blockId) {
    case 'overview':
      return renderTextCard(config.textBlocks.overview.title, config.textBlocks.overview.content)
    case 'key_metrics':
      return renderComparisonTable({
        title: getBlockLabel('key_metrics'),
        rows: config.keyMetrics,
        emptyState: 'Ключевые показатели пока не распознаны. Загрузите выгрузки или проверьте исходники.',
      })
    case 'search_systems':
      return renderSearchSystems(config)
    case 'seo_highlights':
      return renderComparisonTable({
        title: getBlockLabel('seo_highlights'),
        rows: config.seoHighlightRows,
        emptyState: 'Дополнительные SEO-показатели пока не заполнены.',
        includeSource: true,
      })
    case 'analytical_conclusions':
      return renderTextCard(config.textBlocks.analyticalConclusions.title, config.textBlocks.analyticalConclusions.content)
    case 'final_summary':
      return renderTextCard(config.textBlocks.finalSummary.title, config.textBlocks.finalSummary.content)
    case 'recommendations':
      return renderTextCard(config.textBlocks.recommendations.title, config.textBlocks.recommendations.content)
  }
}

export function renderSeoMonthlyReportPreview(config: SeoMonthlyReportConfig) {
  const visibleBlocks = config.blockOrder.filter((item) => !config.hiddenBlocks.includes(item))

  return `
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(config.title)}</title>
        <style>
          :root {
            --ink: #172033;
            --muted: #546073;
            --line: #d9e3ef;
            --warm: #f08f49;
            --warm-soft: #fff5ee;
            --bg: #f5f8fc;
            --card: #ffffff;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background:
              radial-gradient(circle at top left, rgba(240, 143, 73, 0.10), transparent 20%),
              linear-gradient(180deg, #eef4fb 0%, #f7fbff 100%);
            color: var(--ink);
            font: 15px/1.65 "Avenir Next", "Trebuchet MS", "Segoe UI", sans-serif;
            padding: 28px 16px 40px;
          }
          .report-shell {
            max-width: 980px;
            margin: 0 auto;
          }
          .cover-card,
          .section-card,
          .warning-card {
            background: rgba(255,255,255,0.98);
            border: 1px solid var(--line);
            border-radius: 28px;
            box-shadow: 0 18px 54px rgba(15, 23, 42, 0.08);
          }
          .cover-card {
            padding: 30px 32px;
          }
          .brand-chip {
            display: inline-flex;
            align-items: center;
            padding: 8px 14px;
            border-radius: 999px;
            border: 1px solid rgba(240, 143, 73, 0.28);
            background: var(--warm-soft);
            color: #c26c2e;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          h1 {
            margin: 18px 0 8px;
            font-size: 38px;
            line-height: 1.08;
            letter-spacing: -0.04em;
          }
          .subtitle {
            margin: 0;
            color: var(--muted);
            font-size: 16px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-top: 22px;
          }
          .meta-card {
            padding: 16px 18px;
            border-radius: 20px;
            border: 1px solid var(--line);
            background: #f8fbff;
          }
          .meta-label {
            color: var(--muted);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .meta-value {
            margin-top: 8px;
            font-size: 17px;
            font-weight: 700;
          }
          .stack {
            display: grid;
            gap: 20px;
            margin-top: 22px;
          }
          .section-card,
          .warning-card {
            padding: 24px 28px;
          }
          .warning-card {
            background: linear-gradient(180deg, rgba(255, 248, 241, 0.96), rgba(255,255,255,0.98));
            border-color: rgba(240, 143, 73, 0.28);
          }
          h2 {
            margin: 0 0 16px;
            font-size: 26px;
            line-height: 1.15;
            letter-spacing: -0.03em;
          }
          h3 {
            margin: 0 0 10px;
            font-size: 19px;
            line-height: 1.2;
          }
          .rich-text p:first-child,
          .warning-card p:first-child {
            margin-top: 0;
          }
          .rich-text p:last-child,
          .warning-card p:last-child {
            margin-bottom: 0;
          }
          .rich-text p,
          .rich-text li,
          .warning-card p,
          .warning-card li {
            color: #334155;
            font-size: 16px;
          }
          .rich-text ul,
          .warning-card ul {
            margin: 0;
            padding-left: 22px;
          }
          .metric-table {
            width: 100%;
            border-collapse: collapse;
            overflow: hidden;
            border-radius: 22px;
          }
          .metric-table th,
          .metric-table td {
            padding: 14px 16px;
            border-bottom: 1px solid rgba(217, 227, 239, 0.95);
            text-align: left;
            vertical-align: top;
            font-size: 14px;
          }
          .metric-table thead th {
            background: #f7fafd;
            color: var(--muted);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .metric-name {
            font-weight: 700;
            color: var(--ink);
          }
          .metric-note {
            margin-top: 6px;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.5;
          }
          .tone-positive { color: #047857; font-weight: 700; }
          .tone-negative { color: #b91c1c; font-weight: 700; }
          .tone-neutral { color: var(--muted); font-weight: 700; }
          .system-stack {
            display: grid;
            gap: 14px;
          }
          .system-card {
            padding: 18px 20px;
            border-radius: 22px;
            border: 1px solid var(--line);
            background: #fbfdff;
          }
          .system-list {
            margin: 0;
            padding-left: 20px;
            color: #334155;
          }
          .system-list li + li {
            margin-top: 8px;
          }
          .empty-state {
            padding: 18px 20px;
            border-radius: 20px;
            background: #f8fafc;
            color: var(--muted);
          }
          @media (max-width: 860px) {
            .meta-grid {
              grid-template-columns: 1fr;
            }
            h1 {
              font-size: 31px;
            }
            .cover-card,
            .section-card,
            .warning-card {
              padding: 22px;
            }
            .metric-table {
              display: block;
              overflow-x: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-shell">
          <section class="cover-card">
            <div class="brand-chip">${escapeHtml(config.brandName)}</div>
            <h1>${escapeHtml(config.title)}</h1>
            <p class="subtitle">${escapeHtml(config.subtitle || formatComparisonLabel(config.comparePeriodStart, config.comparePeriodEnd, config.periodStart, config.periodEnd))}</p>
            <div class="meta-grid">
              <div class="meta-card">
                <div class="meta-label">Проект</div>
                <div class="meta-value">${escapeHtml(config.projectName)}</div>
              </div>
              <div class="meta-card">
                <div class="meta-label">Отчетный период</div>
                <div class="meta-value">${escapeHtml(formatPeriodLabel(config.periodStart, config.periodEnd))}</div>
              </div>
              <div class="meta-card">
                <div class="meta-label">Сравнение</div>
                <div class="meta-value">${escapeHtml(formatPeriodLabel(config.comparePeriodStart, config.comparePeriodEnd))}</div>
              </div>
            </div>
          </section>

          <div class="stack">
            ${renderWarnings(config)}
            ${visibleBlocks.map((blockId) => renderBlock(blockId, config)).join('')}
          </div>
        </div>
      </body>
    </html>
  `
}
