import { Buffer } from 'buffer'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseSeoAuditJobResult } from '@/lib/seo-audit-jobs'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const job = await prisma.parserJob.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      type: true,
      result: true,
      status: true,
    },
  })

  if (!job || job.type !== 'seo_audit') {
    return NextResponse.json({ error: 'Аудит не найден.' }, { status: 404 })
  }

  const result = parseSeoAuditJobResult(job.result)
  if (!result) {
    return NextResponse.json({ error: 'Файл аудита ещё не готов.' }, { status: 409 })
  }

  const format = new URL(request.url).searchParams.get('format') === 'docx' ? 'docx' : 'pdf'
  const fileBase64 = format === 'pdf' ? result.pdfBase64 : result.docxBase64

  if (!fileBase64) {
    return NextResponse.json(
      { error: format === 'pdf' ? 'PDF-версия аудита ещё не готова.' : 'DOCX-версия аудита ещё не готова.' },
      { status: 409 }
    )
  }

  const fileBuffer = Buffer.from(fileBase64, 'base64')
  const fileName =
    format === 'pdf'
      ? result.pdfFileName || result.fileName.replace(/\.docx$/i, '.pdf')
      : result.fileName
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
