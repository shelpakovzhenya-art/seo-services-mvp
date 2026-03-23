'use client'

import Link from 'next/link'
import { AlertTriangle, FileSearch, FolderInput, ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRangeLabel, formatReportDateTime } from '@/lib/seo-report-utils'

type ReportItem = {
  id: string
  status: string
  configData: {
    projectName: string
    periodStart: string
    periodEnd: string
    lastParsedAt?: string
    sources: Array<{ id: string; name: string; warnings: string[]; recognizedMetrics: Array<{ id: string }> }>
    parserWarnings: string[]
    missingBlocks: string[]
  }
}

export default function SeoReportParserIndex({ reports }: { reports: ReportItem[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">Парсер отчетов</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Отдельный экран для проверки исходников, качества распознавания и ручной корректировки перед сборкой
          месячного SEO-отчета.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
            <FolderInput className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">Загрузка исходников</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Поддерживаются PNG, JPG, PDF, DOCX, XLSX и CSV. Каждый файл привязывается к конкретному отчету.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-2xl border border-orange-100 bg-orange-50 p-3 text-orange-700">
            <ScanSearch className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">Распознавание метрик</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Парсер извлекает текст из документов и скриншотов, ищет месяцы сравнения и собирает таблицы показателей.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex rounded-2xl border border-rose-100 bg-rose-50 p-3 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-950">Контроль ошибок</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Если часть данных не распознана или значения конфликтуют, отчет остается в черновике и помечается для
            проверки.
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        {reports.length ? (
          reports.map((report) => {
            const recognizedCount = report.configData.sources.reduce(
              (total, source) => total + source.recognizedMetrics.length,
              0
            )
            const sourceWarnings = report.configData.sources.reduce((total, source) => total + source.warnings.length, 0)

            return (
              <article key={report.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <FileSearch className="h-5 w-5 text-cyan-700" />
                      <h2 className="text-2xl font-semibold text-slate-950">{report.configData.projectName}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Период: {formatRangeLabel(report.configData.periodStart, report.configData.periodEnd)}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <div>Файлов: {report.configData.sources.length}</div>
                      <div>Распознано метрик: {recognizedCount}</div>
                      <div>Предупреждений по файлам: {sourceWarnings}</div>
                      <div>Проблемных блоков: {report.configData.missingBlocks.length}</div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      Последний парсинг: {formatReportDateTime(report.configData.lastParsedAt || null)}
                    </div>
                  </div>

                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/admin/seo-analytics/reports/${report.id}?tab=parser`}>Открыть парсер</Link>
                  </Button>
                </div>

                {report.configData.parserWarnings.length ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-900">
                    {report.configData.parserWarnings.join(' ')}
                  </div>
                ) : null}
              </article>
            )
          })
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-sm leading-6 text-slate-500">
            Пока нет ни одного отчета с исходниками для парсинга.
          </div>
        )}
      </div>
    </div>
  )
}
