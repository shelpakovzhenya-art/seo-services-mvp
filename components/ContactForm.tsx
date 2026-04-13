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
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
          {dictionary.form.nameLabel}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-2xl border border-white/16 bg-[#0f1226] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#9a74ff] focus:ring-2 focus:ring-[#8d66ff]/35"
          placeholder={dictionary.form.namePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm font-medium text-slate-200">
          {dictionary.form.contactLabel}
        </label>
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl border border-white/14 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-[#b9a6ff] transition hover:text-[#d6ccff]"
          >
            <Image src="/telegram-logo.svg" alt="Telegram" width={24} height={24} className="h-6 w-6" />
            {dictionary.form.telegramLabel}
          </a>
          <span className="text-slate-500">{dictionary.form.telegramHint}</span>
        </div>
        <input
          type="text"
          id="contact"
          required
          autoComplete="tel"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="w-full rounded-2xl border border-white/16 bg-[#0f1226] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#9a74ff] focus:ring-2 focus:ring-[#8d66ff]/35"
          placeholder={dictionary.form.contactPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="site" className="mb-2 block text-sm font-medium text-slate-200">
          {dictionary.form.siteLabel}
        </label>
        <input
          type="text"
          id="site"
          autoComplete="url"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          className="w-full rounded-2xl border border-white/16 bg-[#0f1226] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#9a74ff] focus:ring-2 focus:ring-[#8d66ff]/35"
          placeholder={dictionary.form.sitePlaceholder}
        />
      </div>

      <div className="rounded-2xl border border-white/14 bg-white/5 p-4 text-sm leading-7 text-slate-300">
        {dictionary.form.note}
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

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl">
        {isSubmitting ? dictionary.form.submitting : dictionary.form.submit}
      </Button>
    </form>
  )
}
