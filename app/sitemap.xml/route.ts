import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { generateSitemapXml } from '@/lib/sitemap-content'

const SITEMAP_PATH = join(process.cwd(), 'public', 'sitemap.xml')

export const dynamic = 'force-dynamic'

export async function GET() {
  const content = existsSync(SITEMAP_PATH)
    ? await readFile(SITEMAP_PATH, 'utf-8')
    : await generateSitemapXml()

  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
