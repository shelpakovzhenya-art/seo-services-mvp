import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSeoReportJob } from '@/lib/seo-report-store'
import { SEO_MONTHLY_REPORT_JOB_TYPE } from '@/lib/seo-report-types'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  return NextResponse.json({
    id: report.id,
    status: report.status,
    error: report.error,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    completedAt: report.completedAt,
    config: report.configData,
    result: report.resultData,
  })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const nextConfig = {
      ...body.config,
      updatedAt: new Date().toISOString(),
    }

    await prisma.parserJob.update({
      where: { id: params.id },
      data: {
        type: SEO_MONTHLY_REPORT_JOB_TYPE,
        status: body.status || 'draft',
        config: JSON.stringify(nextConfig),
        result: body.keepResult ? report.result : null,
        error: null,
      },
    })

    return NextResponse.json({ ok: true, config: nextConfig })
  } catch (error) {
    console.error('Error updating SEO report:', error)
    return NextResponse.json({ error: 'Не удалось сохранить изменения.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  await prisma.parserJob.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
