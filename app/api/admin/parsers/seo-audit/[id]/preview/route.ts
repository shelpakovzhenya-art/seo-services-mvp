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
  if (!result?.previewHtml) {
    return NextResponse.json({ error: 'HTML-превью ещё не готово.' }, { status: 409 })
  }

  if ((result.generatorVersion || 1) < 2) {
    return NextResponse.json(
      { error: 'Этот аудит собран старой версией генератора. Запустите аудит заново, чтобы получить корректный отчет.' },
      { status: 409 }
    )
  }

  return new NextResponse(result.previewHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
