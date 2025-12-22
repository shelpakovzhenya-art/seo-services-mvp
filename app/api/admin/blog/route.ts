import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const post = await prisma.blogPost.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        published: body.published ?? false,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        parentId: body.parentId || null,
        order: body.order || 0,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании статьи' },
      { status: 500 }
    )
  }
}

