'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Edit3, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-gray-50 p-4">
      <p className="text-gray-400">{'\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0430...'}</p>
    </div>
  ),
})

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
  priceLabel: string | null
  hasOverride: boolean
}

const TEXT = {
  saveError: '\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0443\u0441\u043b\u0443\u0433\u0438',
  resetError: '\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0441\u0431\u0440\u043e\u0441\u0435 \u043f\u0440\u0430\u0432\u043e\u043a',
  resetConfirm:
    '\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u0440\u0430\u0432\u043a\u0438 \u0438 \u0432\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u0431\u0430\u0437\u043e\u0432\u043e\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b?',
  intro:
    '\u042d\u0442\u043e\u0442 \u0440\u0430\u0437\u0434\u0435\u043b \u0442\u0435\u043f\u0435\u0440\u044c \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0443\u0441\u043b\u0443\u0433, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0435\u0441\u0442\u044c \u043d\u0430 \u0441\u0430\u0439\u0442\u0435. \u041f\u0440\u0430\u0432\u043a\u0438 \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043a\u0430, SEO-\u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044f \u0438 HTML-\u0431\u043b\u043e\u043a\u0430 \u0441\u0440\u0430\u0437\u0443 \u0443\u0445\u043e\u0434\u044f\u0442 \u043d\u0430 \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b.',
  service: '\u0423\u0441\u043b\u0443\u0433\u0430',
  price: '\u0426\u0435\u043d\u0430',
  edits: '\u041f\u0440\u0430\u0432\u043a\u0438',
  actions: '\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044f',
  yes: '\u0415\u0441\u0442\u044c',
  no: '\u041d\u0435\u0442',
  editService: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',
  sortOrder: '\u041f\u043e\u0440\u044f\u0434\u043e\u043a \u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0438',
  htmlBlock: 'HTML-\u0431\u043b\u043e\u043a \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435',
  htmlPlaceholder:
    '\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 HTML-\u043a\u043e\u043d\u0442\u0435\u043d\u0442 \u0438\u043b\u0438 \u0441\u043e\u0431\u0435\u0440\u0438\u0442\u0435 \u0435\u0433\u043e \u0432\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u043e \u0432 \u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0435...',
  saving: '\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435...',
  save: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c',
  cancel: '\u041e\u0442\u043c\u0435\u043d\u0430',
  dash: '\u2014',
} as const

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
        body: JSON.stringify(service),
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
                    <div className="flex gap-2">
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

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {TEXT.editService}: {service.name}
      </h2>

      <div className="space-y-4">
        <Field label="Slug">
          <input value={formData.serviceSlug} readOnly className="admin-input bg-slate-50 text-slate-500" />
        </Field>

        <Field label="SEO title">
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="admin-input"
          />
        </Field>

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

        <Field label="H1">
          <input
            value={formData.h1}
            onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
            className="admin-input"
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
