import { getDefaultLlmsContent } from '@/lib/llms-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(getDefaultLlmsContent(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
