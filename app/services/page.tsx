import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import {
  processCards,
  ProjectCta,
  ReferencePage,
  referenceServices,
  SectionTitle,
  ServiceCard,
  trustHighlights,
  IconTile,
} from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCollectionPageSchema, createItemListSchema } from '@/lib/structured-data'

const pageMetadata: Metadata = {
  title: 'Услуги SEO-продвижения | Shelpakov Digital',
  description:
    'Комплексные SEO-услуги для роста трафика и заявок: продвижение, аудит, техническая поддержка, контент, реклама и линкбилдинг.',
}

export default async function ServicesIndexPage() {
  const locale = await getRequestLocale()
  const breadcrumbsSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'Услуги', path: '/services' },
    ],
    { locale }
  )
  const collectionSchema = createCollectionPageSchema(
    {
      path: '/services',
      name: 'Услуги Shelpakov Digital',
      description: pageMetadata.description as string,
    },
    { locale }
  )
  const itemListSchema = createItemListSchema(
    {
      path: '/services',
      name: 'SEO-услуги',
      items: referenceServices.map((service) => ({
        name: service.title,
        path: '/services',
        description: service.text,
      })),
    },
    { locale }
  )

  return (
    <ReferencePage>
      <JsonLd id="services-breadcrumbs-schema" data={breadcrumbsSchema} />
      <JsonLd id="services-collection-schema" data={collectionSchema} />
      <JsonLd id="services-item-list-schema" data={itemListSchema} />

      <section className="rounded-lg border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase text-blue-400">Услуги</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">Комплексные решения для роста вашего бизнеса</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Продвигаем сайт системно: от аудита и технической базы до контента, рекламы и роста заявок.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {referenceServices.map((service) => (
            <ServiceCard key={service.title} card={service} />
          ))}
        </div>
      </section>

      <section id="process" className="mt-5 rounded-lg border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
        <SectionTitle title="SEO, которое даёт результат" description="Мы не просто продвигаем сайты, а фиксируем структуру, спрос и путь до заявки." />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustHighlights.map((item) => (
            <article key={item.label} className="rounded-lg border border-blue-200/10 bg-slate-950/42 p-5">
              <IconTile icon={item.icon} />
              <h2 className="mt-5 text-lg font-extrabold text-white">{item.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {processCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-blue-200/10 bg-slate-950/36 p-5">
              <IconTile icon={card.icon} />
              <h2 className="mt-5 text-lg font-extrabold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
            </article>
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
    alternates: getLocaleAlternates('/services'),
    openGraph: {
      title: pageMetadata.title as string,
      description: pageMetadata.description as string,
      type: 'website',
    },
  }
}
