import { Buffer } from 'buffer'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getSeoReportJob } from '@/lib/seo-report-store'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const report = await getSeoReportJob(params.id)
  if (!report) {
    return NextResponse.json({ error: 'Отчет не найден.' }, { status: 404 })
  }

  if (!report.resultData) {
    return NextResponse.json({ error: 'Экспорт ещё не готов. Сначала соберите отчет.' }, { status: 409 })
  }

  const format = new URL(request.url).searchParams.get('format') === 'docx' ? 'docx' : 'pdf'
  const fileBase64 = format === 'pdf' ? report.resultData.pdfBase64 : report.resultData.docxBase64

  if (!fileBase64) {
    return NextResponse.json({ error: 'Файл экспорта ещё не готов.' }, { status: 409 })
  }

  const fileBuffer = Buffer.from(fileBase64, 'base64')
  const fileName = `${report.resultData.fileBaseName}.${format}`
  const contentType =
    format === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
