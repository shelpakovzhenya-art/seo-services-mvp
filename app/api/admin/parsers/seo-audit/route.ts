import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deriveAuditCompanyName, runSeoAuditJob } from '@/lib/seo-audit-jobs'

export const runtime = 'nodejs'

const requestSchema = z.object({
  url: z.string().trim().url(),
  company: z.string().trim().optional(),
  sampleSize: z.coerce.number().int().min(4).max(24).optional(),
})

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const company = body.company || deriveAuditCompanyName(body.url)
    const sampleSize = body.sampleSize ?? 10

    const job = await prisma.parserJob.create({
      data: {
        type: 'seo_audit',
        config: JSON.stringify({
          url: body.url,
          company,
          sampleSize,
        }),
        status: 'running',
      },
      select: {
        id: true,
        type: true,
        status: true,
        error: true,
        config: true,
        createdAt: true,
        completedAt: true,
      },
    })

    runSeoAuditJob(job.id, {
      url: body.url,
      company,
      sampleSize,
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating SEO audit job:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Проверьте URL сайта и параметры аудита.' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Не удалось запустить SEO-аудит.' }, { status: 500 })
  }
}
