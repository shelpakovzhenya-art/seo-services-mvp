import Link from 'next/link'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { buildReviewListing } from '@/lib/review-listing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const reviewsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Отзывы',
    title: 'Отзывы и подтверждение работы',
    description:
      'Отзывы полезны, когда по ним видно не только эмоцию, но и задачу, ход проекта и качество обратной связи во время работы.',
    emptyEmbed:
      'Здесь можно показать отзывы клиентов. Лучше всего этот раздел работает в связке с кейсами и понятными страницами услуг.',
    nextKicker: 'Куда смотреть дальше',
    nextTitle: 'Отзывы работают сильнее вместе с кейсами и страницами услуг',
    nextSteps: [
      {
        href: '/cases',
        title: 'Посмотреть кейсы',
        text: 'Если важнее увидеть исходную ситуацию, приоритеты, внедрение и эффект по проекту.',
      },
      {
        href: '/services',
        title: 'Сравнить форматы работ',
        text: 'Если нужно понять, с чего разумнее начинать: аудит, техбаза, разработка или системное SEO.',
      },
      {
        href: '/contacts',
        title: 'Написать по проекту',
        text: 'Если задача уже понятна и нужен быстрый ориентир по следующему шагу.',
      },
    ],
    metaTitle: 'Отзывы клиентов | Shelpakov Digital',
    metaDescription:
      'Отзывы клиентов о работе над SEO и сайтом помогают понять не только итог, но и стиль коммуникации, ход проекта и качество обратной связи.',
  },
  en: {
    chip: 'Reviews',
    title: 'Client feedback and proof of work',
    description:
      'Reviews matter when they show the task, the project flow, and the quality of communication, not praise alone.',
    emptyEmbed:
      'Client feedback can be shown here. This section works best together with case studies and clear service pages.',
    nextKicker: 'Where to go next',
    nextTitle: 'Reviews are more useful when paired with case studies and service pages',
    nextSteps: [
      {
        href: '/cases',
        title: 'See case studies',
        text: 'If you want to understand the starting point, the implementation priorities, and the result.',
      },
      {
        href: '/services',
        title: 'Compare service formats',
        text: 'If you need to decide whether the first step is an audit, technical work, development, or ongoing SEO.',
      },
      {
        href: '/contacts',
        title: 'Reach out',
        text: 'If the task is already clear and you only need a quick recommendation on what to do next.',
      },
    ],
    metaTitle: 'Client reviews | Shelpakov Digital',
    metaDescription:
      'Client reviews on SEO and website work help a new lead understand the task, the project rhythm, and the quality of feedback.',
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

  reviews = buildReviewListing(reviews)

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

      {reviews.length > 0 ? (
        <div className="uniform-grid-3 mt-8">
          {reviews.map((review) => (
            <div key={review.id} className="uniform-card glass-panel interactive-card p-7">
              <div className="mb-3 flex items-center gap-1 text-xl text-orange-400">
                {[...Array(review.rating)].map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-slate-700">{review.text}</p>
              <p className="mt-4 text-sm font-semibold text-slate-500">— {review.author}</p>
              {(review.company || review.position) && (
                <p className="mt-2 text-sm text-slate-400">{[review.company, review.position].filter(Boolean).join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

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

      {pageContent ? (
        <div className="reading-shell mt-8">
          <div className="editorial-prose max-w-none">
            <RichContent content={pageContent} />
          </div>
        </div>
      ) : null}
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
