'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Eye, FilePlus2, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeoProjectConfig, SeoReportJobStatus } from '@/lib/seo-report-types'
import { formatRangeLabel, formatReportDateTime } from '@/lib/seo-report-utils'

type ReportItem = {
  id: string
  status: SeoReportJobStatus | string
  createdAt: string | Date
  updatedAt: string | Date
  completedAt?: string | Date | null
  configData: {
    projectName: string
    siteUrl: string
    periodStart: string
    periodEnd: string
    lastParsedAt?: string
    sources: Array<{ id: string }>
    parserWarnings: string[]
    missingBlocks: string[]
  }
  resultData?: {
    generatedAt: string
  } | null
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'draft':
      return 'Черновик'
    case 'running':
      return 'Сборка'
    case 'completed':
      return 'Готов'
    case 'published':
      return 'Опубликован'
    case 'failed':
      return 'Ошибка'
    default:
      return status
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-700'
    case 'running':
      return 'bg-amber-100 text-amber-800'
    case 'completed':
      return 'bg-emerald-100 text-emerald-800'
    case 'published':
      return 'bg-cyan-100 text-cyan-800'
    case 'failed':
      return 'bg-rose-100 text-rose-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function SeoReportsManager({
  reports,
  projects,
}: {
  reports: ReportItem[]
  projects: SeoProjectConfig[]
}) {
  const router = useRouter()
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesProject = projectFilter === 'all' || report.configData.projectName === projectFilter
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      const haystack = `${report.configData.projectName} ${report.configData.siteUrl}`.toLowerCase()
      const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase())

      return matchesProject && matchesStatus && matchesSearch
    })
  }, [projectFilter, reports, search, statusFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот отчет?')) {
      return
    }

    const response = await fetch(`/api/admin/seo-reports/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Не удалось удалить отчет.' }))
      alert(error.error || 'Не удалось удалить отчет.')
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">SEO-отчеты</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Здесь хранятся черновики, готовые месячные отчеты и экспортированные версии по проектам.
            </p>
          </div>

          <Button asChild className="gap-2 rounded-full">
            <Link href="/admin/seo-analytics/monthly-report">
              <FilePlus2 className="h-4 w-4" />
              Новый отчет
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Поиск</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Проект или домен"
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Проект</span>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="all">Все проекты</option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Статус</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="all">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="running">Сборка</option>
              <option value="completed">Готов</option>
              <option value="published">Опубликован</option>
              <option value="failed">Ошибка</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-5">
        {filteredReports.length ? (
          filteredReports.map((report) => (
            <article key={report.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-950">{report.configData.projectName}</h2>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{report.configData.siteUrl}</p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                    <div>Период: {formatRangeLabel(report.configData.periodStart, report.configData.periodEnd)}</div>
                    <div>Исходники: {report.configData.sources.length}</div>
                    <div>Предупреждения: {report.configData.parserWarnings.length}</div>
                    <div>Не заполнено: {report.configData.missingBlocks.length}</div>
                  </div>
                  <div className="mt-3 text-xs text-slate-400">
                    Создан: {formatReportDateTime(report.createdAt)} · Обновлен: {formatReportDateTime(report.updatedAt)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/admin/seo-analytics/reports/${report.id}`}>Открыть</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={`/api/admin/seo-reports/${report.id}/preview`} target="_blank" rel="noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      Превью
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full" disabled={!report.resultData}>
                    <a href={`/api/admin/seo-reports/${report.id}/download`}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full" disabled={!report.resultData}>
                    <a href={`/api/admin/seo-reports/${report.id}/download?format=docx`}>
                      <Download className="mr-2 h-4 w-4" />
                      DOCX
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full text-rose-700 hover:border-rose-200 hover:text-rose-800"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-sm leading-6 text-slate-500">
            Отчеты по текущим фильтрам не найдены.
          </div>
        )}
      </div>
    </div>
  )
}
