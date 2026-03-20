import Image from 'next/image'
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
  MessageSquareText,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'

const defaultHomeMetadata = {
  title: 'Shelpakov Digital',
  description:
    'SEO-продвижение сайтов, SEO-аудит, коммерческие факторы и упаковка сайта под рост заявок.',
  keywords:
    'seo-продвижение сайтов, поисковое продвижение, seo-аудит, коммерческие факторы, рост заявок',
}

const trustMetrics = [
  {
    value: 'SEO + конверсия',
    label: 'Продвигаю сайт не только под позиции, но и под реальные заявки.',
  },
  {
    value: 'B2B и услуги',
    label: 'Сильнее всего работаю там, где важны доверие, смысл и экспертность.',
  },
  {
    value: 'План на 90 дней',
    label: 'После старта проект получает понятную карту действий и приоритетов.',
  },
]

const founderHighlights = [
  {
    icon: Search,
    title: 'Глубокий анализ спроса',
    text: 'Разбираю поисковый спрос, поведение конкурентов и точки роста по структуре сайта.',
  },
  {
    icon: Sparkles,
    title: 'Упаковка под дорогой чек',
    text: 'Сайт должен выглядеть убедительно, современно и дороже в восприятии, чем у конкурентов.',
  },
  {
    icon: MessageSquareText,
    title: 'Фокус на заявку',
    text: 'Каждый блок должен помогать посетителю быстрее понять ценность и оставить обращение.',
  },
]

const advantageCards = [
  {
    icon: ShieldCheck,
    title: 'Прозрачная работа',
    text: 'Фиксируем задачи, показываем прогресс и держим понятный темп по проекту.',
  },
  {
    icon: FileText,
    title: 'Сильная коммерческая подача',
    text: 'Усиливаю оффер, доверительные блоки, структуру страниц и понятность предложения.',
  },
  {
    icon: LineChart,
    title: 'Рост в поиске и продажах',
    text: 'Сайт получает не только SEO-основу, но и более сильную конверсионную архитектуру.',
  },
]

const packageCards = [
  {
    name: 'Старт',
    price: 'от 60 000 ₽/мес',
    accent: 'Для бизнеса, которому нужен крепкий фундамент',
    items: [
      'Технический SEO-аудит и исправление критичных ошибок',
      'Сбор и кластеризация семантики',
      'Оптимизация title, description, h1',
      'План работ и отчётность каждый месяц',
    ],
  },
  {
    name: 'Оптимальный',
    price: 'от 110 000 ₽/мес',
    accent: 'Для системного роста заявок и видимости',
    items: [
      'Всё из тарифа «Старт»',
      'Пересборка ключевых посадочных страниц',
      'Усиление коммерческих факторов и CTA',
      'Контент-план и написание SEO-материалов',
      'Регулярный анализ конкурентов и корректировка стратегии',
    ],
  },
  {
    name: 'Про',
    price: 'от 180 000 ₽/мес',
    accent: 'Для агрессивного роста и сильного позиционирования',
    items: [
      'Всё из тарифа «Оптимальный»',
      'Полная архитектура разделов и кластеров',
      'Глубокая работа с доверием, кейсами и упаковкой бренда',
      'Продвинутая аналитика по конверсии и гипотезам',
      'Приоритетное сопровождение и быстрый запуск новых страниц',
    ],
  },
]

const industryBlocks = [
  'B2B-компании и экспертные услуги',
  'Локальный бизнес с конкуренцией в поиске',
  'Сайты услуг, которым нужен сильный коммерческий каркас',
  'Проекты, где важны доверие, кейсы и экспертный контент',
]

const processBlocks = [
  {
    step: '01',
    title: 'Аудит и карта роста',
    text: 'Находим слабые места по структуре, SEO, коммерческим факторам и сценарию заявки.',
  },
  {
    step: '02',
    title: 'Пересборка сильных страниц',
    text: 'Усиливаем оффер, проектируем более понятные страницы услуг и формируем доверие.',
  },
  {
    step: '03',
    title: 'Системное продвижение',
    text: 'Соединяем SEO, контент, аналитику и работу с конверсией в единый механизм роста.',
  },
]

const cooperationFormats = [
  'Разовый аудит и стратегия роста',
  'Пересборка сайта под заявки и коммерческие факторы',
  'Комплексное SEO-сопровождение проекта',
  'Точечные задачи: структура, тексты, контент, посадочные страницы',
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
                SEO-продвижение сайтов, которое делает проект заметнее, убедительнее и прибыльнее.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Я соединяю поисковое продвижение, коммерческие факторы, упаковку оффера и
                структуру сайта в единую систему роста. В результате сайт должен не просто
                собирать трафик, а вызывать доверие и приводить больше обращений.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7 shadow-[0_0_40px_rgba(34,211,238,0.28)]">
                    Получить аудит сайта
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
                  План работ после первого созвона
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Фокус на заявки и рост доверия
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
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_28%)]" />
              <div className="relative grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#08101c]">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,245,255,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(77,124,255,0.18),transparent_36%)]" />
                  <Image
                    src="/founder-hero.svg"
                    alt="Евгений Шелпаков работает за ноутбуком"
                    width={700}
                    height={900}
                    className="h-full min-h-[520px] w-full object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/90 to-transparent p-6">
                    <div className="text-3xl font-semibold text-white">Евгений Шелпаков</div>
                    <div className="mt-2 text-sm uppercase tracking-[0.22em] text-cyan-200">
                      Shelpakov Digital
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                        SEO
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                        Упаковка сайта
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                        Конверсия
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="glass-panel interactive-card p-6">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Персональный подход
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-white">Стратегия, смыслы и рост заявок</div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Работаю как стратег и исполнитель: смотрю на сайт глазами SEO-специалиста,
                      маркетолога и владельца бизнеса, которому нужен ощутимый результат, а не
                      просто красивые отчёты.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {founderHighlights.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.title} className="glass-panel interactive-card p-5">
                          <div className="flex items-start gap-4">
                            <div className="mt-1 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                              <p className="mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Фокус</div>
                      <div className="mt-2 text-xl font-semibold text-white">SEO</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Сильная сторона</div>
                      <div className="mt-2 text-xl font-semibold text-white">Оффер</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Результат</div>
                      <div className="mt-2 text-xl font-semibold text-white">Заявки</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Почему сайт работает сильнее</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Сайт должен одновременно привлекать трафик, вызывать доверие и вести к обращению
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Поэтому я усиливаю не один отдельный фактор, а всю систему целиком: позиционирование,
            SEO-структуру, ключевые посадочные страницы, контент и коммерческую подачу.
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
                Понятные пакеты работ для разного темпа роста
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Можно стартовать с базового уровня, а можно сразу брать системное продвижение с
              усилением оффера, структуры и контента.
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
                <div className="relative">
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
              Не хаотичный список, а понятные точки входа для клиента
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
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Для кого это</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Особенно полезно тем, кому важно не просто быть в интернете, а выглядеть сильнее конкурентов
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
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Кейсы и доказательства</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Сильный сайт должен подтверждать результат, а не только обещать его
            </h2>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-2 text-cyan-200 transition hover:text-white">
            Открыть все кейсы
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
                  {item.description || item.content || 'Показываю, как меняется структура сайта, доверие и конверсия после правильной упаковки проекта.'}
                </p>
              </div>
            ))
          ) : (
            <div className="glass-panel p-8 lg:col-span-2">
              <h3 className="text-2xl font-semibold text-white">Блок кейсов готов к наполнению</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Следующий шаг для усиления продаж и SEO-доверия — добавить цифры, задачи клиента,
                сделанные шаги и итоговый эффект от работы.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Экспертный контент</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Контент должен усиливать продажи, а не просто заполнять блог
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
                    {post.excerpt || 'Контент, который усиливает экспертность, доверие и видимость сайта в поиске.'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-white">Контентный блок уже встроен в структуру</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Его можно усиливать статьями по SEO, кейсам, аналитике рынка и ответами на частые вопросы клиентов.
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
              Чем подробнее подтверждение, тем выше вероятность заявки
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="glass-panel interactive-card p-7">
                <div className="flex gap-1 text-cyan-200">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">{review.text}</p>
                <p className="mt-6 text-sm text-slate-500">— {review.author}</p>
              </div>
            ))
          ) : (
            <div className="glass-panel p-7 md:col-span-3">
              <p className="text-sm leading-7 text-slate-400">
                Сюда стоит добавлять отзывы с именем, нишей клиента и кратким описанием результата,
                чтобы усиливать доверие и конверсию.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="contact-form" className="container mx-auto px-4 py-20">
        <div className="glass-panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Следующий шаг</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">
                Оставьте заявку и получите разбор сайта с приоритетами на рост
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
                Если хотите усилить SEO-продвижение сайта, коммерческие факторы и итоговую
                конверсию, начнём с аудита. После первой связи я покажу, какие страницы, запросы и
                блоки доверия нужно усиливать в первую очередь.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Clock3 className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Быстрый ответ</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Обычно отвечаю в ближайшее время после заявки.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <BadgeCheck className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Понятный план</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Покажу, что мешает конверсии и что можно улучшить в первую очередь.
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
    keywords: keywords.split(',').map((item) => item.trim()).filter(Boolean),
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
