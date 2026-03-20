'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you. We will contact you shortly.' })
        setFormData({ name: '', phone: '', honeypot: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again later.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
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
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-200">
          Phone or Telegram
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
          placeholder="+7 or @telegram"
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm ${
            message.type === 'success'
              ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
              : 'border border-red-400/30 bg-red-400/10 text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl">
        {isSubmitting ? 'Sending...' : 'Send request'}
      </Button>
    </form>
  )
}
