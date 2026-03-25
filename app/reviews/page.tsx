import Link from 'next/link'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const reviewsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Отзывы',
    title: 'Отзывы и подтверждение работы',
    description: 'Отзывы полезны, когда по ним видно не только похвалу, но и задачу, ход работы и качество коммуникации.',
    emptyEmbed: 'Здесь публикуются отзывы клиентов. Лучше всего они работают в связке с кейсами и страницами услуг.',
    nextKicker: 'Куда смотреть дальше',
    nextTitle: 'Отзывы дают больше пользы вместе с кейсами и страницами услуг',
    nextSteps: [
      {
        href: '/cases',
        title: 'Сначала посмотреть кейсы',
        text: 'Если важнее увидеть исходную ситуацию, список изменений и эффект по проекту.',
      },
      {
        href: '/services',
        title: 'Сравнить форматы работ',
        text: 'Если нужно понять, с чего логичнее начинать: аудит, техоптимизация, разработка или системное SEO.',
      },
      {
        href: '/contacts',
        title: 'Написать по проекту',
        text: 'Если задача уже понятна и нужен быстрый ориентир по следующему шагу.',
      },
    ],
    metaTitle: 'Отзывы клиентов | Shelpakov Digital',
    metaDescription:
      'Отзывы клиентов о работе над SEO и сайтом: по ним проще понять задачу, стиль коммуникации, ход проекта и качество обратной связи.',
  },
  en: {
    chip: 'Reviews',
    title: 'Client feedback and proof of work',
    description: 'Reviews matter when they show the task, the working process, and the quality of communication, not praise alone.',
    emptyEmbed: 'This page publishes client feedback. It works best together with case studies and service pages.',
    nextKicker: 'Where to go next',
    nextTitle: 'Reviews are more useful when paired with case studies and service pages',
    nextSteps: [
      {
        href: '/cases',
        title: 'Start with case studies',
        text: 'If you want to see the starting point, the changes made, and the effect on the project.',
      },
      {
        href: '/services',
        title: 'Compare service formats',
        text: 'If you need to understand whether the right first move is an audit, technical work, development, or ongoing SEO.',
      },
      {
        href: '/contacts',
        title: 'Reach out about your project',
        text: 'If the task is already clear and you only need a fast recommendation on the next step.',
      },
    ],
    metaTitle: 'Client reviews | Shelpakov Digital',
    metaDescription:
      'Client feedback on SEO and website work helps a new lead understand the task, communication style, project rhythm, and quality of feedback.',
  },
}

export default async function ReviewsPage() {
  const locale = await getRequestLocale()
  const copy = reviewsCopy[locale]
  let page: any = null
  let settings: any = null
  let reviews: any[] = []

  try {
    page = await prisma.page.findUnique({ where: { slug: 'reviews' } })
    settings = await prisma.siteSettings.findFirst()
    reviews = await prisma.review.findMany({ orderBy: { order: 'asc' } })
  } catch (error) {
    console.error('Error loading reviews page:', error)
  }

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || copy.chip)

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <span className="warm-chip">{copy.chip}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || copy.description}</p>
      </section>

      {settings?.yandexReviewsEmbed ? (
        <div
          className="reading-shell mt-8 overflow-hidden [&_div]:max-w-full [&_iframe]:max-w-full [&_iframe]:!w-full [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: settings.yandexReviewsEmbed }}
        />
      ) : (
        <div className="reading-shell mt-8">
          <p className="text-slate-600">{copy.emptyEmbed}</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="uniform-grid-3 mt-8">
          {reviews.map((review) => (
            <div key={review.id} className="uniform-card glass-panel interactive-card p-7">
              <div className="mb-3 flex items-center gap-1 text-xl text-orange-400">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-slate-700">{review.text}</p>
              <p className="mt-4 text-sm font-semibold text-slate-500">— {review.author}</p>
            </div>
          ))}
        </div>
      )}

      <section className="reading-shell mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.nextKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.nextTitle}</h2>
          </div>
        </div>

        <div className="uniform-grid-3 mt-6 gap-4">
          {copy.nextSteps.map((item: any) => (
            <Link
              key={item.href}
              href={prefixPathWithLocale(item.href, locale)}
              className="uniform-card rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:border-cyan-200 hover:bg-white"
            >
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {pageContent && (
        <div className="reading-shell mt-8">
          <div className="editorial-prose max-w-none">
            <RichContent content={pageContent} />
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = reviewsCopy[locale]
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'reviews' } })
  } catch (error) {
    page = null
  }

  const alternates = getLocaleAlternates('/reviews')
  const title = normalizeMetaTitle(page?.title, copy.metaTitle)
  const description = normalizeMetaDescription(page?.description, copy.metaDescription)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
