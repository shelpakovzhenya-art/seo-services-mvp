import { Clock, Mail } from 'lucide-react'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const contactsCopy: Record<Locale, any> = {
  ru: {
    chip: 'Контакты',
    title: 'Связаться по проекту',
    description: 'Если хотите обсудить сайт, аудит или продвижение, оставьте заявку или напишите напрямую.',
    howToReach: 'Как связаться',
    formTitle: 'Форма обратной связи',
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

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || copy.chip)

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <span className="warm-chip">{copy.chip}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || copy.description}</p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="reading-shell h-full">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.howToReach}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="h-5 w-5 text-cyan-700" />
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="hover:text-slate-950">
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="h-5 w-5 text-cyan-700" />
              <span>{settings?.workSchedule || copy.scheduleFallback}</span>
            </div>
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

  const alternates = getLocaleAlternates('/contacts')
  const title = normalizeMetaTitle(page?.title, copy.metaTitle)
  const description = normalizeMetaDescription(page?.description, copy.metaDescription)

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
