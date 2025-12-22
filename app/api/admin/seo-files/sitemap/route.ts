import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const SITEMAP_PATH = join(process.cwd(), 'public', 'sitemap.xml')

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let content = ''
    if (existsSync(SITEMAP_PATH)) {
      content = await readFile(SITEMAP_PATH, 'utf-8')
    } else {
      // Default sitemap.xml
      const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
      content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading sitemap.xml:', error)
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

    await writeFile(SITEMAP_PATH, content, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error writing sitemap.xml:', error)
    return NextResponse.json(
      { error: 'Ошибка при сохранении файла' },
      { status: 500 }
    )
  }
}


