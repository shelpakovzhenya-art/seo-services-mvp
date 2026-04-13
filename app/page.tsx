import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const verificationCode = 'yilk8rn94r0d3m5v'

const homeMeta = {
  ru: {
    title: 'Частный SEO-специалист для сайтов услуг и B2B | Shelpakov Digital',
    description:
      'Независимый SEO-специалист для небольших и средних проектов: аудит, структура сайта, ключевые страницы, техническая база и рост обращений из поиска.',
    imageAlt: 'Дизайн главной страницы Shelpakov Digital',
  },
  en: {
    title: 'Independent SEO consultant for service websites and B2B | Shelpakov Digital',
    description:
      'Independent SEO consultant for small and mid-size projects: audits, site structure, key pages, technical foundations, and stronger lead flow from search.',
    imageAlt: 'Shelpakov Digital homepage design',
  },
} as const

export default async function HomePage() {
  const locale = await getRequestLocale()
  const copy = homeMeta[locale]

  return (
    <div className="overflow-hidden bg-[#f6f4ef]">
      <span className="hidden" aria-hidden="true">
        {verificationCode}
      </span>

      <div className="mx-auto block w-full max-w-[390px] md:hidden">
        <Image
          src="/pencil/vZXcm.webp"
          alt={copy.imageAlt}
          width={390}
          height={4934}
          className="block h-auto w-full"
          sizes="100vw"
          priority
          unoptimized
        />
      </div>

      <div className="mx-auto hidden w-full max-w-[1440px] md:block">
        <Image
          src="/pencil/iBo4z.webp"
          alt={copy.imageAlt}
          width={1440}
          height={4259}
          className="block h-auto w-full"
          sizes="100vw"
          priority
          unoptimized
        />
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = homeMeta[locale]

  let page: Awaited<ReturnType<typeof prisma.page.findUnique>> = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
  } catch {
    page = null
  }

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/')
  const title = normalizeMetaTitle(localizedPage?.title, copy.title)
  const description = normalizeMetaDescription(localizedPage?.description, copy.description)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website' as const,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    },
  }
}
