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
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
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
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении статьи' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении статьи' },
      { status: 500 }
    )
  }
}

