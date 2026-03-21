import Image from 'next/image'
import { notFound } from 'next/navigation'
import ContactForm from '@/components/ContactForm'
import RichContent from '@/components/RichContent'
import { Button } from '@/components/ui/button'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { prisma } from '@/lib/prisma'
import { getFullUrl } from '@/lib/site-url'

function parseResultImages(value?: string | null) {
  return (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default async function CasePage({ params }: { params: { slug: string } }) {
  const caseItem = await prisma.case.findFirst({
    where: { slug: params.slug },
  })

  if (!caseItem) {
    notFound()
  }

  const galleryImages = parseResultImages(caseItem.resultImages)

  return (
    <div className="page-shell">
      <section className="soft-section surface-pad overflow-hidden">
        <span className="warm-chip">Кейс</span>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold text-slate-950 md:text-6xl">{caseItem.title}</h1>
        {caseItem.description ? (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{caseItem.description}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#case-contact">
            <Button size="lg" className="rounded-full px-7">
              Обсудить похожий проект
            </Button>
          </a>
        </div>

        {caseItem.image ? (
          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_50px_rgba(58,97,137,0.12)]">
            <div className="relative aspect-[16/9] w-full">
              <Image src={caseItem.image} alt={caseItem.title} fill unoptimized className="object-cover" />
            </div>
          </div>
        ) : null}
      </section>

      <RichContent
        content={caseItem.content}
        title={caseItem.title}
        className="page-card mt-8 prose max-w-none prose-slate"
      />

      {galleryImages.length > 0 ? (
        <section className="page-card mt-8">
          <h2 className="text-3xl font-semibold text-slate-950">Скрины и результаты</h2>
          <div className="uniform-grid-3 mt-8 gap-4">
            {galleryImages.map((src, index) => (
              <article
                key={src}
                className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_18px_45px_rgba(148,107,61,0.08)]"
              >
                <div className="relative aspect-[16/10] w-full bg-[linear-gradient(180deg,#fffdf8,#f7fbff)] p-3">
                  <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/80 bg-white">
                    <Image
                      src={src}
                      alt={`${caseItem.title} ${index + 1}`}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
            <span className="warm-chip">Обсудить проект</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
              Нужен похожий кейс для вашего сайта?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Разберу задачу, покажу точки роста и подскажу, с чего логично начать, чтобы SEO и структура сайта
              работали на заявки.
            </p>
          </div>

          <div className="p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const caseItem = await prisma.case.findFirst({
    where: { slug: params.slug },
  })

  if (!caseItem) {
    return {}
  }

  const url = getFullUrl(`/cases/${params.slug}`)
  const title = normalizeMetaTitle(caseItem.title, 'SEO-кейс')
  const description = normalizeMetaDescription(
    caseItem.description,
    'Кейс Shelpakov Digital по SEO, структуре сайта и росту заявок с понятной стратегией, внедрением ключевых правок и акцентом на коммерческий результат.'
  )

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
  }
}
