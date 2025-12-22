import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import ReviewsManager from '@/components/admin/ReviewsManager'

export default async function AdminReviewsPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const reviews = await prisma.review.findMany({
    orderBy: { order: 'asc' }
  })

  // Serialize data to remove Date objects and make it safe for client components
  const serializedReviews = reviews.map(review => ({
    id: review.id,
    author: review.author,
    text: review.text,
    rating: review.rating,
    order: review.order,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Управление отзывами</h1>
      <ReviewsManager initialReviews={serializedReviews} />
    </div>
  )
}

