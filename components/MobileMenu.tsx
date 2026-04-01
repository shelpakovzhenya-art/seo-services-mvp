'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, Menu, MessageCircle, MessagesSquare, X } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getDictionary } from '@/lib/dictionaries'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'

type MenuItem = {
  id: string
  label: string
  url: string
}

type SocialLink = {
  href: string
  label: string
  type?: 'telegram' | 'whatsapp' | 'vk' | 'max'
}

type WorkStatus = {
  text: string
  badgeClass: string
  dotClass: string
  pingClass: string
}

type Props = {
  menuItems: MenuItem[]
  email: string
  workSchedule: string
  workStatus: WorkStatus
  socialLinks: SocialLink[]
  locale: Locale
  currentPath: string
}

export default function MobileMenu({ menuItems, email, workSchedule, workStatus, socialLinks, locale, currentPath }: Props) {
  const [open, setOpen] = useState(false)
  const dictionary = getDictionary(locale)

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [open])

  return (
    <>
      <div className="flex items-center gap-2 lg:hidden">
        <LanguageSwitcher locale={locale} pathname={currentPath} />
        <button
          type="button"
          aria-label={open ? dictionary.mobileMenu.close : dictionary.mobileMenu.open}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:bg-slate-50"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label={dictionary.mobileMenu.close}
          className={`absolute inset-0 bg-slate-950/24 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-[100dvh] w-full max-w-[24rem] overflow-x-hidden overflow-y-auto border-l border-slate-200 bg-[#f8fafc] shadow-[-24px_0_60px_rgba(15,23,42,0.16)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/94 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{dictionary.mobileMenu.menuTitle}</div>
                <div className="mt-1 flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <Image src="/favicon-48.png" alt="Shelpakov Digital" width={36} height={36} className="h-[78%] w-[78%] object-contain" />
                  </span>
                  <span className="truncate text-xl font-semibold text-slate-950 sm:text-2xl">Shelpakov Digital</span>
                </div>
              </div>
              <button
                type="button"
                aria-label={dictionary.mobileMenu.close}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex min-h-[calc(100dvh-89px)] flex-col px-4 py-5 pb-8 sm:px-6 sm:py-6">
            <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                <span className="font-semibold text-slate-900">{workSchedule}</span>
                <span className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${workStatus.badgeClass}`}>
                  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <span className={`absolute inset-0 inline-flex animate-ping rounded-full opacity-90 ${workStatus.pingClass}`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.92)] ${workStatus.dotClass}`} />
                  </span>
                  {workStatus.text}
                </span>
              </div>
              <a href={`mailto:${email}`} className="mt-4 inline-flex min-w-0 max-w-full items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="min-w-0 break-all">{email}</span>
              </a>
            </div>

            <nav className="mt-6 grid gap-3">
              {menuItems.map((item) => {
                const href = prefixPathWithLocale(item.url, locale)
                const isActive = currentPath === href

                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex min-w-0 items-center justify-between rounded-[20px] border px-5 py-4 text-[clamp(1rem,4.2vw,1.25rem)] font-semibold tracking-[0.01em] transition ${isActive ? 'border-slate-950 bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.14)]' : 'border-slate-200 bg-white text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <span className="min-w-0 break-words pr-3">{item.label}</span>
                    <ArrowUpRight className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{dictionary.mobileMenu.contactsTitle}</div>

              {socialLinks.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-800 transition hover:border-slate-300 hover:bg-white hover:text-slate-950"
                    >
                      {item.type === 'telegram' ? (
                        <Image src="/telegram-logo.svg" alt="Telegram" width={20} height={20} className="h-5 w-5" />
                      ) : item.type === 'vk' ? (
                        <MessagesSquare className="h-5 w-5" />
                      ) : (
                        <MessageCircle className="h-5 w-5" />
                      )}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              href={prefixPathWithLocale('/contacts#contact-form', locale)}
              onClick={() => setOpen(false)}
              className="site-cta-button mt-6 inline-flex w-full justify-center px-5 py-4 text-base"
            >
              {dictionary.header.discussProject}
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
