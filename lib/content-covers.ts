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
  'kak-podgotovit-sait-k-geo-i-ii-vydache': '/blog/geo-ai-readiness-cover.svg',
  'seo-dlya-brand-media-kak-izmerit-polzu': '/blog/brand-media-impact-cover.svg',
  'pereezd-na-novyy-domen-bez-poteri-trafika': '/blog/domain-migration-plan-cover.svg',
  'canonical-ili-301-redirekt-kak-vybrat-dlya-seo': '/blog/canonical-vs-redirect-cover.svg',
  '301-redirekt-s-domena-na-domen-checklist-bez-poter': '/blog/domain-redirect-checklist-cover.svg',
  'oshibka-401-unauthorized-vliyanie-na-indeksaciyu-i-seo': '/blog/error-401-seo-cover.svg',
  'bitye-ssylki-na-saite-kak-naiti-i-ustranit-bez-haosa': '/blog/broken-links-fix-cover.svg',
  'chto-vliyaet-na-skorost-saita-i-kak-uskorit-kommercheskie-stranicy': '/blog/site-speed-optimization-cover.svg',
  'meta-tegi-title-description-h1-praktika-dlya-uslug': '/blog/meta-tags-practice-cover.svg',
  'seo-dlya-media-i-ekspertnogo-bloga-kak-rasti-bez-vody': '/blog/expert-blog-growth-cover.svg',
  'kak-podgotovit-sait-k-redizainu-i-razrabotke-bez-prosadki-seo': '/blog/redesign-seo-prep-cover.svg',
  'kachestvo-lidov-iz-seo-pochemu-vazhnee-obema-trafika': '/blog/seo-lead-quality-cover.svg',
  'reputaciya-i-seo-kak-otzyvy-vliyayut-na-vidimost-i-zayavki': '/blog/reputation-seo-cover.svg',
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
