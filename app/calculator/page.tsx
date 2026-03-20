import ReactMarkdown from 'react-markdown'
import Calculator from '@/components/Calculator'
import ContactForm from '@/components/ContactForm'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'

const defaultCalculatorTitle = 'Калькулятор SEO-услуг | Shelpakov Digital'
const defaultCalculatorDescription =
  'Калькулятор SEO-услуг для предварительной оценки бюджета на аудит, доработку структуры сайта, контент, сопровождение и рост органического канала.'

export default async function CalculatorPage() {
  let page: any = null
  let services: any[] = []
  let settings: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    console.error('Error loading calculator page:', error)
    page = null
    services = []
    settings = null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold">{page?.h1 || 'Калькулятор стоимости SEO-услуг'}</h1>

      {page?.description && <p className="mb-8 text-xl text-gray-600">{page.description}</p>}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Calculator
            services={services}
            discountEnabled={settings?.globalDiscountEnabled || false}
            discountPercent={settings?.globalDiscountPercent || 0}
          />
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold">Оставить заявку</h2>
          <ContactForm />
        </div>
      </div>

      {page?.content && (
        <div className="prose mt-12 max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
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
