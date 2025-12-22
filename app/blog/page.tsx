import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function BlogPage() {
  let posts: any[] = []
  
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' }
    })
  } catch (error) {
    console.error('Error loading blog page:', error)
    posts = []
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Блог</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.coverImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                )}
                {post.publishedAt && (
                  <p className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-500 py-12">Пока нет опубликованных статей</p>
      )}
    </div>
  )
}

export async function generateMetadata() {
  const { getFullUrl } = await import('@/lib/site-url')
  const blogUrl = getFullUrl('/blog')
  
  return {
    title: 'Блог о SEO и продвижении сайтов | SEO Update',
    description: 'Полезные статьи о SEO, продвижении сайтов, поисковой оптимизации и увеличении трафика',
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: 'Блог о SEO и продвижении сайтов',
      description: 'Полезные статьи о SEO, продвижении сайтов, поисковой оптимизации и увеличении трафика',
      url: blogUrl,
      type: 'website',
    },
  }
}

