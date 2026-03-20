import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site-url'

type PageProps = {
  params: {
    slug: string
  }
}

async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  if (!page || page.slug === 'home') {
    return {}
  }

  const siteUrl = getSiteUrl()

  return {
    title: { absolute: page.title },
    description: page.description || undefined,
    keywords: page.keywords
      ? page.keywords.split(',').map((item) => item.trim()).filter(Boolean)
      : undefined,
    alternates: {
      canonical: `${siteUrl}/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description || undefined,
      url: `${siteUrl}/${page.slug}`,
      type: 'website',
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page || page.slug === 'home') {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold text-white md:text-6xl">
          {page.h1 || page.title}
        </h1>
        {page.description && (
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {page.description}
          </p>
        )}
        {page.content && (
          <article
            className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </div>
  )
}
