'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderPlus, Plus, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeoProjectConfig } from '@/lib/seo-report-types'
import { buildMonthlyPeriods } from '@/lib/seo-report-utils'

export default function SeoMonthlyReportBuilder({ projects }: { projects: SeoProjectConfig[] }) {
  const router = useRouter()
  const defaultPeriods = buildMonthlyPeriods('previous_month')
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [projectName, setProjectName] = useState(projects[0]?.name || '')
  const [siteUrl, setSiteUrl] = useState(projects[0]?.siteUrl || '')
  const [periodPreset, setPeriodPreset] = useState<'current_month' | 'previous_month' | 'custom'>('previous_month')
  const [periodStart, setPeriodStart] = useState(defaultPeriods.periodStart)
  const [periodEnd, setPeriodEnd] = useState(defaultPeriods.periodEnd)
  const [comparePeriodStart, setComparePeriodStart] = useState(defaultPeriods.comparePeriodStart)
  const [comparePeriodEnd, setComparePeriodEnd] = useState(defaultPeriods.comparePeriodEnd)
  const [projectForm, setProjectForm] = useState({
    name: '',
    siteUrl: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingProject, setIsSavingProject] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((item) => item.id === projectId) || null,
    [projectId, projects]
  )

  const handleProjectChange = (nextProjectId: string) => {
    setProjectId(nextProjectId)
    const nextProject = projects.find((item) => item.id === nextProjectId)
    setProjectName(nextProject?.name || '')
    setSiteUrl(nextProject?.siteUrl || '')
  }

  const handlePresetChange = (value: 'current_month' | 'previous_month' | 'custom') => {
    setPeriodPreset(value)
    if (value !== 'custom') {
      const periods = buildMonthlyPeriods(value)
      setPeriodStart(periods.periodStart)
      setPeriodEnd(periods.periodEnd)
      setComparePeriodStart(periods.comparePeriodStart)
      setComparePeriodEnd(periods.comparePeriodEnd)
    }
  }

  const handleCreateReport = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/seo-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId || undefined,
          projectName: projectId ? undefined : projectName,
          siteUrl: projectId ? undefined : siteUrl,
          periodPreset,
          periodStart,
          periodEnd,
          comparePeriodStart,
          comparePeriodEnd,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        alert(payload.error || 'Не удалось создать черновик отчета.')
        return
      }

      router.push(`/admin/seo-analytics/reports/${payload.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating SEO report draft:', error)
      alert('Не удалось создать черновик отчета.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateProject = async () => {
    if (!projectForm.name.trim() || !projectForm.siteUrl.trim()) {
      alert('Заполните название проекта и URL сайта.')
      return
    }

    setIsSavingProject(true)

    try {
      const response = await fetch('/api/admin/seo-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      })

      const payload = await response.json()
      if (!response.ok) {
        alert(payload.error || 'Не удалось создать проект.')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Error creating SEO project:', error)
      alert('Не удалось создать проект.')
    } finally {
      setIsSavingProject(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">Новый месячный SEO-отчет</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Сначала выбираем проект и период, затем создаем черновик. После этого можно загрузить исходники, прогнать
          парсер и собрать экспорт в PDF или DOCX.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Параметры отчета</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Выберите проект или задайте данные вручную.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Проект</span>
              <select
                value={projectId}
                onChange={(event) => handleProjectChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="">Укажу вручную</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Название проекта</span>
                <input
                  value={projectId ? selectedProject?.name || '' : projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  disabled={Boolean(projectId)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">URL сайта</span>
                <input
                  type="url"
                  value={projectId ? selectedProject?.siteUrl || '' : siteUrl}
                  onChange={(event) => setSiteUrl(event.target.value)}
                  disabled={Boolean(projectId)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-50"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Период</span>
                <select
                  value={periodPreset}
                  onChange={(event) =>
                    handlePresetChange(event.target.value as 'current_month' | 'previous_month' | 'custom')
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="current_month">Текущий месяц</option>
                  <option value="previous_month">Предыдущий месяц</option>
                  <option value="custom">Задать вручную</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Период: от</span>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(event) => setPeriodStart(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Период: до</span>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(event) => setPeriodEnd(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Сравнение: от</span>
                <input
                  type="date"
                  value={comparePeriodStart}
                  onChange={(event) => setComparePeriodStart(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Сравнение: до</span>
                <input
                  type="date"
                  value={comparePeriodEnd}
                  onChange={(event) => setComparePeriodEnd(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>

            <Button onClick={handleCreateReport} disabled={isSubmitting} className="mt-2 gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'Создаем черновик...' : 'Создать черновик отчета'}
            </Button>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-orange-700">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Добавить проект</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Если сайта еще нет в списке, создайте карточку проекта прямо здесь.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Название</span>
              <input
                value={projectForm.name}
                onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">URL сайта</span>
              <input
                type="url"
                value={projectForm.siteUrl}
                onChange={(event) => setProjectForm((current) => ({ ...current, siteUrl: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Комментарий</span>
              <textarea
                value={projectForm.notes}
                onChange={(event) => setProjectForm((current) => ({ ...current, notes: event.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <Button onClick={handleCreateProject} disabled={isSavingProject} variant="outline" className="w-full rounded-full">
              {isSavingProject ? 'Сохраняем проект...' : 'Сохранить проект'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
