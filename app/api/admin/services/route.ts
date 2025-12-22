import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' }
  })

  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description || null,
        content: body.content || null,
        image: body.image || null,
        price: body.price,
        unit: body.unit || '₽/проект',
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании услуги' },
      { status: 500 }
    )
  }
}

