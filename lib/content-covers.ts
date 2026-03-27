type BlogCoverSource = {
  slug?: string | null
  coverImage?: string | null
}

type CaseCoverSource = {
  slug?: string | null
  image?: string | null
}

const blogFallbackCoverMap: Record<string, string> = {
  'geo-i-ii-vydacha-kak-poluchat-trafik-v-2026': '/blog/ai-traffic-geo-cover.svg',
  'seo-trendy-2026-chto-rabotaet-segodnya': '/blog/seo-trends-2026-cover.svg',
  'kak-izmerit-effektivnost-seo-i-ai-trafika': '/blog/seo-effectiveness-ai-cover.svg',
  'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  'kak-podgotovit-sait-k-geo-i-ii-vydache': '/blog/ai-traffic-geo-cover.svg',
  'seo-dlya-brand-media-kak-izmerit-polzu': '/blog/seo-effectiveness-ai-cover.svg',
}

const caseFallbackCoverMap: Record<string, string> = {
  'botiq-seo-audit': '/cases/botiq/audit-cover.png',
}

export function isInlineImageAsset(src: string) {
  return src.startsWith('data:')
}

export function getBlogCover(post: BlogCoverSource) {
  const directCover = post.coverImage?.trim()

  if (directCover) {
    return directCover
  }

  const slug = post.slug?.trim() || ''
  return blogFallbackCoverMap[slug] || ''
}

export function getCaseCover(caseItem: CaseCoverSource) {
  const directCover = caseItem.image?.trim()

  if (directCover) {
    return directCover
  }

  const slug = caseItem.slug?.trim() || ''
  return caseFallbackCoverMap[slug] || ''
}
