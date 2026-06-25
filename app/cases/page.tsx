import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import {
  BlogCover,
  localizedPath,
  ProjectCta,
  ReferencePage,
  referenceCaseCards,
} from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createItemListSchema } from '@/lib/structured-data'

const pageMetadata: Metadata = {
  title: 'Кейсы SEO-продвижения | Shelpakov Digital',
  description: 'Примеры проектов и результатов: рост трафика, заявок, продаж и понятной структуры сайта.',
}

export default async function CasesPage() {
  const locale = await getRequestLocale()
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'Кейсы', path: '/cases' },
    ],
    { locale }
  )
  const itemListSchema = createItemListSchema(
    {
      path: '/cases',
      name: 'Кейсы Shelpakov Digital',
      items: referenceCaseCards.map((item) => ({
        name: item.title,
        path: '/cases',
        description: `${item.subtitle}: ${item.result}`,
      })),
    },
    { locale }
  )

  return (
    <ReferencePage>
      <JsonLd id="cases-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="cases-item-list-schema" data={itemListSchema} />

      <section className="rounded-lg border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase text-blue-400">Кейсы</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">Реальные проекты и результаты</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Показываем, что изменили в структуре, контенте и технической базе, а также какой эффект получили.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Все', 'SEO-продвижение', 'Интернет-магазины', 'Услуги', 'Локальный бизнес'].map((chip) => (
              <span key={chip} className="rounded-md border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-slate-200">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {referenceCaseCards.map((item) => (
            <Link key={item.title} href={localizedPath('/cases', locale)} className="group overflow-hidden rounded-lg border border-blue-200/10 bg-slate-950/42 transition hover:-translate-y-1 hover:border-blue-300/35">
              <BlogCover src={item.image} title={item.title} />
              <div className="p-5">
                <p className="text-xs text-slate-400">{item.subtitle}</p>
                <h2 className="mt-2 text-lg font-extrabold text-white">{item.title}</h2>
                <p className="mt-3 text-2xl font-black text-blue-400">{item.result}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-blue-400">Посмотреть кейс</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProjectCta locale={locale} />
    </ReferencePage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata,
    alternates: getLocaleAlternates('/cases'),
    openGraph: {
      title: pageMetadata.title as string,
      description: pageMetadata.description as string,
      type: 'website',
    },
  }
}
