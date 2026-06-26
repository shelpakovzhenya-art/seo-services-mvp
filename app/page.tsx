import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Briefcase,
  CircleDollarSign,
  ClipboardCheck,
  FileSearch,
  Link2,
  Mail,
  MapPin,
  Megaphone,
  PenTool,
  Phone,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'

const verificationCode = 'yilk8rn94r0d3m5v'

type Card = {
  icon: LucideIcon
  title: string
  text: string
}

type LinkCard = Card & {
  href: string
}

const navItems = [
  { label: 'Услуги', href: '/services' },
  { label: 'Кейсы', href: '/cases' },
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about' },
  { label: 'Процесс', href: '#process' },
  { label: 'Контакты', href: '/contacts' },
]

const partners = [
  { name: 'SIGNAL', url: 'signalmsk.com' },
  { name: 'MY PODOLOG SHOP', url: 'mypodolog.shop' },
  { name: 'MY PODOLOG', url: 'mypodolog.ru' },
  { name: 'PODOCENTER', url: 'podocenter-kzn.ru' },
]

const telegramUrl = 'https://t.me/whoamikon'
const maxUrl = 'https://max.ru/whoamikon'
const contactPhone = '+7 901 682-33-71'
const contactPhoneHref = 'tel:+79016823371'
const contactEmail = 'shelpakovzhenya@gmail.com'

const resultCards: Card[] = [
  { icon: Sparkles, title: 'от 3 месяцев', text: 'Первые результаты уже через 90 дней' },
  { icon: BarChart3, title: 'по срезам', text: 'Сравниваем старт и текущую динамику' },
  { icon: ShieldCheck, title: 'с источником', text: 'Данные показываем только с подтверждением' },
  { icon: Briefcase, title: 'план работ', text: 'Фиксируем действия по приоритетам' },
]

const processCards: Card[] = [
  { icon: FileSearch, title: 'Технический аудит', text: 'Проверяем сайт на ошибки и технические проблемы' },
  { icon: Target, title: 'Сбор семантики', text: 'Собираем коммерческие запросы и кластеры' },
  { icon: Wrench, title: 'Оптимизация сайта', text: 'Делаем страницы понятными для людей и поиска' },
  { icon: Rocket, title: 'Продвижение', text: 'Выводим сайт в топ и увеличиваем трафик' },
  { icon: ClipboardCheck, title: 'Аналитика и отчёты', text: 'Показываем динамику и понятные результаты' },
]

const heroBenefits = [
  { icon: ShieldCheck, label: 'Прозрачная отчётность' },
  { icon: Link2, label: 'Без долгосрочных контрактов' },
  { icon: Sparkles, label: 'Гарантия результата' },
]

const serviceCards: LinkCard[] = [
  { icon: Search, title: 'SEO-продвижение', text: 'Выводим сайт в топ и усиливаем целевой трафик', href: '/services/seo' },
  { icon: Megaphone, title: 'Контекстная реклама', text: 'Настраиваем заявки из Яндекса и Google', href: '/services/performance-ads' },
  { icon: Settings2, title: 'Техническая поддержка', text: 'Убираем ошибки и ускоряем сайт', href: '/services/technical-seo' },
  { icon: FileSearch, title: 'Аудит сайта', text: 'Находим точки роста и критичные проблемы', href: '/services/seo-audit' },
  { icon: PenTool, title: 'Контент-маркетинг', text: 'Создаём материалы под спрос и доверие', href: '/services/seo-content' },
  { icon: CircleDollarSign, title: 'Коммерческие страницы', text: 'Усиливаем посадочные под заявки и продажи', href: '/services/ecommerce-seo' },
]

const caseCards = [
  { title: 'SIGNAL', subtitle: 'Рост трафика', result: '+1919%', image: '/reference/cases-desk-1.webp' },
  { title: 'MY PODOLOG', subtitle: 'Рост трафика', result: '+220%', image: '/reference/cases-desk-2.webp' },
  { title: 'PODOCENTER', subtitle: 'Рост трафика', result: '+252%', image: '/reference/cases-desk-3.webp' },
]

const blogCards = [
  {
    title: 'Каким должен быть современный сайт для SEO и заявок',
    date: 'Блог',
    image: '/reference/blog-desk-1.webp',
    href: '/blog/trebovaniya-k-sovremennomu-saitu-dlya-seo-i-konversii',
  },
  {
    title: 'Подготовка сайта к GEO и AI-выдаче',
    date: 'Блог',
    image: '/reference/blog-desk-2.webp',
    href: '/blog/kak-podgotovit-sait-k-geo-i-ii-vydache',
  },
  {
    title: 'Контент-план для SEO: как не делать статьи в пустоту',
    date: 'Блог',
    image: '/reference/blog-desk-3.webp',
    href: '/blog/content-plan-dlya-seo-na-90-dney-dlya-komandy-bez-khaosa',
  },
]

function pathFor(path: string, locale: Locale) {
  return path.startsWith('#') ? path : prefixPathWithLocale(path, locale)
}

function Logo() {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md border border-[#2b75ff]/40 bg-white shadow-[0_0_22px_rgba(31,100,255,0.72)]">
        <Image src="/favicon-48.png" alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
      </span>
      <span className="truncate text-[13px] font-extrabold text-white sm:text-sm">Shelpakov Digital</span>
    </span>
  )
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-md border border-[#226dff]/35 bg-[#0b2b6f]/55 text-[#3f86ff] shadow-[0_0_24px_rgba(35,111,255,0.35)]">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  )
}

function Header({ locale }: { locale: Locale }) {
  return (
    <header className="flex min-h-[54px] items-center justify-between gap-3 px-5 sm:px-7">
      <Link href={pathFor('/', locale)} aria-label="Shelpakov Digital">
        <Logo />
      </Link>
      <nav className="hidden min-w-0 items-center gap-3 text-[10px] font-semibold text-slate-300 lg:flex xl:gap-5 xl:text-[11px]">
        {navItems.map((item) => (
          <Link key={item.label} href={pathFor(item.href, locale)} className="whitespace-nowrap transition hover:text-[#3f86ff]">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <a href={contactPhoneHref} className="hidden whitespace-nowrap text-[10px] font-extrabold text-white sm:inline xl:text-[11px]">
          {contactPhone}
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          className="hidden h-8 w-8 place-items-center rounded-md border border-[#2369ff]/30 bg-[#0a1c42] text-[#63c7ff] md:grid"
        >
          <Image src="/telegram-logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
        </a>
        <a
          href={maxUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Max"
          className="hidden h-8 w-8 place-items-center rounded-md border border-[#2369ff]/30 bg-[#0a1c42] text-[#8db5ff] transition hover:border-[#5a96ff]/70 hover:bg-[#0c285d] md:grid"
        >
          <Image src="/max-logo.png" alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-[4px]" />
        </a>
        <Link
          href={pathFor('/contacts', locale)}
          className="hidden whitespace-nowrap rounded-md bg-[#2368ff] px-3 py-2 text-[10px] font-extrabold text-white shadow-[0_10px_28px_rgba(35,104,255,0.38)] transition hover:bg-[#2f77ff] sm:inline-flex xl:px-4 xl:text-[11px]"
        >
          Получить аудит
        </Link>
      </div>
    </header>
  )
}

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/reference/hero-laptop-hq.webp"
        alt=""
        fill
        priority
        sizes="1320px"
        className="object-cover object-center opacity-100 brightness-110 contrast-115 saturate-[1.06]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#020713_0%,rgba(2,7,19,0.98)_38%,rgba(2,7,19,0.40)_62%,rgba(2,7,19,0.06)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#020713_0%,rgba(2,7,19,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#020713_0%,rgba(2,7,19,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(25,86,255,0.14),transparent_34%)]" />
      <div className="relative z-10 px-5 py-8 sm:px-7 lg:px-8 lg:py-9">
        <div className="max-w-[540px]">
          <span className="inline-flex rounded-md border border-[#2d72ff]/40 bg-[#0b2b6f]/45 px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#3b86ff]">
            SEO продвижение для малого и среднего бизнеса
          </span>
          <h1 className="mt-4 text-[27px] font-extrabold leading-[1.12] tracking-normal text-white sm:text-[38px] lg:text-[40px]">
            Выводим бизнес
            <br />в топ поисковых систем
            <br />
            <span className="text-[#2d72ff]">и увеличиваем прибыль</span>
          </h1>
          <p className="mt-3 max-w-[470px] text-[13px] leading-6 text-slate-300">
            Комплексное SEO-продвижение, которое приводит целевой трафик и превращает его в клиентов.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={pathFor('/contacts', locale)}
              className="inline-flex h-10 w-full max-w-[330px] items-center justify-center rounded-md bg-[#2368ff] px-5 text-[12px] font-extrabold text-white shadow-[0_12px_32px_rgba(35,104,255,0.44)] sm:w-auto"
            >
              Получить бесплатный аудит
            </Link>
            <Link
              href={pathFor('/cases', locale)}
              className="inline-flex h-10 w-full max-w-[330px] items-center justify-center rounded-md border border-[#2a3e64] bg-[#050b18]/70 px-5 text-[12px] font-extrabold text-white sm:w-auto"
            >
              Смотреть кейсы
            </Link>
          </div>
          <div className="mt-5 flex max-w-[590px] flex-nowrap items-center gap-3 overflow-hidden text-[10px] text-slate-300 sm:gap-5 lg:text-[11px]">
            {heroBenefits.map((item) => (
              <span key={item.label} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#2f7bff]/50 bg-[#0b2b6f]/55 text-[#4f92ff]">
                  <item.icon className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="px-5 pt-5 sm:px-7">
      <div className="seo-hover-surface grid overflow-hidden rounded-md border border-[#224779]/80 bg-[linear-gradient(135deg,rgba(7,18,37,0.94),rgba(4,10,22,0.92))] shadow-[inset_0_1px_0_rgba(120,170,255,0.10),0_18px_60px_rgba(0,0,0,0.28)] sm:grid-cols-2 lg:grid-cols-[1.05fr_repeat(4,1fr)]">
        <div className="flex min-h-[56px] items-center border-b border-[#163155] px-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-blue-100 sm:border-r lg:border-b-0">
          Наши партнёры
        </div>
        {partners.map((partner) => (
          <a
            key={partner.url}
            href={`https://${partner.url}`}
            target="_blank"
            rel="noreferrer"
            className="seo-hover-card group relative min-h-[56px] overflow-hidden border-t border-[#163155] px-4 py-3 outline-none transition duration-300 hover:border-[#2d72ff]/70 hover:bg-[#0a1c3b] active:scale-[0.99] focus-visible:border-[#5a96ff] focus-visible:bg-[#0a1c3b] sm:border-r sm:border-t-0"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(81,145,255,0.18),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
            <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#2d72ff] transition group-hover:scale-125 group-hover:shadow-[0_0_16px_rgba(45,114,255,0.9)]" />
            <span className="absolute bottom-3 right-3 text-[11px] font-black text-[#5a96ff] opacity-0 transition group-hover:opacity-100">↗</span>
            <p className="relative text-[14px] font-black uppercase leading-tight tracking-[0.08em] text-white [font-family:Georgia,'Times_New_Roman',serif]">{partner.name}</p>
            <p className="relative mt-1 text-[10px] text-slate-400 transition group-hover:text-slate-200">{partner.url}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function ResultSection() {
  return (
    <section className="px-5 pt-5 sm:px-7">
      <div className="group relative overflow-hidden rounded-md border border-[#24528b]/80 bg-[linear-gradient(135deg,rgba(7,18,37,0.96),rgba(8,27,57,0.78))] p-5 shadow-[inset_0_1px_0_rgba(125,178,255,0.10),0_20px_70px_rgba(0,0,0,0.24)] transition duration-500 hover:border-[#3f86ff]/80 sm:p-7">
        <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(75,134,255,0.18),rgba(105,219,255,0.12),transparent)] transition duration-1000 group-hover:translate-x-[120%]" />
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-72 rounded-full bg-[#2368ff]/12 blur-3xl" />
        <h2 className="relative text-[22px] font-extrabold tracking-normal text-white">SEO, которое даёт результат</h2>
        <p className="mt-2 text-[12px] leading-6 text-slate-300">
          Мы не просто продвигаем сайты - мы усиливаем структуру, спрос и путь до заявки.
        </p>
        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resultCards.map((card) => (
            <article key={card.title} className="seo-hover-card group/card relative min-h-[108px] overflow-hidden rounded-md border border-[#1f4778] bg-[#08142a]/84 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#4b91ff] hover:shadow-[0_18px_45px_rgba(23,96,255,0.18)]">
              <span className="absolute inset-0 opacity-0 transition duration-300 group-hover/card:opacity-100 bg-[radial-gradient(circle_at_24%_0%,rgba(74,139,255,0.22),transparent_42%)]" />
              <IconTile icon={card.icon} />
              <h3 className="relative mt-4 text-[13px] font-extrabold text-white">{card.title}</h3>
              <p className="relative mt-2 text-[11px] leading-5 text-slate-300">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="process" className="px-5 pt-5 sm:px-7">
      <div className="seo-hover-surface rounded-md border border-[#163155] bg-[#06101f]/86 p-5 sm:p-7">
        <h2 className="text-[22px] font-extrabold tracking-normal text-white">Что мы делаем</h2>
        <p className="mt-2 text-[12px] leading-6 text-slate-300">Комплексное SEO-продвижение под ключ</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {processCards.map((card) => (
            <article key={card.title} className="seo-hover-card group relative min-h-[132px] overflow-hidden rounded-md border border-[#17345e] bg-[#08142a]/76 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#4b91ff] hover:bg-[#0a1b39]/90">
              <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[linear-gradient(135deg,rgba(33,103,255,0.18),transparent_48%)]" />
              <IconTile icon={card.icon} />
              <h3 className="relative mt-4 text-[12px] font-extrabold text-white">{card.title}</h3>
              <p className="relative mt-2 text-[10px] leading-5 text-slate-300">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesCarousel({ locale }: { locale: Locale }) {
  return (
    <section id="services" className="px-5 pt-5 sm:px-7">
      <div className="seo-hover-surface rounded-md border border-[#163155] bg-[#06101f]/86 p-5 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-normal text-white">Услуги</h2>
            <p className="mt-2 text-[12px] leading-6 text-slate-300">Комплексные решения для роста вашего бизнеса</p>
          </div>
          <Link href={pathFor('/services', locale)} className="hidden whitespace-nowrap text-[12px] font-bold text-[#4b91ff] transition hover:text-white sm:inline-flex">
            Все услуги →
          </Link>
        </div>
        <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#24528b_transparent]">
          {serviceCards.map((card) => (
            <Link
              key={card.title}
              href={pathFor(card.href, locale)}
              className="seo-hover-card group relative min-h-[168px] w-[210px] shrink-0 snap-start overflow-hidden rounded-md border border-[#17345e] bg-[#08142a]/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#4b91ff] hover:shadow-[0_18px_45px_rgba(23,96,255,0.20)]"
            >
              <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(84,152,255,0.18),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
              <IconTile icon={card.icon} />
              <h3 className="relative mt-4 text-[13px] font-extrabold text-white">{card.title}</h3>
              <p className="relative mt-2 text-[11px] leading-5 text-slate-300">{card.text}</p>
              <span className="relative mt-4 inline-flex text-[11px] font-bold text-[#4b91ff]">Подробнее →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function CasesSection({ locale }: { locale: Locale }) {
  return (
    <section id="cases" className="px-5 pt-5 sm:px-7">
      <div className="seo-hover-surface rounded-md border border-[#163155] bg-[#071225]/86 p-5 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-normal text-white">Кейсы</h2>
            <p className="mt-2 text-[12px] leading-6 text-slate-300">Реальные проекты и результаты</p>
          </div>
          <Link href={pathFor('/cases', locale)} className="hidden whitespace-nowrap text-[12px] font-bold text-[#4b91ff] transition hover:text-white sm:inline-flex">
            Все кейсы →
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {caseCards.map((item) => (
            <Link key={item.title} href={pathFor('/cases', locale)} className="seo-hover-card group relative overflow-hidden rounded-md border border-[#17345e] bg-[#08142a]/80 transition duration-300 hover:-translate-y-1 hover:border-[#4b91ff] hover:shadow-[0_18px_45px_rgba(23,96,255,0.20)]">
              <div className="relative h-28 overflow-hidden border-b border-[#17345e]">
                <Image src={item.image} alt="" fill sizes="360px" className="object-cover opacity-90 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,0.05),rgba(3,8,18,0.62))]" />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{item.subtitle}</p>
                <h3 className="mt-2 text-[13px] font-extrabold text-white">{item.title}</h3>
                <p className="mt-3 text-[22px] font-black text-[#4b91ff]">{item.result}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogSection({ locale }: { locale: Locale }) {
  return (
    <section id="blog" className="px-5 pt-5 sm:px-7">
      <div className="seo-hover-surface rounded-md border border-[#163155] bg-[#06101f]/86 p-5 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-normal text-white">Блог</h2>
            <p className="mt-2 text-[12px] leading-6 text-slate-300">Полезные материалы с перелинковкой на статьи</p>
          </div>
          <Link href={pathFor('/blog', locale)} className="hidden whitespace-nowrap text-[12px] font-bold text-[#4b91ff] transition hover:text-white sm:inline-flex">
            Все статьи →
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {blogCards.map((post) => (
            <Link key={post.href} href={pathFor(post.href, locale)} className="seo-hover-card group relative overflow-hidden rounded-md border border-[#17345e] bg-[#08142a]/80 transition duration-300 hover:-translate-y-1 hover:border-[#4b91ff] hover:shadow-[0_18px_45px_rgba(23,96,255,0.20)]">
              <div className="relative h-28 overflow-hidden border-b border-[#17345e]">
                <Image src={post.image} alt="" fill sizes="360px" className="object-cover opacity-90 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,0.05),rgba(3,8,18,0.68))]" />
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{post.date}</p>
                <h3 className="mt-2 min-h-[52px] text-[13px] font-extrabold leading-snug text-white">{post.title}</h3>
                <span className="mt-4 inline-flex text-[11px] font-bold text-[#4b91ff]">Читать статью →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhotoCta({ locale }: { locale: Locale }) {
  return (
    <section className="px-5 py-5 sm:px-7">
      <div className="relative min-h-[180px] overflow-hidden rounded-md border border-[#163155] bg-[#050b16] p-5 transition duration-500 hover:border-[#3f86ff]/80 hover:shadow-[0_20px_70px_rgba(23,96,255,0.18)] sm:p-7">
        <Image src="/reference/home-keyboard.webp" alt="" fill sizes="1200px" className="object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,19,0.97)_0%,rgba(2,7,19,0.83)_42%,rgba(2,7,19,0.18)_100%)]" />
        <div className="relative z-10 max-w-[455px]">
          <h2 className="text-[20px] font-extrabold leading-tight text-white sm:text-[24px]">
            Хотите вывести бизнес в топ
            <br />и получать больше клиентов?
          </h2>
          <p className="mt-3 text-[12px] leading-6 text-slate-300">
            Оставьте заявку, подробный бесплатный аудит и покажем точки роста.
          </p>
          <Link
            href={pathFor('/contacts', locale)}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#2368ff] px-5 text-[12px] font-extrabold text-white shadow-[0_12px_30px_rgba(35,104,255,0.4)]"
          >
            Получить бесплатный аудит
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="grid gap-5 border-t border-[#163155]/75 px-5 py-6 text-[11px] text-slate-400 sm:grid-cols-2 sm:px-7 lg:grid-cols-[1.15fr_0.8fr_0.9fr_0.9fr_1fr]">
      <div>
        <Logo />
        <p className="mt-3 max-w-[260px] leading-5">SEO-продвижение для малого и среднего бизнеса. Превращаем трафик в прибыль.</p>
      </div>
      <div>
        <p className="font-extrabold text-white">Услуги</p>
        <div className="mt-3 grid gap-2">
          <Link href={pathFor('/services/seo', locale)} className="hover:text-white">SEO-продвижение</Link>
          <Link href={pathFor('/services/seo-audit', locale)} className="hover:text-white">SEO-аудит</Link>
          <Link href={pathFor('/services/technical-seo', locale)} className="hover:text-white">Техническое SEO</Link>
          <Link href={pathFor('/services/seo-content', locale)} className="hover:text-white">SEO-контент</Link>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-white">Страницы</p>
        <div className="mt-3 grid gap-2">
          <Link href={pathFor('/services/local-seo', locale)} className="hover:text-white">Локальное SEO</Link>
          <Link href={pathFor('/services/b2b-seo', locale)} className="hover:text-white">B2B SEO</Link>
          <Link href={pathFor('/services/ecommerce-seo', locale)} className="hover:text-white">Коммерческие страницы</Link>
          <Link href={pathFor('/services/link-building', locale)} className="hover:text-white">Линкбилдинг</Link>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-white">Материалы</p>
        <div className="mt-3 grid gap-2">
          <Link href={pathFor('/cases', locale)} className="hover:text-white">Кейсы</Link>
          <Link href={pathFor('/blog', locale)} className="hover:text-white">Блог</Link>
          <Link href={pathFor('/tools', locale)} className="hover:text-white">SEO-инструменты</Link>
          <Link href="/sitemap.xml" className="hover:text-white">Карта сайта</Link>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-white">Контакты</p>
        <div className="mt-3 grid gap-2">
          <a href={contactPhoneHref} className="flex items-center gap-2 hover:text-white">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {contactPhone}
          </a>
          <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-white">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {contactEmail}
          </a>
          <a href={telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
            <Image src="/telegram-logo.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
            @whoamikon
          </a>
          <a href={maxUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white">
            <Image src="/max-logo.png" alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-[3px]" />
            MAX
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Москва, Россия
          </span>
        </div>
      </div>
    </footer>
  )
}

export default async function HomePage() {
  const locale = await getRequestLocale()

  return (
    <div className="min-h-screen bg-[#020713] text-white">
      <span className="hidden" aria-hidden="true">
        {verificationCode}
      </span>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_4%,rgba(22,87,255,0.17),transparent_34%),linear-gradient(180deg,#020713_0%,#030814_52%,#020713_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,83,143,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(42,83,143,0.08)_1px,transparent_1px)] bg-[size:56px_56px] opacity-45" />
      </div>
      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="overflow-hidden bg-[#030814]/92">
          <Header locale={locale} />
          <Hero locale={locale} />
          <Partners />
          <ServicesCarousel locale={locale} />
          <ResultSection />
          <ProcessSection />
          <CasesSection locale={locale} />
          <BlogSection locale={locale} />
          <PhotoCta locale={locale} />
          <Footer locale={locale} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const alternates = getLocaleAlternates('/')
  const title = 'Shelpakov Digital - SEO-продвижение для роста трафика и заявок'
  const description =
    'Комплексное SEO-продвижение для малого и среднего бизнеса: аудит, семантика, оптимизация сайта, рост трафика и заявок.'

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'Shelpakov Digital',
    },
  }
}
