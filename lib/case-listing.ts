import { podocenterCase } from '@/lib/podocenter-case'

const PLACEHOLDER_CASE_TITLE = '\u043f\u0440\u0438\u043c\u0435\u0440 \u043a\u0435\u0439\u0441\u0430'
const PLACEHOLDER_CASE_DESCRIPTION =
  '\u0434\u0435\u0442\u0430\u043b\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0431\u0443\u0434\u0443\u0442 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b \u043f\u043e\u0437\u0436\u0435'

type CaseListItem = {
  id?: string | number
  slug?: string | null
  title?: string | null
  description?: string | null
  content?: string | null
  image?: string | null
}

function normalizeText(value?: string | null) {
  return (value || '').trim().toLowerCase()
}

export function isPlaceholderCase(caseItem: CaseListItem) {
  const title = normalizeText(caseItem.title)
  const description = normalizeText(caseItem.description)

  return title === PLACEHOLDER_CASE_TITLE || description.includes(PLACEHOLDER_CASE_DESCRIPTION)
}

export function isPodocenterCase(caseItem: CaseListItem) {
  const title = normalizeText(caseItem.title)

  return caseItem.slug === podocenterCase.slug || title.includes('podocenter')
}

export function buildCaseListing<T extends CaseListItem>(cases: T[]) {
  const visibleCases = cases.filter((caseItem) => !isPlaceholderCase(caseItem))
  const hasPodocenterCard = visibleCases.some((caseItem) => isPodocenterCase(caseItem))

  if (hasPodocenterCard) {
    return visibleCases
  }

  return [
    {
      id: 'podocenter-static-case',
      slug: podocenterCase.slug,
      title: podocenterCase.h1,
      description: podocenterCase.excerpt,
      content: '',
      image: null,
    } as T,
    ...visibleCases,
  ]
}
