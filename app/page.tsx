import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Binary,
  Bot,
  Briefcase,
  Building2,
  Clock3,
  FileCheck2,
  LineChart,
  MessageSquareText,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
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
  { value: 'SEO + GEO', label: 'Продвижение под классический поиск и новую AI-выдачу' },
  { value: 'B2B / Экспертность', label: 'Упор на сложные ниши, дорогие услуги и сильное позиционирование' },
  { value: 'План на 90 дней', label: 'Клиент получает понятную дорожную карту, а не абстрактные обещания' },
]

const capabilityBlocks = [
  {
    title: 'SEO-система роста',
    text: 'Техническое SEO, семантическая архитектура, коммерческие посадочные страницы и контент-кластеры.',
    icon: Radar,
  },
  {
    title: 'Конверсионная упаковка',
    text: 'Усиление оффера, структуры сайта, доверительных блоков и CTA-сценариев, чтобы заявок было больше.',
    icon: LineChart,
  },
  {
    title: 'Контент под новую выдачу',
    text: 'Экспертный контент, который работает и для людей, и для поиска, и для AI-ответов.',
    icon: Bot,
  },
]

const commercialFactors = [
  {
    title: 'Работа по договору',
    text: 'Фиксируем объём работ, этапы и формат взаимодействия заранее.',
    icon: FileCheck2,
  },
  {
    title: 'Понятная отчётность',
    text: 'Регулярно показываю, что сделано, что изменилось и куда движется проект.',
    icon: ShieldCheck,
  },
  {
    title: 'Быстрый старт',
    text: 'После первой встречи вы получаете план работ, гипотезы и приоритеты.',
    icon: Clock3,
  },
  {
    title: 'Прямой контакт',
    text: 'Без менеджерской прослойки: можно быстро обсудить задачу и получить решение.',
    icon: MessageSquareText,
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
    text: 'Определяю слабые места в структуре, поисковом спросе, оффере и коммерческих факторах.',
  },
  {
    step: '02',
    title: 'Пересборка сайта и контента',
    text: 'Улучшаю страницы услуг, кейсы, блоки доверия, навигацию и сценарии заявки.',
  },
  {
    step: '03',
    title: 'Запуск системы продвижения',
    text: 'SEO, контент, конверсия и доверие начинают работать как единый механизм роста.',
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_80%_18%,rgba(96,165,250,0.2),transparent_24%)]" />
        <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                Shelpakov Digital
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
                SEO-продвижение сайтов и упаковка, которые приводят не просто трафик, а заявки.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Я соединяю поисковое продвижение сайтов, SEO-аудит, коммерческие факторы, экспертный контент и структуру сайта в единую систему роста. Сайт должен лучше ранжироваться, вызывать доверие и приводить больше обращений.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-7">
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
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Быстрый ответ по заявке</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">План работ после первого созвона</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Фокус на заявки и доверие</span>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <div key={metric.value} className="glass-panel p-5">
                    <div className="text-2xl font-semibold text-white">{metric.value}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel relative overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_35%)]" />
              <div className="relative space-y-6">
                <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
                    <Image
                      src="/founder-hero.svg"
                      alt="Евгений Шелпаков работает за ноутбуком"
                      width={700}
                      height={900}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Персональный подход</div>
                      <div className="mt-2 text-2xl font-semibold text-white">Евгений Шелпаков</div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Работаю как стратег и исполнитель: смотрю на сайт глазами SEO-специалиста, маркетолога и человека, который должен привести клиента к заявке.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-cyan-200" />
                        <span className="font-medium text-white">Анализ конкурентов и спроса</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Снимаю сильные паттерны рынка и адаптирую их под ваш бренд, а не копирую чужой сайт.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-cyan-200" />
                        <span className="font-medium text-white">Футуристичный визуал + смысл</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Не просто красивый интерфейс, а дизайн, который делает проект заметнее и дороже в восприятии.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Карта роста</div>
                    <div className="mt-2 text-2xl font-semibold text-white">Структура + доверие + конверсия</div>
                  </div>
                  <Binary className="h-10 w-10 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Анализ конверсии</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Что сейчас мешает сайту сильнее конвертировать трафик в обращения
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Основная проблема была в том, что сайт выглядел как шаблонный MVP: слабое первое впечатление, мало доверительных блоков, недостаточно прямых коммерческих сигналов и нет ясного сценария для клиента. Для SEO и конверсии это означает слабую релевантность, низкое доверие и потерю части заявок.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {capabilityBlocks.map((block) => {
            const Icon = block.icon
            return (
              <div key={block.title} className="glass-panel p-7">
                <Icon className="h-8 w-8 text-cyan-200" />
                <h3 className="mt-5 text-2xl font-semibold text-white">{block.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{block.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Коммерческие факторы</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Что я добавил, чтобы сайт выглядел убедительнее и продавал лучше
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {commercialFactors.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="glass-panel p-6">
                  <Icon className="h-7 w-7 text-cyan-200" />
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Услуги и форматы работы</p>
              <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
                Не просто список услуг, а понятные точки входа для клиента
              </h2>
            <div className="mt-8 space-y-4">
              {cooperationFormats.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="glass-panel p-6">
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
            <div className="glass-panel p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Для кого это</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Сайт особенно подходит тем, кому важно не просто «быть в интернете», а выглядеть сильнее конкурентов.
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
                <div key={item.step} className="glass-panel flex gap-5 p-6">
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
                Сильный сайт должен показывать результат, а не только обещать его
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
              <div key={item.id} className="glass-panel p-8">
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
              <h3 className="text-2xl font-semibold text-white">Блок кейсов готов к усилению</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Следующий шаг для роста конверсии — добавить в кейсы цифры, задачи клиента, сделанные шаги и итоговый эффект.
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
                Блог должен усиливать продажи, а не просто существовать
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
                <Link key={post.id} href={`/blog/${post.slug}`} className="glass-panel group p-7 transition hover:border-cyan-300/30 hover:bg-white/8">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Материал</div>
                  <h3 className="mt-4 text-2xl font-semibold text-white group-hover:text-cyan-100">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {post.excerpt || 'Контент, который усиливает экспертность, доверие и видимость сайта в поиске.'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-white">Контентный блок уже встроен в структуру</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Его можно усилить статьями по SEO, кейсам, аналитике рынка и ответам на частые вопросы клиентов.
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
              <div key={review.id} className="glass-panel p-7">
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
                Для роста конверсии сюда стоит добавлять отзывы с именем, нишей клиента и кратким описанием результата.
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
                Если хотите усилить SEO-продвижение сайта, коммерческие факторы и итоговую конверсию, начнём с аудита. После первой связи я покажу, какие страницы, запросы и блоки доверия нужно усиливать в первую очередь.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Clock3 className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Быстрый ответ</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Обычно отвечаю в ближайшее время после заявки.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <BadgeCheck className="h-5 w-5 text-cyan-200" />
                    <span className="font-medium">Понятный план</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Покажу, что мешает конверсии и что можно улучшить в первую очередь.</p>
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
    /* description:
      'SEO-продвижение сайтов, SEO-аудит, коммерческие факторы и упаковка сайта под рост заявок.',
    */ description,
    keywords: keywords.split(',').map((item) => item.trim()).filter(Boolean),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      /* title: 'Shelpakov Digital',
      description:
        'Продвижение, коммерческие факторы, экспертный контент и упаковка сайта под рост заявок.',
      */ title,
      description,
      url: siteUrl,
      type: 'website',
    },
  }
}
