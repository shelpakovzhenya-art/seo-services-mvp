import Image from 'next/image'
import { notFound } from 'next/navigation'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'

function normalizeMetaDescription(excerpt: string | null | undefined) {
  const clean = (excerpt || '').replace(/\s+/g, ' ').trim()

  if (clean.length >= 140 && clean.length <= 160) {
    return clean
  }

  if (clean.length > 160) {
    return `${clean.slice(0, 157).trimEnd()}...`
  }

  const fallback = `${clean ? `${clean} ` : ''}Экспертный материал Shelpakov Digital о SEO, структуре сайта и росте органического трафика.`
  return fallback.length > 160 ? `${fallback.slice(0, 157).trimEnd()}...` : fallback
}

function normalizeMetaTitle(title: string) {
  if (title.length <= 48) {
    return `${title} | Shelpakov Digital`
  }

  return `${title.slice(0, 45).trimEnd()}... | Shelpakov Digital`
}

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
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

  const coverImage = post.coverImage || getFallbackCover(post.slug)
  const content = stripLeadingMarkdownH1(post.content, post.title)

  return (
    <article className="container mx-auto mb-0 max-w-4xl px-4 py-12">
      <header className="soft-section overflow-hidden p-8 md:p-10">
        <div className="max-w-3xl">
          {post.publishedAt && (
            <p className="text-sm text-slate-500">
              {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>}
        </div>

        {coverImage && (
          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_50px_rgba(58,97,137,0.12)]">
            <div className="relative aspect-[16/9] w-full">
              <Image src={coverImage} alt={post.title} fill className="object-cover" />
            </div>
          </div>
        )}
      </header>

      <div className="prose mt-10 max-w-none prose-slate prose-headings:text-slate-950 prose-p:text-slate-700 prose-li:text-slate-700">
        <RichContent content={content} />
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
  const coverImage = post.coverImage || getFallbackCover(post.slug)
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
      images: coverImage ? [getFullUrl(coverImage)] : [],
    },
  }
}
