import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServicePageTemplate from '@/components/services/ServicePageTemplate'
import { getServicePage, servicePages } from '@/lib/service-pages'
import { getFullUrl } from '@/lib/site-url'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServicePage(slug)

  if (!service) {
    return {}
  }

  const canonical = getFullUrl(`/services/${service.slug}`)

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: canonical,
      type: 'article',
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServicePage(slug)

  if (!service) {
    notFound()
  }

  return <ServicePageTemplate service={service} />
}
