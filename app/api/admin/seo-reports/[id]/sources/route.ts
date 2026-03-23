import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildSourceFromUpload } from '@/lib/seo-report-parser'
import { getSeoReportJob } from '@/lib/seo-report-store'
import { REPORT_SOURCE_KINDS } from '@/lib/seo-report-types'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const allowedMimePrefixes = [
  'image/',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
]

const sourceKindSchema = z.enum(REPORT_SOURCE_KINDS)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  try {
    const formData = await request.formData()
    const sourceKind = sourceKindSchema.parse(formData.get('sourceKind'))
    const files = formData.getAll('files').filter((item): item is File => item instanceof File)

    if (!files.length) {
      return NextResponse.json({ error: 'Нужно загрузить хотя бы один файл.' }, { status: 400 })
    }

    const nextSources = [...report.configData.sources]

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `Файл ${file.name} превышает лимит 15 МБ.` }, { status: 400 })
      }

      if (!allowedMimePrefixes.some((item) => file.type.startsWith(item) || file.type === item)) {
        return NextResponse.json({ error: `Формат ${file.type || file.name} пока не поддерживается.` }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      nextSources.push(
        buildSourceFromUpload({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          dataBase64: buffer.toString('base64'),
          sourceKind,
        })
      )
    }

    const nextConfig = {
      ...report.configData,
      updatedAt: new Date().toISOString(),
      sources: nextSources,
    }

    await prisma.parserJob.update({
      where: { id: params.id },
      data: {
        status: 'draft',
        config: JSON.stringify(nextConfig),
        result: null,
        error: null,
      },
    })

    return NextResponse.json({ ok: true, config: nextConfig })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Проверьте тип источника.' }, { status: 400 })
    }

    console.error('Error uploading SEO report sources:', error)
    return NextResponse.json({ error: 'Не удалось загрузить файлы.' }, { status: 500 })
  }
}
