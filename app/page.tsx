import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MapPin,
  Phone,
  Search,
  Target,
  UsersRound,
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

const resultCards: Card[] = [
  { icon: Target, title: 'от 3 месяцев', text: 'Первые результаты уже через 90 дней' },
  { icon: BarChart3, title: 'по срезам', text: 'Сравниваем старт и текущую динамику' },
  { icon: UsersRound, title: 'с источником', text: 'Данные показываем только с подтверждением' },
  { icon: Briefcase, title: 'план работ', text: 'Фиксируем действия по приоритетам' },
]

const processCards: Card[] = [
  { icon: Search, title: 'Технический аудит', text: 'Проверяем сайт на ошибки и технические проблемы' },
  { icon: Target, title: 'Сбор семантики', text: 'Собираем коммерческие запросы и кластеры' },
  { icon: Wrench, title: 'Оптимизация сайта', text: 'Делаем страницы понятными для людей и поиска' },
  { icon: BarChart3, title: 'Продвижение', text: 'Выводим сайт в топ и увеличиваем трафик' },
  { icon: ClipboardCheck, title: 'Аналитика и отчёты', text: 'Показываем динамику и понятные результаты' },
]

function pathFor(path: string, locale: Locale) {
  return path.startsWith('#') ? path : prefixPathWithLocale(path, locale)
}

function Logo() {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#1f64ff] text-[11px] font-black lowercase text-white shadow-[0_0_22px_rgba(31,100,255,0.72)]">
        m
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

function MiniChart() {
  return (
    <svg viewBox="0 0 220 58" className="h-16 w-full" fill="none" aria-hidden="true">
      <path d="M5 51H215" stroke="rgba(64,124,255,0.16)" />
      <path
        d="M7 45C29 39 35 31 50 35C66 39 74 27 90 31C106 35 114 19 132 23C150 28 157 12 174 17C190 22 199 12 214 7"
        stroke="#1f68ff"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M7 45C29 39 35 31 50 35C66 39 74 27 90 31C106 35 114 19 132 23C150 28 157 12 174 17C190 22 199 12 214 7"
        stroke="#79d8ff"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  )
}

function Header({ locale }: { locale: Locale }) {
  return (
    <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#163155]/75 px-5 sm:px-7">
      <Link href={pathFor('/', locale)} aria-label="Shelpakov Digital">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-5 text-[11px] font-semibold text-slate-300 lg:flex">
        {navItems.map((item) => (
          <Link key={item.label} href={pathFor(item.href, locale)} className="transition hover:text-[#3f86ff]">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <a href="tel:+74951293556" className="hidden text-[11px] font-extrabold text-white sm:inline">
          +7 (495) 129-35-56
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
          className="hidden h-8 min-w-8 place-items-center rounded-md border border-[#2369ff]/30 bg-[#0a1c42] px-1.5 text-[9px] font-black uppercase tracking-normal text-[#8db5ff] md:grid"
        >
          MAX
        </a>
        <Link
          href={pathFor('/contacts', locale)}
          className="hidden rounded-md bg-[#2368ff] px-4 py-2 text-[11px] font-extrabold text-white shadow-[0_10px_28px_rgba(35,104,255,0.38)] transition hover:bg-[#2f77ff] sm:inline-flex"
        >
          Получить аудит
        </Link>
      </div>
    </header>
  )
}

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative overflow-hidden border-b border-[#163155]/75">
      <Image
        src="/reference/hero-laptop.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 720px"
        className="origin-right scale-[1.18] object-contain object-right opacity-100 brightness-125 contrast-110"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#020713_0%,#020713_42%,rgba(2,7,19,0.62)_57%,rgba(2,7,19,0.04)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(25,86,255,0.08),transparent_34%)]" />
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
          <div className="mt-5 grid max-w-[520px] gap-3 text-[11px] text-slate-300 sm:grid-cols-3">
            {['Прозрачная отчётность', 'Без долгосрочных контрактов', 'Гарантия результата'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2f7bff]" aria-hidden="true" />
                {item}
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
      <div className="grid overflow-hidden rounded-md border border-[#163155] bg-[#071225]/86 sm:grid-cols-2 lg:grid-cols-[1.05fr_repeat(4,1fr)]">
        <div className="flex min-h-[48px] items-center border-b border-[#163155] px-4 text-[12px] font-extrabold text-white sm:border-r lg:border-b-0">
          Наши партнёры
        </div>
        {partners.map((partner) => (
          <a
            key={partner.url}
            href={`https://${partner.url}`}
            target="_blank"
            rel="noreferrer"
            className="group relative min-h-[48px] border-t border-[#163155] px-4 py-2.5 outline-none transition duration-200 hover:border-[#2d72ff]/70 hover:bg-[#0a1c3b] active:scale-[0.99] focus-visible:border-[#5a96ff] focus-visible:bg-[#0a1c3b] sm:border-r sm:border-t-0"
          >
            <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#2d72ff] transition group-hover:scale-125 group-hover:shadow-[0_0_16px_rgba(45,114,255,0.9)]" />
            <span className="absolute bottom-3 right-3 text-[11px] font-black text-[#5a96ff] opacity-0 transition group-hover:opacity-100">↗</span>
            <p className="text-[13px] font-black uppercase leading-tight text-white">{partner.name}</p>
            <p className="mt-1 text-[10px] text-slate-400 transition group-hover:text-slate-200">{partner.url}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function ResultSection() {
  return (
    <section className="px-5 pt-5 sm:px-7">
      <div className="rounded-md border border-[#163155] bg-[#071225]/86 p-5 sm:p-7">
        <h2 className="text-[22px] font-extrabold tracking-normal text-white">SEO, которое даёт результат</h2>
        <p className="mt-2 text-[12px] leading-6 text-slate-300">
          Мы не просто продвигаем сайты - мы усиливаем структуру, спрос и путь до заявки.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resultCards.map((card) => (
            <article key={card.title} className="min-h-[108px] rounded-md border border-[#17345e] bg-[#08142a]/84 p-4">
              <IconTile icon={card.icon} />
              <h3 className="mt-4 text-[13px] font-extrabold text-white">{card.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-300">{card.text}</p>
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
      <div className="rounded-md border border-[#163155] bg-[#06101f]/86 p-5 sm:p-7">
        <h2 className="text-[22px] font-extrabold tracking-normal text-white">Что мы делаем</h2>
        <p className="mt-2 text-[12px] leading-6 text-slate-300">Комплексное SEO-продвижение под ключ</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {processCards.map((card) => (
            <article key={card.title} className="min-h-[132px] rounded-md border border-[#17345e] bg-[#08142a]/76 p-4">
              <IconTile icon={card.icon} />
              <h3 className="mt-4 text-[12px] font-extrabold text-white">{card.title}</h3>
              <p className="mt-2 text-[10px] leading-5 text-slate-300">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhotoCta({ locale }: { locale: Locale }) {
  return (
    <section className="px-5 py-5 sm:px-7">
      <div className="relative min-h-[180px] overflow-hidden rounded-md border border-[#163155] bg-[#050b16] p-5 sm:p-7">
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

function Footer() {
  return (
    <footer className="grid gap-5 border-t border-[#163155]/75 px-5 py-6 text-[11px] text-slate-400 sm:grid-cols-2 sm:px-7 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
      <div>
        <Logo />
        <p className="mt-3 max-w-[260px] leading-5">SEO-продвижение для малого и среднего бизнеса. Превращаем трафик в прибыль.</p>
      </div>
      <div>
        <p className="font-extrabold text-white">Услуги</p>
        <div className="mt-3 grid gap-2">
          <span>SEO-продвижение</span>
          <span>Технический аудит</span>
          <span>Оптимизация сайта</span>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-white">Компания</p>
        <div className="mt-3 grid gap-2">
          <span>О нас</span>
          <span>Кейсы</span>
          <span>Блог</span>
        </div>
      </div>
      <div>
        <p className="font-extrabold text-white">Контакты</p>
        <div className="mt-3 grid gap-2">
          <a href="tel:+74951293556" className="flex items-center gap-2 hover:text-white">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            +7 (495) 129-35-56
          </a>
          <a href="mailto:mail@shelpakov.online" className="flex items-center gap-2 hover:text-white">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            mail@shelpakov.online
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
      <div className="relative mx-auto w-full max-w-[1320px] px-2 py-2 sm:px-3 sm:py-3">
        <div className="overflow-hidden rounded-md border border-[#1a355d] bg-[#030814]/92 shadow-[0_26px_90px_rgba(0,0,0,0.48)]">
          <Header locale={locale} />
          <Hero locale={locale} />
          <Partners />
          <ResultSection />
          <ProcessSection />
          <PhotoCta locale={locale} />
          <Footer />
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
