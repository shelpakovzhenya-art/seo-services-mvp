import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BarChart3, FileSearch, FolderKanban, ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/auth'

const cards = [
  {
    title: 'Аудит',
    text: 'Текущий модуль SEO-аудита с обходом сайта, PDF / DOCX и историей запусков.',
    href: '/admin/seo-analytics/audit',
    icon: FileSearch,
  },
  {
    title: 'Отчеты',
    text: 'Список всех месячных SEO-отчетов по проектам, периодам и статусам.',
    href: '/admin/seo-analytics/reports',
    icon: FolderKanban,
  },
  {
    title: 'Месячный SEO-отчет',
    text: 'Создание нового отчета: выбор проекта, периода, загрузка исходников и запуск сборки.',
    href: '/admin/seo-analytics/monthly-report',
    icon: BarChart3,
  },
  {
    title: 'Парсер отчетов',
    text: 'Отдельный экран для проверки распознавания файлов, найденных метрик и предупреждений.',
    href: '/admin/seo-analytics/report-parser',
    icon: ScanSearch,
  },
]

export default async function SeoAnalyticsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-950">SEO / Аналитика</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
          Общий раздел для аудита, парсеров и месячных SEO-отчетов. Аудит и отчет живут в одном административном блоке,
          но работают как независимые инструменты.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.href} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{card.text}</p>
              <Button asChild variant="outline" className="mt-6 rounded-full">
                <Link href={card.href}>Открыть</Link>
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
