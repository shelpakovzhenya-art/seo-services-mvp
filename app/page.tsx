import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Clock3,
  FileText,
  Gem,
  LineChart,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { podocenterCase } from '@/lib/podocenter-case'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'

const defaultHomeMetadata = {
  title: 'SEO-продвижение сайтов под заявки | Shelpakov Digital',
  description:
    'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика для услуг, B2B-проектов и локального бизнеса.',
  keywords:
    'seo продвижение сайтов, seo аудит, техническое seo, коммерческие факторы, рост заявок, органический трафик',
}

const trustMetrics = [
  {
    value: 'Трафик и заявки',
    label: 'Поисковый рост должен приводить не только к визитам, но и к обращениям в бизнес.',
  },
  {
    value: 'Услуги и B2B',
    label: 'Особенно полезно там, где клиенту важно доверие, экспертность и понятный следующий шаг.',
  },
  {
    value: 'Понятный план',
    label: 'После старта проекта есть приоритеты, логика внедрения и список точек роста.',
  },
]

const advantageCards = [
  {
    icon: FileText,
    title: 'Аудит без воды',
    text: 'Сначала показываю, где сайт реально теряет потенциал, а не перегружаю второстепенными замечаниями.',
  },
  {
    icon: LineChart,
    title: 'Фокус на результате',
    text: 'Работа строится вокруг органики, доверия и конверсии, а не вокруг формального списка SEO-действий.',
  },
  {
    icon: BarChart3,
    title: 'Системный подход',
    text: 'Структура, контент, техническая база и подача сайта собираются в одну рабочую систему роста.',
  },
]

const packageCards = [
  {
    name: 'Старт',
    price: '15 000 ₽',
    accent:
      'Когда нужно быстро понять слабые места сайта и получить понятный список первых шагов.',
    icon: Rocket,
    items: [
      'Базовый SEO-аудит сайта',
      'Проверка индексации, метаданных и структуры',
      'Список быстрых правок с приоритетами',
      'Короткий разбор дальнейших шагов',
    ],
  },
  {
    name: 'Оптимальный',
    price: '30 000 ₽',
    accent:
      'Когда проекту уже нужен рабочий план усиления ключевых страниц, спроса и коммерческой подачи.',
    icon: Gem,
    items: [
      'Всё из тарифа «Старт»',
      'Сбор и кластеризация приоритетной семантики',
      'Доработка ключевых страниц услуг',
      'Усиление коммерческих факторов и CTA',
    ],
  },
  {
    name: 'Про',
    price: '50 000 ₽',
    accent:
      'Когда нужен более глубокий контур роста: структура, контентные гипотезы и сопровождение проекта.',
    icon: BarChart3,
    items: [
      'Всё из тарифа «Оптимальный»',
      'Расширение структуры и новых посадочных',
      'Глубокая работа с оффером и упаковкой',
      'Приоритетное сопровождение проекта',
    ],
  },
]

const industryBlocks = [
  'Сайты услуг, где трафик есть, а заявок мало.',
  'B2B-проекты с длинным циклом принятия решения.',
  'Локальный бизнес с плотной конкуренцией в выдаче.',
  'Проекты, которым нужен более сильный и дорогой образ.',
]

const processBlocks = [
  {
    step: '01',
    title: 'Разбираю спрос и текущее состояние сайта',
    text: 'Смотрю структуру, ключевые страницы, коммерческие блоки и путь пользователя до заявки.',
  },
  {
    step: '02',
    title: 'Собираю рабочий план',
    text: 'Фиксирую приоритеты: что исправить срочно, что усилить следующим этапом и куда не тратить ресурсы.',
  },
  {
    step: '03',
    title: 'Дорабатываю сайт под рост',
    text: 'Усиливаю страницы, тексты, доверие и SEO-основу так, чтобы сайт выглядел и работал сильнее.',
  },
]

export default async function HomePage() {
  let reviews: any[] = []
  let cases: any[] = []
  let posts: any[] = []

  try {
    reviews = await prisma.review.findMany({
      orderBy: { order: 'asc' },
      take: 3,
    })
    cases = await prisma.case.findMany({
      orderBy: { order: 'asc' },
      take: 2,
    })
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }

  return (
    <div className="overflow-hidden">
      <section className="section-grid relative border-b border-orange-100">
        <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-24 md:pt-20">
          <div className="hero-panel hero-sheen relative overflow-hidden rounded-[40px] border border-white/70 px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
            <div className="hero-grid-mask" />
            <div className="hero-orb float-slow left-[-30px] top-10 h-28 w-28 bg-[radial-gradient(circle,rgba(255,163,102,0.34),rgba(255,163,102,0))]" />
            <div className="hero-orb float-reverse right-10 top-[-16px] h-24 w-24 bg-[radial-gradient(circle,rgba(56,189,248,0.28),rgba(56,189,248,0))]" />
            <div className="hero-orb pulse-glow bottom-8 right-[-20px] h-40 w-40 bg-[radial-gradient(circle,rgba(255,214,153,0.3),rgba(255,214,153,0))]" />
            <div className="hero-fragment drift-right right-[7%] top-[14%] hidden md:flex">
              <span className="hero-fragment-line w-16" />
              <span className="hero-fragment-line w-8" />
            </div>
            <div className="hero-fragment drift-left left-[56%] top-[26%] hidden lg:flex">
              <span className="hero-fragment-dot" />
              <span className="hero-fragment-line w-20" />
            </div>
            <div className="hero-fragment float-slow bottom-[20%] right-[18%] hidden md:flex">
              <span className="hero-fragment-line w-10" />
              <span className="hero-fragment-line w-24" />
            </div>
            <div className="hero-beam drift-right" />

            <div className="relative max-w-5xl">
              <span className="warm-chip">SEO-продвижение под заявки</span>
              <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-slate-950 md:text-7xl">
                SEO и структура сайта, которые помогают получать больше обращений, а не просто расти по позициям.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                Помогаю бизнесу усиливать сайт под поиск и под клиента: дорабатываю ключевые страницы, оффер,
                структуру, коммерческие факторы и логику заявки, чтобы органика становилась каналом роста.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
                    Получить разбор сайта
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/cases">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50"
                  >
                    Посмотреть кейсы
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-orange-200 bg-white/90 px-4 py-2 shadow-sm">
                  Быстрый ответ по заявке
                </span>
                <span className="rounded-full border border-orange-200 bg-white/90 px-4 py-2 shadow-sm">
                  План работ после созвона
                </span>
                <span className="rounded-full border border-orange-200 bg-white/90 px-4 py-2 shadow-sm">
                  Фокус на заявках и доверии
                </span>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <div
                    key={metric.value}
                    className="rounded-[24px] border border-orange-100 bg-white/82 p-5 shadow-[0_18px_35px_rgba(138,103,63,0.06)] backdrop-blur-sm"
                  >
                    <div className="text-2xl font-semibold text-slate-950">{metric.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Подход к проекту</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              Сайт должен быть убедительным и для поиска, и для клиента
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Поэтому работа строится вокруг связки: спрос, структура, коммерческие блоки, тексты, доверие и путь
            к заявке.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {advantageCards.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="glass-panel interactive-card p-7">
                <Icon className="h-8 w-8 text-cyan-700" />
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white/50">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Тарифы</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
                Форматы работ под разную задачу
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              От быстрого разбора до более глубокого сопровождения проекта с усилением структуры, подачи и SEO-основы.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {packageCards.map((pkg, index) => {
              const Icon = pkg.icon
              return (
                <div
                  key={pkg.name}
                  className={`interactive-card relative flex h-full flex-col rounded-[30px] border p-7 ${
                    index === 1
                      ? 'border-cyan-200 bg-[linear-gradient(180deg,rgba(224,247,255,0.95),rgba(255,250,243,0.95))] shadow-[0_24px_60px_rgba(56,189,248,0.12)]'
                      : 'border-white/80 bg-white/88'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-orange-700">{pkg.name}</div>
                      <h3 className="mt-3 text-3xl font-semibold text-slate-950">{pkg.price}</h3>
                    </div>
                    <Icon className="h-8 w-8 text-cyan-700" />
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">{pkg.accent}</p>

                  <div className="mt-6 flex-1 space-y-3">
                    {pkg.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                        <span className="text-sm leading-6 text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <a href="#contact-form" className="mt-6">
                    <Button className="w-full rounded-2xl">Выбрать тариф</Button>
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ServicesCatalogSection compact />

      <section className="border-y border-orange-100 bg-white/50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-panel interactive-card p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Кому особенно полезно</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Если сайт уже есть, но работает слабее, чем должен
              </h2>
              <div className="mt-8 space-y-4">
                {industryBlocks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {processBlocks.map((item) => (
                <div key={item.step} className="glass-panel interactive-card flex gap-5 p-6">
                  <div className="text-3xl font-semibold text-cyan-700">{item.step}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Кейсы</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              Примеры проектов, где сайт стал сильнее
            </h2>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
            Открыть кейсы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href={podocenterCase.url}
            className="glass-panel interactive-card group block p-8 transition hover:border-cyan-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.24em] text-orange-700">Новый кейс</span>
              <Building2 className="h-5 w-5 text-cyan-700" />
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-slate-950">{podocenterCase.h1}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{podocenterCase.excerpt}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition group-hover:text-slate-950">
              Открыть кейс
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {cases.length > 0 ? (
            cases.map((item, index) => (
              <div key={item.id} className="glass-panel interactive-card p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.24em] text-orange-700">Кейс {index + 1}</span>
                  <Building2 className="h-5 w-5 text-cyan-700" />
                </div>
                <h3 className="mt-6 text-3xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description ||
                    item.content ||
                    'Разбор проекта, в котором доработка структуры, контента и ключевых страниц усилила органический потенциал сайта.'}
                </p>
              </div>
            ))
          ) : (
            <div className="glass-panel p-8 lg:col-span-2">
              <h3 className="text-2xl font-semibold text-slate-950">Кейсы с разбором задачи, работ и результата</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Здесь публикуются проекты, в которых видно, как структура сайта, SEO и коммерческие факторы влияют на
                трафик, заявки и стоимость обращения.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white/50">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Блог</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
                Материалы, которые усиливают экспертность сайта
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
              Перейти в блог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glass-panel interactive-card group p-7 transition hover:border-cyan-200"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Материал</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {post.excerpt ||
                      'Материал, который помогает клиенту лучше понять подход, ошибки и точки роста сайта.'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">Блог усиливает доверие и поисковое покрытие</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Здесь лучше всего работают экспертные материалы: разборы ошибок, практика по SEO и ответы на частые
                  вопросы клиентов.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Отзывы</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              Подтверждение, которое работает на доверие
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="glass-panel interactive-card p-7">
                <div className="text-sm uppercase tracking-[0.24em] text-orange-700">{review.author}</div>
                <p className="mt-5 text-sm leading-7 text-slate-600">{review.text}</p>
                {(review.company || review.position) && (
                  <div className="mt-6 text-sm text-slate-400">
                    {[review.company, review.position].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="glass-panel p-7 md:col-span-3">
              <h3 className="text-2xl font-semibold text-slate-950">Отзывы клиентов и рабочий контекст проекта</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Лучше всего этот блок работает, когда в нём есть реальные отзывы с именем, компанией и коротким описанием
                задачи, которую нужно было решить.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="contact-form" className="scroll-mt-32 border-t border-orange-100 bg-white/50">
        <div className="container mx-auto px-4 py-20">
          <div className="soft-section grid gap-8 overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Следующий шаг</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
                Оставьте заявку, и я подготовлю разбор сайта
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600">
                Покажу, что мешает росту, где сайт недожимает по заявкам и с каких изменений логичнее начать.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Clock3 className="h-5 w-5 text-cyan-700" />
                    <span className="font-medium">Быстрая обратная связь</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Обычно отвечаю в течение дня после заявки.</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ShieldCheck className="h-5 w-5 text-cyan-700" />
                    <span className="font-medium">Конкретные выводы</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Без общих фраз: только понятные точки роста и следующий шаг.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
  } catch (error) {
    page = null
  }
  const { getSiteUrl } = await import('@/lib/site-url')
  const siteUrl = getSiteUrl()

  return {
    title: normalizeMetaTitle(page?.title, defaultHomeMetadata.title),
    description: normalizeMetaDescription(page?.description, defaultHomeMetadata.description),
    keywords: page?.keywords || defaultHomeMetadata.keywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: normalizeMetaTitle(page?.title, defaultHomeMetadata.title),
      description: normalizeMetaDescription(page?.description, defaultHomeMetadata.description),
      url: siteUrl,
      type: 'website',
    },
  }
}
