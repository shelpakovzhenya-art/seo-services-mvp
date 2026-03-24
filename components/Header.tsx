import HeaderClient from '@/components/HeaderClient'
import { prisma } from '@/lib/prisma'

type HeaderMenuItem = {
  id: string
  label: string
  url: string
  order: number
  isActive: boolean
}

const DEFAULT_MENU_ITEMS: HeaderMenuItem[] = [
  { id: '2', label: 'SEO Services', url: '/services', order: 2, isActive: true },
  { id: 'development', label: 'Development', url: '/services/website-development', order: 3, isActive: true },
  { id: '3', label: 'Case Studies', url: '/cases', order: 4, isActive: true },
  { id: '4', label: 'Reviews', url: '/reviews', order: 5, isActive: true },
  { id: '5', label: 'Blog', url: '/blog', order: 6, isActive: true },
  { id: '6', label: 'Contact', url: '/contacts', order: 7, isActive: true },
]

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

  return <HeaderClient settings={settings} menuItems={menuItems} />
}
