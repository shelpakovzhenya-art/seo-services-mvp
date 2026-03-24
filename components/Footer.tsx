import FooterClient from '@/components/FooterClient'
import { prisma } from '@/lib/prisma'

const DEFAULT_MENU_ITEMS = [
  { id: '1', label: 'Home', url: '/', order: 1, isActive: true },
  { id: '2', label: 'Services', url: '/services', order: 2, isActive: true },
  { id: '3', label: 'Cases', url: '/cases', order: 3, isActive: true },
  { id: '4', label: 'Reviews', url: '/reviews', order: 4, isActive: true },
  { id: '5', label: 'Blog', url: '/blog', order: 5, isActive: true },
  { id: '6', label: 'Contacts', url: '/contacts', order: 6, isActive: true },
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

  return <FooterClient settings={settings} menuItems={menuItems} />
}
