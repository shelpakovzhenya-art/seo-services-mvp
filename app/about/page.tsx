import JsonLd from '@/components/JsonLd'
import TrustPageShell from '@/components/trust/TrustPageShell'
import { prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getFullUrl, getLocaleAlternates, getSiteUrl } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { getAboutPageCopy, getEditorialTeam, getLocaleLanguageTag } from '@/lib/trust-content'

export default async function AboutPage() {
  const locale = await getRequestLocale()
  const copy = getAboutPageCopy(locale)
  const team = getEditorialTeam(locale)
  const pagePath = prefixPathWithLocale('/about', locale)
  const pageUrl = getFullUrl(pagePath)
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
      { name: copy.chip, path: '/about' },
    ],
    { locale }
  )
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${pageUrl}#about`,
    url: pageUrl,
    name: copy.title,
    description: copy.description,
    inLanguage: getLocaleLanguageTag(locale),
    isPartOf: {
      '@id': `${getSiteUrl()}#website`,
    },
    about: {
      '@id': `${getSiteUrl()}#brand`,
    },
    mainEntity: {
      '@type': 'ProfessionalService',
      '@id': `${getSiteUrl()}#brand`,
      name: team.name,
      description: team.summary,
    },
  }

  return (
    <>
      <JsonLd id="about-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="about-page-schema" data={aboutPageSchema} />
      <TrustPageShell copy={copy} locale={locale} />
    </>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = getAboutPageCopy(locale)
  const alternates = getLocaleAlternates('/about')

  return {
    title: locale === 'ru' ? 'О подходе Shelpakov Digital' : 'About Shelpakov Digital',
    description: copy.description,
    alternates,
    openGraph: {
      title: locale === 'ru' ? 'О подходе Shelpakov Digital' : 'About Shelpakov Digital',
      description: copy.description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
