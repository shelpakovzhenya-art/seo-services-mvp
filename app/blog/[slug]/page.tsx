import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post
  
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true }
    })
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {post.coverImage && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      {post.publishedAt && (
        <p className="text-gray-500 mb-8">
          {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
  let post
  
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true }
    })
  } catch (error) {
    post = null
  }

  if (!post) {
    return {
      title: 'Статья не найдена',
    }
  }

  return {
    title: `${post.title} - SEO Services`,
    description: post.excerpt || post.title,
  }
}

