import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseSeoReportConfig } from '@/lib/seo-report-parser'
import { getSeoReportJob } from '@/lib/seo-report-store'

export const runtime = 'nodejs'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  try {
    const parsedConfig = await parseSeoReportConfig(report.configData)

    await prisma.parserJob.update({
      where: { id: params.id },
      data: {
        status: 'draft',
        config: JSON.stringify(parsedConfig),
        result: null,
        error: null,
      },
    })

    return NextResponse.json({ ok: true, config: parsedConfig })
  } catch (error) {
    console.error('Error parsing SEO report sources:', error)
    return NextResponse.json({ error: 'Не удалось распознать загруженные данные.' }, { status: 500 })
  }
}
