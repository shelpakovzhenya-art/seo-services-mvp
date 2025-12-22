import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

export default async function ServicesPage() {
  let page: any = null
  let services: any[] = []
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'services' } })
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error loading services page:', error)
    page = null
    services = []
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{page?.h1 || 'Наши услуги'}</h1>
      
      {page?.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-semibold mb-3">{service.name}</h2>
            {service.description && (
              <p className="text-gray-600 mb-4">{service.description}</p>
            )}
            <div className="text-3xl font-bold text-primary mb-2">
              {service.price.toLocaleString('ru-RU')} {service.unit}
            </div>
          </div>
        ))}
      </div>

      {page?.content && (
        <div className="prose max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'services' } })
  } catch (error) {
    page = null
  }
  return {
    title: page?.title || 'Услуги - SEO Services',
    description: page?.description || 'Наши SEO услуги',
  }
}

