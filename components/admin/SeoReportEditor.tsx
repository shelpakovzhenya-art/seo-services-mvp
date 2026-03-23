'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileUp,
  Globe2,
  Plus,
  Save,
  ScanSearch,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Button } from '@/components/ui/button'
import {
  createSourceDataUrl,
  getSourceKindLabel,
  type SeoMonthlyReportConfig,
  type SeoProjectConfig,
  type SeoReportBlockId,
  type SeoReportSourceKind,
  type SeoReportTableRow,
} from '@/lib/seo-report-types'
import { formatFileSize, formatRangeLabel, getBlockLabel } from '@/lib/seo-report-utils'

type ReportEditorProps = {
  reportId: string
  initialStatus: string
  initialConfig: SeoMonthlyReportConfig
  projects: SeoProjectConfig[]
}

function createEmptyRow(sourceLabel: string): SeoReportTableRow {
  return {
    id: `manual-row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    key: 'unknown',
    label: 'Новая метрика',
    sourceLabel,
    unit: 'number',
    previousRaw: '—',
    currentRaw: '—',
    changeRaw: '—',
    changeTone: 'neutral',
    requiresReview: true,
  }
}

function getTabLabel(tab: 'parser' | 'report') {
  return tab === 'parser' ? 'Парсер и исходники' : 'Редактор и превью'
}

function TableEditor({
  title,
  rows,
  onChange,
  defaultSourceLabel,
}: {
  title: string
  rows: SeoReportTableRow[]
  onChange: (rows: SeoReportTableRow[]) => void
  defaultSourceLabel: string
}) {
  const updateRow = (rowId: string, key: keyof SeoReportTableRow, value: string | boolean) => {
    onChange(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [key]: value,
            }
          : row
      )
    )
  }

  const removeRow = (rowId: string) => {
    onChange(rows.filter((row) => row.id !== rowId))
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => onChange([...rows, createEmptyRow(defaultSourceLabel)])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить строку
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {rows.length ? (
          rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.9fr_auto]">
                <input
                  value={row.label}
                  onChange={(event) => updateRow(row.id, 'label', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  value={row.sourceLabel}
                  onChange={(event) => updateRow(row.id, 'sourceLabel', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  value={row.previousRaw}
                  onChange={(event) => updateRow(row.id, 'previousRaw', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  value={row.currentRaw}
                  onChange={(event) => updateRow(row.id, 'currentRaw', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <input
                  value={row.changeRaw}
                  onChange={(event) => updateRow(row.id, 'changeRaw', event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full text-rose-700 hover:border-rose-200 hover:text-rose-800"
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <input
                value={row.notes || ''}
                onChange={(event) => updateRow(row.id, 'notes', event.target.value)}
                placeholder="Комментарий к строке"
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
            Таблица пока пустая.
          </div>
        )}
      </div>
    </div>
  )
}

export default function SeoReportEditor({
  reportId,
  initialStatus,
  initialConfig,
  projects,
}: ReportEditorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [config, setConfig] = useState(initialConfig)
  const [status, setStatus] = useState(initialStatus)
  const [activeTab, setActiveTab] = useState<'parser' | 'report'>(
    searchParams.get('tab') === 'parser' ? 'parser' : 'report'
  )
  const [uploadSourceKind, setUploadSourceKind] = useState<SeoReportSourceKind>('yandex_metrica')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    setConfig(initialConfig)
    setStatus(initialStatus)
  }, [initialConfig, initialStatus])

  useEffect(() => {
    if (initialStatus !== 'running') {
      return
    }

    const interval = window.setInterval(() => {
      router.refresh()
    }, 6000)

    return () => window.clearInterval(interval)
  }, [initialStatus, router])

  const selectedProject = useMemo(
    () => projects.find((item) => item.id === config.projectId) || null,
    [config.projectId, projects]
  )

  const persistConfig = async (nextConfig: SeoMonthlyReportConfig, nextStatus = 'draft', keepResult = false) => {
    const response = await fetch(`/api/admin/seo-reports/${reportId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: nextStatus,
        keepResult,
        config: nextConfig,
      }),
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload.error || 'Не удалось сохранить отчет.')
    }

    setConfig(payload.config)
    setStatus(nextStatus)
    return payload.config as SeoMonthlyReportConfig
  }

  const handleSave = async (nextStatus = 'draft', keepResult = false) => {
    setSaving(true)
    try {
      await persistConfig(
        {
          ...config,
          updatedAt: new Date().toISOString(),
        },
        nextStatus,
        keepResult
      )
      router.refresh()
    } catch (error) {
      console.error('Error saving SEO report:', error)
      alert(error instanceof Error ? error.message : 'Не удалось сохранить отчет.')
    } finally {
      setSaving(false)
    }
  }

  const handleParse = async () => {
    setParsing(true)
    try {
      await persistConfig({ ...config, updatedAt: new Date().toISOString() }, 'draft', false)
      const response = await fetch(`/api/admin/seo-reports/${reportId}/parse`, { method: 'POST' })
      const payload = await response.json()

      if (!response.ok) {
        alert(payload.error || 'Не удалось запустить парсер.')
        return
      }

      setConfig(payload.config)
      setStatus('draft')
      setActiveTab('parser')
      router.refresh()
    } catch (error) {
      console.error('Error parsing SEO report:', error)
      alert('Не удалось запустить парсер.')
    } finally {
      setParsing(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await persistConfig({ ...config, updatedAt: new Date().toISOString() }, 'draft', false)
      const response = await fetch(`/api/admin/seo-reports/${reportId}/generate`, { method: 'POST' })
      const payload = await response.json()

      if (!response.ok) {
        alert(payload.error || 'Не удалось собрать отчет.')
        return
      }

      setStatus('running')
      router.refresh()
    } catch (error) {
      console.error('Error generating SEO report:', error)
      alert('Не удалось собрать отчет.')
    } finally {
      setGenerating(false)
    }
  }

  const handleUploadSources = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) {
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('sourceKind', uploadSourceKind)
      files.forEach((file) => formData.append('files', file))

      const response = await fetch(`/api/admin/seo-reports/${reportId}/sources`, {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()
      if (!response.ok) {
        alert(payload.error || 'Не удалось загрузить файлы.')
        return
      }

      setConfig(payload.config)
      setStatus('draft')
      router.refresh()
    } catch (error) {
      console.error('Error uploading sources:', error)
      alert('Не удалось загрузить файлы.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeSource = (sourceId: string) => {
    setConfig((current) => ({
      ...current,
      sources: current.sources.filter((source) => source.id !== sourceId),
    }))
  }

  const moveBlock = (blockId: SeoReportBlockId, direction: 'up' | 'down') => {
    setConfig((current) => {
      const nextOrder = [...current.blockOrder]
      const index = nextOrder.indexOf(blockId)
      if (index === -1) {
        return current
      }

      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= nextOrder.length) {
        return current
      }

      ;[nextOrder[index], nextOrder[swapIndex]] = [nextOrder[swapIndex], nextOrder[index]]
      return {
        ...current,
        blockOrder: nextOrder,
      }
    })
  }

  const toggleBlockVisibility = (blockId: SeoReportBlockId) => {
    setConfig((current) => ({
      ...current,
      hiddenBlocks: current.hiddenBlocks.includes(blockId)
        ? current.hiddenBlocks.filter((item) => item !== blockId)
        : [...current.hiddenBlocks, blockId],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-950">{config.projectName}</h1>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{config.siteUrl}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <div>Отчет: {formatRangeLabel(config.periodStart, config.periodEnd)}</div>
              <div>Сравнение: {formatRangeLabel(config.comparePeriodStart, config.comparePeriodEnd)}</div>
              <div>Источников: {config.sources.length}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => handleSave('draft', false)} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => handleSave('published', true)} disabled={saving}>
              Опубликовать
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.open(`/api/admin/seo-reports/${reportId}/preview`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" />
              Превью
            </Button>
            <Button variant="outline" className="rounded-full" onClick={handleParse} disabled={parsing}>
              <ScanSearch className="mr-2 h-4 w-4" />
              {parsing ? 'Парсим...' : 'Запустить парсер'}
            </Button>
            <Button className="rounded-full" onClick={handleGenerate} disabled={generating || status === 'running'}>
              <Sparkles className="mr-2 h-4 w-4" />
              {generating || status === 'running' ? 'Собираем...' : 'Сформировать отчет'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['parser', 'report'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {getTabLabel(tab)}
          </button>
        ))}
      </div>

      {activeTab === 'parser' ? (
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Загрузка исходников</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Загруженные файлы будут привязаны к этому отчету. После загрузки можно сразу прогонять парсер.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={uploadSourceKind}
                  onChange={(event) => setUploadSourceKind(event.target.value as SeoReportSourceKind)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="yandex_metrica">Яндекс.Метрика</option>
                  <option value="topvisor">Топвизор</option>
                  <option value="google_search_console">Google Search Console</option>
                  <option value="ga4">Google Analytics / GA4</option>
                  <option value="excel">Excel / Google Sheets</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="csv">CSV</option>
                  <option value="screenshot">Скриншот</option>
                  <option value="other">Прочее</option>
                </select>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-200 hover:text-slate-950">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Загружаем...' : 'Добавить файлы'}
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleUploadSources}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="grid gap-5">
            {config.sources.length ? (
              config.sources.map((source) => {
                const imagePreview = source.mimeType.startsWith('image/') ? createSourceDataUrl(source) : null

                return (
                  <article key={source.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-950">{source.name}</h3>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {getSourceKindLabel(source.sourceKind)}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {formatFileSize(source.size)}
                          </span>
                        </div>

                        {imagePreview ? (
                          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <img src={imagePreview} alt={source.name} className="max-h-64 rounded-xl object-contain" />
                          </div>
                        ) : null}

                        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm font-semibold text-slate-950">Распознанный текст</div>
                            <div className="mt-2 max-h-48 overflow-auto text-sm leading-6 text-slate-600">
                              {source.extractedText ? source.extractedText.slice(0, 2400) : 'Текст еще не извлечен.'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm font-semibold text-slate-950">Найденные метрики</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {source.recognizedMetrics.length ? (
                                source.recognizedMetrics.map((metric) => (
                                  <span
                                    key={metric.id}
                                    className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800"
                                  >
                                    {metric.label}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-500">Метрики пока не распознаны.</span>
                              )}
                            </div>

                            {source.warnings.length ? (
                              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                                {source.warnings.join(' ')}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full text-rose-700 hover:border-rose-200 hover:text-rose-800"
                        onClick={() => removeSource(source.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Убрать
                      </Button>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-sm leading-6 text-slate-500">
                Пока нет ни одного загруженного файла.
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Заголовок отчета</span>
                <input
                  value={config.title}
                  onChange={(event) => setConfig((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Подзаголовок</span>
                <input
                  value={config.subtitle}
                  onChange={(event) => setConfig((current) => ({ ...current, subtitle: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Проект</span>
                <input
                  value={config.projectName}
                  onChange={(event) => setConfig((current) => ({ ...current, projectName: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">URL сайта</span>
                <input
                  value={config.siteUrl}
                  onChange={(event) => setConfig((current) => ({ ...current, siteUrl: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Globe2 className="h-4 w-4 text-cyan-700" />
                Порядок и видимость секций
              </div>
              <div className="mt-4 grid gap-3">
                {config.blockOrder.map((blockId, index) => {
                  const hidden = config.hiddenBlocks.includes(blockId)
                  return (
                    <div key={blockId} className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="min-w-[180px] flex-1 text-sm font-medium text-slate-900">{getBlockLabel(blockId)}</div>
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => moveBlock(blockId, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => moveBlock(blockId, 'down')}
                        disabled={index === config.blockOrder.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => toggleBlockVisibility(blockId)}>
                        {hidden ? 'Показать' : 'Скрыть'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{config.textBlocks.overview.title}</h2>
              <div className="mt-4">
                <RichTextEditor
                  content={config.textBlocks.overview.content}
                  onChange={(content) =>
                    setConfig((current) => ({
                      ...current,
                      textBlocks: {
                        ...current.textBlocks,
                        overview: {
                          ...current.textBlocks.overview,
                          content,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <TableEditor
              title={getBlockLabel('key_metrics')}
              rows={config.keyMetrics}
              defaultSourceLabel="Общий итог"
              onChange={(rows) => setConfig((current) => ({ ...current, keyMetrics: rows }))}
            />

            <TableEditor
              title={getBlockLabel('search_systems')}
              rows={config.searchSystemRows}
              defaultSourceLabel="Google"
              onChange={(rows) => setConfig((current) => ({ ...current, searchSystemRows: rows }))}
            />

            <TableEditor
              title={getBlockLabel('seo_highlights')}
              rows={config.seoHighlightRows}
              defaultSourceLabel="SEO-блок"
              onChange={(rows) => setConfig((current) => ({ ...current, seoHighlightRows: rows }))}
            />

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{config.textBlocks.analyticalConclusions.title}</h2>
              <div className="mt-4">
                <RichTextEditor
                  content={config.textBlocks.analyticalConclusions.content}
                  onChange={(content) =>
                    setConfig((current) => ({
                      ...current,
                      textBlocks: {
                        ...current.textBlocks,
                        analyticalConclusions: {
                          ...current.textBlocks.analyticalConclusions,
                          content,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{config.textBlocks.finalSummary.title}</h2>
              <div className="mt-4">
                <RichTextEditor
                  content={config.textBlocks.finalSummary.content}
                  onChange={(content) =>
                    setConfig((current) => ({
                      ...current,
                      textBlocks: {
                        ...current.textBlocks,
                        finalSummary: {
                          ...current.textBlocks.finalSummary,
                          content,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{config.textBlocks.recommendations.title}</h2>
              <div className="mt-4">
                <RichTextEditor
                  content={config.textBlocks.recommendations.content}
                  onChange={(content) =>
                    setConfig((current) => ({
                      ...current,
                      textBlocks: {
                        ...current.textBlocks,
                        recommendations: {
                          ...current.textBlocks.recommendations,
                          content,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Визуальный предпросмотр</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ниже открывается HTML-превью того отчета, который сейчас хранится в системе.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-full">
                  <a href={`/api/admin/seo-reports/${reportId}/preview`} target="_blank" rel="noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Открыть отдельно
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href={`/api/admin/seo-reports/${reportId}/download`}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href={`/api/admin/seo-reports/${reportId}/download?format=docx`}>
                    <Download className="mr-2 h-4 w-4" />
                    DOCX
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
              <iframe
                title="Предпросмотр SEO-отчета"
                src={`/api/admin/seo-reports/${reportId}/preview`}
                className="h-[900px] w-full bg-white"
              />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
