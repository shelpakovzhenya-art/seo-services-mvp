import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import {
  BlogCover,
  localizedPath,
  PageHero,
  ReferencePage,
  referenceBlogCards,
  SectionTitle,
} from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCollectionPageSchema, createItemListSchema } from '@/lib/structured-data'

const pageMetadata: Metadata = {
  title: 'Блог о SEO и digital-маркетинге | Shelpakov Digital',
  description: 'Мысли, кейсы и полезные материалы о SEO, аналитике, контенте, технической базе и росте сайта.',
}

export default async function BlogPage() {
  const locale = await getRequestLocale()
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'Блог', path: '/blog' },
    ],
    { locale }
  )
  const collectionSchema = createCollectionPageSchema(
    {
      path: '/blog',
      name: 'Блог Shelpakov Digital',
      description: pageMetadata.description as string,
    },
    { locale }
  )
  const itemListSchema = createItemListSchema(
    {
      path: '/blog',
      name: 'Материалы блога',
      items: referenceBlogCards.map((post) => ({
        name: post.title,
        path: '/blog',
        description: post.date,
      })),
    },
    { locale }
  )

  return (
    <ReferencePage>
      <JsonLd id="blog-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="blog-collection-schema" data={collectionSchema} />
      <JsonLd id="blog-item-list-schema" data={itemListSchema} />

      <PageHero
        eyebrow="Блог"
        title="Мысли, кейсы и полезные материалы"
        description="Пишем о SEO и digital-маркетинге: без воды, с практическими выводами для бизнеса."
      />

      <section className="mt-5 rounded-lg border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Материалы" description="Подборка статей для владельцев сайтов, маркетологов и команд." />
          <div className="flex flex-wrap gap-2">
            {['Все', 'SEO', 'Аналитика', 'Кейсы', 'Инструменты'].map((chip) => (
              <span key={chip} className="rounded-md border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-slate-200">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {referenceBlogCards.map((post) => (
            <Link key={post.title} href={localizedPath('/blog', locale)} className="group overflow-hidden rounded-lg border border-blue-200/10 bg-slate-950/42 transition hover:-translate-y-1 hover:border-blue-300/35">
              <BlogCover src={post.image} title={post.title} />
              <div className="p-5">
                <p className="text-xs text-slate-400">{post.date}</p>
                <h2 className="mt-2 min-h-[56px] text-lg font-extrabold leading-tight text-white">{post.title}</h2>
                <span className="mt-4 inline-flex text-sm font-bold text-blue-400">Читать материал</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Подпишитесь на обновления</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">Получайте полезные материалы и кейсы первыми.</p>
          </div>
          <form className="flex gap-3">
            <input
              type="email"
              name="email"
              placeholder="Ваш email"
              className="min-w-0 flex-1 rounded-lg border border-blue-200/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
            />
            <button type="submit" aria-label="Подписаться" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              →
            </button>
          </form>
        </div>
      </section>
    </ReferencePage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata,
    alternates: getLocaleAlternates('/blog'),
    openGraph: {
      title: pageMetadata.title as string,
      description: pageMetadata.description as string,
      type: 'website',
    },
  }
}
