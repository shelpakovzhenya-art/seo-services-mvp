type ReviewRecord = {
  id?: string | number
  author?: string | null
  text?: string | null
  company?: string | null
  position?: string | null
}

const PLACEHOLDER_REVIEW_AUTHOR = 'иван иванов'
const PLACEHOLDER_REVIEW_PHRASE = 'трафик вырос на 200% за 3 месяца'

function normalizeText(value?: string | null) {
  return (value || '').trim().toLowerCase()
}

export function isPlaceholderReview(review: ReviewRecord) {
  return (
    normalizeText(review.author) === PLACEHOLDER_REVIEW_AUTHOR ||
    normalizeText(review.text).includes(PLACEHOLDER_REVIEW_PHRASE)
  )
}

export function buildReviewListing<T extends ReviewRecord>(reviews: T[]) {
  return reviews.filter((review) => !isPlaceholderReview(review))
}
