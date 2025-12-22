'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SiteSettings {
  id: string
  workSchedule: string | null
  email: string | null
  telegramUrl: string | null
  vkUrl: string | null
  whatsappUrl: string | null
  maxUrl: string | null
  footerText: string | null
  globalDiscountEnabled: boolean
  globalDiscountPercent: number
  yandexReviewsEmbed: string | null
}

interface MenuItem {
  id: string
  label: string
  url: string
  order: number
  isActive: boolean
}

export default function SettingsManager({
  initialSettings,
  initialMenuItems,
}: {
  initialSettings: SiteSettings | null
  initialMenuItems: MenuItem[]
}) {
  const [settings, setSettings] = useState(initialSettings)
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [formData, setFormData] = useState({
    workSchedule: settings?.workSchedule || '',
    email: settings?.email || '',
    telegramUrl: settings?.telegramUrl || '',
    vkUrl: settings?.vkUrl || '',
    whatsappUrl: settings?.whatsappUrl || '',
    maxUrl: settings?.maxUrl || '',
    footerText: settings?.footerText || '',
    globalDiscountEnabled: settings?.globalDiscountEnabled || false,
    globalDiscountPercent: settings?.globalDiscountPercent || 0,
    yandexReviewsEmbed: settings?.yandexReviewsEmbed || '',
  })

  const handleSaveSettings = async () => {
    try {
      // Convert empty strings to null for optional fields
      const dataToSend = {
        ...formData,
        workSchedule: formData.workSchedule.trim() || null,
        email: formData.email.trim() || null,
        telegramUrl: formData.telegramUrl.trim() || null,
        vkUrl: formData.vkUrl.trim() || null,
        whatsappUrl: formData.whatsappUrl.trim() || null,
        maxUrl: formData.maxUrl.trim() || null,
        footerText: formData.footerText.trim() || null,
        yandexReviewsEmbed: formData.yandexReviewsEmbed.trim() || null,
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        alert('Настройки сохранены')
        // Reload the page to show updated data
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении настроек')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ошибка при сохранении настроек. Проверьте консоль для деталей.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Основные настройки</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">График работы</label>
            <input
              type="text"
              value={formData.workSchedule}
              onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Telegram URL</label>
              <input
                type="url"
                value={formData.telegramUrl}
                onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">VK URL</label>
              <input
                type="url"
                value={formData.vkUrl}
                onChange={(e) => setFormData({ ...formData, vkUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp URL</label>
              <input
                type="url"
                value={formData.whatsappUrl}
                onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max URL</label>
              <input
                type="url"
                value={formData.maxUrl}
                onChange={(e) => setFormData({ ...formData, maxUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Текст футера</label>
            <textarea
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              rows={3}
            />
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Скидка</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.globalDiscountEnabled}
                  onChange={(e) => setFormData({ ...formData, globalDiscountEnabled: e.target.checked })}
                />
                <span>Включить скидку</span>
              </label>
              <div>
                <label className="block text-sm font-medium mb-1">Процент скидки</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.globalDiscountPercent}
                  onChange={(e) => setFormData({ ...formData, globalDiscountPercent: parseFloat(e.target.value) || 0 })}
                  className="w-24 px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Яндекс Отзывы Embed Code
              <span className="text-xs text-gray-500 ml-2">(HTML код виджета)</span>
            </label>
            <textarea
              value={formData.yandexReviewsEmbed}
              onChange={(e) => setFormData({ ...formData, yandexReviewsEmbed: e.target.value })}
              className="w-full px-4 py-2 border rounded-md font-mono text-sm"
              rows={6}
              placeholder="Вставьте HTML код виджета Яндекс Отзывов"
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Внимание: используйте только доверенный код от Яндекс
            </p>
          </div>
          <Button onClick={handleSaveSettings}>Сохранить настройки</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Меню</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded">
              <span className="w-8 text-sm text-gray-500">{item.order}</span>
              <span className="flex-1">{item.label}</span>
              <span className="text-sm text-gray-500">{item.url}</span>
              <span className={item.isActive ? 'text-green-600' : 'text-gray-400'}>
                {item.isActive ? 'Активно' : 'Неактивно'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


