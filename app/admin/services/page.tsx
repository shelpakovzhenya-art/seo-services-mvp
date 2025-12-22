import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import ServicesManager from '@/components/admin/ServicesManager'

export default async function AdminServicesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  })

  // Serialize data to remove Date objects and make it safe for client components
  const serializedServices = services.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    content: service.content,
    image: service.image,
    price: service.price,
    unit: service.unit,
    isActive: service.isActive,
    order: service.order,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Управление услугами</h1>
      </div>
      <ServicesManager initialServices={serializedServices} />
    </div>
  )
}

