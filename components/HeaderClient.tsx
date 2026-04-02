'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Mail, MessageCircle, MessagesSquare } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MobileMenu from '@/components/MobileMenu'
import { getDictionary } from '@/lib/dictionaries'
import { getLocaleFromPathname, type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { containsCyrillic } from '@/lib/text-detection'
import { getWorkStatus } from '@/lib/work-status'

type HeaderMenuItem = {
  id: string
  label: string
  url: string
  order: number
  isActive: boolean
}

type HeaderClientProps = {
  menuItems: HeaderMenuItem[]
  settings: any
}

const DEVELOPMENT_ITEM: HeaderMenuItem = {
  id: 'development',
  label: 'Development',
  url: '/services/website-development',
  order: 3,
  isActive: true,
}

const CONTACT_FORM_HREF = '/contacts#contact-form'

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
    case '/tools':
      return dictionary.menu.tools
    case '/calculator':
      return locale === 'ru' ? 'Калькулятор' : 'Calculator'
    default:
      return fallbackLabel
  }
}

function normalizeMenuItems(items: HeaderMenuItem[], locale: Locale) {
  const filtered = items
    .filter((item) => item.isActive !== false)
    .filter((item) => item.url !== '/')
    .filter((item) => item.url !== DEVELOPMENT_ITEM.url)
    .map((item) => ({
      ...item,
      label: localizeMenuLabel(item.url, item.label, locale),
    }))

  const servicesIndex = filtered.findIndex((item) => item.url === '/services')
  const localizedDevelopmentItem = {
    ...DEVELOPMENT_ITEM,
    label: localizeMenuLabel(DEVELOPMENT_ITEM.url, DEVELOPMENT_ITEM.label, locale),
  }

  if (servicesIndex >= 0) {
    filtered.splice(servicesIndex + 1, 0, localizedDevelopmentItem)
    return filtered
  }

  return [localizedDevelopmentItem, ...filtered]
}

export default function HeaderClient({ menuItems, settings }: HeaderClientProps) {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname) || 'ru'
  const dictionary = getDictionary(locale)
  const normalizedMenuItems = normalizeMenuItems(menuItems, locale)
  const workSchedule =
    locale === 'en' && containsCyrillic(settings?.workSchedule)
      ? 'Mon-Fri 09:00-17:00'
      : settings?.workSchedule || 'Mon-Fri 09:00-17:00'
  const workStatus = getWorkStatus(workSchedule)
  const socialLinks = [
    { href: settings?.telegramUrl, label: 'Telegram', type: 'telegram' as const },
    { href: settings?.whatsappUrl, label: 'WhatsApp', type: 'whatsapp' as const },
    { href: settings?.vkUrl, label: 'VK', type: 'vk' as const },
    { href: settings?.maxUrl, label: 'Messenger', type: 'max' as const },
  ].filter((item) => item.href)

  return (
    <>
        <div className="relative z-40 border-b border-white/6 bg-[#0b1220]/92 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start gap-2 py-2.5 text-[11px] font-medium text-slate-200/88 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:gap-4 md:py-3 md:text-xs">
            <div className="flex w-full min-w-0 flex-wrap items-center gap-2.5 md:gap-3">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-[#101a2d]/96 px-3 py-1.5 font-semibold text-slate-50 shadow-[0_10px_24px_rgba(2,8,23,0.22)] md:px-3.5">
                {workSchedule}
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${workStatus.badgeClass}`}>
                <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                  <span className={`absolute inset-0 inline-flex animate-ping rounded-full opacity-90 ${workStatus.pingClass}`} />
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.9)] ${workStatus.dotClass}`} />
                </span>
                {workStatus.text}
              </span>
              <a
                href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
                className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-white/10 bg-[#101a2d]/96 px-3 py-1.5 font-medium text-slate-50 shadow-[0_10px_24px_rgba(2,8,23,0.22)] transition hover:border-[#caa37a]/36 hover:text-white sm:w-auto sm:break-normal md:px-3.5"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="min-w-0 break-all">{settings?.email || 'shelpakovzhenya@gmail.com'}</span>
              </a>
            </div>

            {socialLinks.length > 0 ? (
              <div className="hidden shrink-0 items-center gap-2 md:flex">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100 transition hover:border-[#caa37a]/42 hover:bg-white/[0.1] hover:text-white"
                  >
                    {item.type === 'telegram' ? (
                      <Image src="/telegram-logo.svg" alt="Telegram" width={20} height={20} className="h-5 w-5" />
                    ) : item.type === 'vk' ? (
                      <MessagesSquare className="h-4 w-4" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-[#0b1220]/84 shadow-[0_18px_40px_rgba(2,8,23,0.22)] backdrop-blur-2xl">
        <div className="container mx-auto px-4">
          <nav className="my-2 flex items-center justify-between gap-2.5 rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(10,17,31,0.96),rgba(15,24,40,0.94))] px-3 py-2.5 shadow-[0_22px_52px_rgba(2,8,23,0.24)] md:my-3 md:mb-4 md:gap-4 md:rounded-[28px] md:px-4 md:py-4">
            <Link href={prefixPathWithLocale('/', locale)} className="flex min-w-0 flex-1 items-center gap-2.5 pr-2 sm:gap-3 lg:flex-none">
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,239,232,0.96))] shadow-[0_12px_30px_rgba(2,8,23,0.22)] sm:h-11 sm:w-11 md:h-12 md:w-12">
                <Image src="/favicon-48.png" alt="Shelpakov Digital" width={40} height={40} className="h-[78%] w-[78%] object-contain" priority />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-white sm:text-[0.95rem] md:text-lg md:tracking-[0.2em]">Shelpakov Digital</span>
                <span className="hidden max-w-full truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400/90 md:block md:text-xs md:tracking-[0.22em]">
                  {dictionary.header.brandSubtitle}
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-6 xl:flex">
              {normalizedMenuItems.map((item) => (
                <li key={`${item.url}-${item.id}`}>
                  <Link href={prefixPathWithLocale(item.url, locale)} className="site-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 xl:flex">
              <LanguageSwitcher locale={locale} pathname={pathname} />
              <Link href={prefixPathWithLocale(CONTACT_FORM_HREF, locale)} className="site-cta-button">
                {dictionary.header.discussProject}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <MobileMenu
              menuItems={normalizedMenuItems.map((item) => ({
                id: String(item.id),
                label: item.label,
                url: item.url,
              }))}
              email={settings?.email || 'shelpakovzhenya@gmail.com'}
              workSchedule={workSchedule}
              workStatus={workStatus}
              socialLinks={socialLinks.map((item) => ({
                href: item.href,
                label: item.label,
                type: item.type,
              }))}
              locale={locale}
              currentPath={pathname}
            />
          </nav>
        </div>
      </div>
    </>
  )
}
