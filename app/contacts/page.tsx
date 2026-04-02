import { Clock, Mail } from 'lucide-react'
import BrandPageHero from '@/components/BrandPageHero'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'
import { containsCyrillic } from '@/lib/text-detection'

const contactsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Контакты',
    title: 'Связаться по проекту',
    description: 'Если хотите обсудить сайт, аудит или продвижение, оставьте заявку или напишите напрямую.',
    howToReach: 'Как связаться',
    formTitle: 'Форма обратной связи',
    readinessCards: [
      'Пришлите домен и короткую задачу.',
      'Если услуга неочевидна, опишите симптом.',
      'Для оценки бюджета можно начать с калькулятора.',
    ],
    scheduleFallback: 'Пн-Пт 09:00-17:00',
    metaTitle: 'Контакты | Shelpakov Digital',
    metaDescription:
      'Свяжитесь со мной, чтобы обсудить SEO-продвижение, аудит сайта, структуру страниц, коммерческие факторы и точки роста вашего проекта без лишних обязательств.',
  },
  en: {
    chip: 'Contact',
    title: 'Discuss your project',
    description: 'If you would like to discuss a website, audit, or SEO support, leave a request or reach out directly.',
    howToReach: 'How to get in touch',
    formTitle: 'Contact form',
    readinessCards: [
      'Send the domain and a short task.',
      'If the service is unclear, describe the symptom.',
      'For a rough budget range, the calculator is faster.',
    ],
    scheduleFallback: 'Mon-Fri 09:00-17:00',
    metaTitle: 'Contact | Shelpakov Digital',
    metaDescription:
      'Get in touch to discuss SEO, website audits, page structure, commercial signals, and practical growth opportunities for your project.',
  },
}

export default async function ContactsPage() {
  const locale = await getRequestLocale()
  const copy = contactsCopy[locale]
  let page: any = null
  let settings: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    console.error('Error loading contacts page:', error)
  }

  const localizedPage = locale === 'ru' ? page : null
  const pageContent = stripLeadingMarkdownH1(localizedPage?.content, localizedPage?.h1 || localizedPage?.title || copy.chip)
  const workSchedule =
    locale === 'en' && containsCyrillic(settings?.workSchedule) ? copy.scheduleFallback : settings?.workSchedule || copy.scheduleFallback
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'ru' ? 'Главная' : 'Home', path: '/' },
    { name: copy.chip, path: '/contacts' },
  ], { locale })

  return (
    <div className="page-shell">
      <JsonLd id="contacts-breadcrumbs-schema" data={breadcrumbSchema} />

      <BrandPageHero
        eyebrow={copy.chip}
        title={localizedPage?.h1 || copy.title}
        description={localizedPage?.description || copy.description}
        aside={
          <>
            <div className="page-aside-card">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{copy.howToReach}</div>
              <div className="mt-4 space-y-4">
                <div className="flex min-w-0 items-start gap-3 text-slate-700">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-[#8a5630]" />
                  <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="min-w-0 break-all hover:text-slate-950">
                    {settings?.email || 'shelpakovzhenya@gmail.com'}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Clock className="h-5 w-5 text-[#8a5630]" />
                  <span>{workSchedule}</span>
                </div>
              </div>
            </div>
            <div className="page-aside-card--dark">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#d5b08d]">{locale === 'ru' ? 'Что прислать' : 'What to send'}</div>
              <div className="mt-4 space-y-3">
                {copy.readinessCards.map((item: string) => (
                  <div key={item} className="rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-7 text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="reading-shell h-full">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.howToReach}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex min-w-0 items-start gap-3 text-slate-700">
              <Mail className="h-5 w-5 shrink-0 text-[#8a5630]" />
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="min-w-0 break-all hover:text-slate-950">
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="h-5 w-5 text-[#8a5630]" />
              <span>{workSchedule}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {copy.readinessCards.map((item: string) => (
              <div key={item} className="brand-card-soft px-4 py-3 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>

          {pageContent && (
            <div className="editorial-prose mt-8 max-w-none">
              <RichContent content={pageContent} />
            </div>
          )}
        </div>

        <div id="contact-form" className="page-card h-full scroll-mt-36 md:scroll-mt-40">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.formTitle}</h2>
          <div className="mt-6">
            <LazyContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = contactsCopy[locale]
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
  } catch (error) {
    page = null
  }

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/contacts')
  const title = normalizeMetaTitle(localizedPage?.title, copy.metaTitle)
  const description = normalizeMetaDescription(localizedPage?.description, copy.metaDescription)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
    },
  }
}
