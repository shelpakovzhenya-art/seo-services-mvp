import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getDefaultRobotsContent } from '@/lib/robots-content'

const ROBOTS_PATH = join(process.cwd(), 'public', 'robots.txt')

export const dynamic = 'force-dynamic'

export async function GET() {
  const content = existsSync(ROBOTS_PATH)
    ? await readFile(ROBOTS_PATH, 'utf-8')
    : getDefaultRobotsContent()

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
