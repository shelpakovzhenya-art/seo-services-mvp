import { Buffer } from 'buffer'
import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseSeoAuditJobResult } from '@/lib/seo-audit-jobs'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: { id: string } }) {
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

  const fileBuffer = Buffer.from(result.docxBase64, 'base64')

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
