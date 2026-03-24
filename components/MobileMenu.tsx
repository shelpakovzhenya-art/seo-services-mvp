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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/12 text-slate-50 shadow-[0_12px_26px_rgba(2,8,23,0.24)] transition hover:bg-white/18"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label={dictionary.mobileMenu.close}
          className={`absolute inset-0 bg-slate-950/44 backdrop-blur-md transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute inset-0 h-[100dvh] w-screen overflow-y-auto bg-[radial-gradient(circle_at_18%_16%,rgba(255,182,140,0.2),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(96,227,255,0.18),transparent_22%),linear-gradient(180deg,rgba(6,12,24,0.985),rgba(10,18,33,1))] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="sticky top-0 z-10 border-b border-white/10 bg-[#09111f]/88 px-6 py-5 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-orange-300">{dictionary.mobileMenu.menuTitle}</div>
                <div className="mt-1 text-2xl font-semibold text-white">Shelpakov Digital</div>
              </div>
              <button
                type="button"
                aria-label={dictionary.mobileMenu.close}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/10 text-slate-100 shadow-[0_12px_30px_rgba(2,8,23,0.3)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex min-h-[calc(100dvh-89px)] flex-col px-6 py-6 pb-8">
            <div className="rounded-[30px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_20px_40px_rgba(2,8,23,0.24)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-200/88">
                <span className="font-semibold text-slate-50/92">{workSchedule}</span>
                <span className={`inline-flex items-center gap-2.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${workStatus.badgeClass}`}>
                  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    <span className={`absolute inset-0 inline-flex animate-ping rounded-full opacity-90 ${workStatus.pingClass}`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.92)] ${workStatus.dotClass}`} />
                  </span>
                  {workStatus.text}
                </span>
              </div>
              <a href={`mailto:${email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-100 transition hover:text-cyan-100">
                <Mail className="h-4 w-4 text-cyan-300" />
                {email}
              </a>
            </div>

            <nav className="mt-6 grid gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={prefixPathWithLocale(item.url, locale)}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-[30px] border border-white/12 bg-white/[0.08] px-5 py-5 text-[clamp(1.2rem,4.4vw,1.56rem)] font-bold tracking-[0.01em] text-white shadow-[0_18px_36px_rgba(2,8,23,0.2)] backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-white/[0.12]"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-5 w-5 text-cyan-300" />
                </Link>
              ))}
            </nav>

            <div className="mt-6 rounded-[30px] border border-white/12 bg-[linear-gradient(145deg,rgba(255,186,140,0.15),rgba(255,255,255,0.06)_48%,rgba(96,227,255,0.08))] p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.22em] text-orange-300">{dictionary.mobileMenu.contactsTitle}</div>

              {socialLinks.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-base font-medium text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/14 hover:text-cyan-100"
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
