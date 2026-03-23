import { prisma } from '@/lib/prisma'
import { SEO_PROJECT_CONFIG_TYPE, type SeoProjectConfig } from '@/lib/seo-report-types'

function buildProjectPayload(input: { id: string; name: string; siteUrl: string; notes?: string }) {
  const now = new Date().toISOString()

  return {
    id: input.id,
    name: input.name,
    siteUrl: input.siteUrl,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  } satisfies SeoProjectConfig
}

export async function listSeoProjects() {
  const rows = await prisma.parserConfig.findMany({
    where: {
      type: SEO_PROJECT_CONFIG_TYPE,
      isActive: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return rows
    .map((item) => {
      try {
        return JSON.parse(item.config) as SeoProjectConfig
      } catch {
        return null
      }
    })
    .filter((item): item is SeoProjectConfig => Boolean(item))
}

export async function createSeoProject(input: { name: string; siteUrl: string; notes?: string }) {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const payload = buildProjectPayload({
    id,
    name: input.name,
    siteUrl: input.siteUrl,
    notes: input.notes,
  })

  await prisma.parserConfig.create({
    data: {
      name: input.name,
      type: SEO_PROJECT_CONFIG_TYPE,
      config: JSON.stringify(payload),
      isActive: true,
    },
  })

  return payload
}
