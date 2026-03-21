'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Edit, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-gray-50 p-4">
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
  publishedAt: string | null
  parentId: string | null
  order: number
  children?: BlogPost[]
}

type BlogPostFormData = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  published: boolean
  publishedAt: string
  parentId: string | null
  order: number
}

function buildTree(items: BlogPost[]): BlogPost[] {
  const map = new Map<string, BlogPost>()
  const roots: BlogPost[] = []

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  items.forEach((item) => {
    const node = map.get(item.id)

    if (!node) {
      return
    }

    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)

      if (!parent) {
        roots.push(node)
        return
      }

      parent.children = parent.children || []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots.sort((a, b) => a.order - b.order)
}

function createInitialFormData(post: BlogPost | null): BlogPostFormData {
  return {
    slug: post?.slug || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    published: post?.published ?? false,
    publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
    parentId: post?.parentId || null,
    order: post?.order || 0,
  }
}

export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const treePosts = buildTree(posts)

  const handleSave = async (post: Partial<BlogPost>) => {
    const url = editing?.id ? `/api/admin/blog/${editing.id}` : '/api/admin/blog'
    const method = editing?.id ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        alert(error?.error || 'Ошибка при сохранении статьи')
        return
      }

      setEditing(null)
      setIsCreating(false)
      window.location.reload()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Ошибка при сохранении статьи. Проверьте консоль для деталей.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        alert(error?.error || 'Ошибка при удалении статьи')
        return
      }

      setPosts((current) => current.filter((item) => item.id !== id))
      window.location.reload()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Ошибка при удалении статьи. Проверьте консоль для деталей.')
    }
  }

  const startCreate = () => {
    setEditing(null)
    setIsCreating(true)
  }

  const startEdit = (post: BlogPost) => {
    setIsCreating(false)
    setEditing(post)
  }

  const startCreateChild = (post: BlogPost) => {
    setIsCreating(true)
    setEditing({
      id: '',
      slug: `${post.slug}-subsection`,
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      published: false,
      publishedAt: null,
      parentId: post.id,
      order: 0,
    })
  }

  const renderPostItem = (post: BlogPost, level = 0): JSX.Element => (
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
          <span className={post.published ? 'text-green-600' : 'text-gray-400'}>{post.published ? 'Да' : 'Нет'}</span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : '—'}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => startEdit(post)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => startCreateChild(post)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </td>
      </tr>
      {post.children?.map((child) => renderPostItem(child, level + 1))}
    </>
  )

  return (
    <div>
      <div className="mb-4">
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" />
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

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
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
  const isExistingPost = Boolean(post?.id)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [formData, setFormData] = useState<BlogPostFormData>(createInitialFormData(post))

  const getParentOptions = () => {
    if (!post?.id) {
      return allPosts.filter((item) => !item.parentId)
    }

    return allPosts.filter((item) => item.id !== post.id && !item.parentId)
  }

  const handleCoverUpload = async (file: File) => {
    setIsUploadingCover(true)

    try {
      const payload = new FormData()
      payload.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      setFormData((current) => ({ ...current, coverImage: url }))
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert('Ошибка загрузки обложки. Попробуйте еще раз.')
    } finally {
      setIsUploadingCover(false)
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">{isExistingPost ? 'Редактировать статью' : 'Новая статья'}</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full rounded-md border px-4 py-2"
            required
            disabled={isExistingPost}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Краткое описание</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full rounded-md border px-4 py-2"
            rows={2}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Обложка анонса</label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {formData.coverImage ? (
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img src={formData.coverImage} alt="Предпросмотр обложки" className="h-48 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: '' })}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                Обложка пока не добавлена
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="gap-2"
              >
                {isUploadingCover ? <Upload className="h-4 w-4 animate-pulse" /> : <ImagePlus className="h-4 w-4" />}
                {isUploadingCover ? 'Загружаю фото...' : 'Загрузить фото для анонса'}
              </Button>
              <span className="self-center text-xs text-slate-500">Фото попадет и в карточку статьи, и в верх статьи.</span>
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  void handleCoverUpload(file)
                }
              }}
            />

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Или вставьте URL вручную
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full rounded-md border bg-white px-4 py-2"
                placeholder="https://... или data:image/..."
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Родительский раздел</label>
          <select
            value={formData.parentId ?? ''}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
            className="w-full rounded-md border px-4 py-2"
          >
            <option value="">— Корневой раздел —</option>
            {getParentOptions().map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Порядок сортировки</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
            className="w-full rounded-md border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Содержание</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите содержимое статьи..."
          />
          <p className="mt-2 text-xs text-slate-500">Для фото внутри статьи нажмите иконку картинки в панели редактора.</p>
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
              <label className="mb-1 block text-sm font-medium">Дата публикации</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="rounded-md border px-4 py-2"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() =>
              onSave({
                ...formData,
                parentId: formData.parentId || null,
                publishedAt: formData.published && formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
              })
            }
          >
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </div>
    </div>
  )
}
