import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const caseItem = await prisma.case.create({
      data: {
        title: body.title,
        description: body.description || null,
        content: body.content || null,
        image: body.image || null,
        order: body.order || 0,
      },
    })

    return NextResponse.json(caseItem)
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании кейса' },
      { status: 500 }
    )
  }
}


