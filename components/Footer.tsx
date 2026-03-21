import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, MessagesSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { featuredReads } from '@/lib/site-recommendations'

const DEFAULT_MENU_ITEMS = [
  { id: '1', label: 'Р“Р»Р°РІРЅР°СЏ', url: '/', order: 1, isActive: true },
  { id: '2', label: 'РЈСЃР»СѓРіРё', url: '/services', order: 2, isActive: true },
  { id: '3', label: 'РљРµР№СЃС‹', url: '/cases', order: 3, isActive: true },
  { id: '4', label: 'РћС‚Р·С‹РІС‹', url: '/reviews', order: 4, isActive: true },
  { id: '5', label: 'Р‘Р»РѕРі', url: '/blog', order: 5, isActive: true },
  { id: '6', label: 'РљРѕРЅС‚Р°РєС‚С‹', url: '/contacts', order: 6, isActive: true },
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
            <h3 className="max-w-xl text-3xl font-semibold text-white">SEO Рё РґРѕСЂР°Р±РѕС‚РєР° СЃР°Р№С‚Р° РїРѕРґ Р·Р°СЏРІРєРё, РґРѕРІРµСЂРёРµ Рё СЂРѕСЃС‚.</h3>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              {settings?.footerText ||
                'РџРѕРјРѕРіР°СЋ СЃРґРµР»Р°С‚СЊ СЃР°Р№С‚ РїРѕРЅСЏС‚РЅРµРµ РґР»СЏ РєР»РёРµРЅС‚Р°, СЃРёР»СЊРЅРµРµ РґР»СЏ РїРѕРёСЃРєРѕРІРёРєРѕРІ Рё РїРѕР»РµР·РЅРµРµ РґР»СЏ Р±РёР·РЅРµСЃР°.'}
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
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">РќР°РІРёРіР°С†РёСЏ</h3>
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
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">РљРѕРЅС‚Р°РєС‚С‹</h3>
            <div className="space-y-3 text-sm">
              <p>{settings?.workSchedule || 'РџРЅ-РџС‚ 09:00-17:00'}</p>
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="transition hover:text-white">
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
              <p className="text-slate-400">РђСѓРґРёС‚, СЃС‚СЂР°С‚РµРіРёСЏ, РєРѕРјРјРµСЂС‡РµСЃРєРёРµ С„Р°РєС‚РѕСЂС‹ Рё СЂРѕСЃС‚ Р·Р°СЏРІРѕРє.</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">РџРѕС‡РёС‚Р°С‚СЊ РґР°Р»СЊС€Рµ</h3>
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
          <p>&copy; {currentYear} Shelpakov Digital. Р’СЃРµ РїСЂР°РІР° Р·Р°С‰РёС‰РµРЅС‹.</p>
        </div>
      </div>
    </footer>
  )
}
