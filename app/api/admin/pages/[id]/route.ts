import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description || null,
        keywords: body.keywords || null,
        h1: body.h1 || null,
        content: body.content || null,
        parentId: body.parentId || null,
        order: body.order || 0,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении страницы' },
      { status: 500 }
    )
  }
}

