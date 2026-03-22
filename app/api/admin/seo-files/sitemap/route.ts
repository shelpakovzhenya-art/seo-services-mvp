import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { generateSitemapXml } from '@/lib/sitemap-content'

const SITEMAP_PATH = join(process.cwd(), 'public', 'sitemap.xml')

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const source = existsSync(SITEMAP_PATH) ? 'file' : 'generated'
    const content = source === 'file'
      ? await readFile(SITEMAP_PATH, 'utf-8')
      : await generateSitemapXml()

    return NextResponse.json({ content, source })
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

    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }

    await writeFile(SITEMAP_PATH, content, 'utf-8')

    return NextResponse.json({ success: true, source: 'file' })
  } catch (error) {
    console.error('Error writing sitemap.xml:', error)
    return NextResponse.json(
      { error: 'Ошибка при сохранении файла' },
      { status: 500 }
    )
  }
}
