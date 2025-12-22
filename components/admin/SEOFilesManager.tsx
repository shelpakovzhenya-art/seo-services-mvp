'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, RefreshCw } from 'lucide-react'

export default function SEOFilesManager() {
  const [robotsContent, setRobotsContent] = useState('')
  const [sitemapContent, setSitemapContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({ robots: false, sitemap: false })

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    setLoading(true)
    try {
      const [robotsRes, sitemapRes] = await Promise.all([
        fetch('/api/admin/seo-files/robots'),
        fetch('/api/admin/seo-files/sitemap'),
      ])

      if (robotsRes.ok) {
        const robotsData = await robotsRes.json()
        setRobotsContent(robotsData.content || '')
      }

      if (sitemapRes.ok) {
        const sitemapData = await sitemapRes.json()
        setSitemapContent(sitemapData.content || '')
      }
    } catch (error) {
      console.error('Error loading files:', error)
      alert('Ошибка при загрузке файлов')
    } finally {
      setLoading(false)
    }
  }

  const saveRobots = async () => {
    setSaving({ ...saving, robots: true })
    try {
      const response = await fetch('/api/admin/seo-files/robots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: robotsContent }),
      })

      if (response.ok) {
        alert('robots.txt успешно сохранен')
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving robots.txt:', error)
      alert('Ошибка при сохранении файла')
    } finally {
      setSaving({ ...saving, robots: false })
    }
  }

  const saveSitemap = async () => {
    setSaving({ ...saving, sitemap: true })
    try {
      const response = await fetch('/api/admin/seo-files/sitemap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: sitemapContent }),
      })

      if (response.ok) {
        alert('sitemap.xml успешно сохранен')
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving sitemap.xml:', error)
      alert('Ошибка при сохранении файла')
    } finally {
      setSaving({ ...saving, sitemap: false })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* robots.txt */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">robots.txt</h2>
            <p className="text-sm text-gray-600 mt-1">
              Файл для управления индексацией сайта поисковыми системами
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFiles}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
            <Button
              onClick={saveRobots}
              disabled={saving.robots}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving.robots ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
        <textarea
          value={robotsContent}
          onChange={(e) => setRobotsContent(e.target.value)}
          className="w-full px-4 py-3 border rounded-md font-mono text-sm"
          rows={12}
          placeholder="User-agent: *&#10;Allow: /"
        />
        <div className="mt-2 text-xs text-gray-500">
          Файл доступен по адресу: <code className="bg-gray-100 px-1 rounded">/robots.txt</code>
        </div>
      </div>

      {/* sitemap.xml */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">sitemap.xml</h2>
            <p className="text-sm text-gray-600 mt-1">
              XML-карта сайта для поисковых систем
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFiles}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
            <Button
              onClick={saveSitemap}
              disabled={saving.sitemap}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving.sitemap ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
        <textarea
          value={sitemapContent}
          onChange={(e) => setSitemapContent(e.target.value)}
          className="w-full px-4 py-3 border rounded-md font-mono text-sm"
          rows={20}
          placeholder='<?xml version="1.0" encoding="UTF-8"?>&#10;<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">&#10;  ...&#10;</urlset>'
        />
        <div className="mt-2 text-xs text-gray-500">
          Файл доступен по адресу: <code className="bg-gray-100 px-1 rounded">/sitemap.xml</code>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Полезная информация</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            <strong>robots.txt</strong> - управляет доступом поисковых роботов к страницам сайта
          </li>
          <li>
            <strong>sitemap.xml</strong> - помогает поисковым системам находить и индексировать страницы
          </li>
          <li>Изменения вступают в силу сразу после сохранения</li>
          <li>Файлы сохраняются в директории <code className="bg-blue-100 px-1 rounded">public/</code></li>
        </ul>
      </div>
    </div>
  )
}


