import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

export default async function ServicesPage() {
  let page: any = null
  let services: any[] = []

  try {
    page = await prisma.page.findUnique({ where: { slug: 'services' } })
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Error loading services page:', error)
    page = null
    services = []
  }

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Услуги</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">
          {page?.h1 || 'Услуги по SEO и доработке сайта'}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {page?.description || 'От разового аудита до комплексной работы над сайтом, структурой и ростом заявок.'}
        </p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="page-card">
            <h2 className="text-2xl font-semibold text-slate-950">{service.name}</h2>
            {service.description && <p className="mt-3 text-base leading-7 text-slate-600">{service.description}</p>}
            <div className="mt-6 text-3xl font-semibold text-cyan-700">
              {service.price.toLocaleString('ru-RU')} {service.unit}
            </div>
          </div>
        ))}
      </div>

      {page?.content && (
        <div className="page-card mt-8 prose max-w-none prose-slate">
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
  const { getFullUrl } = await import('@/lib/site-url')
  const servicesUrl = getFullUrl('/services')

  return {
    title: page?.title || 'SEO-услуги | Shelpakov Digital',
    description: page?.description || 'SEO-аудит, продвижение сайта, работа со структурой, метатегами и коммерческими факторами.',
    alternates: {
      canonical: servicesUrl,
    },
    openGraph: {
      title: page?.title || 'SEO-услуги',
      description: page?.description || 'SEO-аудит, продвижение сайта, работа со структурой, метатегами и коммерческими факторами.',
      url: servicesUrl,
      type: 'website',
    },
  }
}
