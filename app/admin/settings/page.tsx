import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import SettingsManager from '@/components/admin/SettingsManager'

export default async function AdminSettingsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  let settings: any = null
  let menuItems: any[] = []
  
  try {
    settings = await prisma.siteSettings.findFirst()
    menuItems = await prisma.menuItem.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading settings:', error)
    settings = null
    menuItems = []
  }

  // Serialize data to remove Date objects and make it safe for client components
  const serializedSettings = settings ? {
    id: settings.id,
    workSchedule: settings.workSchedule ?? null,
    email: settings.email ?? null,
    telegramUrl: settings.telegramUrl ?? null,
    vkUrl: settings.vkUrl ?? null,
    whatsappUrl: settings.whatsappUrl ?? null,
    maxUrl: settings.maxUrl ?? null,
    footerText: settings.footerText ?? null,
    globalDiscountEnabled: Boolean(settings.globalDiscountEnabled),
    globalDiscountPercent: Number(settings.globalDiscountPercent) || 0,
    yandexReviewsEmbed: settings.yandexReviewsEmbed ?? null,
  } : null

  const serializedMenuItems = menuItems.map(item => ({
    id: item.id,
    label: item.label,
    url: item.url,
    order: Number(item.order) || 0,
    isActive: Boolean(item.isActive),
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Настройки сайта</h1>
      <SettingsManager initialSettings={serializedSettings} initialMenuItems={serializedMenuItems} />
    </div>
  )
}

