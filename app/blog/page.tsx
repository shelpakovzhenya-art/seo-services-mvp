import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function BlogPage() {
  let posts: any[] = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Error loading blog page:', error)
    posts = []
  }

  return (
    <div className="page-shell">
      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">Блог</span>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950 md:text-6xl">Материалы по SEO и сайту</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Статьи, которые помогают разобраться в продвижении, структуре сайта и типовых ошибках.
        </p>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="page-card overflow-hidden p-0 transition hover:-translate-y-1">
              {post.coverImage && (
                <div className="relative h-48 w-full">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-950">{post.title}</h2>
                {post.excerpt && <p className="mt-3 text-slate-600">{post.excerpt}</p>}
                {post.publishedAt && (
                  <p className="mt-4 text-sm text-slate-400">{new Date(post.publishedAt).toLocaleDateString('ru-RU')}</p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="page-card mt-8 text-center text-slate-500">Пока нет опубликованных статей.</div>
      )}
    </div>
  )
}

export async function generateMetadata() {
  const { getFullUrl } = await import('@/lib/site-url')
  const blogUrl = getFullUrl('/blog')

  return {
    title: 'Блог о SEO и развитии сайта | Shelpakov Digital',
    description: 'Статьи о SEO, структуре сайта, продвижении и повышении конверсии.',
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: 'Блог о SEO и развитии сайта',
      description: 'Статьи о SEO, структуре сайта, продвижении и повышении конверсии.',
      url: blogUrl,
      type: 'website',
    },
  }
}
