import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#050b14] text-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.14),transparent_24%)]" />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
              Shelpakov Digital
            </span>
            <h3 className="max-w-xl text-3xl font-semibold text-white">
              Система роста для SEO, контента и конверсии.
            </h3>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              {settings?.footerText ||
                'Помогаю упаковать сайт так, чтобы он сильнее выглядел, лучше продвигался и приводил больше обращений.'}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">
              Навигация
            </h3>
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
            <h3 className="mb-4 text-sm uppercase tracking-[0.24em] text-slate-500">
              Контакты
            </h3>
            <div className="space-y-3 text-sm">
              <p>{settings?.workSchedule || 'Пн-Пт 09:00-17:00'}</p>
              <a
                href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
                className="transition hover:text-white"
              >
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
              <p className="text-slate-500">Аудит, стратегия, упаковка сайта и рост заявок.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-500">
          <p>&copy; {currentYear} Shelpakov Digital. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
