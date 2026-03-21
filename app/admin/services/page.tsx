import { redirect } from 'next/navigation'
import ServicesManager from '@/components/admin/ServicesManager'
import { isAuthenticated } from '@/lib/auth'
import { getServiceOverrideMap } from '@/lib/service-overrides'
import { getServicePricing } from '@/lib/service-pricing'
import { servicePages } from '@/lib/service-pages'

const PAGE_TITLE = '\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0443\u0441\u043b\u0443\u0433'
const PAGE_DESCRIPTION =
  '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u0435 SEO-\u0443\u0441\u043b\u0443\u0433\u0438 \u0441 \u0441\u0430\u0439\u0442\u0430 \u0438 \u043f\u0443\u0431\u043b\u0438\u043a\u0443\u0439\u0442\u0435 \u043f\u0440\u0430\u0432\u043a\u0438 \u0447\u0435\u0440\u0435\u0437 \u0430\u0434\u043c\u0438\u043d\u043a\u0443.'

export default async function AdminServicesPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const overrides = await getServiceOverrideMap(servicePages.map((service) => service.slug))

  const serializedServices = servicePages.map((service, index) => {
    const override = overrides.get(service.slug)
    const pricing = getServicePricing(service.slug)

    return {
      id: override?.id || null,
      serviceSlug: service.slug,
      name: service.shortName,
      title: override?.title || service.title,
      description: override?.description || service.description,
      h1: override?.h1 || service.h1,
      keywords: override?.keywords || '',
      content: override?.content || '',
      order: override?.order ?? index,
      priceLabel: pricing?.priceLabel || null,
      hasOverride: Boolean(override),
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{PAGE_TITLE}</h1>
        <p className="mt-2 text-sm text-slate-500">{PAGE_DESCRIPTION}</p>
      </div>
      <ServicesManager initialServices={serializedServices} />
    </div>
  )
}
