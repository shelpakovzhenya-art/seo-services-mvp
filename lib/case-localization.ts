import type { Locale } from '@/lib/i18n'
import { botiqCase } from '@/lib/botiq-case'
import { podocenterCase } from '@/lib/podocenter-case'

type LocalizableCaseRecord = {
  slug?: string | null
  title?: string | null
  description?: string | null
  h1?: string | null
  excerpt?: string | null
}

const englishCaseOverrides: Record<string, Partial<LocalizableCaseRecord>> = {
  [podocenterCase.slug]: {
    h1: 'How a podiatry center in Kazan built a stronger site structure around demand and leads',
    title: 'PodoCenter SEO case study: stronger local visibility and lead flow in Kazan',
    description:
      'A case study of a local medical project: by rebuilding service pages, content, commercial blocks, and the technical foundation, the PodoCenter website captured demand in Kazan more effectively.',
    excerpt:
      'A practical case about rebuilding a local medical website: dedicated service pages, article-to-service bridges, a clearer path to appointment, and stronger local visibility in Kazan.',
  },
  [botiqCase.slug]: {
    title: 'Botiq SEO case study: site structure, visibility, and demand capture',
    description:
      'A practical SEO case study on strengthening site structure, landing pages, and commercial signals to capture demand more consistently.',
  },
}

export function localizeCaseRecord<T extends LocalizableCaseRecord>(caseItem: T, locale: Locale): T {
  if (locale !== 'en') {
    return caseItem
  }

  const slug = caseItem.slug || ''
  const override = englishCaseOverrides[slug]

  return override ? ({ ...caseItem, ...override } as T) : caseItem
}
