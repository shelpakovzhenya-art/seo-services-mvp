'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Загрузка редактора...</p>
    </div>
  ),
})

interface Case {
  id: string
  title: string
  description: string | null
  content: string | null
  image: string | null
  order: number
}

export default function CasesManager({ initialCases }: { initialCases: Case[] }) {
  const [cases, setCases] = useState(initialCases)
  const [editing, setEditing] = useState<Case | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = async (caseItem: Partial<Case>) => {
    const url = editing ? `/api/admin/cases/${editing.id}` : '/api/admin/cases'
    const method = editing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseItem),
      })

      if (response.ok) {
        setEditing(null)
        setIsCreating(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении кейса')
      }
    } catch (error) {
      console.error('Error saving case:', error)
      alert('Ошибка при сохранении кейса. Проверьте консоль для деталей.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить кейс?')) return

    try {
      const response = await fetch(`/api/admin/cases/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCases(cases.filter(c => c.id !== id))
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при удалении кейса')
      }
    } catch (error) {
      console.error('Error deleting case:', error)
      alert('Ошибка при удалении кейса. Проверьте консоль для деталей.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить кейс
        </Button>
      </div>

      {(isCreating || editing) && (
        <CaseForm
          caseItem={editing}
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Описание</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Порядок</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td className="px-4 py-3">{caseItem.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{caseItem.description || '—'}</td>
                <td className="px-4 py-3">{caseItem.order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(caseItem)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(caseItem.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CaseForm({
  caseItem,
  onSave,
  onCancel,
}: {
  caseItem: Case | null
  onSave: (caseItem: Partial<Case>) => void
  onCancel: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: caseItem?.title || '',
    description: caseItem?.description || '',
    content: caseItem?.content || '',
    image: caseItem?.image || '',
    order: caseItem?.order || 0,
  })

  const handleImageUpload = async () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      setFormData({ ...formData, image: url })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Ошибка загрузки изображения')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {caseItem ? 'Редактировать кейс' : 'Новый кейс'}
      </h2>
      <div className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Изображение для анонса</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-md"
              placeholder="/uploads/image.jpg или URL"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUpload}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </Button>
          </div>
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Preview"
                className="max-w-xs h-32 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Содержание</label>
          <RichTextEditor
            content={formData.content || ''}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите описание кейса с форматированием, изображениями и т.д."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Порядок</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-24 px-4 py-2 border rounded-md"
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

