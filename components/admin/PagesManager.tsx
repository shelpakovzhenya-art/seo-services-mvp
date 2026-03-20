'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-slate-500">Загрузка редактора...</p>
    </div>
  ),
})

interface Page {
  id: string
  slug: string
  title: string
  description: string | null
  keywords?: string | null
  h1: string | null
  content: string | null
  parentId: string | null
  order: number
  children?: Page[]
}

export default function PagesManager({ initialPages }: { initialPages: Page[] }) {
  const [pages] = useState(initialPages)
  const [editing, setEditing] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const buildTree = (items: Page[]): Page[] => {
    const map = new Map<string, Page>()
    const roots: Page[] = []

    items.forEach((item) => {
      map.set(item.id, { ...item, children: [] })
    })

    items.forEach((item) => {
      const node = map.get(item.id)!
      if (item.parentId && map.has(item.parentId)) {
        const parent = map.get(item.parentId)!
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots.sort((a, b) => a.order - b.order)
  }

  const treePages = buildTree(pages)

  const handleSave = async (page: Partial<Page>) => {
    try {
      const isNew = !page.id || !editing?.id
      const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          parentId: page.parentId || null,
        }),
      })

      if (response.ok) {
        setEditing(null)
        setIsCreating(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Ошибка при сохранении страницы')
    }
  }

  const renderPageItem = (page: Page, level = 0): JSX.Element => (
    <>
      <tr key={page.id} className={level > 0 ? 'bg-slate-50/80' : 'bg-white'}>
        <td className="px-4 py-4 text-slate-700">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
            {level > 0 && <span className="text-slate-400">→</span>}
            <span className="font-medium">{page.slug}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-slate-900">{page.title}</td>
        <td className="px-4 py-4 text-slate-700">{page.h1 || '—'}</td>
        <td className="px-4 py-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false)
                setEditing(page)
              }}
              className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(null)
                setIsCreating(true)
                setEditing({
                  id: '',
                  slug: `${page.slug}-subsection`,
                  title: '',
                  description: '',
                  keywords: '',
                  h1: '',
                  content: '',
                  parentId: page.id,
                  order: 0,
                })
              }}
              className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      {page.children?.map((child) => renderPageItem(child, level + 1))}
    </>
  )

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Страницы сайта</h2>
          <p className="mt-1 text-sm text-slate-500">
            Редактируйте SEO, заголовки и содержимое без хаоса.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setIsCreating(true)
            setEditing({
              id: '',
              slug: '',
              title: '',
              description: '',
              keywords: '',
              h1: '',
              content: '',
              parentId: null,
              order: 0,
            })
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить раздел
        </Button>
      </div>

      {(editing || isCreating) && (
        <PageForm
          page={editing!}
          allPages={pages}
          onSave={handleSave}
          onCancel={() => {
            setEditing(null)
            setIsCreating(false)
          }}
        />
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">H1</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">{treePages.map((page) => renderPageItem(page))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PageForm({
  page,
  allPages,
  onSave,
  onCancel,
}: {
  page: Page
  allPages: Page[]
  onSave: (page: Partial<Page>) => void
  onCancel: () => void
}) {
  const isNew = !page.id
  const [formData, setFormData] = useState({
    slug: page.slug || '',
    title: page.title || '',
    description: page.description || '',
    keywords: page.keywords || '',
    h1: page.h1 || '',
    content: page.content || '',
    parentId: page.parentId || null,
    order: page.order || 0,
  })

  const getParentOptions = (): Page[] => {
    if (isNew) return allPages.filter((p) => !p.parentId)
    return allPages.filter((p) => p.id !== page.id && !p.parentId)
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        {isNew ? 'Новый раздел' : `Редактировать страницу: ${page.slug}`}
      </h2>

      <div className="space-y-4">
        <Field label="Slug (URL)">
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="admin-input"
            required
            disabled={page.slug === 'home'}
            placeholder="example-page"
          />
          {page.slug === 'home' && (
            <p className="mt-1 text-xs text-slate-500">
              Для главной страницы slug фиксирован и всегда равен `home`.
            </p>
          )}
        </Field>

        <Field label="Родительский раздел">
          <select
            value={formData.parentId ?? ''}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
            className="admin-input"
          >
            <option value="">— Корневой раздел —</option>
            {getParentOptions().map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Порядок сортировки">
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="admin-input"
          />
        </Field>

        <Field label="Title (SEO)">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="admin-input"
            required
          />
        </Field>

        <Field label="Description (SEO)">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="admin-input min-h-[92px]"
            rows={3}
          />
        </Field>

        <Field label="Keywords (SEO)">
          <textarea
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="admin-input min-h-[92px]"
            rows={3}
            placeholder="seo-продвижение сайтов, seo-аудит, коммерческие факторы"
          />
        </Field>

        <Field label="H1">
          <input
            type="text"
            value={formData.h1}
            onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
            className="admin-input"
          />
        </Field>

        <Field label="Содержимое">
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите содержимое страницы..."
          />
        </Field>

        <div className="flex gap-2">
          <Button onClick={() => onSave(formData)}>Сохранить</Button>
          <Button variant="outline" onClick={onCancel}>
            Отмена
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
