'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Edit, Plus } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Загрузка редактора...</p>
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
  const [pages, setPages] = useState(initialPages)
  const [editing, setEditing] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Build tree structure
  const buildTree = (items: Page[]): Page[] => {
    const map = new Map<string, Page>()
    const roots: Page[] = []

    items.forEach(item => {
      map.set(item.id, { ...item, children: [] })
    })

    items.forEach(item => {
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

  const renderPageItem = (page: Page, level: number = 0): JSX.Element => (
    <>
      <tr key={page.id} className={level > 0 ? 'bg-gray-50' : ''}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {level > 0 && <span className="text-gray-400">└─</span>}
            {page.slug}
          </div>
        </td>
        <td className="px-4 py-3">{page.title}</td>
        <td className="px-4 py-3">{page.h1 || '—'}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false)
                setEditing(page)
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(null)
                setIsCreating(true)
                // Set parentId for new subsection
                const formData = {
                  slug: `${page.slug}-subsection`,
                  title: '',
                  description: '',
                  keywords: '',
                  h1: '',
                  content: '',
                  parentId: page.id,
                }
                setEditing({ ...formData, id: '', order: 0 } as Page)
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>
      {page.children?.map(child => renderPageItem(child, level + 1))}
    </>
  )

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => {
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
            order: 0
          } as Page)
        }} className="gap-2">
          <Plus className="w-4 h-4" />
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">H1</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {treePages.map((page) => renderPageItem(page))}
          </tbody>
        </table>
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
  const [formData, setFormData] = useState<{
    slug: string
    title: string
    description: string
    keywords: string
    h1: string
    content: string
    parentId: string | null
    order: number
  }>({
    slug: page.slug || '',
    title: page.title || '',
    description: page.description || '',
    keywords: page.keywords || '',
    h1: page.h1 || '',
    content: page.content || '',
    parentId: page.parentId || null,
    order: page.order || 0,
  })

  // Filter out current page and its children from parent options
  const getParentOptions = (): Page[] => {
    if (isNew) return allPages.filter(p => !p.parentId)
    return allPages.filter(p => p.id !== page.id && !p.parentId)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isNew ? 'Новый раздел' : `Редактировать страницу: ${page.slug}`}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
            disabled={page.slug === 'home'}
            placeholder="example-page"
          />
          {page.slug === 'home' && (
            <p className="mt-1 text-xs text-gray-500">Для главной страницы slug фиксирован и всегда равен `home`.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Родительский раздел</label>
          <select
            value={formData.parentId ?? ''}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">— Корневой раздел —</option>
            {getParentOptions().map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Порядок сортировки</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title (SEO)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (SEO)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Keywords (SEO)</label>
          <textarea
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={2}
            placeholder="seo-продвижение сайтов, seo-аудит, коммерческие факторы"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">H1</label>
          <input
            type="text"
            value={formData.h1}
            onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Содержание</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите содержимое страницы..."
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(formData)}>Сохранить</Button>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
        </div>
      </div>
    </div>
  )
}

