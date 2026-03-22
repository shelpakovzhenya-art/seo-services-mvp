'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Edit3, RotateCcw } from 'lucide-react'
import { formatServicePriceLabel } from '@/lib/service-pricing'
import { Button } from '@/components/ui/button'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-gray-50 p-4">
      <p className="text-gray-400">Загрузка редактора...</p>
    </div>
  ),
})

type PriceUnit = 'project' | 'month'

interface ServicePageItem {
  id: string | null
  serviceSlug: string
  name: string
  title: string
  description: string
  h1: string
  keywords: string
  content: string
  order: number
  pricingName: string
  pricingShortDescription: string
  priceFrom: number
  priceUnit: PriceUnit
  priceLabel: string | null
  calculatorHint: string
  deliverablesText: string
  hasOverride: boolean
}

const TEXT = {
  saveError: 'Ошибка при сохранении страницы услуги',
  resetError: 'Ошибка при сбросе правок',
  resetConfirm: 'Сбросить правки и вернуться к базовой версии страницы?',
  intro:
    'В этом разделе теперь редактируются и тексты страницы услуги, и коммерческий блок: цена, подпись, подсказка для калькулятора и состав работ. После сохранения изменения уходят на публичные страницы и в калькулятор.',
  service: 'Услуга',
  price: 'Цена',
  edits: 'Правки',
  actions: 'Действия',
  yes: 'Есть',
  no: 'Нет',
  editService: 'Редактировать услугу',
  sortOrder: 'Порядок сортировки',
  htmlBlock: 'HTML-блок на странице',
  htmlPlaceholder: 'Добавьте HTML-контент или соберите его визуально в редакторе...',
  pricingBlock: 'Коммерческий блок',
  pricingName: 'Название услуги в калькуляторе',
  pricingDescription: 'Короткое описание для калькулятора',
  priceFrom: 'Цена от, ₽',
  priceUnit: 'Тип тарифа',
  priceLabel: 'Подпись цены',
  calculatorHint: 'Подсказка под ценой',
  deliverables: 'Что входит в услугу',
  deliverablesHint: 'По одному пункту на строку',
  month: 'В месяц',
  project: 'За проект',
  saving: 'Сохранение...',
  save: 'Сохранить',
  cancel: 'Отмена',
  dash: '—',
} as const

function splitDeliverables(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function ServicesManager({ initialServices }: { initialServices: ServicePageItem[] }) {
  const [services] = useState(initialServices)
  const [editing, setEditing] = useState<ServicePageItem | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async (service: ServicePageItem) => {
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/service-pages/${service.serviceSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...service,
          deliverables: splitDeliverables(service.deliverablesText),
        }),
      })

      if (response.ok) {
        setEditing(null)
        window.location.reload()
        return
      }

      const error = await response.json()
      alert(error.error || TEXT.saveError)
    } catch (error) {
      console.error('Error saving service page:', error)
      alert(TEXT.saveError)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async (serviceSlug: string) => {
    if (!confirm(TEXT.resetConfirm)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/service-pages/${serviceSlug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        if (editing?.serviceSlug === serviceSlug) {
          setEditing(null)
        }
        window.location.reload()
        return
      }

      const error = await response.json()
      alert(error.error || TEXT.resetError)
    } catch (error) {
      console.error('Error resetting service page:', error)
      alert(TEXT.resetError)
    }
  }

  return (
    <div>
      <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">{TEXT.intro}</div>

      {editing ? (
        <ServicePageForm
          key={editing.serviceSlug}
          service={editing}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">{TEXT.service}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">URL</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">SEO title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">{TEXT.price}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">{TEXT.edits}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">{TEXT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {services.map((service) => (
                <tr key={service.serviceSlug}>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{service.h1}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">/services/{service.serviceSlug}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{service.title}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{service.priceLabel || TEXT.dash}</td>
                  <td className="px-4 py-4">
                    <span className={service.hasOverride ? 'text-emerald-600' : 'text-slate-400'}>
                      {service.hasOverride ? TEXT.yes : TEXT.no}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative z-10 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(service)}
                        className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(service.serviceSlug)}
                        disabled={!service.hasOverride}
                        className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-300"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ServicePageForm({
  service,
  saving,
  onSave,
  onCancel,
}: {
  service: ServicePageItem
  saving: boolean
  onSave: (service: ServicePageItem) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(service)

  const updatePriceLabel = (priceFrom: number, priceUnit: PriceUnit) => {
    setFormData((current) => ({
      ...current,
      priceFrom,
      priceUnit,
      priceLabel: formatServicePriceLabel(priceFrom, priceUnit),
    }))
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {TEXT.editService}: {service.name}
      </h2>

      <div className="space-y-6">
        <Field label="Slug">
          <input value={formData.serviceSlug} readOnly className="admin-input bg-slate-50 text-slate-500" />
        </Field>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="SEO title">
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="admin-input"
            />
          </Field>

          <Field label="H1">
            <input
              value={formData.h1}
              onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
              className="admin-input"
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="admin-input min-h-[96px]"
            rows={4}
          />
        </Field>

        <Field label="Keywords">
          <textarea
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="admin-input min-h-[96px]"
            rows={4}
          />
        </Field>

        <Field label={TEXT.sortOrder}>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
            className="admin-input max-w-[140px]"
          />
        </Field>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="text-sm font-semibold text-slate-900">{TEXT.pricingBlock}</div>
          <div className="mt-4 space-y-4">
            <Field label={TEXT.pricingName}>
              <input
                value={formData.pricingName}
                onChange={(e) => setFormData({ ...formData, pricingName: e.target.value })}
                className="admin-input"
              />
            </Field>

            <Field label={TEXT.pricingDescription}>
              <textarea
                value={formData.pricingShortDescription}
                onChange={(e) => setFormData({ ...formData, pricingShortDescription: e.target.value })}
                className="admin-input min-h-[96px]"
                rows={4}
              />
            </Field>

            <div className="grid gap-4 lg:grid-cols-[180px_220px_1fr]">
              <Field label={TEXT.priceFrom}>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={formData.priceFrom}
                  onChange={(e) => updatePriceLabel(parseInt(e.target.value, 10) || 0, formData.priceUnit)}
                  className="admin-input"
                />
              </Field>

              <Field label={TEXT.priceUnit}>
                <select
                  value={formData.priceUnit}
                  onChange={(e) => updatePriceLabel(formData.priceFrom, e.target.value as PriceUnit)}
                  className="admin-input"
                >
                  <option value="month">{TEXT.month}</option>
                  <option value="project">{TEXT.project}</option>
                </select>
              </Field>

              <Field label={TEXT.priceLabel}>
                <input
                  value={formData.priceLabel || ''}
                  onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                  className="admin-input"
                />
              </Field>
            </div>

            <Field label={TEXT.calculatorHint}>
              <textarea
                value={formData.calculatorHint}
                onChange={(e) => setFormData({ ...formData, calculatorHint: e.target.value })}
                className="admin-input min-h-[96px]"
                rows={4}
              />
            </Field>

            <Field label={`${TEXT.deliverables} (${TEXT.deliverablesHint})`}>
              <textarea
                value={formData.deliverablesText}
                onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
                className="admin-input min-h-[132px]"
                rows={6}
              />
            </Field>
          </div>
        </div>

        <Field label={TEXT.htmlBlock}>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder={TEXT.htmlPlaceholder}
          />
        </Field>

        <div className="flex gap-2">
          <Button onClick={() => onSave({ ...formData, hasOverride: true })} disabled={saving}>
            {saving ? TEXT.saving : TEXT.save}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            {TEXT.cancel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  )
}
