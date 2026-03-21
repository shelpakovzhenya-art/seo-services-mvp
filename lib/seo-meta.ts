export const META_TITLE_LIMIT = 70
export const META_DESCRIPTION_MIN = 140
export const META_DESCRIPTION_MAX = 160

const BRAND_NAME = 'Shelpakov Digital'
const BRAND_SUFFIX = ` | ${BRAND_NAME}`
const DESCRIPTION_EXTENSION = ' Подходит для сайта услуг, B2B-проектов и роста заявок.'

function cleanMetaText(value: string | null | undefined) {
  return (value || '').replace(/\s+/g, ' ').trim()
}

function stripBrand(title: string) {
  return title
    .replace(new RegExp(`\\s*[|:-]\\s*${BRAND_NAME}$`, 'i'), '')
    .replace(new RegExp(`${BRAND_NAME}$`, 'i'), '')
    .trim()
}

function trimToWord(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  const sliced = value.slice(0, Math.max(0, maxLength - 3)).trimEnd()
  const lastSpace = sliced.lastIndexOf(' ')

  if (lastSpace > 28) {
    return `${sliced.slice(0, lastSpace).trimEnd()}...`
  }

  return `${sliced}...`
}

function withBrand(baseTitle: string) {
  const normalizedBase = stripBrand(cleanMetaText(baseTitle))

  if (!normalizedBase) {
    return BRAND_NAME
  }

  const maxBaseLength = META_TITLE_LIMIT - BRAND_SUFFIX.length
  return `${trimToWord(normalizedBase, maxBaseLength)}${BRAND_SUFFIX}`
}

function isInvalidMetaText(value: string) {
  return /SEO Update|SEO Services/i.test(value)
}

function fitDescription(value: string) {
  let normalized = cleanMetaText(value)

  if (!normalized) {
    normalized = `SEO, структура сайта и рост заявок для бизнеса от ${BRAND_NAME}.`
  }

  while (normalized.length < META_DESCRIPTION_MIN) {
    const addition = normalized.includes(DESCRIPTION_EXTENSION) ? ' SEO, структура и заявки без лишней воды.' : DESCRIPTION_EXTENSION
    normalized = cleanMetaText(`${normalized}${addition}`)
    if (normalized.length > META_DESCRIPTION_MAX) {
      break
    }
  }

  return trimToWord(normalized, META_DESCRIPTION_MAX)
}

export function normalizeMetaTitle(candidate: string | null | undefined, fallback: string) {
  const cleanCandidate = stripBrand(cleanMetaText(candidate))
  const cleanFallback = stripBrand(cleanMetaText(fallback))

  if (
    cleanCandidate &&
    cleanCandidate.length <= META_TITLE_LIMIT - BRAND_SUFFIX.length &&
    !isInvalidMetaText(cleanCandidate)
  ) {
    return withBrand(cleanCandidate)
  }

  return withBrand(cleanFallback)
}

export function normalizeMetaDescription(candidate: string | null | undefined, fallback: string) {
  const cleanCandidate = cleanMetaText(candidate)
  const cleanFallback = cleanMetaText(fallback)

  if (
    cleanCandidate &&
    cleanCandidate.length >= META_DESCRIPTION_MIN &&
    cleanCandidate.length <= META_DESCRIPTION_MAX &&
    !isInvalidMetaText(cleanCandidate)
  ) {
    return cleanCandidate
  }

  return fitDescription(cleanFallback || cleanCandidate)
}

export function absoluteTitle(title: string) {
  return { absolute: title } as const
}
