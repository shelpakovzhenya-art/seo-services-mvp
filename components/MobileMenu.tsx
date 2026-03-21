'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, Menu, MessageCircle, MessagesSquare, X } from 'lucide-react'

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
}

const OPEN_MENU_LABEL = '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e'
const CLOSE_MENU_LABEL = '\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e'
const MENU_TITLE = '\u041c\u0435\u043d\u044e'
const CONTACTS_TITLE = '\u0421\u0432\u044f\u0437\u044c'
const DISCUSS_PROJECT = '\u041e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442'

export default function MobileMenu({ menuItems, email, workSchedule, workStatus, socialLinks }: Props) {
  const [open, setOpen] = useState(false)

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
      <button
        type="button"
        aria-label={open ? CLOSE_MENU_LABEL : OPEN_MENU_LABEL}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={`fixed inset-0 z-[70] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label={CLOSE_MENU_LABEL}
          className={`absolute inset-0 bg-slate-950/36 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute inset-y-0 right-0 h-full w-full max-w-[420px] overflow-y-auto border-l border-orange-100 bg-[#fffaf4] shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="sticky top-0 z-10 border-b border-orange-100 bg-[#fffaf4]/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">{MENU_TITLE}</div>
                <div className="mt-1 text-base font-semibold text-slate-950">Shelpakov Digital</div>
              </div>
              <button
                type="button"
                aria-label={CLOSE_MENU_LABEL}
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6 px-5 py-5 pb-8">
            <div className="rounded-[24px] border border-orange-100 bg-white p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>{workSchedule}</span>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${workStatus.badgeClass}`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${workStatus.pingClass}`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${workStatus.dotClass}`} />
                  </span>
                  {workStatus.text}
                </span>
              </div>
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700 transition hover:text-slate-950"
              >
                <Mail className="h-4 w-4 text-cyan-700" />
                {email}
              </a>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-4 text-base font-medium text-slate-900 transition hover:border-cyan-200"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-cyan-700" />
                </Link>
              ))}
            </nav>

            <div className="rounded-[24px] border border-orange-100 bg-[#fff5ea] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-orange-700">{CONTACTS_TITLE}</div>

              {socialLinks.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                    >
                      {item.type === 'telegram' ? (
                        <Image src="/telegram-logo.svg" alt="Telegram" width={18} height={18} className="h-[18px] w-[18px]" />
                      ) : item.type === 'vk' ? (
                        <MessagesSquare className="h-4 w-4" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <a
              href="#contact-form"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
            >
              {DISCUSS_PROJECT}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
