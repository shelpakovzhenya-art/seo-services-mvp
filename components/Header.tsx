import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MessageCircle, MessagesSquare } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'
import { prisma } from '@/lib/prisma'
import { getWorkStatus } from '@/lib/work-status'

const DEFAULT_MENU_ITEMS = [
  { id: '1', label: 'Главная', url: '/', order: 1, isActive: true },
  { id: '2', label: 'Услуги', url: '/services', order: 2, isActive: true },
  { id: '3', label: 'Кейсы', url: '/cases', order: 3, isActive: true },
  { id: '4', label: 'Отзывы', url: '/reviews', order: 4, isActive: true },
  { id: '5', label: 'Блог', url: '/blog', order: 5, isActive: true },
  { id: '6', label: 'Контакты', url: '/contacts', order: 6, isActive: true },
]

export default async function Header() {
  let settings: any = null
  let menuItems: any[] = []

  try {
    settings = await prisma.siteSettings.findFirst()
    menuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (menuItems.length === 0) {
      menuItems = DEFAULT_MENU_ITEMS
    }
  } catch (error) {
    console.error('Error loading header data:', error)
    menuItems = DEFAULT_MENU_ITEMS
  }

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101d]/72 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="warm-chip">Shelpakov Digital</span>
            <span>{settings?.workSchedule || 'Пн-Пт 09:00-17:00'}</span>
            <span className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold ${workStatus.badgeClass}`}>
              <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                <span className={`absolute inset-0 inline-flex animate-ping rounded-full opacity-90 ${workStatus.pingClass}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.9)] ${workStatus.dotClass}`} />
              </span>
              {workStatus.text}
            </span>
            <a
              href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
              className="inline-flex items-center gap-2 transition hover:text-white"
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-slate-200 transition hover:border-cyan-300/60 hover:bg-white/14 hover:text-cyan-100"
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

        <nav className="mb-4 flex items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-white/[0.06] px-4 py-4 shadow-[0_20px_55px_rgba(2,8,23,0.24)]">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-cyan-200/40 bg-white/95 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
              <Image src="/favicon-48.png" alt="Логотип Shelpakov Digital" width={28} height={28} className="h-7 w-7 object-contain" />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-semibold uppercase tracking-[0.16em] text-white">Shelpakov Digital</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">SEO, структура сайта, заявки</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link href={item.url} className="text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#contact-form"
            className="hidden items-center gap-2 rounded-full border border-cyan-200/30 bg-[linear-gradient(135deg,rgba(96,227,255,0.95),rgba(255,183,137,0.9))] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_32px_rgba(2,8,23,0.22)] transition hover:-translate-y-0.5 lg:inline-flex"
          >
            Обсудить проект
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <MobileMenu
            menuItems={menuItems.map((item) => ({
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
    </header>
  )
}
