import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MessageCircle, MessagesSquare } from 'lucide-react'
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
      label: 'Мессенджер',
      type: 'max' as const,
    },
  ].filter((item) => item.href)

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-[#fffaf4]/88 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="warm-chip">Shelpakov Digital</span>
            <span>{settings?.workSchedule || 'Пн-Пт 09:00-17:00'}</span>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${
                workStatus.isWorking
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${workStatus.dotClass}`} />
              {workStatus.text}
            </span>
            <a
              href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
              className="inline-flex items-center gap-2 transition hover:text-slate-900"
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  {item.type === 'telegram' ? (
                    <Image src="/telegram-logo.svg" alt="Telegram" width={18} height={18} className="h-[18px] w-[18px]" />
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

        <nav className="flex items-center justify-between gap-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              <Image
                src="/favicon-48.png"
                alt="Логотип Shelpakov Digital"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="flex flex-col">
              <span className="text-lg font-semibold uppercase tracking-[0.16em] text-slate-900">
                Shelpakov Digital
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                SEO, структура сайта, заявки
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link href={item.url} className="text-sm text-slate-600 transition hover:text-slate-950">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
          >
            Обсудить проект
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
