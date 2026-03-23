import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { botiqCase } from '@/lib/botiq-case'
import { prisma } from '@/lib/prisma'

export async function POST(_: Request, { params }: { params: { slug: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (params.slug !== botiqCase.slug) {
    return NextResponse.json({ error: 'Шаблон кейса не найден' }, { status: 404 })
  }

  try {
    const existingCase = await prisma.case.findFirst({
      where: { slug: botiqCase.slug },
      select: { id: true },
    })

    if (existingCase) {
      return NextResponse.json({ error: 'Кейс Botiq уже существует в базе' }, { status: 409 })
    }

    const createdCase = await prisma.case.create({
      data: {
        slug: botiqCase.slug,
        title: botiqCase.title,
        description: botiqCase.description,
        content: botiqCase.content,
        image: botiqCase.image,
        resultImages: botiqCase.resultImages,
        order: botiqCase.order,
      },
    })

    return NextResponse.json(createdCase)
  } catch (error) {
    console.error('Error creating built-in case template:', error)
    return NextResponse.json({ error: 'Не удалось создать кейс из шаблона' }, { status: 500 })
  }
}
