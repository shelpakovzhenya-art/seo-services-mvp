'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Save } from 'lucide-react'

type SitemapSource = 'generated' | 'file'

export default function SEOFilesManager() {
  const [robotsContent, setRobotsContent] = useState('')
  const [sitemapContent, setSitemapContent] = useState('')
  const [sitemapSource, setSitemapSource] = useState<SitemapSource>('generated')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({ robots: false, sitemap: false })

  useEffect(() => {
    void loadFiles()
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
        setSitemapSource(sitemapData.source === 'file' ? 'file' : 'generated')
      }
    } catch (error) {
      console.error('Error loading files:', error)
      alert('Ошибка при загрузке SEO-файлов')
    } finally {
      setLoading(false)
    }
  }

  const saveRobots = async () => {
    setSaving((current) => ({ ...current, robots: true }))
    try {
      const response = await fetch('/api/admin/seo-files/robots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: robotsContent }),
      })

      if (response.ok) {
        alert('robots.txt успешно сохранён')
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving robots.txt:', error)
      alert('Ошибка при сохранении файла')
    } finally {
      setSaving((current) => ({ ...current, robots: false }))
    }
  }

  const saveSitemap = async () => {
    setSaving((current) => ({ ...current, sitemap: true }))
    try {
      const response = await fetch('/api/admin/seo-files/sitemap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: sitemapContent }),
      })

      if (response.ok) {
        setSitemapSource('file')
        alert('sitemap.xml успешно сохранён')
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving sitemap.xml:', error)
      alert('Ошибка при сохранении файла')
    } finally {
      setSaving((current) => ({ ...current, sitemap: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">robots.txt</h2>
            <p className="mt-1 text-sm text-gray-600">
              Файл для управления индексацией сайта поисковыми системами
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Обновить
            </Button>
            <Button onClick={saveRobots} disabled={saving.robots}>
              <Save className="mr-2 h-4 w-4" />
              {saving.robots ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>

        <textarea
          value={robotsContent}
          onChange={(event) => setRobotsContent(event.target.value)}
          className="w-full rounded-md border px-4 py-3 font-mono text-sm"
          rows={12}
          placeholder={'User-agent: *\nAllow: /'}
        />

        <div className="mt-2 text-xs text-gray-500">
          Файл доступен по адресу: <code className="rounded bg-gray-100 px-1">/robots.txt</code>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">sitemap.xml</h2>
            <p className="mt-1 text-sm text-gray-600">
              XML-карта сайта для поисковых систем
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Сейчас используется:{' '}
              <span className="font-medium text-gray-700">
                {sitemapSource === 'file'
                  ? 'сохранённый файл из public/sitemap.xml'
                  : 'живая генерация по текущим страницам сайта'}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Обновить
            </Button>
            <Button onClick={saveSitemap} disabled={saving.sitemap}>
              <Save className="mr-2 h-4 w-4" />
              {saving.sitemap ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>

        <textarea
          value={sitemapContent}
          onChange={(event) => setSitemapContent(event.target.value)}
          className="w-full rounded-md border px-4 py-3 font-mono text-sm"
          rows={20}
          placeholder={'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ...\n</urlset>'}
        />

        <div className="mt-2 text-xs text-gray-500">
          Файл доступен по адресу: <code className="rounded bg-gray-100 px-1">/sitemap.xml</code>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">Полезно знать</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
          <li>
            <strong>robots.txt</strong> управляет доступом поисковых роботов к страницам сайта.
          </li>
          <li>
            <strong>sitemap.xml</strong> помогает поисковым системам находить и индексировать страницы.
          </li>
          <li>
            Если файл sitemap.xml не сохранён вручную, в админке и на сайте показывается живая генерация по текущим страницам.
          </li>
          <li>
            Если сохранить sitemap.xml вручную, он станет override-версией и будет отдаваться сайтом как основной файл.
          </li>
        </ul>
      </div>
    </div>
  )
}
