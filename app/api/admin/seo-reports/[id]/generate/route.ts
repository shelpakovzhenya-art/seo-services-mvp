import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runSeoMonthlyReportJob } from '@/lib/seo-report-jobs'
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

  const nextConfig = {
    ...report.configData,
    updatedAt: new Date().toISOString(),
  }

  await prisma.parserJob.update({
    where: { id: params.id },
    data: {
      status: 'running',
      config: JSON.stringify(nextConfig),
      error: null,
      completedAt: null,
    },
  })

  runSeoMonthlyReportJob(params.id, nextConfig)

  return NextResponse.json({
    ok: true,
    status: 'running',
  })
}
