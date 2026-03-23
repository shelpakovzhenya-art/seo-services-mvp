'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Eye, FileSearch, Globe, Play, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ParserJob {
  id: string
  type: string
  status: string
  result?: string | null
  error: string | null
  config?: string | null
  createdAt: Date | string
  completedAt: Date | string | null
}

type ParsedConfig = {
  url?: string
  company?: string
  sampleSize?: number
  competitors?: string[]
}

function parseConfig(config: string | null | undefined): ParsedConfig {
  if (!config) {
    return {}
  }

  try {
    return JSON.parse(config) as ParsedConfig
  } catch {
    return {}
  }
}

function formatStoredResult(result: string) {
  try {
    return JSON.stringify(JSON.parse(result), null, 2)
  } catch {
    return result
  }
}

function normalizeCompetitorUrls(rawValue: string) {
  const unique = new Set<string>()

  rawValue
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      if (unique.size < 5) {
        unique.add(item)
      }
    })

  return Array.from(unique)
}

function getDomainLabel(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '')
  } catch {
    return rawUrl
  }
}

function getJobLabel(type: string) {
  if (type === 'seo_audit') {
    return 'SEO-аудит сайта'
  }

  if (type === 'sitemap') {
    return 'Парсер sitemap.xml'
  }

  return type
}

function formatDate(value: Date | string | null) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString('ru-RU')
}

export default function ParsersManager({ initialJobs }: { initialJobs: ParserJob[] }) {
  const router = useRouter()
  const [jobs, setJobs] = useState(initialJobs)
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [auditUrl, setAuditUrl] = useState('')
  const [auditCompany, setAuditCompany] = useState('')
  const [competitorUrlsText, setCompetitorUrlsText] = useState('')
  const [sampleSize, setSampleSize] = useState(0)
  const [isRunning, setIsRunning] = useState({ sitemap: false, audit: false })

  useEffect(() => {
    setJobs(initialJobs)
  }, [initialJobs])

  const hasRunningJobs = useMemo(() => jobs.some((job) => job.status === 'running'), [jobs])

  useEffect(() => {
    if (!hasRunningJobs) {
      return
    }

    const interval = window.setInterval(() => {
      router.refresh()
    }, 6000)

    return () => window.clearInterval(interval)
  }, [hasRunningJobs, router])

  const handleRunSitemapParser = async () => {
    if (!sitemapUrl.trim()) {
      alert('Введите URL sitemap.xml')
      return
    }

    setIsRunning((current) => ({ ...current, sitemap: true }))
    try {
      const response = await fetch('/api/admin/parsers/sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sitemapUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Ошибка при запуске парсера sitemap.xml')
        return
      }

      setSitemapUrl('')
      router.refresh()
      alert('Парсер sitemap.xml запущен')
    } catch (error) {
      console.error('Error running sitemap parser:', error)
      alert('Ошибка при запуске парсера sitemap.xml')
    } finally {
      setIsRunning((current) => ({ ...current, sitemap: false }))
    }
  }

  const handleRunSeoAudit = async () => {
    if (!auditUrl.trim()) {
      alert('Введите URL сайта для аудита')
      return
    }

    const competitors = normalizeCompetitorUrls(competitorUrlsText)

    setIsRunning((current) => ({ ...current, audit: true }))
    try {
      const response = await fetch('/api/admin/parsers/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: auditUrl,
          company: auditCompany,
          sampleSize,
          competitors,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Не удалось запустить SEO-аудит')
        return
      }

      setAuditUrl('')
      setAuditCompany('')
      setCompetitorUrlsText('')
      setSampleSize(0)
      router.refresh()
      alert('SEO-аудит запущен. Когда задача завершится, здесь появятся кнопки превью, PDF и DOCX.')
    } catch (error) {
      console.error('Error running SEO audit:', error)
      alert('Не удалось запустить SEO-аудит')
    } finally {
      setIsRunning((current) => ({ ...current, audit: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Парсер sitemap.xml</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Быстро вытаскивает URL из карты сайта и сохраняет результат в историю запусков.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">URL sitemap.xml</label>
              <input
                type="url"
                value={sitemapUrl}
                onChange={(event) => setSitemapUrl(event.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <Button onClick={handleRunSitemapParser} disabled={isRunning.sitemap} className="gap-2 rounded-full">
              <Play className="h-4 w-4" />
              {isRunning.sitemap ? 'Запуск...' : 'Запустить парсер'}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-orange-700">
              <FileSearch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">SEO-аудит в PDF</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Генерирует брендовый аудит Shelpakov Digital с полным обходом сайта, HTML-превью, готовым PDF и DOCX-версией.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">URL сайта</label>
              <input
                type="url"
                value={auditUrl}
                onChange={(event) => setAuditUrl(event.target.value)}
                placeholder="https://site.ru"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_140px]">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Название проекта</label>
                <input
                  type="text"
                  value={auditCompany}
                  onChange={(event) => setAuditCompany(event.target.value)}
                  placeholder="Если оставить пустым, возьмём из домена"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Лимит страниц</label>
                <input
                  type="number"
                  min={0}
                  max={5000}
                  value={sampleSize}
                  onChange={(event) => setSampleSize(Math.max(0, Number(event.target.value) || 0))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">URL конкурентов</label>
              <textarea
                value={competitorUrlsText}
                onChange={(event) => setCompetitorUrlsText(event.target.value)}
                placeholder={'https://competitor-1.ru\nhttps://competitor-2.ru\nhttps://competitor-3.ru'}
                className="min-h-[112px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                По одному URL на строку. Можно добавить до 5 конкурентов. В отчёте появится отдельный блок со сравнением,
                списком недостающих элементов, коротким ТЗ на внедрение и объяснением, что это даст сайту.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3 text-sm leading-6 text-slate-600">
              <div>0 = полный обход сайта по sitemap и внутренним ссылкам.</div>
              После запуска задача появится в истории ниже. Как только статус станет <strong>completed</strong>, появятся кнопки
              <strong> Превью</strong>, <strong>PDF</strong> и <strong>DOCX</strong>.
            </div>

            <Button onClick={handleRunSeoAudit} disabled={isRunning.audit} className="gap-2 rounded-full">
              <Sparkles className="h-4 w-4" />
              {isRunning.audit ? 'Собираем задачу...' : 'Запустить SEO-аудит'}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">История запусков</h2>
            <p className="mt-1 text-sm text-slate-500">
              Если задача ещё собирается, список обновится автоматически. Можно и вручную освежить данные.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.refresh()} className="gap-2 rounded-full">
            <RefreshCw className={`h-4 w-4 ${hasRunningJobs ? 'animate-spin' : ''}`} />
            Обновить список
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Инструмент</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Цель</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Действия</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Создано</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => {
                const config = parseConfig(job.config)
                const isAudit = job.type === 'seo_audit'

                return (
                  <tr key={job.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{getJobLabel(job.type)}</div>
                      {config.company ? <div className="mt-1 text-xs text-slate-500">{config.company}</div> : null}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {config.url ? (
                        <a href={config.url} target="_blank" rel="noreferrer" className="break-all text-cyan-700 hover:text-cyan-900">
                          {config.url}
                        </a>
                      ) : (
                        '—'
                      )}
                      {typeof config.sampleSize === 'number' ? (
                        <div className="mt-1 text-xs text-slate-500">
                          {config.sampleSize > 0 ? `Лимит: ${config.sampleSize} страниц` : 'Режим: полный обход сайта'}
                        </div>
                      ) : null}
                      {config.competitors?.length ? (
                        <div className="mt-1 text-xs text-slate-500">
                          Конкуренты: {config.competitors.map((item) => getDomainLabel(item)).join(', ')}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : job.status === 'running'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {job.status}
                      </span>
                      {job.error ? <div className="mt-2 max-w-md text-xs leading-5 text-rose-700">{job.error}</div> : null}
                    </td>
                    <td className="px-4 py-4">
                      {isAudit ? (
                        job.status === 'completed' ? (
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline" className="rounded-full">
                              <a href={`/api/admin/parsers/seo-audit/${job.id}/preview`} target="_blank" rel="noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                Превью
                              </a>
                            </Button>
                            <Button asChild size="sm" className="rounded-full">
                              <a href={`/api/admin/parsers/seo-audit/${job.id}/download`}>
                                <Download className="mr-2 h-4 w-4" />
                                PDF
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="outline" className="rounded-full">
                              <a href={`/api/admin/parsers/seo-audit/${job.id}/download?format=docx`}>
                                <Download className="mr-2 h-4 w-4" />
                                DOCX
                              </a>
                            </Button>
                          </div>
                        ) : job.status === 'running' ? (
                          <div className="text-sm text-slate-500">Собираем документ и превью…</div>
                        ) : (
                          <div className="text-sm text-slate-500">Файлы будут доступны после успешной сборки.</div>
                        )
                      ) : job.result ? (
                        <details>
                          <summary className="cursor-pointer text-sm font-medium text-cyan-700">Показать результат</summary>
                          <pre className="mt-3 max-h-48 overflow-auto rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
                            {formatStoredResult(job.result)}
                          </pre>
                        </details>
                      ) : (
                        <div className="text-sm text-slate-500">—</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      <div>{formatDate(job.createdAt)}</div>
                      {job.completedAt ? <div className="mt-1 text-xs text-slate-400">Готово: {formatDate(job.completedAt)}</div> : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
