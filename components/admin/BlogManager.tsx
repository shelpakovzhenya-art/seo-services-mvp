'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Загрузка редактора...</p>
    </div>
  ),
})

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  publishedAt: string | null // ISO string from server, converted to Date when needed
  parentId: string | null
  order: number
  children?: BlogPost[]
}

export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Build tree structure
  const buildTree = (items: BlogPost[]): BlogPost[] => {
    const map = new Map<string, BlogPost>()
    const roots: BlogPost[] = []

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

  const treePosts = buildTree(posts)

  const handleSave = async (post: Partial<BlogPost>) => {
    const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog'
    const method = editing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        setEditing(null)
        setIsCreating(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении статьи')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Ошибка при сохранении статьи. Проверьте консоль для деталей.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id))
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при удалении статьи')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Ошибка при удалении статьи. Проверьте консоль для деталей.')
    }
  }

  const renderPostItem = (post: BlogPost, level: number = 0): JSX.Element => (
    <>
      <tr key={post.id} className={level > 0 ? 'bg-gray-50' : ''}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {level > 0 && <span className="text-gray-400">└─</span>}
            {post.title}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{post.slug}</td>
        <td className="px-4 py-3">
          <span className={post.published ? 'text-green-600' : 'text-gray-400'}>
            {post.published ? 'Да' : 'Нет'}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : '—'}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false)
                setEditing(post)
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
                const formData = {
                  slug: `${post.slug}-subsection`,
                  title: '',
                  excerpt: '',
                  content: '',
                  coverImage: '',
                  published: false,
                  publishedAt: null,
                  parentId: post.id,
                  order: 0,
                }
                setEditing({ ...formData, id: '' } as BlogPost)
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(post.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </td>
      </tr>
      {post.children?.map(child => renderPostItem(child, level + 1))}
    </>
  )

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить статью
        </Button>
      </div>

      {(isCreating || editing) && (
        <BlogPostForm
          post={editing}
          allPosts={posts}
          onSave={handleSave}
          onCancel={() => {
            setIsCreating(false)
            setEditing(null)
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Название</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Опубликовано</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Дата</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {treePosts.map((post) => renderPostItem(post))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BlogPostForm({
  post,
  allPosts,
  onSave,
  onCancel,
}: {
  post: BlogPost | null
  allPosts: BlogPost[]
  onSave: (post: Partial<BlogPost>) => void
  onCancel: () => void
}) {
  const isNew = !post?.id
  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    published: post?.published ?? false,
    publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
    parentId: post?.parentId || '',
    order: post?.order || 0,
  })

  // Filter out current post and its children from parent options
  const getParentOptions = (): BlogPost[] => {
    if (isNew) return allPosts.filter(p => !p.parentId)
    return allPosts.filter(p => p.id !== post.id && !p.parentId)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {post ? 'Редактировать статью' : 'Новая статья'}
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
            disabled={!!post}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Краткое описание</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL обложки</label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Родительский раздел</label>
          <select
            value={formData.parentId}
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
          <label className="block text-sm font-medium mb-1">Содержание</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите содержимое статьи..."
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
            <span>Опубликовано</span>
          </label>
          {formData.published && (
            <div>
              <label className="block text-sm font-medium mb-1">Дата публикации</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="px-4 py-2 border rounded-md"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave({
            ...formData,
            parentId: formData.parentId || null,
            publishedAt: formData.published && formData.publishedAt 
              ? new Date(formData.publishedAt) 
              : null
          })}>Сохранить</Button>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
        </div>
      </div>
    </div>
  )
}

