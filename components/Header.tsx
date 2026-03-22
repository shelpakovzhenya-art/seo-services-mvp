import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MessageCircle, MessagesSquare } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'
import { prisma } from '@/lib/prisma'
import { getWorkStatus } from '@/lib/work-status'

type HeaderMenuItem = {
  id: string
  label: string
  url: string
  order: number
  isActive: boolean
}

const DEFAULT_MENU_ITEMS: HeaderMenuItem[] = [
  { id: '2', label: 'SEO-услуги', url: '/services', order: 2, isActive: true },
  { id: 'development', label: 'Разработка', url: '/services/website-development', order: 3, isActive: true },
  { id: '3', label: 'Кейсы', url: '/cases', order: 4, isActive: true },
  { id: '4', label: 'Отзывы', url: '/reviews', order: 5, isActive: true },
  { id: '5', label: 'Блог', url: '/blog', order: 6, isActive: true },
  { id: '6', label: 'Контакты', url: '/contacts', order: 7, isActive: true },
]

const DEVELOPMENT_ITEM: HeaderMenuItem = {
  id: 'development',
  label: 'Разработка',
  url: '/services/website-development',
  order: 3,
  isActive: true,
}

const CONTACT_FORM_HREF = '/contacts#contact-form'

function normalizeMenuItems(items: HeaderMenuItem[]) {
  const filtered = items
    .filter((item) => item.isActive !== false)
    .filter((item) => item.url !== '/')
    .filter((item) => item.url !== DEVELOPMENT_ITEM.url)
    .map((item) => (item.url === '/services' ? { ...item, label: 'SEO-услуги' } : item))

  const servicesIndex = filtered.findIndex((item) => item.url === '/services')

  if (servicesIndex >= 0) {
    filtered.splice(servicesIndex + 1, 0, DEVELOPMENT_ITEM)
    return filtered
  }

  return [DEFAULT_MENU_ITEMS[0], DEVELOPMENT_ITEM, ...filtered]
}

export default async function Header() {
  let settings: any = null
  let menuItems: HeaderMenuItem[] = []

  try {
    settings = await prisma.siteSettings.findFirst()
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    menuItems = dbMenuItems.length > 0 ? (dbMenuItems as HeaderMenuItem[]) : DEFAULT_MENU_ITEMS
  } catch (error) {
    console.error('Error loading header data:', error)
    menuItems = DEFAULT_MENU_ITEMS
  }

  const normalizedMenuItems = normalizeMenuItems(menuItems)
  const workStatus = getWorkStatus(settings?.workSchedule)
  const socialLinks = [
    {
      href: settings?.telegramUrl,
      label: 'Telegram',
      type: 'telegram' as const,
    },
    {
      href: settings?.whatsappUrl,
      label: 'WhatsApp',
      type: 'whatsapp' as const,
    },
    {
      href: settings?.vkUrl,
      label: 'VK',
      type: 'vk' as const,
    },
    {
      href: settings?.maxUrl,
      label: 'Messenger',
      type: 'max' as const,
    },
  ].filter((item) => item.href)

  return (
    <>
      <div className="relative z-40 border-b border-white/10 bg-[#07101d]/88 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 py-2.5 text-[11px] font-medium text-slate-200/88 md:gap-4 md:py-3 md:text-xs">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              <span className="warm-chip">Shelpakov Digital</span>
              <span className="inline-flex items-center rounded-full border border-white/12 bg-[#0c1727]/90 px-3 py-1.5 font-semibold text-slate-50 shadow-[0_10px_24px_rgba(2,8,23,0.22)] md:px-3.5">
                {settings?.workSchedule || 'Пн-Пт 09:00-17:00'}
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
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#0c1727]/90 px-3 py-1.5 font-medium text-slate-50 shadow-[0_10px_24px_rgba(2,8,23,0.22)] transition hover:border-cyan-300/30 hover:text-white md:px-3.5"
              >
                <Mail className="h-3.5 w-3.5" />
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>

            {socialLinks.length > 0 ? (
              <div className="hidden items-center gap-2 md:flex">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/10 text-slate-100 transition hover:border-cyan-300/60 hover:bg-white/16 hover:text-cyan-100"
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

      <div className="sticky top-0 z-50 bg-[#07101d]/80 shadow-[0_18px_40px_rgba(2,8,23,0.26)] backdrop-blur-2xl">
        <div className="container mx-auto px-4">
          <nav className="my-2 flex items-center justify-between gap-3 rounded-[26px] border border-white/14 bg-[linear-gradient(145deg,rgba(11,20,37,0.9),rgba(15,28,48,0.84))] px-3.5 py-3 shadow-[0_22px_52px_rgba(2,8,23,0.28)] md:my-3 md:mb-4 md:gap-4 md:rounded-[32px] md:px-4 md:py-4">
            <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-200/40 bg-white/95 shadow-[0_10px_24px_rgba(15,23,42,0.14)] sm:h-11 sm:w-11 md:h-12 md:w-12">
                <Image src="/favicon-48.png" alt="Логотип Shelpakov Digital" width={28} height={28} className="h-6 w-6 object-contain md:h-7 md:w-7" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-white sm:text-[1rem] md:text-lg md:tracking-[0.16em]">Shelpakov Digital</span>
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300/86 sm:block md:text-xs md:tracking-[0.2em]">
                  SEO, структура сайта, заявки
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-7 lg:flex">
              {normalizedMenuItems.map((item) => (
                <li key={`${item.url}-${item.id}`}>
                  <Link href={item.url} className="site-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href={CONTACT_FORM_HREF} className="site-cta-button hidden lg:inline-flex">
              Обсудить проект
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <MobileMenu
              menuItems={normalizedMenuItems.map((item) => ({
                id: String(item.id),
                label: item.label,
                url: item.url,
              }))}
              email={settings?.email || 'shelpakovzhenya@gmail.com'}
              workSchedule={settings?.workSchedule || 'Пн-Пт 09:00-17:00'}
              workStatus={workStatus}
              socialLinks={socialLinks.map((item) => ({
                href: item.href,
                label: item.label,
                type: item.type,
              }))}
            />
          </nav>
        </div>
      </div>
    </>
  )
}
