import ReactMarkdown from 'react-markdown'
import Calculator from '@/components/Calculator'
import ContactForm from '@/components/ContactForm'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { servicePricing } from '@/lib/service-pricing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

const defaultCalculatorTitle = 'Калькулятор SEO-услуг | Shelpakov Digital'
const defaultCalculatorDescription =
  'Калькулятор SEO-услуг для предварительной оценки бюджета на аудит, техническую базу, контент, сопровождение и рост органического канала.'

export default async function CalculatorPage() {
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    console.error('Error loading calculator page:', error)
    page = null
  }

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || 'Калькулятор SEO-услуг')

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Калькулятор SEO-услуг</span>
        <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
          {page?.h1 || 'Подберите формат SEO-работ и получите ориентир по бюджету'}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {page?.description ||
            'Собрал калькулятор по новой линейке услуг: от аудита и технической базы до системного SEO, контента и консалтинга.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Рыночный ориентир по стоимости</span>
          <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Без навязывания лишних задач</span>
          <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Покажу, с чего начать именно вам</span>
        </div>
      </section>

      <section className="mt-10">
        <Calculator
          services={servicePricing.map((service) => ({
            id: service.slug,
            slug: service.slug,
            name: service.name,
            description: service.shortDescription,
            price: service.priceFrom,
            unit: service.priceLabel,
            hint: service.calculatorHint,
            deliverables: service.deliverables,
          }))}
        />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="page-card">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что влияет на стоимость</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Цена зависит не только от услуги, но и от масштаба проекта</h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
              Чем больше разделов, шаблонов и посадочных страниц, тем выше объём аналитики и внедрения.
            </div>
            <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
              Для eCommerce, B2B и геозависимых проектов обычно требуется больше структуры, контента и контроля.
            </div>
            <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
              Если часть задач уже сделана, можно стартовать с точечной услуги, а не брать полное сопровождение.
            </div>
          </div>
        </div>

        <div id="contact-form" className="soft-section overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Обсудить задачу</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">Оставьте заявку, если нужен точный расчёт</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                Напишите сайт, задачу и что уже делали. В ответ покажу, какой формат работ подойдёт сейчас и где можно не
                переплачивать.
              </p>
            </div>
            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {pageContent && (
        <div className="page-card mt-10 prose max-w-none prose-slate">
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
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    page = null
  }
  const { getFullUrl } = await import('@/lib/site-url')
  const calculatorUrl = getFullUrl('/calculator')
  const title = normalizeMetaTitle(page?.title, defaultCalculatorTitle)
  const description = normalizeMetaDescription(page?.description, defaultCalculatorDescription)

  return {
    title,
    description,
    alternates: {
      canonical: calculatorUrl,
    },
    openGraph: {
      title,
      description,
      url: calculatorUrl,
      type: 'website',
    },
  }
}
