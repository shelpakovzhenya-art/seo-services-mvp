import 'server-only'

import type { Page } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServicePricing, servicePricing, type ServicePricing } from '@/lib/service-pricing'

export const SERVICE_PRICING_OVERRIDE_PREFIX = 'service-pricing:'

export type ServicePricingOverridePayload = {
  name: string
  shortDescription: string
  priceFrom: number
  unit: ServicePricing['unit']
  priceLabel: string
  calculatorHint: string
  deliverables: string[]
}

export type ServicePricingOverridePage = Pick<Page, 'id' | 'slug' | 'title' | 'description' | 'content' | 'order'>

export function getServicePricingOverrideSlug(slug: string) {
  return `${SERVICE_PRICING_OVERRIDE_PREFIX}${slug}`
}

function normalizeDeliverables(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

function normalizePriceUnit(value: unknown, fallback: ServicePricing['unit']): ServicePricing['unit'] {
  return value === 'month' || value === 'project' ? value : fallback
}

export function normalizeServicePricingOverrideInput(
  value: Partial<ServicePricingOverridePayload> | null | undefined,
  fallback: ServicePricing
): ServicePricingOverridePayload {
  const priceFromNumber = Number(value?.priceFrom)

  return {
    name: typeof value?.name === 'string' && value.name.trim() ? value.name.trim() : fallback.name,
    shortDescription:
      typeof value?.shortDescription === 'string' && value.shortDescription.trim()
        ? value.shortDescription.trim()
        : fallback.shortDescription,
    priceFrom: Number.isFinite(priceFromNumber) && priceFromNumber > 0 ? priceFromNumber : fallback.priceFrom,
    unit: normalizePriceUnit(value?.unit, fallback.unit),
    priceLabel:
      typeof value?.priceLabel === 'string' && value.priceLabel.trim() ? value.priceLabel.trim() : fallback.priceLabel,
    calculatorHint:
      typeof value?.calculatorHint === 'string' && value.calculatorHint.trim()
        ? value.calculatorHint.trim()
        : fallback.calculatorHint,
    deliverables: normalizeDeliverables(value?.deliverables).length > 0 ? normalizeDeliverables(value?.deliverables) : fallback.deliverables,
  }
}

function parseServicePricingOverride(page: ServicePricingOverridePage): ServicePricingOverridePayload | null {
  if (!page.content) {
    return null
  }

  try {
    const parsed = JSON.parse(page.content)

    return {
      name: typeof parsed?.name === 'string' ? parsed.name : page.title,
      shortDescription: typeof parsed?.shortDescription === 'string' ? parsed.shortDescription : page.description || '',
      priceFrom: Number(parsed?.priceFrom) || 0,
      unit: parsed?.unit === 'month' ? 'month' : 'project',
      priceLabel: typeof parsed?.priceLabel === 'string' ? parsed.priceLabel : '',
      calculatorHint: typeof parsed?.calculatorHint === 'string' ? parsed.calculatorHint : '',
      deliverables: normalizeDeliverables(parsed?.deliverables),
    }
  } catch (error) {
    console.error('Error parsing service pricing override:', error)
    return null
  }
}

export async function getServicePricingOverridePages(slugs: string[]) {
  if (slugs.length === 0) {
    return []
  }

  return prisma.page.findMany({
    where: {
      slug: {
        in: slugs.map(getServicePricingOverrideSlug),
      },
    },
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
  })
}

export async function getServicePricingOverrideMap(slugs: string[]) {
  const pages = await getServicePricingOverridePages(slugs)

  return new Map(
    pages
      .map((page) => [page.slug.replace(SERVICE_PRICING_OVERRIDE_PREFIX, ''), parseServicePricingOverride(page)] as const)
      .filter((entry): entry is readonly [string, ServicePricingOverridePayload] => Boolean(entry[1]))
  )
}

export function mergeServicePricingWithOverride(
  pricing: ServicePricing,
  override?: ServicePricingOverridePayload | null
): ServicePricing {
  if (!override) {
    return pricing
  }

  return {
    ...pricing,
    ...override,
    deliverables: override.deliverables.length > 0 ? override.deliverables : pricing.deliverables,
  }
}

export async function getMergedServicePricing(slug: string) {
  const pricing = getServicePricing(slug)

  if (!pricing) {
    return null
  }

  const overrides = await getServicePricingOverrideMap([slug])
  return mergeServicePricingWithOverride(pricing, overrides.get(slug))
}

export async function getMergedServicePricingMap(slugs: string[]) {
  const overrides = await getServicePricingOverrideMap(slugs)

  return new Map(
    slugs
      .map((slug) => {
        const pricing = getServicePricing(slug)
        if (!pricing) {
          return null
        }

        return [slug, mergeServicePricingWithOverride(pricing, overrides.get(slug))] as const
      })
      .filter((entry): entry is readonly [string, ServicePricing] => Boolean(entry))
  )
}

export async function getMergedServicePricingList() {
  const overrides = await getServicePricingOverrideMap(servicePricing.map((item) => item.slug))

  return servicePricing.map((item) => mergeServicePricingWithOverride(item, overrides.get(item.slug)))
}
