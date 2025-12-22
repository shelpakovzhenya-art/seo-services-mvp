import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const ROBOTS_PATH = join(process.cwd(), 'public', 'robots.txt')

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let content = ''
    if (existsSync(ROBOTS_PATH)) {
      content = await readFile(ROBOTS_PATH, 'utf-8')
    } else {
      // Default robots.txt
      content = `User-agent: *
Allow: /

Sitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml`
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading robots.txt:', error)
    return NextResponse.json(
      { error: 'Ошибка при чтении файла' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content } = body

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    await writeFile(ROBOTS_PATH, content, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error writing robots.txt:', error)
    return NextResponse.json(
      { error: 'Ошибка при сохранении файла' },
      { status: 500 }
    )
  }
}


