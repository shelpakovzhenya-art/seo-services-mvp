import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAuthenticated } from '@/lib/auth'
import { createSeoProject, listSeoProjects } from '@/lib/seo-projects'

export const runtime = 'nodejs'

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  siteUrl: z.string().trim().url(),
  notes: z.string().trim().max(400).optional(),
})

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await listSeoProjects()
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = requestSchema.parse(await request.json())
    const project = await createSeoProject(body)
    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Проверьте название проекта и URL сайта.' }, { status: 400 })
    }

    console.error('Error creating SEO project:', error)
    return NextResponse.json({ error: 'Не удалось создать проект.' }, { status: 500 })
  }
}
