'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Review {
  id: string
  author: string
  text: string
  rating: number
  order: number
}

export default function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [editing, setEditing] = useState<Review | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = async (review: Partial<Review>) => {
    const url = editing ? `/api/admin/reviews/${editing.id}` : '/api/admin/reviews'
    const method = editing ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      })

      if (response.ok) {
        setEditing(null)
        setIsCreating(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении отзыва')
      }
    } catch (error) {
      console.error('Error saving review:', error)
      alert('Ошибка при сохранении отзыва. Проверьте консоль для деталей.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== id))
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при удалении отзыва')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Ошибка при удалении отзыва. Проверьте консоль для деталей.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить отзыв
        </Button>
      </div>

      {(isCreating || editing) && (
        <ReviewForm
          review={editing}
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Автор</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Текст</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Рейтинг</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Порядок</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3">{review.author}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">{review.text}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{review.order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(review)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
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

function ReviewForm({
  review,
  onSave,
  onCancel,
}: {
  review: Review | null
  onSave: (review: Partial<Review>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    author: review?.author || '',
    text: review?.text || '',
    rating: review?.rating || 5,
    order: review?.order || 0,
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {review ? 'Редактировать отзыв' : 'Новый отзыв'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Автор</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Текст отзыва</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            rows={5}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Рейтинг (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Порядок</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-md"
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


