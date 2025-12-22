import { prisma } from '@/lib/prisma'
import Calculator from '@/components/Calculator'
import ContactForm from '@/components/ContactForm'
import ReactMarkdown from 'react-markdown'

export default async function CalculatorPage() {
  let page: any = null
  let services: any[] = []
  let settings: any = null
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
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
      <h1 className="text-4xl font-bold mb-6">{page?.h1 || 'Калькулятор стоимости'}</h1>
      
      {page?.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Calculator
            services={services}
            discountEnabled={settings?.globalDiscountEnabled || false}
            discountPercent={settings?.globalDiscountPercent || 0}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Оставить заявку</h2>
          <ContactForm />
        </div>
      </div>

      {page?.content && (
        <div className="mt-12 prose max-w-none">
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
  return {
    title: page?.title || 'Калькулятор стоимости - SEO Services',
    description: page?.description || 'Рассчитайте стоимость SEO услуг',
  }
}

