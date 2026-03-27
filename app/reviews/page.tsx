import JsonLd from '@/components/JsonLd'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { buildLocalizedReviewListing } from '@/lib/review-listing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

const reviewsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Отзывы',
    title: 'Отзывы клиентов',
    description:
      'Здесь собраны отзывы по реальным проектам: как шла работа, что было удобно в процессе и чем всё закончилось для клиента.',
    emptyEmbed: 'Внешний блок с отзывами пока не подключён.',
    metaTitle: 'Отзывы клиентов | Shelpakov Digital',
    metaDescription:
      'Отзывы клиентов о работе над SEO и сайтом: что делали, как шла коммуникация и что получилось в итоге.',
  },
  en: {
    chip: 'Reviews',
    title: 'Client reviews',
    description:
      'These reviews show real projects: what the task was, how the work felt in practice, and what the client saw in the end.',
    emptyEmbed: 'The external review widget is not connected yet.',
    metaTitle: 'Client reviews | Shelpakov Digital',
    metaDescription:
      'Client reviews about SEO and website work: the task, the communication style, and the practical result.',
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

  reviews = buildLocalizedReviewListing(reviews, locale)
  const localizedPage = locale === 'ru' ? page : null
  const pageContent = stripLeadingMarkdownH1(localizedPage?.content, localizedPage?.h1 || localizedPage?.title || copy.chip)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: copy.chip, path: '/reviews' },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id="reviews-breadcrumbs-schema" data={breadcrumbSchema} />

      <section className="surface-grid surface-pad">
        <h1 className="text-4xl font-semibold text-slate-950 md:text-6xl">{localizedPage?.h1 || copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{localizedPage?.description || copy.description}</p>
      </section>

      {locale === 'ru' && settings?.yandexReviewsEmbed ? (
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
              <p className="text-base font-semibold text-slate-950">{review.author}</p>
              <p className="flex-1 text-sm leading-7 text-slate-700">{review.text}</p>
              {(review.company || review.position) && (
                <p className="mt-2 text-sm text-slate-400">{[review.company, review.position].filter(Boolean).join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

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

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/reviews')
  const title = normalizeMetaTitle(localizedPage?.title, copy.metaTitle)
  const description = normalizeMetaDescription(localizedPage?.description, copy.metaDescription)

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
