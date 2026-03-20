export function normalizeMetaTitle(candidate: string | null | undefined, fallback: string) {
  const clean = (candidate || '').replace(/\s+/g, ' ').trim()

  if (
    !clean ||
    clean.length > 70 ||
    /SEO Update|SEO Services/i.test(clean)
  ) {
    return fallback
  }

  return clean
}

export function normalizeMetaDescription(candidate: string | null | undefined, fallback: string) {
  const clean = (candidate || '').replace(/\s+/g, ' ').trim()

  if (
    !clean ||
    clean.length < 140 ||
    clean.length > 160 ||
    /SEO Update|SEO Services/i.test(clean)
  ) {
    return fallback
  }

  return clean
}
