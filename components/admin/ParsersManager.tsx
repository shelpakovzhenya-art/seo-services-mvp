'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface ParserJob {
  id: string
  type: string
  status: string
  result: string | null
  error: string | null
  createdAt: Date
  completedAt: Date | null
}

export default function ParsersManager({ initialJobs }: { initialJobs: ParserJob[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRunSitemapParser = async () => {
    if (!sitemapUrl.trim()) {
      alert('Введите URL sitemap.xml')
      return
    }

    setIsRunning(true)
    try {
      const response = await fetch('/api/admin/parsers/sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sitemapUrl }),
      })

      if (response.ok) {
        const job = await response.json()
        setJobs([job, ...jobs])
        setSitemapUrl('')
        alert('Парсер запущен')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при запуске парсера')
      }
    } catch (error) {
      console.error('Error running parser:', error)
      alert('Ошибка при запуске парсера')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sitemap URL Extractor</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL sitemap.xml</label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <Button 
            onClick={handleRunSitemapParser} 
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Запуск...' : 'Запустить парсер'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">История запусков</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Тип</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Результат</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3">{job.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'failed' ? 'bg-red-100 text-red-800' :
                      job.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {job.error ? (
                      <span className="text-red-600">{job.error}</span>
                    ) : job.result ? (
                      <details>
                        <summary className="cursor-pointer text-blue-600">
                          Показать результат
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(JSON.parse(job.result), null, 2)}
                        </pre>
                      </details>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(job.createdAt).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


