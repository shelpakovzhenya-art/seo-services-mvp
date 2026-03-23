import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { listSeoProjects } from '@/lib/seo-projects'
import { buildDefaultSeoMonthlyReportConfig, SEO_MONTHLY_REPORT_JOB_TYPE } from '@/lib/seo-report-types'
import { buildMonthlyPeriods } from '@/lib/seo-report-utils'

export const runtime = 'nodejs'

const requestSchema = z.object({
  projectId: z.string().trim().optional(),
  projectName: z.string().trim().optional(),
  siteUrl: z.string().trim().optional(),
  periodPreset: z.enum(['current_month', 'previous_month', 'custom']).default('previous_month'),
  periodStart: z.string().trim().optional(),
  periodEnd: z.string().trim().optional(),
  comparePeriodStart: z.string().trim().optional(),
  comparePeriodEnd: z.string().trim().optional(),
})

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const projects = await listSeoProjects()
    const selectedProject = body.projectId ? projects.find((item) => item.id === body.projectId) : null

    const projectName = selectedProject?.name || body.projectName
    const siteUrl = selectedProject?.siteUrl || body.siteUrl

    if (!projectName || !siteUrl) {
      return NextResponse.json({ error: 'Выберите проект или укажите название и URL сайта.' }, { status: 400 })
    }

    const periods =
      body.periodPreset === 'custom'
        ? {
            periodStart: body.periodStart || '',
            periodEnd: body.periodEnd || '',
            comparePeriodStart: body.comparePeriodStart || '',
            comparePeriodEnd: body.comparePeriodEnd || '',
          }
        : buildMonthlyPeriods(body.periodPreset)

    if (Object.values(periods).some((item) => !item)) {
      return NextResponse.json({ error: 'Для ручного режима нужно заполнить оба периода сравнения.' }, { status: 400 })
    }

    const config = buildDefaultSeoMonthlyReportConfig({
      projectId: selectedProject?.id,
      projectName,
      siteUrl,
      periodPreset: body.periodPreset,
      periodStart: periods.periodStart,
      periodEnd: periods.periodEnd,
      comparePeriodStart: periods.comparePeriodStart,
      comparePeriodEnd: periods.comparePeriodEnd,
    })

    const created = await prisma.parserJob.create({
      data: {
        type: SEO_MONTHLY_REPORT_JOB_TYPE,
        status: 'draft',
        config: JSON.stringify(config),
      },
    })

    return NextResponse.json({
      id: created.id,
      status: created.status,
      createdAt: created.createdAt,
      config,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Проверьте параметры отчета.' }, { status: 400 })
    }

    console.error('Error creating SEO report draft:', error)
    return NextResponse.json({ error: 'Не удалось создать черновик отчета.' }, { status: 500 })
  }
}
