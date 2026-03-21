import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServiceOverrideSlug } from '@/lib/service-overrides'
import {
  getServicePricingOverrideSlug,
  normalizeServicePricingOverrideInput,
} from '@/lib/service-pricing-overrides'
import { getServicePricing } from '@/lib/service-pricing'

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parent = await prisma.page.findUnique({
      where: { slug: 'services' },
      select: { id: true },
    })

    const basePricing = getServicePricing(params.slug)
    const pricingOverride = basePricing
      ? normalizeServicePricingOverrideInput(
          {
            name: body.pricingName,
            shortDescription: body.pricingShortDescription,
            priceFrom: body.priceFrom,
            unit: body.priceUnit,
            priceLabel: body.priceLabel,
            calculatorHint: body.calculatorHint,
            deliverables: body.deliverables,
          },
          basePricing
        )
      : null

    const [page, pricingPage] = await prisma.$transaction([
      prisma.page.upsert({
        where: { slug: getServiceOverrideSlug(params.slug) },
        update: {
          title: body.title,
          description: body.description || null,
          keywords: body.keywords || null,
          h1: body.h1 || null,
          content: body.content || null,
          order: body.order || 0,
          parentId: parent?.id || null,
        },
        create: {
          slug: getServiceOverrideSlug(params.slug),
          title: body.title,
          description: body.description || null,
          keywords: body.keywords || null,
          h1: body.h1 || null,
          content: body.content || null,
          order: body.order || 0,
          parentId: parent?.id || null,
        },
      }),
      pricingOverride
        ? prisma.page.upsert({
            where: { slug: getServicePricingOverrideSlug(params.slug) },
            update: {
              title: pricingOverride.name,
              description: pricingOverride.shortDescription || null,
              content: JSON.stringify(pricingOverride),
              order: body.order || 0,
              parentId: parent?.id || null,
            },
            create: {
              slug: getServicePricingOverrideSlug(params.slug),
              title: pricingOverride.name,
              description: pricingOverride.shortDescription || null,
              content: JSON.stringify(pricingOverride),
              order: body.order || 0,
              parentId: parent?.id || null,
            },
          })
        : prisma.page.findUnique({
            where: { slug: getServicePricingOverrideSlug(params.slug) },
          }),
    ])

    return NextResponse.json({ page, pricingPage })
  } catch (error) {
    console.error('Error saving service page override:', error)
    return NextResponse.json(
      { error: 'Ошибка при сохранении страницы услуги' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.page.deleteMany({
      where: {
        slug: {
          in: [getServiceOverrideSlug(params.slug), getServicePricingOverrideSlug(params.slug)],
        },
      },
    })
  } catch (error: any) {
    if (error?.code !== 'P2025') {
      console.error('Error deleting service page override:', error)
      return NextResponse.json(
        { error: 'Ошибка при сбросе правок услуги' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ success: true })
}
