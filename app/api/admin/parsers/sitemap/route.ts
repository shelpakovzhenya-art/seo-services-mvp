import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL обязателен' },
        { status: 400 }
      )
    }

    // Create job
    const job = await prisma.parserJob.create({
      data: {
        type: 'sitemap',
        config: JSON.stringify({ url }),
        status: 'running',
      },
    })

    // Run parser in background (simple sync execution for MVP)
    parseSitemap(url, job.id)

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating parser job:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании задачи парсера' },
      { status: 500 }
    )
  }
}

function parseSitemap(url: string, jobId: string) {
  // Run async without blocking
  ;(async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const text = await response.text()
      
      // Simple regex-based extraction for MVP
      const urlRegex = /<loc>(.*?)<\/loc>/g
      const urls: string[] = []
      let match
      
      while ((match = urlRegex.exec(text)) !== null) {
        urls.push(match[1])
      }

      // Update job with result
      await prisma.parserJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          result: JSON.stringify({ urls, count: urls.length }),
          completedAt: new Date(),
        },
      })
    } catch (error: any) {
      await prisma.parserJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          error: error.message || 'Unknown error',
          completedAt: new Date(),
        },
      })
    }
  })().catch(error => {
    console.error('Parser error:', error)
  })
}

