import { prisma } from '@/lib/prisma'
import {
  parseSeoMonthlyReportConfig,
  parseSeoMonthlyReportResult,
  SEO_MONTHLY_REPORT_JOB_TYPE,
  type SeoMonthlyReportConfig,
} from '@/lib/seo-report-types'

export async function getSeoReportJob(id: string) {
  const job = await prisma.parserJob.findUnique({
    where: { id },
  })

  if (!job || job.type !== SEO_MONTHLY_REPORT_JOB_TYPE) {
    return null
  }

  const config = parseSeoMonthlyReportConfig(job.config)
  const result = parseSeoMonthlyReportResult(job.result)

  if (!config) {
    return null
  }

  return {
    ...job,
    configData: config,
    resultData: result,
  }
}

export async function listSeoReportJobs() {
  const jobs = await prisma.parserJob.findMany({
    where: {
      type: SEO_MONTHLY_REPORT_JOB_TYPE,
    },
    orderBy: { createdAt: 'desc' },
  })

  return jobs
    .map((job) => {
      const config = parseSeoMonthlyReportConfig(job.config)
      const result = parseSeoMonthlyReportResult(job.result)

      if (!config) {
        return null
      }

      return {
        ...job,
        configData: config,
        resultData: result,
      }
    })
    .filter(
      (
        item
      ): item is Awaited<ReturnType<typeof getSeoReportJob>> & { configData: SeoMonthlyReportConfig } => Boolean(item)
    )
}
