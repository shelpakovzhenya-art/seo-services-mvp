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
  'seo-dlya-internet-magazina-v-2026-prioritety-bez-lishnikh-raskhodov': '/blog/site-speed-optimization-cover.svg',
  'rabota-za-protsent-v-seo-kogda-model-deystvitelno-rabotaet': '/blog/reputation-seo-cover.svg',
  'seo-strategiya-na-6-mesyatsev-dlya-sayta-uslug': '/blog/redesign-seo-prep-cover.svg',
  'lokalnoe-seo-dlya-filialov-kak-ne-poteryat-goroda-v-vydache': '/blog/domain-redirect-checklist-cover.svg',
  'tekhnicheskiy-seo-cheklist-pered-relizom-ili-redizaynom': '/blog/meta-tags-practice-cover.svg',
  'kak-svyazat-blog-s-kommercheskimi-stranitsami-i-zayavkami': '/blog/canonical-vs-redirect-cover.svg',
  'seo-dlya-b2b-kak-rabotat-s-dlinnym-tsiklom-sdelki': '/blog/seo-lead-quality-cover.svg',
  'bezopasnyy-link-building-v-2026-chto-rabotaet-bez-sanktsiy': '/blog/broken-links-fix-cover.svg',
  'kak-vosstanovit-organiku-posle-rezkogo-padeniya-trafika': '/blog/error-401-seo-cover.svg',
  'content-plan-dlya-seo-na-90-dney-dlya-komandy-bez-khaosa': '/blog/expert-blog-growth-cover.svg',
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
