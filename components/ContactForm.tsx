'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/dictionaries'
import { getLocaleFromPathname, getRouteLocale } from '@/lib/i18n'

export default function ContactForm() {
  const pathname = usePathname()
  const locale = getRouteLocale(getLocaleFromPathname(pathname))
  const dictionary = getDictionary(locale)
  const copy =
    locale === 'ru'
      ? {
          nameLabel: 'Ваше имя',
          namePlaceholder: 'Введите ваше имя',
          contactLabel: 'Email, телефон или Telegram',
          contactPlaceholder: 'Как с вами связаться',
          siteLabel: 'Сайт',
          sitePlaceholder: 'Адрес сайта',
          messageLabel: 'Сообщение',
          messagePlaceholder: 'Расскажите о вашем проекте',
          submit: 'Отправить заявку',
        }
      : {
          nameLabel: 'Your name',
          namePlaceholder: 'Enter your name',
          contactLabel: 'Email, phone, or Telegram',
          contactPlaceholder: 'How to reach you',
          siteLabel: 'Website',
          sitePlaceholder: 'Website URL',
          messageLabel: 'Message',
          messagePlaceholder: 'Tell us about your project',
          submit: 'Send request',
        }
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    site: '',
    message: '',
    honeypot: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const inputClass =
    'w-full rounded-lg border border-blue-200/12 bg-slate-950/58 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25'

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
          message: formData.message,
          honeypot: formData.honeypot,
          sourceUrl: window.location.href,
          sourceTitle: document.title,
          locale,
        }),
      })

      await response.json().catch(() => null)

      if (response.ok) {
        setMessage({ type: 'success', text: dictionary.form.success })
        setFormData({ name: '', contact: '', site: '', message: '', honeypot: '' })
      } else {
        setMessage({ type: 'error', text: dictionary.form.error })
      }
    } catch {
      setMessage({ type: 'error', text: dictionary.form.error })
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
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-200">
          {copy.nameLabel}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          placeholder={copy.namePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm font-semibold text-slate-200">
          {copy.contactLabel}
        </label>
        <input
          type="text"
          id="contact"
          required
          autoComplete="tel"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className={inputClass}
          placeholder={copy.contactPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="site" className="mb-2 block text-sm font-semibold text-slate-200">
          {copy.siteLabel}
        </label>
        <input
          type="text"
          id="site"
          autoComplete="url"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          className={inputClass}
          placeholder={copy.sitePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-200">
          {copy.messageLabel}
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder={copy.messagePlaceholder}
        />
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-sm ${
            message.type === 'success'
              ? 'border border-emerald-300/35 bg-emerald-400/12 text-emerald-200'
              : 'border border-rose-300/35 bg-rose-400/12 text-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-lg">
        {isSubmitting ? dictionary.form.submitting : copy.submit}
      </Button>
    </form>
  )
}
