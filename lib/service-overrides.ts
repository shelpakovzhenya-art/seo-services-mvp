import type { Page } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { servicePages, type ServicePageContent } from '@/lib/service-pages'

export const SERVICE_OVERRIDE_PREFIX = 'service:'

export type ServiceOverridePage = Pick<Page, 'id' | 'slug' | 'title' | 'description' | 'keywords' | 'h1' | 'content' | 'order'>

export type ServicePageWithOverride = ServicePageContent & {
  overrideId: string | null
  overrideContent: string | null
  overrideKeywords: string | null
  sortOrder: number
}

export function getServiceOverrideSlug(slug: string) {
  return `${SERVICE_OVERRIDE_PREFIX}${slug}`
}

export async function getServiceOverridePages(slugs: string[]) {
  if (slugs.length === 0) {
    return []
  }

  try {
    return await prisma.page.findMany({
      where: {
        slug: {
          in: slugs.map(getServiceOverrideSlug),
        },
      },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    })
  } catch (error) {
    console.error('Error loading service override pages:', error)
    return []
  }
}

export async function getServiceOverrideMap(slugs: string[]) {
  const pages = await getServiceOverridePages(slugs)
  return new Map(
    pages.map((page) => [
      page.slug.replace(SERVICE_OVERRIDE_PREFIX, ''),
      page,
    ])
  )
}

export function mergeServiceWithOverride(
  service: ServicePageContent,
  index: number,
  override?: ServiceOverridePage | null
): ServicePageWithOverride {
  return {
    ...service,
    title: override?.title || service.title,
    description: override?.description || service.description,
    h1: override?.h1 || service.h1,
    overrideId: override?.id || null,
    overrideContent: override?.content || null,
    overrideKeywords: override?.keywords || null,
    sortOrder: override?.order ?? index,
  }
}

export async function getMergedServicePages() {
  const overrides = await getServiceOverrideMap(servicePages.map((service) => service.slug))

  return servicePages
    .map((service, index) => mergeServiceWithOverride(service, index, overrides.get(service.slug)))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.shortName.localeCompare(right.shortName, 'ru'))
}
