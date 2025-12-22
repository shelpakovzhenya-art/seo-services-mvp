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
    const caseItem = await prisma.case.update({
      where: { id: params.id },
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
    console.error('Error updating case:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении кейса' },
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
    await prisma.case.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting case:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении кейса' },
      { status: 500 }
    )
  }
}


