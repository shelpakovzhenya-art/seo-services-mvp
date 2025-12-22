import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import BlogManager from '@/components/admin/BlogManager'

export default async function AdminBlogPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { order: 'asc' }
  })

  // Serialize data to remove Date objects and make it safe for client components
  // Convert Date objects to ISO strings for serialization
  const serializedPosts = posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    published: post.published,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    parentId: post.parentId,
    order: post.order,
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Управление блогом</h1>
      <BlogManager initialPosts={serializedPosts} />
    </div>
  )
}

