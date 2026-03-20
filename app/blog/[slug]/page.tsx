import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { prisma } from '@/lib/prisma'

function normalizeMetaDescription(excerpt: string | null | undefined) {
  const clean = (excerpt || '').replace(/\s+/g, ' ').trim()

  if (clean.length >= 140 && clean.length <= 160) {
    return clean
  }

  if (clean.length > 160) {
    return `${clean.slice(0, 157).trimEnd()}...`
  }

  const fallback =
    `${clean ? `${clean} ` : ''}Экспертный материал Shelpakov Digital о SEO, структуре сайта и росте органического трафика.`

  return fallback.length > 160 ? `${fallback.slice(0, 157).trimEnd()}...` : fallback
}

function normalizeMetaTitle(title: string) {
  if (title.length <= 48) {
    return `${title} | Shelpakov Digital`
  }

  return `${title.slice(0, 45).trimEnd()}... | Shelpakov Digital`
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: any = null

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    })
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto mb-0 max-w-4xl px-4 py-12">
      {post.coverImage && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

      {post.publishedAt && (
        <p className="mb-8 text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      <div className="prose max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let post: any = null

  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    })
  } catch (error) {
    post = null
  }

  if (!post) {
    return {
      title: 'Статья не найдена',
    }
  }

  const { getFullUrl } = await import('@/lib/site-url')
  const postUrl = getFullUrl(`/blog/${params.slug}`)
  const metaTitle = normalizeMetaTitle(post.title)
  const metaDescription = normalizeMetaDescription(post.excerpt)

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      images: post.coverImage ? [getFullUrl(post.coverImage)] : [],
    },
  }
}
