import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { renderSeoMonthlyReportPreview } from '@/lib/seo-report-preview'
import { getSeoReportJob } from '@/lib/seo-report-store'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  const html = report.resultData?.previewHtml || renderSeoMonthlyReportPreview(report.configData)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
