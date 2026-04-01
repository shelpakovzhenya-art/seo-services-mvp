'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Mail } from 'lucide-react'
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
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 shadow-[0_10px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <nav className="flex min-h-[4.75rem] items-center justify-between gap-3 py-3 lg:gap-6">
            <Link href={prefixPathWithLocale('/', locale)} className="flex min-w-0 flex-1 items-center gap-3 pr-2 lg:flex-none">
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)] md:h-12 md:w-12">
                <Image src="/favicon-48.png" alt="Shelpakov Digital" width={40} height={40} className="h-[78%] w-[78%] object-contain" priority />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[0.94rem] font-semibold text-slate-950 sm:text-[1rem] md:text-lg">Shelpakov Digital</span>
                <span className="hidden max-w-full truncate text-[10px] font-medium tracking-[0.08em] text-slate-500 md:block md:text-xs md:tracking-[0.12em]">
                  {dictionary.header.brandSubtitle}
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-6 xl:gap-7 lg:flex">
              {normalizedMenuItems.map((item) => (
                <li key={`${item.url}-${item.id}`}>
                  <Link href={prefixPathWithLocale(item.url, locale)} className="site-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="hidden min-w-0 xl:flex xl:flex-col xl:items-end">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{workStatus.text}</span>
                <a
                  href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{settings?.email || 'shelpakovzhenya@gmail.com'}</span>
                </a>
              </div>
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

