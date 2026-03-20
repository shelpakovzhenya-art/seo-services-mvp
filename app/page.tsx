import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
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
  Star,
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
    value: 'Трафик + заявки',
    label: 'Работаю не только над видимостью сайта, но и над тем, чтобы посетитель оставлял обращение.',
  },
  {
    value: 'B2B и услуги',
    label: 'Сильнее всего раскрываются проекты, где важны доверие, экспертность и понятный оффер.',
  },
  {
    value: 'План на 90 дней',
    label: 'После старта у вас есть понятный список задач, приоритетов и точек роста.',
  },
]

const heroPillars = [
  {
    icon: Layers3,
    title: 'Структура без хаоса',
    text: 'Собираю семантику, разделы и посадочные страницы в понятную систему.',
  },
  {
    icon: BadgeCheck,
    title: 'Оффер, который читается',
    text: 'Усиливаю подачу услуг, чтобы клиент быстрее понимал, почему стоит обратиться именно к вам.',
  },
  {
    icon: Clock3,
    title: 'Быстрый старт',
    text: 'Без долгой раскачки: аудит, приоритеты и первые правки можно запустить сразу.',
  },
]

const advantageCards = [
  {
    icon: ShieldCheck,
    title: 'Прозрачный процесс',
    text: 'Вы понимаете, что делается, зачем это делается и какой эффект ожидаем на каждом этапе.',
  },
  {
    icon: FileText,
    title: 'Коммерческая упаковка',
    text: 'Дорабатываю не только SEO, но и доверие: оффер, преимущества, сценарий заявки, блоки убеждения.',
  },
  {
    icon: LineChart,
    title: 'Рост без пустых действий',
    text: 'Фокус на тех изменениях, которые реально влияют на позиции, поведение пользователей и обращения.',
  },
]

const packageCards = [
  {
    name: 'Старт',
    price: '15 000 ₽',
    accent: 'Подходит, если нужно быстро навести порядок в основе проекта.',
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
    accent: 'Для проектов, которым уже нужен системный рост и работа под заявки.',
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
    accent: 'Для бизнеса, который хочет выстроить сильный сайт и двигаться быстрее конкурентов.',
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
  'B2B-компании и экспертные услуги',
  'Локальный бизнес с конкурентной выдачей',
  'Сайты услуг, где мало заявок при нормальном трафике',
  'Проекты, которым нужна сильная подача, а не просто набор страниц',
]

const processBlocks = [
  {
    step: '01',
    title: 'Смотрю, где теряются деньги',
    text: 'Разбираю структуру сайта, спрос, слабые страницы и места, где пользователь не доходит до заявки.',
  },
  {
    step: '02',
    title: 'Собираю план без воды',
    text: 'Формирую конкретные действия: что исправить, что усилить, что запускать в первую очередь.',
  },
  {
    step: '03',
    title: 'Дорабатываю под рост',
    text: 'Соединяю SEO, коммерческие факторы и контент так, чтобы сайт выглядел сильнее и продавал увереннее.',
  },
]

const cooperationFormats = [
  'Разовый аудит с понятными выводами',
  'Доработка сайта под рост заявок',
  'Комплексное SEO-сопровождение',
  'Точечные задачи: структура, страницы, тексты, оффер',
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
      <section className="section-grid relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(0,245,255,0.14),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(77,124,255,0.24),transparent_26%),radial-gradient(circle_at_65%_72%,rgba(16,185,129,0.14),transparent_24%)]" />
        <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                Shelpakov Digital
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] text-white md:text-7xl">
                Продвижение сайта, которое приводит не только трафик, но и заявки.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Помогаю бизнесу получать больше обращений из поиска: усиливаю структуру сайта, коммерческие
                факторы, страницы услуг и общую подачу проекта.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7 shadow-[0_0_40px_rgba(34,211,238,0.28)]">
                    Получить разбор сайта
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/cases">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10"
                  >
                    Посмотреть кейсы
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Быстрый ответ по заявке
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  План работ после созвона
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Фокус на заявки, а не на отчеты
                </span>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <div key={metric.value} className="glass-panel interactive-card p-5">
                    <div className="text-2xl font-semibold text-white">{metric.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-panel relative overflow-hidden rounded-[34px] border border-white/12 p-5 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,rgba(8,16,28,0.96),rgba(12,24,42,0.92))] p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-cyan-200/90">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5">
                      Shelpakov Digital
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">SEO</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Заявки</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      Коммерческие факторы
                    </span>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Как строится работа</p>
                      <h3 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                        Сначала ищем слабые места. Потом усиливаем то, что влияет на результат.
                      </h3>
                      <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                        Без сложных слов и лишней суеты. Смотрю, где сайт недорабатывает по поиску, доверию и
                        конверсии, а затем собираю понятный план правок.
                      </p>
                    </div>

                    <div className="rounded-[26px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">На что смотрим в первую очередь</div>
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="text-sm text-slate-400">Что получает бизнес</div>
                          <div className="mt-1 text-2xl font-semibold text-white">Больше заявок с сайта</div>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                          <div className="text-sm text-slate-400">Что усиливаем</div>
                          <div className="mt-1 text-2xl font-semibold text-white">Структуру, оффер и SEO</div>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                          <div className="text-sm text-slate-400">Как идем</div>
                          <div className="mt-1 text-2xl font-semibold text-white">Пошагово и с приоритетами</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {heroPillars.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.title} className="glass-panel interactive-card p-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Почему сайт начинает работать сильнее</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Хороший сайт должен быть полезен и поиску, и человеку
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Поэтому усиливаю не один показатель, а весь сценарий: как сайт ищут, что видит клиент, почему он
            должен доверять и в какой момент оставляет заявку.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {advantageCards.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="glass-panel interactive-card p-7">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-cyan-200" />
                  <Star className="h-5 w-5 text-cyan-100/70" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Тарифы комплексного продвижения</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Понятные пакеты работ без перегруза
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Тариф можно выбрать под текущую задачу: от базового аудита до системной работы над ростом сайта.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {packageCards.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`interactive-card relative overflow-hidden rounded-[30px] border p-7 ${
                  index === 1
                    ? 'border-cyan-300/30 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(9,16,29,0.88))] shadow-[0_0_50px_rgba(34,211,238,0.16)]'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%)]" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-cyan-200">{pkg.name}</div>
                      <h3 className="mt-3 text-3xl font-semibold text-white">{pkg.price}</h3>
                    </div>
                    {index === 1 ? (
                      <Gem className="h-8 w-8 text-cyan-200" />
                    ) : index === 0 ? (
                      <Rocket className="h-8 w-8 text-cyan-200" />
                    ) : (
                      <BarChart3 className="h-8 w-8 text-cyan-200" />
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{pkg.accent}</p>
                  <div className="mt-6 space-y-3">
                    {pkg.items.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                        <span className="text-sm leading-6 text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact-form" className="mt-6">
                    <Button className="w-full rounded-2xl">Выбрать тариф</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Услуги и форматы работы</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Не список ради списка, а понятные варианты для клиента
            </h2>
            <div className="mt-8 space-y-4">
              {cooperationFormats.map((item, index) => (
                <div
                  key={item}
                  className="interactive-card flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300"
                >
                  <span className="text-sm font-semibold text-cyan-200">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="glass-panel interactive-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                  <Briefcase className="mt-1 h-5 w-5 text-cyan-200" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{service.description}</p>
                <div className="mt-6 text-sm uppercase tracking-[0.18em] text-cyan-200">
                  от {service.price.toLocaleString('ru-RU')} {service.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-panel interactive-card p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Кому это особенно полезно</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Если сайт уже есть, но заявок мало, обычно проблема не в чем-то одном
              </h2>
              <div className="mt-8 space-y-4">
                {industryBlocks.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {processBlocks.map((item) => (
                <div key={item.step} className="glass-panel interactive-card flex gap-5 p-6">
                  <div className="text-3xl font-semibold text-cyan-200">{item.step}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
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
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Кейсы и результаты</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Сильный сайт должен подтверждать экспертность на практике
            </h2>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white">
            Открыть кейсы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {cases.length > 0 ? (
            cases.map((item, index) => (
              <div key={item.id} className="glass-panel interactive-card p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.24em] text-cyan-200">Кейс {index + 1}</span>
                  <Building2 className="h-5 w-5 text-cyan-200" />
                </div>
                <h3 className="mt-6 text-3xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {item.description || item.content || 'Кейс показывает, как меняется сайт после грамотной доработки структуры, оффера и SEO-основы.'}
                </p>
              </div>
            ))
          ) : (
            <div className="glass-panel p-8 lg:col-span-2">
              <h3 className="text-2xl font-semibold text-white">Здесь стоит показать реальные результаты</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Лучше всего работают кейсы с цифрами, сроками, задачей клиента и итогом после внедрения правок.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Контент и экспертиза</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Контент должен помогать продажам, а не просто заполнять блог
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white">
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
                  className="glass-panel interactive-card group p-7 transition hover:border-cyan-300/30 hover:bg-white/8"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Материал</div>
                  <h3 className="mt-4 text-2xl font-semibold text-white group-hover:text-cyan-100">
                    {post.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {post.excerpt || 'Материал, который усиливает экспертность бренда и помогает привлекать целевой спрос.'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-white">Блог лучше использовать как усиление доверия</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Хорошо работают статьи с разбором кейсов, типовых ошибок, аналитикой спроса и ответами на частые вопросы клиентов.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Отзывы и доверие</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Чем конкретнее подтверждение, тем выше конверсия
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="glass-panel interactive-card p-7">
                <div className="text-sm uppercase tracking-[0.24em] text-cyan-200">{review.author}</div>
                <p className="mt-5 text-sm leading-7 text-slate-300">{review.text}</p>
                {(review.company || review.position) && (
                  <div className="mt-6 text-sm text-slate-500">
                    {[review.company, review.position].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="glass-panel p-7 md:col-span-3">
              <h3 className="text-2xl font-semibold text-white">Отзывы лучше показывать с деталями</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Имя, компания, задача и результат работают сильнее, чем общий благодарственный текст.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="contact-form" className="scroll-mt-32 border-t border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(7,17,31,0.96),rgba(11,21,38,0.92))] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Следующий шаг</p>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
                Оставьте заявку, и я подготовлю понятный разбор сайта
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
                Покажу, что мешает росту, где сайт недожимает по заявкам и с каких изменений стоит начать.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Clock3 className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Быстрая обратная связь</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Обычно отвечаю в ближайшее время после заявки.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <BadgeCheck className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Без общих фраз</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Вы получите конкретные выводы: что исправить, что усилить и куда не тратить деньги.
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
