import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const page = await prisma.page.create({
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
  } catch (error: any) {
    console.error('Error creating page:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Страница с таким slug уже существует' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка при создании страницы' },
      { status: 500 }
    )
  }
}


