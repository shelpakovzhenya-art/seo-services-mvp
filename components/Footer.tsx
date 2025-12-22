import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Footer() {
  let settings, menuItems
  
  try {
    settings = await prisma.siteSettings.findFirst()
    menuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading footer data:', error)
    settings = null
    menuItems = []
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.url}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <div className="space-y-2">
              <p>{settings?.workSchedule || 'ПН–ПТ 9:00–17:00'}</p>
              <a 
                href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
                className="hover:text-white transition-colors"
              >
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>
          </div>
          {/* Footer Text */}
          <div>
            <h3 className="text-white font-semibold mb-4">О нас</h3>
            <p className="text-sm">
              {settings?.footerText || 'Профессиональные SEO услуги для вашего бизнеса'}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} SEO Services. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

