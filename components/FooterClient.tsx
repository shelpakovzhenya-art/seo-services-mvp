'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, MessagesSquare, Wrench } from 'lucide-react'
import { getDictionary } from '@/lib/dictionaries'
import { getLocaleFromPathname, type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getFeaturedReads } from '@/lib/public-copy'
import { normalizeSocialUrl } from '@/lib/social-links'
import { containsCyrillic } from '@/lib/text-detection'

type FooterClientProps = {
  menuItems: Array<{ id: string; label: string; url: string; order: number; isActive: boolean }>
  settings: any
}

type SocialLink = {
  href: string
  label: string
  type: 'telegram' | 'whatsapp' | 'vk' | 'max'
}

const DEFAULT_TELEGRAM_URL = 'https://t.me/whoamikon'

function localizeMenuLabel(url: string, fallbackLabel: string, locale: Locale) {
  const dictionary = getDictionary(locale)

  switch (url) {
    case '/':
      return dictionary.menu.home
    case '/services':
      return dictionary.menu.services
    case '/services/website-development':
      return dictionary.menu.development
    case '/cases':
      return dictionary.menu.cases
    case '/reviews':
      return dictionary.menu.reviews
    case '/blog':
      return dictionary.menu.blog
    case '/contacts':
      return dictionary.menu.contacts
    case '/calculator':
      return locale === 'ru' ? 'Калькулятор' : 'Calculator'
    case '/tools':
      return dictionary.menu.tools
    default:
      return fallbackLabel
  }
}

export default function FooterClient({ menuItems, settings }: FooterClientProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname) || 'ru'
  const dictionary = getDictionary(locale)
  const featuredReads = getFeaturedReads(locale)
  const currentYear = new Date().getFullYear()
  const footerText =
    locale === 'en' && containsCyrillic(settings?.footerText)
      ? dictionary.footer.description
      : settings?.footerText || dictionary.footer.description
  const workSchedule =
    locale === 'en' && containsCyrillic(settings?.workSchedule)
      ? 'Mon-Fri 09:00-17:00'
      : settings?.workSchedule || 'Mon-Fri 09:00-17:00'
  const telegramHref = normalizeSocialUrl(settings?.telegramUrl, 'telegram') || DEFAULT_TELEGRAM_URL
  const socialLinks = [
    { href: telegramHref, label: 'Telegram', type: 'telegram' as const },
    { href: normalizeSocialUrl(settings?.whatsappUrl, 'whatsapp'), label: 'WhatsApp', type: 'whatsapp' as const },
    { href: normalizeSocialUrl(settings?.vkUrl, 'vk'), label: 'VK', type: 'vk' as const },
    { href: normalizeSocialUrl(settings?.maxUrl, 'max'), label: 'Messenger', type: 'max' as const },
  ].filter((item): item is SocialLink => Boolean(item.href))

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#253249] bg-[#0b1220] text-slate-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(188,144,100,0.14),transparent_24%),radial-gradient(circle_at_12%_16%,rgba(58,86,122,0.12),transparent_22%)]" />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.75fr_0.8fr_1.1fr]">
          <div className="space-y-5">
            <h3 className="max-w-xl text-3xl font-semibold text-white">{dictionary.footer.heading}</h3>
            <p className="max-w-xl text-sm leading-7 text-slate-400">{footerText}</p>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 transition hover:border-[#caa37a]/40 hover:bg-white/[0.08] hover:text-white"
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

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">{dictionary.footer.navigation}</h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link href={prefixPathWithLocale(item.url, locale)} className="transition hover:text-white">
                    {localizeMenuLabel(item.url, item.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">{dictionary.footer.contacts}</h3>
            <div className="text-sm">
              <div className="space-y-3">
                <p>{workSchedule}</p>
                <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="break-all transition hover:text-white">
                  {settings?.email || 'shelpakovzhenya@gmail.com'}
                </a>
                <p className="text-slate-400">{dictionary.footer.toolsTitle}</p>
              </div>

              <div className="pt-6">
                <Link
                  href={prefixPathWithLocale('/tools', locale)}
                  className="inline-flex w-fit max-w-full items-center gap-3 border border-white/10 bg-[#10192b] px-5 py-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:border-[#caa37a]/36 hover:bg-[#162132] hover:text-white"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-slate-100">
                    <Wrench className="h-4 w-4" />
                  </span>
                  <span className="break-words">{dictionary.footer.tools}</span>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">{dictionary.footer.readingMore}</h3>
            <div className="space-y-4">
              {featuredReads.map((item) => (
                <Link
                  key={item.href}
                  href={prefixPathWithLocale(item.href, locale)}
                  className="block rounded-[24px] border border-white/10 bg-white/[0.05] p-4 transition hover:border-[#caa37a]/36 hover:bg-white/[0.08] hover:text-white"
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#d2ab86]">{item.kicker}</div>
                  <div className="mt-2 text-sm font-medium leading-6 text-slate-100">{item.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/sitemap.xml" className="w-fit text-sm text-slate-500 transition hover:text-white">
            {dictionary.footer.sitemap}
          </Link>
          <p>&copy; {currentYear} Shelpakov Digital. {dictionary.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
