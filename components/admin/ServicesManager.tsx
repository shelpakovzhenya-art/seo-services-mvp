'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Загрузка редактора...</p>
    </div>
  ),
})

interface Service {
  id: string
  name: string
  description: string | null
  content: string | null
  image: string | null
  price: number
  unit: string
  isActive: boolean
  order: number
}

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = async (service: Partial<Service>) => {
    const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services'
    const method = editing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })

      if (response.ok) {
        const updated = await response.json()
        if (editing) {
          setServices(services.map(s => s.id === editing.id ? updated : s))
        } else {
          setServices([...services, updated])
        }
        setEditing(null)
        setIsCreating(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении услуги')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Ошибка при сохранении услуги. Проверьте консоль для деталей.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить услугу?')) return

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setServices(services.filter(s => s.id !== id))
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при удалении услуги')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Ошибка при удалении услуги. Проверьте консоль для деталей.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить услугу
        </Button>
      </div>

      {(isCreating || editing) && (
        <ServiceForm
          service={editing}
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Цена</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Единица</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Активна</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-4 py-3">{service.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{service.description || '—'}</td>
                <td className="px-4 py-3">{service.price.toLocaleString('ru-RU')}</td>
                <td className="px-4 py-3">{service.unit}</td>
                <td className="px-4 py-3">
                  <span className={service.isActive ? 'text-green-600' : 'text-gray-400'}>
                    {service.isActive ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
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

function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service: Service | null
  onSave: (service: Partial<Service>) => void
  onCancel: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    content: service?.content || '',
    image: service?.image || '',
    price: service?.price || 0,
    unit: service?.unit || '₽/проект',
    isActive: service?.isActive ?? true,
    order: service?.order || 0,
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
        {service ? 'Редактировать услугу' : 'Новая услуга'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Краткое описание (анонс)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
            placeholder="Краткое описание услуги для списка услуг"
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
          <label className="block text-sm font-medium mb-1">Полное описание услуги</label>
          <RichTextEditor
            content={formData.content || ''}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Введите полное описание услуги с форматированием, изображениями и т.д."
          />
          <p className="text-xs text-gray-500 mt-1">
            Используйте визуальный редактор для форматирования текста, добавления изображений и ссылок
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Цена</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Единица</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span>Активна</span>
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Порядок</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-24 px-4 py-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(formData)}>Сохранить</Button>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
        </div>
      </div>
    </div>
  )
}

