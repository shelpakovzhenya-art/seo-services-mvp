import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MessageCircle, Mail } from 'lucide-react'

export default async function Header() {
  let settings: any = null
  let menuItems: any[] = []
  
  try {
    settings = await prisma.siteSettings.findFirst()
    menuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading header data:', error)
    settings = null
    menuItems = []
  }

  const socialLinks = {
    telegram: settings?.telegramUrl,
    vk: settings?.vkUrl,
    whatsapp: settings?.whatsappUrl,
    max: settings?.maxUrl,
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>{settings?.workSchedule || 'ПН–ПТ 9:00–17:00'}</span>
            <a 
              href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
              className="flex items-center gap-1 hover:text-primary"
            >
              <Mail className="w-4 h-4" />
              {settings?.email || 'shelpakovzhenya@gmail.com'}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.telegram && (
              <a 
                href={socialLinks.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            )}
            {socialLinks.vk && (
              <a 
                href={socialLinks.vk} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="VK"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.785 16.241s.287-.029.435-.18c.135-.136.132-.39.132-.39s-.02-1.1.46-1.262c.47-.164 1.075.109 1.69.789.39.43.68.78.68.78s.12.18.27.027c.15-.15.078-.4.078-.4s-1.1-2.9.15-3.26c.15-.045.26-.03.34-.02.11.01.24.02.34.12.1.1.07.29.07.29s-.04.25-.08.42c-.1.42-.21.84-.35 1.24-.09.26-.18.52-.25.78-.04.18-.08.36-.1.54 0 .15.01.29.01.43 0 .12.02.24.08.33.06.09.15.12.15.12s.18.03.4-.15c.22-.18 1.5-1.4 1.5-1.4s.09-.07.15-.04c.06.03.04.12.04.12s-.02.28-.05.55c-.06.54-.13 1.08-.2 1.62-.04.27-.08.54-.13.81-.02.14-.05.28-.1.41-.04.1-.09.19-.15.27-.06.08-.13.14-.22.18-.09.04-.19.05-.29.04-.2-.02-.4-.05-.6-.08-.4-.06-.8-.13-1.19-.21-.1-.02-.2-.05-.29-.08-.09-.03-.18-.07-.26-.12-.08-.05-.15-.11-.21-.18-.06-.07-.11-.15-.15-.24-.04-.09-.07-.18-.09-.28-.02-.2-.03-.4-.04-.6 0-.2-.01-.4-.02-.6 0-.1-.01-.2-.03-.3-.02-.1-.05-.19-.09-.28-.04-.09-.09-.17-.15-.24-.06-.07-.13-.13-.21-.18-.08-.05-.17-.09-.26-.12-.09-.03-.19-.06-.29-.08-.39-.08-.79-.15-1.19-.21-.2-.03-.4-.06-.6-.08-.1-.01-.2 0-.29.04-.09.04-.16.1-.22.18-.06.08-.11.17-.15.27-.05.13-.08.27-.1.41-.05.27-.09.54-.13.81-.07.54-.14 1.08-.2 1.62-.03.27-.05.55-.05.55s0 .09.04.12c.06.03.15-.04.15-.04s1.28-1.22 1.5-1.4c.22-.18.4-.15.4-.15s.09-.03.15-.12c.06-.09.08-.21.08-.33 0-.14.01-.28.01-.43-.02-.18-.06-.36-.1-.54-.07-.26-.16-.52-.25-.78-.14-.4-.25-.82-.35-1.24-.04-.17-.08-.42-.08-.42s-.03-.19.07-.29c.1-.1.23-.11.34-.12.08-.01.19-.025.34.02 1.25.36.15 3.26.15 3.26s-.072.25.078.4c.15.153.27.027.27.027s.29-.35.68-.78c.615-.68 1.22-.953 1.69-.789.48.162.46 1.262.46 1.262s0 .254.132.39c.148.151.435.18.435.18z"/>
                </svg>
              </a>
            )}
            {socialLinks.whatsapp && (
              <a 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
            {socialLinks.max && (
              <a 
                href={socialLinks.max} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors text-sm font-medium"
                aria-label="Max"
              >
                Max
              </a>
            )}
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            SEO Services
          </Link>
          <ul className="flex items-center gap-6">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link 
                  href={item.url}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

