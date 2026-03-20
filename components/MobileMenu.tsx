'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react'

type MenuItem = {
  id: string
  label: string
  url: string
}

type SocialLink = {
  href: string
  label: string
}

type Props = {
  menuItems: MenuItem[]
  email: string
  socialLinks: SocialLink[]
}

export default function MobileMenu({ menuItems, email, socialLinks }: Props) {
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
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-slate-950/32 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-orange-100 bg-[#fffaf4] shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-orange-700">Меню</div>
                <div className="mt-1 text-base font-semibold text-slate-950">Shelpakov Digital</div>
              </div>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
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

              <div className="mt-6 rounded-[24px] border border-orange-100 bg-[#fff5ea] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-orange-700">Связь</div>
                <a
                  href={`mailto:${email}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700 transition hover:text-slate-950"
                >
                  <Mail className="h-4 w-4 text-cyan-700" />
                  {email}
                </a>

                {socialLinks.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-orange-100 px-5 py-4">
              <a
                href="#contact-form"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
              >
                Обсудить проект
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
