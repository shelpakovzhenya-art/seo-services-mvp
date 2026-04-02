'use client'

import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/dictionaries'
import { getLocaleFromPathname, getRouteLocale } from '@/lib/i18n'

export default function ContactForm() {
  const pathname = usePathname()
  const locale = getRouteLocale(getLocaleFromPathname(pathname))
  const dictionary = getDictionary(locale)
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    site: '',
    honeypot: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const telegramHref = 'https://t.me/whoamikon'

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
          honeypot: formData.honeypot,
          sourceUrl: window.location.href,
          sourceTitle: document.title,
          locale,
        }),
      })

      await response.json().catch(() => null)

      if (response.ok) {
        setMessage({ type: 'success', text: dictionary.form.success })
        setFormData({ name: '', contact: '', site: '', honeypot: '' })
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
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          {dictionary.form.nameLabel}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="contact-input"
          placeholder={dictionary.form.namePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm font-medium text-slate-700">
          {dictionary.form.contactLabel}
        </label>
        <div className="contact-helper-card mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-[#8a5630] transition hover:text-slate-950"
          >
            <Image src="/telegram-logo.svg" alt="Telegram" width={24} height={24} className="h-6 w-6" />
            {dictionary.form.telegramLabel}
          </a>
          <span className="text-slate-400">{dictionary.form.telegramHint}</span>
        </div>
        <input
          type="text"
          id="contact"
          required
          autoComplete="tel"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="contact-input"
          placeholder={dictionary.form.contactPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="site" className="mb-2 block text-sm font-medium text-slate-700">
          {dictionary.form.siteLabel}
        </label>
        <input
          type="text"
          id="site"
          autoComplete="url"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          className="contact-input"
          placeholder={dictionary.form.sitePlaceholder}
        />
      </div>

      <div className="contact-note-card text-sm leading-7 text-slate-600">
        {dictionary.form.note}
      </div>

      {message && (
        <div
          className={`contact-message text-sm ${
            message.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl">
        {isSubmitting ? dictionary.form.submitting : dictionary.form.submit}
      </Button>
    </form>
  )
}
