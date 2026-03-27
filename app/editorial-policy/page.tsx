import JsonLd from '@/components/JsonLd'
import TrustPageShell from '@/components/trust/TrustPageShell'
import { prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getFullUrl, getLocaleAlternates, getSiteUrl } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { getEditorialPolicyPageCopy, getLocaleLanguageTag } from '@/lib/trust-content'

export default async function EditorialPolicyPage() {
  const locale = await getRequestLocale()
  const copy = getEditorialPolicyPageCopy(locale)
  const pagePath = prefixPathWithLocale('/editorial-policy', locale)
  const pageUrl = getFullUrl(pagePath)
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
      { name: copy.chip, path: '/editorial-policy' },
    ],
    { locale }
  )
  const editorialPolicySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#editorial-policy`,
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
  }

  return (
    <>
      <JsonLd id="editorial-policy-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="editorial-policy-page-schema" data={editorialPolicySchema} />
      <TrustPageShell copy={copy} locale={locale} />
    </>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = getEditorialPolicyPageCopy(locale)
  const alternates = getLocaleAlternates('/editorial-policy')
  const title = locale === 'ru' ? 'Редакционная политика | Shelpakov Digital' : 'Editorial policy | Shelpakov Digital'

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
