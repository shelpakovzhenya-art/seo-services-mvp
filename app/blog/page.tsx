import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription } from '@/lib/seo-meta'

function getFallbackCover(slug: string) {
  const coverMap: Record<string, string> = {
    'trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii': '/blog/seo-site-requirements-cover.svg',
  }

  return coverMap[slug] || ''
}

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
      <section className="surface-cosmos p-8 md:p-10">
        <div className="max-w-4xl">
          <span className="warm-chip">Р‘Р»РѕРі</span>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">РњР°С‚РµСЂРёР°Р»С‹ РїРѕ SEO Рё СЂР°Р·РІРёС‚РёСЋ СЃР°Р№С‚Р°</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            РџСѓР±Р»РёРєСѓСЋ СЂР°Р·Р±РѕСЂС‹ РїРѕ SEO, СЃС‚СЂСѓРєС‚СѓСЂРµ СЃР°Р№С‚Р°, РєРѕРјРјРµСЂС‡РµСЃРєРёРј С„Р°РєС‚РѕСЂР°Рј Рё РєРѕРЅС‚РµРЅС‚Сѓ, РєРѕС‚РѕСЂС‹Рµ РїРѕРјРѕРіР°СЋС‚ РїСЂРёРЅРёРјР°С‚СЊ
            РІР·РІРµС€РµРЅРЅС‹Рµ СЂРµС€РµРЅРёСЏ РїРѕ РїСЂРѕРµРєС‚Сѓ.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">Р Р°Р·Р±РѕСЂС‹ РѕС€РёР±РѕРє Рё С‚РѕС‡РµРє СЂРѕСЃС‚Р°</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">РњР°С‚РµСЂРёР°Р»С‹ РґР»СЏ РІР»Р°РґРµР»СЊС†Р° СЃР°Р№С‚Р°</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2">SEO + СѓРїР°РєРѕРІРєР° + РєРѕРЅРІРµСЂСЃРёСЏ</span>
          </div>
        </div>
      </section>

      <section className="mt-10 surface-grid p-8 md:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="reading-shell interactive-card overflow-hidden p-0">
                {(post.coverImage || getFallbackCover(post.slug)) && (
                  <div className="relative h-48 w-full">
                    <Image src={post.coverImage || getFallbackCover(post.slug)} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">РЎС‚Р°С‚СЊСЏ</div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-950">{post.title}</h2>
                  {post.excerpt && <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>}
                  {post.publishedAt && (
                    <p className="mt-4 text-sm text-slate-400">{new Date(post.publishedAt).toLocaleDateString('ru-RU')}</p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && <div className="reading-shell mt-8 text-center text-slate-500">РџРѕРєР° РѕРїСѓР±Р»РёРєРѕРІР°РЅРЅС‹С… СЃС‚Р°С‚РµР№ РЅРµС‚.</div>}
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const { getFullUrl } = await import('@/lib/site-url')
  const blogUrl = getFullUrl('/blog')
  const title = 'Р‘Р»РѕРі Рѕ SEO Рё СЂР°Р·РІРёС‚РёРё СЃР°Р№С‚Р° | Shelpakov Digital'
  const description = normalizeMetaDescription(
    null,
    'Р­РєСЃРїРµСЂС‚РЅС‹Рµ СЃС‚Р°С‚СЊРё Рѕ SEO, СЃС‚СЂСѓРєС‚СѓСЂРµ СЃР°Р№С‚Р°, РєРѕРјРјРµСЂС‡РµСЃРєРёС… С„Р°РєС‚РѕСЂР°С… Рё РєРѕРЅС‚РµРЅС‚Рµ: СЃ РїСЂР°РєС‚РёС‡РµСЃРєРёРјРё РІС‹РІРѕРґР°РјРё РґР»СЏ Р±РёР·РЅРµСЃР°, РјР°СЂРєРµС‚РёРЅРіР° Рё СЂРѕСЃС‚Р° Р·Р°СЏРІРѕРє.'
  )

  return {
    title,
    description,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title,
      description,
      url: blogUrl,
      type: 'website',
    },
  }
}
