import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

export default async function ReviewsPage() {
  let page: any = null
  let settings: any = null
  let reviews: any[] = []
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'reviews' } })
    settings = await prisma.siteSettings.findFirst()
    reviews = await prisma.review.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading reviews page:', error)
    page = null
    settings = null
    reviews = []
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{page?.h1 || 'Отзывы'}</h1>
      
      {page?.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}

      {settings?.yandexReviewsEmbed ? (
        <div 
          className="mb-12"
          dangerouslySetInnerHTML={{ __html: settings.yandexReviewsEmbed }}
        />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
          <p className="text-yellow-800">Подключите виджет Яндекс Отзывов в админке</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4">{review.text}</p>
              <p className="text-sm text-gray-500 font-semibold">— {review.author}</p>
            </div>
          ))}
        </div>
      )}

      {page?.content && (
        <div className="prose max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
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
  return {
    title: page?.title || 'Отзывы - SEO Services',
    description: page?.description || 'Отзывы наших клиентов',
  }
}

