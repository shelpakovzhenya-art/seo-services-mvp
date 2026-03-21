import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MapPin, Search } from 'lucide-react'
import LazyContactForm from '@/components/LazyContactForm'
import { Button } from '@/components/ui/button'
import { isPlaceholderCase } from '@/lib/case-listing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { prisma } from '@/lib/prisma'
import { getFullUrl } from '@/lib/site-url'
import { podocenterCase } from '@/lib/podocenter-case'

const serviceLinks = [
  { href: '/services/seo', label: 'SEO-продвижение' },
  { href: '/services/technical-seo', label: 'Техническое SEO' },
  { href: '/services/local-seo', label: 'Local SEO' },
  { href: '/services/seo-content', label: 'SEO-контент' },
]

const resultCaptions = [
  {
    alt: 'Рост поискового трафика PodoCenter',
    caption:
      'Рост визитов и пользователей из поиска после усиления структуры и ключевых посадочных страниц.',
  },
  {
    alt: 'Динамика видимости PodoCenter по Казани',
    caption:
      'Видимость по Казани выросла и закрепилась в коммерческом сегменте локальной выдачи.',
  },
  {
    alt: 'Динамика заявок и CPL по проекту',
    caption:
      'При том же бюджете трафик и количество заявок росли, а CPL снижался месяц к месяцу.',
  },
  {
    alt: 'Матрица позиций PodoCenter',
    caption:
      'Матрица показывает закрепление значимой части запросов в ТОП-10 и появление точек входа в ТОП-3.',
  },
]

function parseResultImages(value?: string | null) {
  return (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default async function PodocenterCasePage() {
  let uploadedImages: string[] = []

  try {
    const caseItems = await prisma.case.findMany({
      where: {
        OR: [
          { slug: podocenterCase.slug },
          { title: { contains: 'PodoCenter', mode: 'insensitive' } },
          { title: { contains: 'подолог', mode: 'insensitive' } },
          { resultImages: { not: null } },
        ],
      },
      select: {
        slug: true,
        title: true,
        resultImages: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    const gallerySource =
      caseItems.find((item) => item.slug === podocenterCase.slug && parseResultImages(item.resultImages).length > 0) ||
      caseItems.find(
        (item) =>
          (item.title || '').toLowerCase().includes('podocenter') && parseResultImages(item.resultImages).length > 0
      ) ||
      caseItems.find((item) => !isPlaceholderCase(item) && parseResultImages(item.resultImages).length > 0) ||
      caseItems.find((item) => parseResultImages(item.resultImages).length > 0) ||
      null

    uploadedImages = parseResultImages(gallerySource?.resultImages)
  } catch (error) {
    console.error('Error loading podocenter case assets:', error)
  }

  const galleryImages = uploadedImages.map((src, index) => ({
    src,
    alt: resultCaptions[index]?.alt || `Скрин результата PodoCenter ${index + 1}`,
    caption:
      resultCaptions[index]?.caption ||
      'Скриншот из проекта с динамикой роста по поиску, видимости и обращениям.',
  }))

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: getFullUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Кейсы',
        item: getFullUrl('/cases'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: podocenterCase.h1,
        item: getFullUrl(podocenterCase.url),
      },
    ],
  }

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="soft-section surface-pad">
        <span className="warm-chip">SEO-кейс локального проекта</span>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold text-slate-950 md:text-6xl">
          {podocenterCase.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{podocenterCase.excerpt}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#case-contact">
            <Button size="lg" className="rounded-full px-7">
              Обсудить продвижение проекта
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link href="/services/seo" className="inline-flex">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50"
            >
              Посмотреть услугу SEO-продвижения
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Ниша</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">Подология и медицина</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Высокая чувствительность к доверию, локальной релевантности и качеству посадочных страниц.
            </p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Регион</div>
            <div className="mt-3 flex items-center gap-3 text-2xl font-semibold text-slate-950">
              <MapPin className="h-6 w-6 text-cyan-700" />
              Казань
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Локальная конкуренция, где важны и видимость в поиске, и понятный сценарий записи.
            </p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Итог</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">Рост по SEO и заявкам</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Проект усилил видимость, получил больше целевого трафика и превратил поиск в рабочий канал обращений.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="page-card">
          <span className="warm-chip">О проекте</span>
          <ul className="mt-6 space-y-4 text-base leading-7 text-slate-700">
            {podocenterCase.about.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="page-card">
          <span className="warm-chip">Точка А и цели</span>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">С какими проблемами пришли</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {podocenterCase.pointA.map((item) => (
                  <li key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Что нужно было получить</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {podocenterCase.goals.map((item) => (
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
        <span className="warm-chip">Что сделали</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Не набор правок, а система роста для локального медицинского проекта
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
          В проекте нельзя было ограничиться только метатегами или точечными техническими задачами. Чтобы получить рост по
          органике и обращениям, мы выстроили связку из структуры, услуг, контента, коммерческих факторов и базовой
          SEO-оптимизации.
        </p>

        <div className="mt-10 space-y-6">
          {podocenterCase.work.map((section) => (
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
          <span className="warm-chip">Результаты</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
            Скриншоты роста по трафику, видимости и заявкам
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
            Ниже идут реальные скриншоты из проекта. Каждый экран показывает отдельный срез: трафик, видимость,
            обращения и позиции.
          </p>

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
          <span className="warm-chip">Что дало результат</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Почему стратегия сработала</h2>
          <div className="mt-6 space-y-4">
            {podocenterCase.whyItWorked.map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-base leading-8 text-slate-600">{podocenterCase.conclusion}</p>
        </div>

        <div className="page-card">
          <span className="warm-chip">Вывод</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Что важно для похожих проектов</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Для локального сервиса недостаточно просто получить трафик. Нужны правильные страницы услуг, понятная логика
            записи, сильные коммерческие сигналы и техническая база, которая помогает поиску правильно понимать сайт.
            Если у вас похожая задача, чаще всего стоит начинать с{' '}
            <Link href="/services/seo-audit" className="font-medium text-cyan-700 transition hover:text-slate-950">
              SEO-аудита
            </Link>{' '}
            или сразу собирать полноценный план{' '}
            <Link href="/services/local-seo" className="font-medium text-cyan-700 transition hover:text-slate-950">
              локального SEO-продвижения
            </Link>
            .
          </p>

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">CTA</div>
            <h3 className="mt-3 text-2xl font-semibold">Нужен похожий результат для локального проекта?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Разберу, где сайт теряет поисковый потенциал, какие страницы нужно усиливать в первую очередь и как связать
              SEO с обращениями, а не только с позициями.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#case-contact">
                <Button className="rounded-full">Заказать SEO-разбор проекта</Button>
              </a>
              <Link href="/calculator">
                <Button
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  Оценить формат работ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">FAQ</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Частые вопросы по кейсу и стратегии</h2>
        <div className="mt-8 grid gap-4">
          {podocenterCase.faq.map((item) => (
            <details key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-950">{item.question}</summary>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">Связанные услуги</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Что может усилить такой же проект</h2>
        <div className="uniform-grid-4 mt-8 gap-4">
          {serviceLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200"
            >
              <div className="flex items-center gap-3 text-cyan-700">
                <Search className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.22em]">Услуга</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Подходит, если проекту нужен следующий шаг после диагностики или системный рост поискового канала.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
            <span className="warm-chip">Обсудить проект</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
              Нужен не отчёт, а рост по поиску и обращениям?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Разберу сайт, покажу слабые места в структуре, контенте и коммерческих факторах, а затем соберу понятный
              план продвижения под ваш регион и спрос.
            </p>
            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-600">
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">Ответ в течение дня</div>
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                Без обязательств и навязчивых продаж
              </div>
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                Покажу точки роста по SEO, структуре и заявкам
              </div>
            </div>
          </div>

          <div className="p-8">
            <LazyContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateMetadata() {
  const url = getFullUrl(podocenterCase.url)
  const title = normalizeMetaTitle(podocenterCase.title, 'SEO-кейс PodoCenter')
  const description = normalizeMetaDescription(
    podocenterCase.description,
    'Кейс по SEO-продвижению PodoCenter в Казани: усиление структуры сайта, рост видимости, поискового трафика и обращений по приоритетным запросам.'
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
