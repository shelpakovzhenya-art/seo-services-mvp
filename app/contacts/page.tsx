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
    readinessKicker: 'Чтобы ответ был полезнее',
    readinessTitle: 'Что лучше прислать сразу и в каких случаях вообще стоит писать',
    readinessCards: [
      'Пришлите домен, краткую задачу и что уже делали: аудит, переезд, подрядчик, контент, редизайн. Это сразу убирает лишние круги согласования.',
      'Если проблема выглядит размытой, не нужно формулировать “правильную услугу”. Достаточно описать симптом: мало заявок, слабая индексация, устаревший сайт, спор по приоритетам.',
      'Если нужен просто ориентир по бюджету, быстрее начать с калькулятора. Если нужен выбор между форматами работ, лучше сразу писать с контекстом проекта.',
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
    readinessKicker: 'To get a more useful reply',
    readinessTitle: 'What to send right away and when it makes sense to reach out',
    readinessCards: [
      'Send the domain, the short task, and what has already been done: audit, migration, contractor work, content, or redesign. This removes unnecessary back-and-forth immediately.',
      'If the problem still feels blurry, you do not need to name the “right service”. It is enough to describe the symptom: low leads, weak indexation, an outdated site, or a priority conflict.',
      'If you only need a rough budget benchmark, the calculator is the faster route. If you need help choosing the right format of work, reaching out with project context is better.',
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

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || copy.chip)

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <span className="warm-chip">{copy.chip}</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">{page?.h1 || copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{page?.description || copy.description}</p>
      </section>

      <section className="reading-shell">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.readinessKicker}</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.readinessTitle}</h2>
        </div>
        <div className="uniform-grid-3 mt-6 gap-4">
          {copy.readinessCards.map((item: string) => (
            <div key={item} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 text-sm leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="reading-shell h-full">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.howToReach}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex min-w-0 items-start gap-3 text-slate-700">
              <Mail className="h-5 w-5 shrink-0 text-cyan-700" />
              <a href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`} className="min-w-0 break-all hover:text-slate-950">
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
