import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const reviewsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Отзывы',
    title: 'Отзывы и подтверждение работы',
    description: 'Отзывы полезны тогда, когда помогают понять подход, формат работы и качество коммуникации.',
    proofKicker: 'Что важно в отзыве',
    proofTitle: 'Перед стартом проекта полезно смотреть не только на похвалу, но и на рабочие сигналы',
    proofCards: [
      'Как быстро и понятно исполнитель возвращает конкретные выводы, а не общие обещания.',
      'Есть ли ощущение управляемости: понятные приоритеты, логика шагов и контроль внедрения.',
      'Помогает ли отзыв понять формат коммуникации, а не только эмоциональную оценку “всё понравилось”.',
    ],
    emptyEmbed: 'На этой странице публикуются отзывы клиентов и дополнительные сигналы доверия.',
    metaTitle: 'Отзывы клиентов | Shelpakov Digital',
    metaDescription:
      'Отзывы клиентов о работе над SEO, структурой сайта и упаковкой оффера помогают заранее понять подход, формат коммуникации и ожидания по проекту.',
  },
  en: {
    chip: 'Reviews',
    title: 'Client feedback and proof of work',
    description: 'Reviews matter when they help a new client understand the approach, delivery style, and quality of communication.',
    proofKicker: 'What matters in a review',
    proofTitle: 'Before hiring, it is useful to look not only for praise, but for working signals',
    proofCards: [
      'How quickly and concretely the specialist returns findings instead of vague promises.',
      'Whether the work feels manageable: clear priorities, a logic of steps, and implementation control.',
      'Whether the review helps you understand the communication style, not only the emotional verdict.',
    ],
    emptyEmbed: 'This page publishes client feedback and additional trust signals.',
    metaTitle: 'Client reviews | Shelpakov Digital',
    metaDescription:
      'Client feedback on SEO, website structure, and offer refinement helps new leads understand the approach, communication style, and project expectations.',
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

      <section className="reading-shell">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.proofKicker}</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.proofTitle}</h2>
        </div>
        <div className="uniform-grid-3 mt-6 gap-4">
          {copy.proofCards.map((item: string) => (
            <div key={item} className="uniform-card rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
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
