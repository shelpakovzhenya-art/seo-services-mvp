'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    site: '',
    honeypot: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.honeypot) {
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.contact,
          site: formData.site,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Спасибо. Получил заявку и скоро свяжусь с вами.' })
        setFormData({ name: '', contact: '', site: '', honeypot: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          Как к вам обращаться
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
          placeholder="Имя"
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm font-medium text-slate-700">
          Телефон, Telegram или email
        </label>
        <input
          type="text"
          id="contact"
          required
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
          placeholder="+7 999 000-00-00 или @telegram"
        />
      </div>

      <div>
        <label htmlFor="site" className="mb-2 block text-sm font-medium text-slate-700">
          Сайт
        </label>
        <input
          type="text"
          id="site"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
          placeholder="https://example.ru"
        />
      </div>

      <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4 text-sm leading-7 text-slate-600">
        Ответим в течение дня, без обязательств и с понятным ориентиром по следующему шагу.
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm ${
            message.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl">
        {isSubmitting ? 'Отправляю заявку...' : 'Отправить заявку'}
      </Button>
    </form>
  )
}
