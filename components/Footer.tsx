import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, MessagesSquare, Wrench } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { featuredReads } from '@/lib/site-recommendations'

const DEFAULT_MENU_ITEMS = [
  { id: '1', label: 'Главная', url: '/', order: 1, isActive: true },
  { id: '2', label: 'Услуги', url: '/services', order: 2, isActive: true },
  { id: '3', label: 'Кейсы', url: '/cases', order: 3, isActive: true },
  { id: '4', label: 'Отзывы', url: '/reviews', order: 4, isActive: true },
  { id: '5', label: 'Блог', url: '/blog', order: 5, isActive: true },
  { id: '6', label: 'Контакты', url: '/contacts', order: 6, isActive: true },
]

export default async function Footer() {
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
    console.error('Error loading footer data:', error)
    menuItems = DEFAULT_MENU_ITEMS
  }

  const currentYear = new Date().getFullYear()
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
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#07101d]/88 text-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,176,128,0.16),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(96,227,255,0.12),transparent_22%)]" />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.75fr_0.8fr_1.1fr]">
          <div className="space-y-5">
            <span className="warm-chip">Shelpakov Digital</span>
            <h3 className="max-w-xl text-3xl font-semibold text-white">SEO и доработка сайта под заявки, доверие и рост.</h3>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              {settings?.footerText ||
                'Помогаю сделать сайт понятнее для клиента, сильнее для поисковиков и полезнее для бизнеса.'}
            </p>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/50 hover:bg-white/14 hover:text-cyan-100"
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
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">Навигация</h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">Контакты</h3>
            <div className="space-y-3 text-sm">
              <p>{settings?.workSchedule || 'Пн-Пт 09:00-17:00'}</p>
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="transition hover:text-white">
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
              <p className="text-slate-400">Аудит, стратегия, коммерческие факторы и рост заявок.</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">Почитать дальше</h3>
            <div className="space-y-4">
              {featuredReads.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-[24px] border border-white/12 bg-white/8 p-4 transition hover:border-cyan-300/40 hover:bg-white/12 hover:text-white"
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-orange-300">{item.kicker}</div>
                  <div className="mt-2 text-sm font-medium leading-6 text-slate-100">{item.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>&copy; {currentYear} Shelpakov Digital. Все права защищены.</p>
            <Link
              href="/tools"
              className="inline-flex w-fit items-center gap-3 border border-white/12 bg-[#09111d]/88 px-5 py-4 text-sm font-medium uppercase tracking-[0.22em] text-slate-200 transition hover:border-cyan-300/34 hover:bg-[#0d1624] hover:text-white"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/5 text-slate-100">
                <Wrench className="h-4 w-4" />
              </span>
              <span>SEO-TOOLS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
