import ReactMarkdown from 'react-markdown'
import { Clock, Mail } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

export default async function ContactsPage() {
  let page: any = null
  let settings: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    console.error('Error loading contacts page:', error)
    page = null
    settings = null
  }

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || 'Контакты')

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Контакты</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">
          {page?.h1 || 'Связаться по проекту'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {page?.description ||
            'Если хотите обсудить сайт, аудит или продвижение, оставьте заявку или напишите напрямую.'}
        </p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="page-card">
          <h2 className="text-2xl font-semibold text-slate-950">Как связаться</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="h-5 w-5 text-cyan-700" />
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="hover:text-slate-950">
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="h-5 w-5 text-cyan-700" />
              <span>{settings?.workSchedule || 'Пн-Пт 09:00-17:00'}</span>
            </div>
          </div>

          {pageContent && (
            <div className="prose mt-8 max-w-none prose-slate">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h2>{children}</h2>,
                }}
              >
                {pageContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="page-card">
          <h2 className="text-2xl font-semibold text-slate-950">Форма обратной связи</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
  } catch (error) {
    page = null
  }
  const { getFullUrl } = await import('@/lib/site-url')
  const contactsUrl = getFullUrl('/contacts')
  const fallbackTitle = 'Контакты | Shelpakov Digital'
  const fallbackDescription =
    'Свяжитесь со мной, чтобы обсудить SEO-продвижение, аудит сайта, структуру страниц, коммерческие факторы и точки роста вашего проекта без лишних обязательств.'
  const title = normalizeMetaTitle(page?.title, fallbackTitle)
  const description = normalizeMetaDescription(page?.description, fallbackDescription)

  return {
    title,
    description,
    alternates: {
      canonical: contactsUrl,
    },
    openGraph: {
      title,
      description,
      url: contactsUrl,
      type: 'website',
    },
  }
}
