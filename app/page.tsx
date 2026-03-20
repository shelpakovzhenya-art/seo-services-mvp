import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  Check,
  Clock3,
  FileText,
  Gem,
  Layers3,
  LineChart,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'

const defaultHomeMetadata = {
  title: 'SEO-продвижение сайтов под заявки | Shelpakov Digital',
  description:
    'SEO-продвижение сайтов, SEO-аудит, доработка структуры и коммерческих факторов для роста заявок и продаж.',
  keywords:
    'seo продвижение сайтов, seo аудит сайта, продвижение сайта в поиске, коммерческие факторы, рост заявок',
}

const trustMetrics = [
  {
    value: 'Трафик и заявки',
    label: 'Сайт должен не просто расти в поиске, а приносить обращения.',
  },
  {
    value: 'Услуги и B2B',
    label: 'Особенно полезно там, где клиенту важно доверие перед заявкой.',
  },
  {
    value: 'Понятный план',
    label: 'После старта у проекта есть список приоритетов и шагов.',
  },
]

const heroCards = [
  {
    icon: Layers3,
    title: 'Структура сайта',
    text: 'Разбираю разделы, посадочные и точки входа, чтобы сайт был понятнее для клиента и поиска.',
  },
  {
    icon: ShieldCheck,
    title: 'Коммерческие факторы',
    text: 'Усиливаю доверие, оффер, преимущества и сценарий заявки.',
  },
  {
    icon: Clock3,
    title: 'Быстрый старт',
    text: 'Без затяжной подготовки. Сначала находим слабые места, потом запускаем правки.',
  },
]

const advantageCards = [
  {
    icon: FileText,
    title: 'Аудит без воды',
    text: 'Показываю, где сайт теряет заявки и что действительно нужно менять в первую очередь.',
  },
  {
    icon: LineChart,
    title: 'Работа под результат',
    text: 'Фокус на том, что влияет на видимость, доверие и конверсию, а не на формальные действия.',
  },
  {
    icon: BarChart3,
    title: 'Системный рост',
    text: 'SEO, контент и коммерческая подача работают вместе, а не по отдельности.',
  },
]

const packageCards = [
  {
    name: 'Старт',
    price: '15 000 ₽',
    accent: 'Для быстрого разбора и базового усиления сайта.',
    items: [
      'Базовый SEO-аудит сайта',
      'Проверка индексации, метатегов и структуры',
      'Список быстрых правок с приоритетами',
      'Созвон и разбор дальнейших шагов',
    ],
  },
  {
    name: 'Оптимальный',
    price: '30 000 ₽',
    accent: 'Для проектов, которым уже нужна работа под заявки.',
    items: [
      'Все из тарифа «Старт»',
      'Сбор и кластеризация семантики',
      'Доработка ключевых страниц услуг',
      'Усиление коммерческих факторов и CTA',
      'План работ на ближайший период',
    ],
  },
  {
    name: 'Про',
    price: '50 000 ₽',
    accent: 'Для бизнеса, который хочет выстроить сильный сайт и обгонять конкурентов.',
    items: [
      'Все из тарифа «Оптимальный»',
      'Расширение структуры и новых посадочных',
      'Глубокая работа с оффером и упаковкой',
      'Контентные и SEO-гипотезы под рост',
      'Приоритетное сопровождение проекта',
    ],
  },
]

const industryBlocks = [
  'Сайты услуг, где трафик есть, а заявок мало',
  'B2B-проекты, где клиент долго принимает решение',
  'Локальный бизнес с плотной конкуренцией в выдаче',
  'Проекты, которым нужен более сильный и дорогой образ',
]

const processBlocks = [
  {
    step: '01',
    title: 'Смотрю, что мешает росту',
    text: 'Анализирую структуру, спрос, коммерческие блоки и путь пользователя до заявки.',
  },
  {
    step: '02',
    title: 'Собираю понятный план',
    text: 'Фиксирую, что исправить в первую очередь, что усиливать дальше и куда не тратить ресурс.',
  },
  {
    step: '03',
    title: 'Дорабатываю под заявки',
    text: 'Усиливаю страницы, тексты, доверие и SEO-основу так, чтобы сайт выглядел и работал сильнее.',
  },
]

const cooperationFormats = [
  'Разовый аудит с приоритетами',
  'Доработка сайта под заявки',
  'Комплексное SEO-сопровождение',
  'Точечные задачи: страницы, структура, тексты, оффер',
]

export default async function HomePage() {
  let services: any[] = []
  let reviews: any[] = []
  let cases: any[] = []
  let posts: any[] = []

  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    })
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
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="warm-chip">SEO-продвижение под заявки</span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-slate-950 md:text-7xl">
                SEO, структура сайта и подача, которые помогают получать больше обращений.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Помогаю бизнесу усиливать сайт под поиск и под клиента: дорабатываю страницы, оффер, структуру,
                коммерческие факторы и общую логику заявки.
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
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Быстрый ответ по заявке</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">План работ после созвона</span>
                <span className="rounded-full border border-orange-200 bg-white px-4 py-2">Фокус на заявки и доверие</span>
              </div>
            </div>

            <div className="hero-panel relative overflow-hidden rounded-[34px] border border-white/70 p-5 md:p-6">
              <div className="hero-orb float-slow left-[-24px] top-10 h-28 w-28 bg-[radial-gradient(circle,rgba(255,163,102,0.34),rgba(255,163,102,0))]" />
              <div className="hero-orb float-reverse right-10 top-[-18px] h-24 w-24 bg-[radial-gradient(circle,rgba(56,189,248,0.28),rgba(56,189,248,0))]" />
              <div className="hero-orb pulse-glow bottom-10 right-[-12px] h-36 w-36 bg-[radial-gradient(circle,rgba(255,214,153,0.28),rgba(255,214,153,0))]" />
              <div className="pointer-events-none absolute left-8 top-8 h-14 w-14 rotate-12 rounded-[18px] border border-cyan-200/70 bg-white/70 shadow-[0_12px_24px_rgba(56,189,248,0.12)] float-slow" />
              <div className="pointer-events-none absolute bottom-20 left-[46%] h-4 w-24 rounded-full bg-gradient-to-r from-orange-300/60 via-cyan-300/60 to-transparent float-reverse" />
              <div className="pointer-events-none absolute right-14 top-[46%] h-16 w-16 rounded-full border border-orange-200/80 bg-white/40 pulse-glow" />
              <div className="grid gap-4">
                <div className="relative rounded-[28px] border border-white/70 bg-white/78 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что получает бизнес</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
                    Не просто рост позиций, а сайт, который выглядит сильнее и продает увереннее.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    В первом экране главное показать ценность, экспертность и следующий шаг без лишнего шума и
                    перегруза.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroCards.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.title} className="glass-panel interactive-card p-5">
                        <div className="mb-4 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {trustMetrics.map((metric) => (
                    <div key={metric.value} className="rounded-[24px] border border-orange-100 bg-orange-50/70 p-5">
                      <div className="text-2xl font-semibold text-slate-950">{metric.value}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600">{metric.label}</div>
                    </div>
                  ))}
                </div>
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
            Поэтому работа строится не вокруг одного пункта, а вокруг всей связки: спрос, структура,
            коммерческие блоки, тексты, доверие и путь к заявке.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {advantageCards.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="glass-panel interactive-card p-7">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-cyan-700" />
                </div>
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
                Форматы работы под разную задачу
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              От быстрого разбора до полноценной системной работы над сайтом и ростом заявок.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {packageCards.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`interactive-card relative flex h-full flex-col overflow-hidden rounded-[30px] border p-7 ${
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
                  {index === 1 ? (
                    <Gem className="h-8 w-8 text-cyan-700" />
                  ) : index === 0 ? (
                    <Rocket className="h-8 w-8 text-cyan-700" />
                  ) : (
                    <BarChart3 className="h-8 w-8 text-cyan-700" />
                  )}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{pkg.accent}</p>
                <div className="mt-6 flex-1 space-y-3">
                  {pkg.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                      <span className="text-sm leading-6 text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact-form" className="mt-6">
                  <Button className="w-full rounded-2xl">Выбрать тариф</Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Услуги и задачи</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">
              С чем можно прийти в работу
            </h2>
            <div className="mt-8 space-y-4">
              {cooperationFormats.map((item, index) => (
                <div
                  key={item}
                  className="interactive-card flex items-center gap-4 rounded-2xl border border-orange-100 bg-white px-5 py-4 text-slate-700"
                >
                  <span className="text-sm font-semibold text-cyan-700">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="glass-panel interactive-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-slate-950">{service.name}</h3>
                  <Briefcase className="mt-1 h-5 w-5 text-cyan-700" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                <div className="mt-6 text-sm uppercase tracking-[0.18em] text-orange-700">
                  от {service.price.toLocaleString('ru-RU')} {service.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                  <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700">
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
          {cases.length > 0 ? (
            cases.map((item, index) => (
              <div key={item.id} className="glass-panel interactive-card p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.24em] text-orange-700">Кейс {index + 1}</span>
                  <Building2 className="h-5 w-5 text-cyan-700" />
                </div>
                <h3 className="mt-6 text-3xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description || item.content || 'Кейс показывает, как доработка структуры, оффера и SEO-основы влияет на результат сайта.'}
                </p>
              </div>
            ))
          ) : (
            <div className="glass-panel p-8 lg:col-span-2">
              <h3 className="text-2xl font-semibold text-slate-950">Здесь лучше показать конкретные цифры и задачи</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Лучше всего работают кейсы со сроками, задачей клиента, сделанными правками и измеримым эффектом.
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
                    {post.excerpt || 'Статья, которая помогает закрывать вопросы клиента и усиливать доверие к проекту.'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">Блог лучше использовать как доказательство экспертизы</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Хорошо работают статьи с разбором ошибок, практикой по SEO и ответами на частые вопросы клиентов.
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
              <h3 className="text-2xl font-semibold text-slate-950">Отзывы лучше показывать с деталями</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Имя, компания, задача и результат работают сильнее, чем общий текст без контекста.
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
                  <p className="mt-2 text-sm text-slate-600">Обычно отвечаю в ближайшее время после заявки.</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                  <div className="flex items-center gap-3 text-slate-900">
                    <ShieldCheck className="h-5 w-5 text-cyan-700" />
                    <span className="font-medium">Конкретные выводы</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Без общих фраз: только то, что реально мешает сайту работать сильнее.
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
  const { getSiteUrl } = await import('@/lib/site-url')
  const siteUrl = getSiteUrl()
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
  })
  const title = homePage?.title || defaultHomeMetadata.title
  const description = homePage?.description || defaultHomeMetadata.description
  const keywords = homePage?.keywords || defaultHomeMetadata.keywords

  return {
    title: { absolute: title },
    description,
    keywords: keywords
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      type: 'website',
    },
  }
}
