import { botiqCase } from '@/lib/botiq-case'
import { isPlaceholderCase } from '@/lib/case-listing'
import { podocenterCase } from '@/lib/podocenter-case'
import { prisma } from '@/lib/prisma'
import { seoTools } from '@/lib/seo-tools'
import { getLocalizedUrl } from '@/lib/site-url'
import { servicePages } from '@/lib/service-pages'

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  priority: number
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export async function generateSitemapEntries(): Promise<SitemapEntry[]> {
  const entries = new Map<string, SitemapEntry>()
  const getCanonicalUrl = (path: string) => getLocalizedUrl(path)

  const addEntry = (entry: SitemapEntry) => {
    const existing = entries.get(entry.url)
    if (!existing || existing.lastModified < entry.lastModified) {
      entries.set(entry.url, entry)
    }
  }

  const now = new Date()

  ;[
    {
      url: getCanonicalUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: getCanonicalUrl('/services'),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: getCanonicalUrl('/cases'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: getCanonicalUrl(podocenterCase.url),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: getCanonicalUrl(botiqCase.url),
      lastModified: new Date(botiqCase.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: getCanonicalUrl('/reviews'),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: getCanonicalUrl('/blog'),
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: getCanonicalUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    },
    {
      url: getCanonicalUrl('/methodology'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.74,
    },
    {
      url: getCanonicalUrl('/editorial-policy'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: getCanonicalUrl('/contacts'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: getCanonicalUrl('/calculator'),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: getCanonicalUrl('/tools'),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    },
    ...servicePages.map((service) => ({
      url: getCanonicalUrl(`/services/${service.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...seoTools.map((tool) => ({
      url: getCanonicalUrl(`/tools/${tool.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.68,
    })),
  ].forEach(addEntry)

  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    posts.forEach((post) => {
      addEntry({
        url: getCanonicalUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt || post.publishedAt || now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  try {
    const cases = await prisma.case.findMany({
      where: {
        slug: {
          not: null,
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    cases
      .filter((item) => !isPlaceholderCase(item))
      .filter((item) => item.slug)
      .forEach((item) => {
        addEntry({
          url: getCanonicalUrl(`/cases/${item.slug}`),
          lastModified: item.updatedAt || now,
          changeFrequency: 'monthly',
          priority: 0.75,
        })
      })
  } catch (error) {
    console.error('Error fetching cases for sitemap:', error)
  }

  return Array.from(entries.values()).sort((a, b) => a.url.localeCompare(b.url))
}

export async function generateSitemapXml() {
  const entries = await generateSitemapEntries()
  return toSitemapXml(entries)
}
