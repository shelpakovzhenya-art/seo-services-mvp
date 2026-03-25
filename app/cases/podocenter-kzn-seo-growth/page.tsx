import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MapPin, Search } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import { Button } from '@/components/ui/button'
import { parseCaseGallery } from '@/lib/case-gallery'
import { isPodocenterCase } from '@/lib/case-listing'
import { localizeCaseRecord } from '@/lib/case-localization'
import { prefixPathWithLocale, type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getServicePageForLocale } from '@/lib/service-page-localization'
import { getFullUrl, getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema, createCaseArticleSchema, createFaqSchema } from '@/lib/structured-data'
import { podocenterCase } from '@/lib/podocenter-case'

const serviceLinkSlugs = ['seo', 'technical-seo', 'local-seo', 'seo-content'] as const

const resultCaptions: Record<Locale, Array<{ alt: string; caption: string }>> = {
  ru: [
    {
      alt: 'Рост поискового трафика PodoCenter',
      caption:
        'Рост визитов из поиска после усиления структуры услуг и ключевых посадочных страниц под локальный спрос.',
    },
    {
      alt: 'Динамика видимости PodoCenter по Казани',
      caption: 'Локальная видимость по Казани стала сильнее именно по тем направлениям, которые ближе к записи.',
    },
    {
      alt: 'Динамика обращений по проекту',
      caption: 'Органика стала лучше работать не только на посещаемость, но и на реальные обращения в центр.',
    },
    {
      alt: 'Матрица позиций PodoCenter',
      caption:
        'Матрица показывает усиление позиций по приоритетным услугам и более уверенное присутствие в локальной выдаче.',
    },
  ],
  en: [
    {
      alt: 'PodoCenter search traffic growth',
      caption: 'Search visits grew after the service structure and priority landing pages were strengthened for local demand.',
    },
    {
      alt: 'PodoCenter visibility growth in Kazan',
      caption: 'Local visibility in Kazan improved most strongly for service clusters that are closest to an appointment.',
    },
    {
      alt: 'Lead dynamics for the project',
      caption: 'Organic traffic started to convert not only into visits, but into real inquiries for the clinic.',
    },
    {
      alt: 'PodoCenter ranking heatmap',
      caption: 'The ranking matrix shows stronger positions for priority services and a more stable local presence.',
    },
  ],
}

const podocenterCopy: Record<
  Locale,
  {
    home: string
    cases: string
    chip: string
    heroCta: string
    heroSecondary: string
    nicheLabel: string
    nicheTitle: string
    nicheDescription: string
    regionLabel: string
    regionTitle: string
    regionDescription: string
    outcomeLabel: string
    outcomeTitle: string
    outcomeDescription: string
    aboutChip: string
    pointAChip: string
    problemsTitle: string
    goalsTitle: string
    workChip: string
    workTitle: string
    workIntro: string
    galleryChip: string
    galleryTitle: string
    galleryIntro: string
    whyChip: string
    whyTitle: string
    conclusionChip: string
    conclusionTitle: string
    faqTitle: string
    relatedChip: string
    relatedTitle: string
    relatedDescription: string
    serviceLabel: string
    contactChip: string
    contactTitle: string
    contactDescription: string
    contactBullets: string[]
    metaTitleSuffix: string
    metaDescriptionFallback: string
    schemaAbout: string[]
  }
> = {
  ru: {
    home: 'Главная',
    cases: 'Кейсы',
    chip: 'SEO-кейс локального проекта',
    heroCta: 'Обсудить продвижение проекта',
    heroSecondary: 'Посмотреть услугу SEO-продвижения',
    nicheLabel: 'Ниша',
    nicheTitle: 'Подология и медицина',
    nicheDescription:
      'Проект с высокой чувствительностью к доверию, локальной релевантности и качеству посадочных страниц.',
    regionLabel: 'Регион',
    regionTitle: 'Казань',
    regionDescription: 'Локальная выдача, где важно не только быть видимым, но и быстро доводить человека до записи.',
    outcomeLabel: 'Итог',
    outcomeTitle: 'Более сильный маршрут от поиска к обращению',
    outcomeDescription:
      'Сайт усилил локальную видимость, получил более точные посадочные под спрос и стал лучше конвертировать органику в обращения.',
    aboutChip: 'О проекте',
    pointAChip: 'Точка А и цели',
    problemsTitle: 'С какими проблемами пришли',
    goalsTitle: 'Что хотели получить',
    workChip: 'Что сделали',
    workTitle: 'Не набор мелких правок, а пересборка сайта под локальный спрос',
    workIntro:
      'Рост появился потому, что структура, посадочные страницы, доверительные блоки и техбаза начали работать вместе, а не отдельно.',
    galleryChip: 'Результаты',
    galleryTitle: 'Скриншоты роста по трафику, локальной видимости и обращениям',
    galleryIntro:
      'Ниже реальные скриншоты по проекту. Они показывают не декоративную картинку, а динамику после пересборки структуры и посадочных.',
    whyChip: 'Почему это сработало',
    whyTitle: 'Что дало результат в этом проекте',
    conclusionChip: 'Вывод',
    conclusionTitle: 'Что полезно взять похожим локальным проектам',
    faqTitle: 'Частые вопросы по кейсу и стратегии',
    relatedChip: 'Связанные услуги',
    relatedTitle: 'Что может усилить похожий проект',
    relatedDescription: 'Следующие шаги после диагностики и точек роста.',
    serviceLabel: 'Услуга',
    contactChip: 'Обсудить проект',
    contactTitle: 'Нужен не отчет, а рост по поиску и обращениям?',
    contactDescription:
      'Разберу сайт, покажу слабые места в структуре, контенте и коммерческих блоках, а затем соберу понятный план под ваш регион и спрос.',
    contactBullets: ['Ответ в течение дня', 'Без обязательств и навязчивых продаж', 'Сразу покажу точки роста по SEO, структуре и заявкам'],
    metaTitleSuffix: 'SEO-кейс PodoCenter',
    metaDescriptionFallback:
      'Кейс по SEO-продвижению PodoCenter в Казани: структура сайта, локальная выдача, органический трафик и заявки.',
    schemaAbout: ['SEO-продвижение', 'Локальное SEO', 'Структура сайта', 'Рост заявок'],
  },
  en: {
    home: 'Home',
    cases: 'Case studies',
    chip: 'Local SEO case study',
    heroCta: 'Discuss this type of growth',
    heroSecondary: 'View SEO service',
    nicheLabel: 'Niche',
    nicheTitle: 'Podiatry and medical services',
    nicheDescription:
      'A project where trust, local relevance, and the quality of landing pages directly affect lead flow.',
    regionLabel: 'Region',
    regionTitle: 'Kazan',
    regionDescription:
      'A local SERP where it is not enough to be visible. The site has to move a visitor to an appointment quickly.',
    outcomeLabel: 'Outcome',
    outcomeTitle: 'A stronger path from search to inquiry',
    outcomeDescription:
      'The site gained stronger local visibility, more precise demand-focused landing pages, and a better path from organic traffic to inquiries.',
    aboutChip: 'About the project',
    pointAChip: 'Starting point and goals',
    problemsTitle: 'What was holding the project back',
    goalsTitle: 'What the project needed',
    workChip: 'What was done',
    workTitle: 'Not a set of micro-fixes, but a rebuild around local demand',
    workIntro:
      'Growth appeared because structure, landing pages, trust signals, and the technical layer started working together instead of in isolation.',
    galleryChip: 'Results',
    galleryTitle: 'Screenshots of traffic, visibility, and inquiry growth',
    galleryIntro:
      'These are real screenshots from the project. They show how performance changed after the site structure and landing pages were rebuilt.',
    whyChip: 'Why it worked',
    whyTitle: 'What created the result in this case',
    conclusionChip: 'Takeaway',
    conclusionTitle: 'What similar local projects can borrow from this case',
    faqTitle: 'Common questions about the case and the strategy',
    relatedChip: 'Related services',
    relatedTitle: 'What can strengthen a similar project',
    relatedDescription: 'Useful next steps after the diagnosis and growth opportunities are clear.',
    serviceLabel: 'Service',
    contactChip: 'Discuss your project',
    contactTitle: 'Need growth in search and inquiries, not just a report?',
    contactDescription:
      'I will review the site, show weak points in structure, content, and commercial blocks, and turn that into a clear plan for your region and demand.',
    contactBullets: ['Reply within one business day', 'No pressure and no hard sell', 'Immediate growth points for SEO, structure, and leads'],
    metaTitleSuffix: 'PodoCenter SEO case study',
    metaDescriptionFallback:
      'A PodoCenter SEO case study in Kazan: site structure, local visibility, organic traffic, and lead flow.',
    schemaAbout: ['SEO', 'Local SEO', 'Site structure', 'Lead growth'],
  },
}

function parseResultImages(value?: string | null) {
  return parseCaseGallery(value).map((item) => item.src)
}

export default async function PodocenterCasePage() {
  const locale = await getRequestLocale()
  const copy = podocenterCopy[locale]
  const caseData = localizeCaseRecord({ ...podocenterCase }, locale)
  const localizedCasePath = prefixPathWithLocale(podocenterCase.url, locale)
  const serviceLinks = serviceLinkSlugs.map((slug) => {
    const service = getServicePageForLocale(slug, locale)

    return {
      href: prefixPathWithLocale(`/services/${slug}`, locale),
      label: service?.shortName || service?.h1 || slug,
      description: service?.intro || copy.relatedDescription,
    }
  })

  let uploadedImages = parseResultImages(podocenterCase.resultImages)

  try {
    const caseItems = await prisma.case.findMany({
      where: {
        resultImages: {
          not: null,
        },
      },
      select: {
        slug: true,
        title: true,
        description: true,
        content: true,
        resultImages: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    const gallerySource =
      caseItems.find((item) => isPodocenterCase(item) && parseResultImages(item.resultImages).length > 0) || null

    if (gallerySource) {
      uploadedImages = parseResultImages(gallerySource.resultImages)
    }
  } catch (error) {
    console.error('Error loading podocenter case assets:', error)
  }

  const galleryImages = uploadedImages.map((src, index) => ({
    src,
    alt: resultCaptions[locale][index]?.alt || `${caseData.title} ${index + 1}`,
    caption: resultCaptions[locale][index]?.caption || copy.galleryIntro,
  }))

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: copy.home, path: prefixPathWithLocale('/', locale) },
    { name: copy.cases, path: prefixPathWithLocale('/cases', locale) },
    { name: caseData.h1 || caseData.title || podocenterCase.h1, path: localizedCasePath },
  ])
  const faqSchema = createFaqSchema(caseData.faq || [])
  const caseArticleSchema = createCaseArticleSchema({
    path: localizedCasePath,
    title: caseData.title || podocenterCase.title,
    description: caseData.description || copy.metaDescriptionFallback,
    image: galleryImages[0]?.src,
    about: copy.schemaAbout,
    locale,
  })

  return (
    <div className="page-shell">
      <JsonLd id="podocenter-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="podocenter-faq-schema" data={faqSchema} />
      <JsonLd id="podocenter-case-schema" data={caseArticleSchema} />

      <section className="soft-section surface-pad">
        <span className="warm-chip">{copy.chip}</span>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold text-slate-950 md:text-6xl">
          {caseData.h1 || caseData.title || podocenterCase.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{caseData.excerpt || podocenterCase.excerpt}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#case-contact">
            <Button size="lg" className="rounded-full px-7">
              {copy.heroCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link href={prefixPathWithLocale('/services/seo', locale)} className="inline-flex">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50"
            >
              {copy.heroSecondary}
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">{copy.nicheLabel}</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">{copy.nicheTitle}</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy.nicheDescription}</p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">{copy.regionLabel}</div>
            <div className="mt-3 flex items-center gap-3 text-2xl font-semibold text-slate-950">
              <MapPin className="h-6 w-6 text-cyan-700" />
              {copy.regionTitle}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy.regionDescription}</p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">{copy.outcomeLabel}</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">{copy.outcomeTitle}</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy.outcomeDescription}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="page-card">
          <span className="warm-chip">{copy.aboutChip}</span>
          <ul className="mt-6 space-y-4 text-base leading-7 text-slate-700">
            {(caseData.about || []).map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="page-card">
          <span className="warm-chip">{copy.pointAChip}</span>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{copy.problemsTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {(caseData.pointA || []).map((item) => (
                  <li key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{copy.goalsTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {(caseData.goals || []).map((item) => (
                  <li key={item} className="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">{copy.workChip}</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.workTitle}</h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">{copy.workIntro}</p>

        <div className="mt-10 space-y-6">
          {(caseData.work || []).map((section) => (
            <article key={section.title} className="rounded-[28px] border border-orange-100 bg-white/85 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section className="mt-8 page-card">
          <span className="warm-chip">{copy.galleryChip}</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.galleryTitle}</h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">{copy.galleryIntro}</p>

          <div className="mt-8 space-y-6">
            {galleryImages.map((item, index) => (
              <article
                key={item.src}
                className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_18px_45px_rgba(148,107,61,0.08)]"
              >
                <div className="border-b border-orange-100 bg-[linear-gradient(180deg,#fffdf8,#f7fbff)] p-3 sm:p-4">
                  <div className="relative min-h-[220px] w-full overflow-hidden rounded-[20px] border border-orange-100 bg-white sm:min-h-[320px] lg:min-h-[420px]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={index === 0}
                      unoptimized
                      className="object-contain p-2 sm:p-4"
                    />
                  </div>
                </div>
                <div className="px-5 py-4 sm:px-6">
                  <p className="text-base font-medium leading-7 text-slate-700">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="page-card">
          <span className="warm-chip">{copy.whyChip}</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">{copy.whyTitle}</h2>
          <div className="mt-6 space-y-4">
            {(caseData.whyItWorked || []).map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="page-card">
          <span className="warm-chip">{copy.conclusionChip}</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">{copy.conclusionTitle}</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">{caseData.conclusion}</p>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">FAQ</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{copy.faqTitle}</h2>
        <div className="mt-8 grid gap-4">
          {(caseData.faq || []).map((item) => (
            <details key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-950">{item.question}</summary>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">{copy.relatedChip}</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{copy.relatedTitle}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{copy.relatedDescription}</p>
        <div className="uniform-grid-4 mt-8 gap-4">
          {serviceLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200"
            >
              <div className="flex items-center gap-3 text-cyan-700">
                <Search className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.22em]">{copy.serviceLabel}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-orange-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <span className="warm-chip">{copy.contactChip}</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{copy.contactDescription}</p>
            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-600">
              {copy.contactBullets.map((item) => (
                <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <LazyContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = podocenterCopy[locale]
  const caseData = localizeCaseRecord({ ...podocenterCase }, locale)
  const alternates = getLocaleAlternates(podocenterCase.url)
  const url = getFullUrl(prefixPathWithLocale(podocenterCase.url, locale))
  const title = normalizeMetaTitle(caseData.title || podocenterCase.title, copy.metaTitleSuffix)
  const description = normalizeMetaDescription(caseData.description, copy.metaDescriptionFallback)

  return {
    title,
    description,
    alternates: {
      ...alternates,
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
