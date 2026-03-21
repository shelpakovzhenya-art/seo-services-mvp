import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

export default async function ReviewsPage() {
  let page: any = null
  let settings: any = null
  let reviews: any[] = []

  try {
    page = await prisma.page.findUnique({ where: { slug: 'reviews' } })
    settings = await prisma.siteSettings.findFirst()
    reviews = await prisma.review.findMany({
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Error loading reviews page:', error)
    page = null
    settings = null
    reviews = []
  }

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || 'Отзывы')

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Отзывы</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">
          {page?.h1 || 'Отзывы и подтверждение работы'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {page?.description || 'Отзывы полезны тогда, когда помогают понять подход, формат работы и качество коммуникации.'}
        </p>
      </section>

      {settings?.yandexReviewsEmbed ? (
        <div className="page-card mt-8" dangerouslySetInnerHTML={{ __html: settings.yandexReviewsEmbed }} />
      ) : (
        <div className="page-card mt-8">
          <p className="text-slate-600">На этой странице публикуются отзывы клиентов и дополнительные сигналы доверия.</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="page-card">
              <div className="mb-3 flex items-center gap-1 text-xl text-orange-400">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-slate-700">{review.text}</p>
              <p className="mt-4 text-sm font-semibold text-slate-500">— {review.author}</p>
            </div>
          ))}
        </div>
      )}

      {pageContent && (
        <div className="page-card mt-8 prose max-w-none prose-slate">
          <RichContent content={pageContent} />
        </div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'reviews' } })
  } catch (error) {
    page = null
  }
  const { getFullUrl } = await import('@/lib/site-url')
  const reviewsUrl = getFullUrl('/reviews')
  const fallbackTitle = 'Отзывы клиентов | Shelpakov Digital'
  const fallbackDescription =
    'Отзывы клиентов о работе над SEO, структурой сайта и упаковкой оффера помогают заранее понять подход, формат коммуникации и ожидания по проекту.'
  const title = normalizeMetaTitle(page?.title, fallbackTitle)
  const description = normalizeMetaDescription(page?.description, fallbackDescription)

  return {
    title,
    description,
    alternates: {
      canonical: reviewsUrl,
    },
    openGraph: {
      title,
      description,
      url: reviewsUrl,
      type: 'website',
    },
  }
}
