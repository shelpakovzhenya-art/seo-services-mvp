import type { LucideIcon } from 'lucide-react'
import { List, Rocket, Target, Wrench } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import CasesBlogSwitcher from '@/components/home/CasesBlogSwitcher'
import ServicesCarousel, { type ServicesCarouselCard } from '@/components/services/ServicesCarousel'
import { buildLocalizedBlogListing } from '@/lib/blog-localization'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { getServicePagesForLocale } from '@/lib/service-page-localization'
import { getMergedServicePages } from '@/lib/service-overrides'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'

const verificationCode = 'yilk8rn94r0d3m5v'

const homeMeta: Record<Locale, { title: string; description: string }> = {
  ru: {
    title: 'Частный SEO-специалист для сайтов услуг и B2B | Shelpakov Digital',
    description:
      'Независимый SEO-специалист для небольших и средних проектов: аудит, структура сайта, ключевые страницы, техническая база и рост обращений из поиска.',
  },
  en: {
    title: 'Independent SEO consultant for service websites and B2B | Shelpakov Digital',
    description:
      'Independent SEO consultant for small and mid-size projects: audits, site structure, key pages, technical foundations, and stronger lead flow from search.',
  },
}

const aboutRows: Array<{ icon: LucideIcon; text: string }> = [
  { icon: Target, text: 'Стратегия и решения в одних руках' },
  { icon: List, text: 'Приоритеты по влиянию на заявки' },
  { icon: Wrench, text: 'Внедрение без хаотичных правок' },
  { icon: Rocket, text: 'Прозрачный фокус: спрос и обращения' },
]

const pricingCards = [
  {
    price: '15 000 ₽',
    title: 'Диагностика и приоритеты',
    description: 'Когда сначала нужно увидеть узкие места сайта и получить план внедрения без лишнего шума.',
    href: '/contacts',
  },
  {
    price: '30 000 ₽',
    title: 'Усиление ключевых страниц',
    description: 'Когда сайт живой, но страницы услуг и сценарии заявки не дотягивают до уровня самой услуги.',
    href: '/contacts',
  },
  {
    price: '50 000 ₽',
    title: 'Системный рост',
    description: 'Когда нужен постоянный цикл: структура, контент, SEO и контроль внедрения по приоритетам.',
    href: '/contacts',
  },
]

const caseCards = [
  {
    tag: 'Кейс 1',
    title: 'Как подологический центр в Казани собрал более сильную структуру под спрос и заявки',
    description: 'Пересборка сайта под локальный медицинский спрос: отдельные услуги, связка со статьями, путь к записи.',
    resultValue: '3 слоя в одной системе',
    resultText: 'спрос, посадочные и техбаза начали усиливать друг друга',
    href: '/cases/podocenter-kzn-seo-growth',
  },
  {
    tag: 'Кейс 2',
    title: 'SEO-аудит сайта Botiq: рабочая карта доработок для партнёрского проекта',
    description: 'Разобрали техническую базу, шаблоны страниц, микроразметку и собрали приоритеты внедрения.',
    resultValue: '52/100 -> план на 60 дней',
    resultText: 'аудит превратили в управляемую очередь задач',
    href: '/cases',
  },
]

const blogFallback = [
  {
    title: 'Как перерабатывать сайт услуг под рост заявок, а не просто под трафик',
    description: 'Разбираю связку структуры, оффера, доверия и технической базы, которая дает стабильные обращения из поиска.',
    href: '/blog',
  },
  {
    title: 'Техническое SEO без лишнего процесса: что чинить первым',
    description: 'Показываю, как выделить критичные ограничения индексации и не тратить время на косметические правки.',
    href: '/blog',
  },
]

const pricingIconDesktop = ['/pencil/2jJr9.webp', '/pencil/E2dWH.webp', '/pencil/1c5bn.webp'] as const
const pricingIconMobile = ['/pencil/ZVCZS.webp', '/pencil/C9R6q.webp', '/pencil/iixua.webp'] as const

function linkWithLocale(path: string, locale: Locale) {
  return prefixPathWithLocale(path, locale)
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/15 bg-[#111327] px-3 py-1 text-[11px] font-bold text-[#d9ddf0] md:px-3 md:py-2 md:text-xs">
      {children}
    </span>
  )
}

export default async function HomePage() {
  const locale = await getRequestLocale()

  let blogCards = [...blogFallback]
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 2,
    })

    const localized = buildLocalizedBlogListing(posts, locale)
      .slice(0, 2)
      .map((post) => ({
        title: post.title,
        description: post.excerpt || 'Практический материал по структуре сайта, SEO и коммерческим страницам.',
        href: `/blog/${post.slug}`,
      }))

    if (localized.length > 0) {
      blogCards = localized
    }
  } catch {
    blogCards = [...blogFallback]
  }

  const services = locale === 'en' ? getServicePagesForLocale(locale) : await getMergedServicePages()
  const servicesCarouselCards: ServicesCarouselCard[] = services.map((service) => ({
    slug: service.slug,
    href: linkWithLocale(`/services/${service.slug}`, locale),
    label: service.label,
    title: service.shortName,
    description: service.cardDescription || service.description,
    signal: null,
    pricing: null,
    cta: locale === 'ru' ? 'Перейти к услуге' : 'Open service',
  }))
  const servicesCountLabel = locale === 'ru' ? 'услуг' : 'services'

  return (
    <div className="relative overflow-hidden bg-[#0a0d1a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="home-glow-drift absolute left-[-12%] top-[6%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(125,60,255,0.30),rgba(10,13,26,0))]" />
        <div className="home-glow-drift-delayed absolute right-[-15%] top-[2%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,77,170,0.2),rgba(10,13,26,0))]" />
        <div className="home-glow-breathe absolute bottom-[-18%] left-[12%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(125,60,255,0.18),rgba(10,13,26,0))]" />
      </div>

      <span className="hidden" aria-hidden="true">
        {verificationCode}
      </span>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-10 pt-5 md:px-[72px] md:pb-[72px] md:pt-10">
        <div className="hidden flex-col gap-16 md:flex">
          <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#090915] px-9 pb-9 pt-7 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[15%] top-[72%] h-[380px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,92,170,0.18),rgba(9,9,21,0))]" />
              <div className="absolute right-[4%] top-[4%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(164,75,255,0.28),rgba(9,9,21,0))]" />
            </div>

            <div className="relative mt-2 grid grid-cols-[760px_minmax(0,1fr)] gap-[22px]">
              <div className="flex flex-col gap-[18px]">
                <p className="text-[13px] font-bold text-[#b184ff]">SEO-продвижение под заявки</p>
                <h1 className="text-[54px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f7f8ff]">Комплексное</h1>
                <h1 className="bg-[linear-gradient(90deg,#7f63ff,#ff4ea9)] bg-clip-text text-[54px] font-extrabold leading-[0.95] tracking-[-0.03em] text-transparent">
                  SEO-продвижение
                </h1>
                <p className="max-w-[710px] text-[18px] font-medium leading-[1.45] text-[#ccd3ea]">
                  Работаю с небольшими и средними проектами: аудит, структура, ключевые страницы, техническая база и сценарий заявки.
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={linkWithLocale('/contacts', locale)}
                    className="button-wave inline-flex rounded-full bg-[linear-gradient(90deg,#6e49ff,#ff4ea2)] px-6 py-4 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(138,80,255,0.45)]"
                  >
                    Получить разбор сайта
                  </Link>
                  <Link
                    href={linkWithLocale('/cases', locale)}
                    className="button-wave inline-flex rounded-full border border-white/30 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-6 py-4 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(139,84,255,0.35)]"
                  >
                    Посмотреть кейсы
                  </Link>
                </div>

                <div className="flex items-center gap-2.5">
                  <Pill>Ответ в течение дня</Pill>
                  <Pill>Понятный первый шаг</Pill>
                  <Pill>Фокус на заявках</Pill>
                </div>
              </div>

              <div className="relative min-h-[510px] overflow-hidden rounded-3xl bg-[#0b0c18]">
                <div className="home-glow-drift absolute left-[6%] top-[4%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(117,75,255,0.30),rgba(11,12,24,0))]" />
                <div className="home-glow-drift-delayed absolute bottom-[8%] right-[6%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,86,170,0.25),rgba(11,12,24,0))]" />
                <div className="absolute left-[4%] top-[8%] h-[84%] w-[92%] overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_65%_28%,rgba(139,87,255,0.36),rgba(11,12,24,0)_60%),radial-gradient(circle_at_24%_74%,rgba(255,97,174,0.20),rgba(11,12,24,0)_66%),linear-gradient(160deg,#151935,#0b0c18)]">
                  <Image
                    src="/pencil/IAIjo.webp"
                    alt="Hero visual"
                    fill
                    className="home-image-float fractal-soft-edge object-cover mix-blend-screen scale-[1.14]"
                    sizes="(min-width: 768px) 36vw, 100vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="relative grid grid-cols-[730px_minmax(0,1fr)] gap-9 overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0b16] p-[34px]">
            <div className="pointer-events-none absolute right-[-8%] top-[-20%] h-[430px] w-[430px] rounded-full bg-[radial-gradient(circle,rgba(139,77,255,0.20),rgba(10,11,22,0))]" />

            <div className="relative flex flex-col gap-6">
              <p className="text-[13px] font-bold text-[#b188ff]">Как веду работу</p>
              <div className="flex items-end gap-4">
                <h2 className="text-[62px] font-extrabold leading-[0.94] tracking-[-0.03em] text-[#f5f7ff]">DIGITAL</h2>
                <h2 className="bg-[linear-gradient(90deg,#7d63ff,#ff4ea9)] bg-clip-text text-[62px] font-extrabold leading-[0.94] tracking-[-0.03em] text-transparent">
                  PRO
                </h2>
              </div>
              <p className="max-w-[660px] text-[17px] font-medium leading-[1.5] text-[#cdd3e8]">
                Работа строится от бизнес-цели: сначала нахожу ключевую точку потери заявок, затем собираю приоритетный план и довожу внедрение до результата.
              </p>
              <div className="flex flex-col gap-3">
                {aboutRows.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0f1122] px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#12152a]"
                  >
                    <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-white/20 bg-[linear-gradient(90deg,#6f56ff,#ff53a8)] text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] font-semibold text-[#e1e5f5]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-[#0b0c18]">
              <Image
                src="/pencil/Xef8P.webp"
                alt="About visual"
                fill
                className="home-image-drift fractal-soft-edge object-cover opacity-90 mix-blend-screen scale-[1.08]"
                sizes="(min-width: 768px) 32vw, 100vw"
              />
              <div className="absolute left-[12%] top-[15%] h-[392px] w-[392px] rounded-full border-2 border-[#9a76ff55] bg-[radial-gradient(circle,rgba(182,108,255,0.28),rgba(25,22,41,0))]" />
              <div className="absolute left-[22%] top-[24%] h-[274px] w-[274px] rounded-full border border-white/15 bg-[radial-gradient(circle,rgba(106,124,255,0.24),rgba(11,12,24,0))]" />
              <div className="absolute left-[33%] top-[33%] h-[160px] w-[160px] rounded-full border border-white/20 bg-[radial-gradient(circle,rgba(255,87,167,0.40),rgba(11,12,24,0))]" />
              <div className="absolute bottom-[5%] left-[5%] h-[162px] w-[162px] rounded-full bg-[radial-gradient(circle,rgba(255,96,178,0.22),rgba(11,12,24,0))]" />
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0b16] px-[30px] pb-[34px] pt-[30px]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-60px] top-[268px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(123,94,255,0.32),rgba(10,11,22,0))]" />
              <div className="absolute right-[-40px] top-[232px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,95,166,0.26),rgba(10,11,22,0))]" />
            </div>

            <div className="relative">
              <span className="absolute right-0 top-0 inline-flex rounded-full border border-white/20 bg-[#111426] px-3 py-2 text-xs font-bold text-[#dbe0f5]">
                {servicesCarouselCards.length} {servicesCountLabel}
              </span>
              <p className="text-[13px] font-bold text-[#b188ff]">Услуги</p>
              <h2 className="mt-2 text-[54px] font-extrabold leading-[0.94] tracking-[-0.03em] text-[#f6f8ff]">Услуги под конкретную задачу сайта</h2>
              <p className="mt-3 text-[17px] font-medium leading-[1.48] text-[#cdd3e8]">
                Здесь проще выбрать первый рабочий шаг: аудит, техработы, переработку страниц или новый сайт.
              </p>

              <div className="mt-6">
                <ServicesCarousel cards={servicesCarouselCards} countLabel={servicesCountLabel} />
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0b16] px-[30px] pb-[34px] pt-[30px]">
            <p className="text-[13px] font-bold text-[#b188ff]">Тарифы</p>
            <h2 className="mt-2 text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f6f8ff]">Форматы работ под разную ситуацию</h2>
            <p className="mt-3 text-[17px] font-medium leading-[1.48] text-[#cdd3e8]">
              Можно начать с диагностики, точечной переработки страниц или полноценной системной работы.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-[18px]">
              {pricingCards.map((card, index) => (
                <div
                  key={card.title}
                  className="relative flex h-[360px] flex-col gap-3 overflow-hidden rounded-[20px] border border-white/15 bg-[#111326] pb-5 pl-[18px] pr-[118px] pt-5 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_24px_50px_rgba(2,6,24,0.35)]"
                  style={{
                    background:
                      index === 0
                        ? 'radial-gradient(circle at 86% 10%, rgba(127,88,255,0.28), rgba(17,19,38,0) 62%), #111326'
                        : index === 1
                          ? 'radial-gradient(circle at 86% 10%, rgba(138,94,255,0.26), rgba(17,19,38,0) 62%), #111326'
                          : 'radial-gradient(circle at 86% 10%, rgba(255,97,173,0.24), rgba(17,19,38,0) 62%), #111326',
                  }}
                >
                  <div className="pointer-events-none absolute right-5 top-6 h-[72px] w-[72px] overflow-hidden rounded-full opacity-95 mix-blend-screen">
                    <Image src={pricingIconDesktop[index]} alt="Pricing icon" fill className="home-image-breathe object-cover" sizes="72px" />
                  </div>
                  <p className="text-[42px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f3f6ff]">{card.price}</p>
                  <h3 className="text-[28px] font-bold leading-[1.02] tracking-[-0.02em] text-[#f2f4ff]">{card.title}</h3>
                  <p className="flex-1 max-w-[230px] text-[15px] font-medium leading-[1.45] text-[#d2d8ec]">{card.description}</p>
                  <Link
                    href={linkWithLocale(card.href, locale)}
                    className="inline-flex w-fit rounded-full border border-white/25 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-4 py-2.5 text-[13px] font-bold text-white"
                  >
                    Выбрать тариф
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0b16] px-[30px] pb-8 pt-[30px]">
            <CasesBlogSwitcher locale={locale} cases={caseCards} posts={blogCards} />
          </section>

          <section className="relative grid grid-cols-[790px_minmax(0,1fr)] items-center gap-[30px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0b16] p-10">
            <div className="home-glow-drift absolute left-[30%] top-[5%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(123,87,255,0.24),rgba(10,11,22,0))]" />
            <div className="home-glow-drift-delayed absolute left-[42%] top-[56%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,98,176,0.18),rgba(10,11,22,0))]" />

            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-[13px] font-bold text-[#b188ff]">Следующий шаг</p>
              <h2 className="text-[72px] font-extrabold leading-[0.9] tracking-[-0.035em] text-[#f7f8ff]">Можно начать</h2>
              <h2 className="bg-[linear-gradient(90deg,#7d63ff,#ff4ea9)] bg-clip-text text-[72px] font-extrabold leading-[0.9] tracking-[-0.035em] text-transparent">
                с короткого разбора сайта
              </h2>
              <p className="max-w-[720px] text-[17px] font-medium text-[#cdd3e8]">От вас нужен домен и короткое описание задачи.</p>
              <div className="pt-1">
                <Link
                  href={linkWithLocale('/contacts', locale)}
                  className="button-wave inline-flex rounded-full border border-white/25 bg-[linear-gradient(90deg,#6f4bff,#ff4da8)] px-8 py-4 text-base font-extrabold text-white shadow-[0_10px_30px_rgba(147,79,255,0.45)] transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  Получить разбор сайта
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Pill>Отвечаю сам</Pill>
                <Pill>Без лишнего процесса</Pill>
              </div>
            </div>

            <div className="relative h-[350px] w-[350px] justify-self-end">
              <div className="home-glow-breathe absolute left-[16%] top-[16%] h-[234px] w-[234px] rounded-full bg-[radial-gradient(circle,rgba(162,94,255,0.28),rgba(15,18,34,0))]" />
              <div className="home-glow-drift-delayed absolute left-[10%] top-[8%] h-[290px] w-[290px] rounded-full bg-[radial-gradient(circle,rgba(123,87,255,0.34),rgba(15,18,34,0))]" />
              <Image src="/pencil/bDogD.webp" alt="CTA visual" fill className="home-image-breathe fractal-soft-edge object-contain p-1 mix-blend-screen" sizes="350px" />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-10 md:hidden">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090915] px-4 pb-5 pt-5">
            <p className="text-xs font-bold text-[#b188ff]">SEO-продвижение под заявки</p>
            <h1 className="mt-1 text-[34px] font-extrabold leading-[0.92] tracking-[-0.03em] text-[#f6f8ff]">Комплексное</h1>
            <h1 className="bg-[linear-gradient(90deg,#7e63ff,#ff4ea8)] bg-clip-text text-[34px] font-extrabold leading-[0.92] tracking-[-0.03em] text-transparent">
              SEO-продвижение
            </h1>
            <p className="mt-3 text-[15px] font-medium leading-[1.45] text-[#cdd3e8]">
              Аудит, структура, ключевые страницы, техническая база и сценарий заявки.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href={linkWithLocale('/contacts', locale)}
                className="button-wave inline-flex justify-center rounded-full bg-[linear-gradient(90deg,#6e49ff,#ff4ea2)] px-4 py-3 text-sm font-extrabold text-white"
              >
                Получить разбор сайта
              </Link>
              <Link
                href={linkWithLocale('/cases', locale)}
                className="button-wave inline-flex justify-center rounded-full border border-white/30 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-4 py-3 text-sm font-extrabold text-white"
              >
                Посмотреть кейсы
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Pill>Ответ в течение дня</Pill>
              <Pill>Понятный первый шаг</Pill>
              <Pill>Фокус на заявках</Pill>
            </div>
            <div className="relative mt-4 h-32 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_66%_38%,rgba(122,84,255,0.30),rgba(11,14,27,0)_60%),linear-gradient(160deg,#151935,#0b0e1b)]">
              <Image src="/pencil/xZcUe.webp" alt="Hero mobile visual" fill className="home-image-float fractal-soft-edge object-cover mix-blend-screen scale-[1.12]" sizes="100vw" />
            </div>
          </section>

          <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0b16] px-4 pb-[18px] pt-[18px]">
            <p className="text-xs font-bold text-[#b188ff]">Как веду работу</p>
            <h2 className="mt-1 text-[52px] font-extrabold leading-[0.9] tracking-[-0.03em] text-[#f5f7ff]">DIGITAL</h2>
            <h2 className="bg-[linear-gradient(90deg,#7d63ff,#ff4ea9)] bg-clip-text text-[52px] font-extrabold leading-[0.9] tracking-[-0.03em] text-transparent">
              PRO
            </h2>
            <p className="mt-2 text-[15px] font-medium leading-[1.46] text-[#cdd3e8]">
              Сначала нахожу главный узел, который мешает заявкам, затем собираю понятный план действий без лишнего процесса.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {aboutRows.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 rounded-[14px] border border-white/10 bg-[#101325] px-3 py-2.5">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-[linear-gradient(90deg,#6f56ff,#ff53a8)] text-white">
                    <Icon className="h-[13px] w-[13px]" />
                  </span>
                  <span className="text-[13px] font-bold text-[#e1e5f5]">{text}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-3 h-[126px] overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_58%_24%,rgba(138,87,255,0.30),rgba(13,15,29,0)_60%),linear-gradient(160deg,#161a32,#0d0f1d)]">
              <Image src="/pencil/Xef8P.webp" alt="About mobile visual" fill className="home-image-drift fractal-soft-edge object-cover opacity-80 mix-blend-screen scale-[1.08]" sizes="100vw" />
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0b16] px-4 pb-[18px] pt-[18px]">
            <span className="inline-flex rounded-full border border-white/15 bg-[#101326] px-3 py-1 text-[11px] font-bold text-[#d9ddf0]">
              {servicesCarouselCards.length} {servicesCountLabel}
            </span>
            <p className="mt-2 text-xs font-bold text-[#b188ff]">Услуги</p>
            <h2 className="mt-1 text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f6f8ff]">Услуги под конкретную задачу сайта</h2>
            <p className="mt-2 text-sm font-medium leading-[1.45] text-[#cdd3e8]">
              Первый рабочий шаг: аудит, техработы, переработка страниц или новый сайт.
            </p>

            <div className="mt-4">
              <ServicesCarousel cards={servicesCarouselCards} countLabel={servicesCountLabel} />
            </div>
          </section>

          <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0b16] px-4 pb-[18px] pt-[18px]">
            <p className="text-xs font-bold text-[#b188ff]">Тарифы</p>
            <h2 className="mt-1 text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f6f8ff]">Форматы работ под разную ситуацию</h2>
            <p className="mt-2 text-sm font-medium leading-[1.45] text-[#cdd3e8]">Старт: диагностика, переработка страниц или системная работа.</p>

            <div className="mt-4 flex flex-col gap-3">
              {pricingCards.map((card, index) => (
                <div
                  key={card.title}
                  className="relative flex h-[250px] flex-col gap-2 overflow-hidden rounded-2xl border border-white/10 bg-[#111326] pb-3.5 pl-3 pr-24 pt-3.5 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_16px_36px_rgba(2,6,24,0.34)]"
                  style={{
                    background:
                      index === 0
                        ? 'radial-gradient(circle at 86% 10%, rgba(127,88,255,0.28), rgba(17,19,38,0) 62%), #111326'
                        : index === 1
                          ? 'radial-gradient(circle at 86% 10%, rgba(138,94,255,0.26), rgba(17,19,38,0) 62%), #111326'
                          : 'radial-gradient(circle at 86% 10%, rgba(255,97,173,0.24), rgba(17,19,38,0) 62%), #111326',
                  }}
                >
                  <div className="pointer-events-none absolute right-3 top-3 h-[64px] w-[64px] overflow-hidden rounded-full opacity-95 mix-blend-screen">
                    <Image src={pricingIconMobile[index]} alt="Pricing mobile icon" fill className="home-image-breathe object-cover" sizes="64px" />
                  </div>
                  <p className="text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#f3f6ff]">{card.price}</p>
                  <h3 className="text-[22px] font-bold leading-[1.05] tracking-[-0.02em] text-[#f2f4ff]">{card.title}</h3>
                  <p className="flex-1 text-[13px] font-medium leading-[1.4] text-[#d2d8ec]">{card.description}</p>
                  <Link
                    href={linkWithLocale(card.href, locale)}
                    className="inline-flex w-fit rounded-full border border-white/20 bg-[linear-gradient(90deg,#6f4bff,#ff4ea8)] px-3 py-1.5 text-xs font-extrabold text-white"
                  >
                    Выбрать тариф
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0b16] px-4 pb-[18px] pt-[18px]">
            <CasesBlogSwitcher locale={locale} cases={caseCards} posts={blogCards} compact />
          </section>

          <section className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0b16] px-4 py-[22px] text-center">
            <p className="text-xs font-bold text-[#b188ff]">Следующий шаг</p>
            <h2 className="mt-1 text-[42px] font-extrabold leading-[0.9] tracking-[-0.03em] text-[#f7f8ff]">Можно начать</h2>
            <h2 className="bg-[linear-gradient(90deg,#7d63ff,#ff4ea9)] bg-clip-text text-[42px] font-extrabold leading-[0.9] tracking-[-0.03em] text-transparent">
              с разбора сайта
            </h2>
            <p className="mt-2 text-[15px] font-medium text-[#cdd3e8]">Нужен домен и короткая задача.</p>
            <div className="mt-4">
              <Link
                href={linkWithLocale('/contacts', locale)}
                className="inline-flex rounded-full border border-white/25 bg-[linear-gradient(90deg,#6f4bff,#ff4da8)] px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Получить разбор
              </Link>
            </div>
            <div className="relative mx-auto mt-4 h-24 w-24 overflow-hidden rounded-full bg-[#0f1222]">
              <Image src="/pencil/bDogD.webp" alt="CTA symbol" fill className="home-image-breathe fractal-soft-edge object-cover" sizes="96px" />
            </div>
            <div className="mt-3 flex flex-col items-center gap-2">
              <Pill>Отвечаю сам</Pill>
              <Pill>Без лишнего процесса</Pill>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = homeMeta[locale]

  let page: Awaited<ReturnType<typeof prisma.page.findUnique>> = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
  } catch {
    page = null
  }

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/')
  const title = normalizeMetaTitle(localizedPage?.title, copy.title)
  const description = normalizeMetaDescription(localizedPage?.description, copy.description)

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website' as const,
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    },
  }
}
