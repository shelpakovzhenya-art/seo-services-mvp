import JsonLd from '@/components/JsonLd'
import TrustPageShell from '@/components/trust/TrustPageShell'
import { prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getFullUrl, getLocaleAlternates, getSiteUrl } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { getLocaleLanguageTag, getMethodologyPageCopy } from '@/lib/trust-content'

export default async function MethodologyPage() {
  const locale = await getRequestLocale()
  const copy = getMethodologyPageCopy(locale)
  const pagePath = prefixPathWithLocale('/methodology', locale)
  const pageUrl = getFullUrl(pagePath)
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
      { name: copy.chip, path: '/methodology' },
    ],
    { locale }
  )
  const methodologySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#methodology`,
    url: pageUrl,
    name: copy.title,
    description: copy.description,
    inLanguage: getLocaleLanguageTag(locale),
    isPartOf: {
      '@id': `${getSiteUrl()}#website`,
    },
    about: {
      '@id': `${getSiteUrl()}#organization`,
    },
  }

  return (
    <>
      <JsonLd id="methodology-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="methodology-page-schema" data={methodologySchema} />
      <TrustPageShell copy={copy} locale={locale} />
    </>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = getMethodologyPageCopy(locale)
  const alternates = getLocaleAlternates('/methodology')
  const title = locale === 'ru' ? 'Методология работы | Shelpakov Digital' : 'Working methodology | Shelpakov Digital'

  return {
    title,
    description: copy.description,
    alternates,
    openGraph: {
      title,
      description: copy.description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
