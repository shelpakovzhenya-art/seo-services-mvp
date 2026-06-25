import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileSearch,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Instagram,
  Target,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'

const verificationCode = 'yilk8rn94r0d3m5v'

type StatCard = {
  icon: LucideIcon
  value: string
  text: string
}

type ServiceCard = {
  icon: LucideIcon
  title: string
  text: string
}

const partners = [
  { name: 'SIGNAL', url: 'signalmsk.com' },
  { name: 'MY PODOLOG SHOP', url: 'mypodolog.shop' },
  { name: 'mypodolog', url: 'mypodolog.ru' },
  { name: 'PODO CENTER', url: 'podocenter-kzn.ru' },
]

const resultStats: StatCard[] = [
  { icon: Target, value: 'от 3 месяцев', text: 'Первые результаты уже через 90 дней' },
  { icon: BarChart3, value: 'от 150%', text: 'Рост органического трафика в среднем' },
  { icon: UsersRound, value: 'от 2.5x', text: 'Больше заявок с сайта' },
  { icon: CircleDollarSign, value: 'от 30%', text: 'Снижение стоимости привлечения клиента' },
]

const serviceCards: ServiceCard[] = [
  { icon: Target, title: 'Технический аудит', text: 'Проверяем сайт на ошибки и точки роста' },
  { icon: Search, title: 'Сбор семантики', text: 'Собираем только коммерческие запросы' },
  { icon: Wrench, title: 'Оптимизация сайта', text: 'Делаем сайт удобным для пользователей и поисковиков' },
  { icon: Rocket, title: 'Продвижение', text: 'Выводим сайт в топ и увеличиваем трафик' },
  { icon: FileSearch, title: 'Аналитика и отчёты', text: 'Прозрачные отчёты и контроль результатов' },
]

const cases = [
  {
    badge: 'Медицина',
    title: 'Клиника в Москве',
    traffic: '+210%',
    leads: '+185%',
    accent: 'from-sky-500/35 via-blue-600/20 to-slate-950',
  },
  {
    badge: 'Интернет-магазин',
    title: 'Магазин оборудования',
    traffic: '+160%',
    leads: '+220%',
    accent: 'from-indigo-500/35 via-cyan-500/15 to-slate-950',
  },
  {
    badge: 'Услуги',
    title: 'Юридическая компания',
    traffic: '+145%',
    leads: '+190%',
    accent: 'from-blue-600/35 via-violet-500/15 to-slate-950',
  },
]

const navItems = [
  { label: 'Услуги', href: '#services' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'О нас', href: '#results' },
  { label: 'Процесс', href: '#services' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
]

function linkWithLocale(path: string, locale: Locale) {
  if (path.startsWith('#')) {
    return path
  }

  return prefixPathWithLocale(path, locale)
}

function IconTile({ icon: Icon, className = '' }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300 shadow-[0_0_22px_rgba(58,114,255,0.38)] ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

function MiniChart({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 56" fill="none" aria-hidden="true">
      <path d="M4 48H216" stroke="rgba(90,142,255,0.26)" strokeWidth="1" />
      <path
        d="M6 43C28 41 33 37 49 40C69 45 77 30 95 33C114 36 119 18 139 22C160 26 169 12 189 18C201 21 209 13 216 8"
        stroke="#4d78ff"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M6 43C28 41 33 37 49 40C69 45 77 30 95 33C114 36 119 18 139 22C160 26 169 12 189 18C201 21 209 13 216 8"
        stroke="#70d8ff"
        strokeLinecap="round"
        strokeWidth="1"
      />
    </svg>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto min-h-[360px] w-full max-w-[590px] lg:min-h-[430px]">
      <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_58%_28%,rgba(52,112,255,0.26),transparent_32%),linear-gradient(135deg,rgba(4,9,20,0.2),rgba(5,12,26,0.88))]" />
      <div className="absolute right-0 top-8 h-[300px] w-[84%] rounded-lg border border-blue-300/15 bg-slate-950/45 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur">
        <div className="absolute inset-x-8 top-7 flex items-center justify-between text-xs text-slate-400">
          <span>SEO Dashboard</span>
          <span className="rounded-md border border-blue-300/20 bg-blue-500/10 px-2 py-1 text-blue-300">live</span>
        </div>
        <div className="absolute left-8 right-8 top-20 rounded-lg border border-blue-300/15 bg-[#071735] p-5">
          <p className="text-sm text-slate-300">Рост трафика</p>
          <p className="mt-1 text-3xl font-black text-white">+178%</p>
          <MiniChart className="mt-4 h-16 w-full" />
        </div>
        <div className="absolute bottom-7 left-8 right-8 grid grid-cols-3 gap-3">
          {['ТОП-10', 'Заявки', 'CR'].map((item, index) => (
            <div key={item} className="rounded-lg border border-blue-300/12 bg-slate-950/55 p-3">
              <p className="text-[11px] text-slate-400">{item}</p>
              <p className="mt-1 text-lg font-black text-blue-300">{index === 0 ? '+352' : index === 1 ? '+243%' : '8.4%'}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-0 hidden w-[270px] rounded-lg border border-blue-300/15 bg-slate-950/72 p-4 shadow-[0_0_42px_rgba(42,99,255,0.28)] backdrop-blur sm:block">
        <div className="flex items-center gap-3 rounded-md border border-blue-300/15 bg-[#071735] px-4 py-3">
          <span className="text-sm text-slate-400">Поиск...</span>
          <Search className="ml-auto h-5 w-5 text-cyan-300" aria-hidden="true" />
        </div>
      </div>
      <div className="absolute bottom-0 right-12 h-5 w-[68%] rounded-[50%] bg-blue-400/24 blur-xl" />
    </div>
  )
}

function AnalyticsVisual() {
  return (
    <div className="relative min-h-[270px] overflow-hidden rounded-lg border border-blue-300/20 bg-gradient-to-br from-slate-950 via-[#071733] to-[#0d255e] p-6 shadow-[inset_0_0_60px_rgba(45,102,255,0.16)]">
      <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="relative ml-auto mt-2 flex h-48 w-full max-w-[300px] items-end gap-4 rounded-lg border border-blue-300/25 bg-slate-950/45 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.36)]">
        <div className="absolute left-5 top-5 h-16 w-16 rounded-full border-[14px] border-blue-400/40 border-t-cyan-300" />
        <MiniChart className="absolute left-24 top-8 h-20 w-44" />
        <span className="h-16 w-12 rounded-t-lg bg-blue-500" />
        <span className="h-24 w-12 rounded-t-lg bg-cyan-300" />
        <span className="h-36 w-12 rounded-t-lg bg-slate-500" />
      </div>
    </div>
  )
}

function SocialIcon({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300" aria-label={label}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  )
}

export default async function HomePage() {
  const locale = await getRequestLocale()

  return (
    <div className="min-h-screen overflow-hidden bg-[#020713] text-white">
      <span className="hidden" aria-hidden="true">
        {verificationCode}
      </span>

      <div className="pointer-events-none fixed inset-0 opacity-90" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_8%,rgba(38,92,255,0.22),transparent_32%),radial-gradient(circle_at_15%_26%,rgba(20,164,255,0.12),transparent_28%),linear-gradient(180deg,#020713_0%,#040b18_48%,#020713_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(68,111,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(68,111,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[24px] border border-blue-200/10 bg-slate-950/72 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
          <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
            <Link href={linkWithLocale('/', locale)} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-black lowercase text-white shadow-[0_0_28px_rgba(60,106,255,0.55)]">
                m
              </span>
              <span className="text-2xl font-extrabold tracking-tight">Shelpakov Digital</span>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-200 lg:flex">
              {navItems.map((item) => (
                <Link key={item.label} href={linkWithLocale(item.href, locale)} className="transition hover:text-blue-300">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href="tel:+74951293556" className="hidden text-sm font-bold text-white sm:inline">
                +7 (495) 129-35-56
              </a>
              <a
                href="https://t.me/whoamikon"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-200 transition hover:border-blue-300/50 hover:bg-blue-500/20 md:inline-flex"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href={linkWithLocale('/contacts', locale)}
                aria-label="Контакты"
                className="hidden h-9 w-9 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-200 transition hover:border-blue-300/50 hover:bg-blue-500/20 md:inline-flex"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={linkWithLocale('/contacts', locale)}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(48,91,255,0.42)] transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Получить аудит
              </Link>
            </div>
          </header>

          <div className="grid gap-8 px-4 pb-8 pt-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:pb-10 lg:pt-12">
            <div className="flex flex-col justify-center">
              <p className="w-fit rounded-md border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-300">
                SEO продвижение для малого и среднего бизнеса
              </p>

              <h1 className="mt-7 max-w-[640px] text-[34px] font-extrabold leading-[1.16] tracking-normal text-white sm:text-[38px] lg:text-[42px]">
                Выводим бизнес в топ поисковых систем и <span className="text-blue-500">увеличиваем прибыль</span>
              </h1>

              <p className="mt-6 max-w-[510px] text-base leading-8 text-slate-300 sm:text-lg">
                Комплексное SEO-продвижение, которое приводит целевой трафик и превращает его в ваших клиентов.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={linkWithLocale('/contacts', locale)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-4 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(44,96,255,0.45)] transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Получить бесплатный аудит
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#cases"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200/30 bg-slate-950/40 px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:border-blue-300/70"
                >
                  Смотреть кейсы
                </Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                {['Прозрачная отчётность', 'Без долгосрочных контрактов', 'Гарантия результата'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>

          <div className="mx-4 mb-5 grid gap-4 rounded-lg border border-blue-200/10 bg-slate-950/55 p-5 sm:mx-8 sm:grid-cols-2 sm:p-6 lg:mx-12 lg:grid-cols-[1.1fr_repeat(4,1fr)]">
            <div className="flex items-center text-lg font-extrabold text-white">Наши партнёры</div>
            {partners.map((partner) => (
              <div key={partner.url} className="min-w-0">
                <p className="text-xl font-black uppercase leading-tight text-white">{partner.name}</p>
                <p className="mt-1 truncate text-xs text-slate-400">{partner.url}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="results" className="mt-5 overflow-hidden rounded-[18px] border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.36)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-normal text-white sm:text-4xl">SEO, которое даёт результат</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">Мы не просто продвигаем сайты - мы увеличиваем ваш доход.</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {resultStats.map((item) => (
                  <div key={item.value} className="rounded-lg border border-blue-200/10 bg-slate-950/40 p-5">
                    <IconTile icon={item.icon} />
                    <p className="mt-7 text-2xl font-extrabold text-white">{item.value}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <AnalyticsVisual />
          </div>
        </section>

        <section id="services" className="mt-5 rounded-[18px] border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Что мы делаем</h2>
          <p className="mt-2 text-slate-300">Комплексное SEO-продвижение под ключ</p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCards.map((item) => (
              <div key={item.title} className="rounded-lg border border-blue-200/10 bg-slate-950/38 p-5 transition hover:-translate-y-1 hover:border-blue-300/35">
                <IconTile icon={item.icon} className="h-10 w-10" />
                <h3 className="mt-5 text-lg font-extrabold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cases" className="mt-5 rounded-[18px] border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Наши кейсы</h2>
            <div className="flex items-center gap-3">
              <Link href={linkWithLocale('/cases', locale)} className="rounded-lg bg-blue-500/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500/20">
                Смотреть все кейсы
              </Link>
              <button type="button" aria-label="Предыдущий кейс" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/10 bg-slate-950/45 text-slate-300">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Следующий кейс" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/10 bg-slate-950/45 text-slate-300">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {cases.map((item) => (
              <article key={item.title} className={`relative min-h-[190px] overflow-hidden rounded-lg border border-blue-200/10 bg-gradient-to-br ${item.accent} p-5`}>
                <div className="absolute inset-0 opacity-35">
                  <div className="absolute -right-10 top-6 h-36 w-36 rounded-full border border-blue-300/30" />
                  <div className="absolute bottom-0 left-0 h-20 w-full bg-[linear-gradient(180deg,transparent,rgba(2,7,19,0.82))]" />
                </div>
                <div className="relative">
                  <span className="rounded-md border border-blue-300/25 bg-blue-500/12 px-3 py-1 text-xs font-bold text-blue-300">{item.badge}</span>
                  <h3 className="mt-6 text-xl font-extrabold text-white">{item.title}</h3>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-300">Рост трафика</p>
                      <p className="mt-1 text-2xl font-extrabold text-white">{item.traffic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">Заявки</p>
                      <p className="mt-1 text-2xl font-extrabold text-white">{item.leads}</p>
                    </div>
                  </div>
                  <MiniChart className="mt-4 h-9 w-full" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[18px] border border-blue-400/35 bg-gradient-to-r from-blue-950 via-[#123170] to-blue-950 p-6 shadow-[0_18px_70px_rgba(20,82,255,0.24)] sm:p-9">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_0.7fr]">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Готовы вывести ваш бизнес на новый уровень?</h2>
              <p className="mt-3 text-slate-200">Оставьте заявку и получите бесплатный SEO-аудит сайта</p>
            </div>
            <div className="hidden h-24 w-24 items-center justify-center rounded-full border border-blue-200/25 bg-slate-950/30 shadow-[0_0_40px_rgba(84,137,255,0.42)] md:flex">
              <ArrowUpRight className="h-10 w-10 text-blue-200" aria-hidden="true" />
            </div>
            <div className="md:text-right">
              <Link href={linkWithLocale('/contacts', locale)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(42,90,255,0.45)] transition hover:-translate-y-0.5 hover:bg-blue-500">
                Получить аудит
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <footer className="grid gap-8 px-5 py-10 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-7">
          <div>
            <Link href={linkWithLocale('/', locale)} className="flex items-center gap-3 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Rocket className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xl font-extrabold">Shelpakov Digital</span>
            </Link>
            <p className="mt-5 max-w-[260px] leading-6">SEO-продвижение для малого и среднего бизнеса. Превращаем трафик в прибыль.</p>
            <p className="mt-8 text-xs">© 2026 Shelpakov Digital. Все права защищены.</p>
          </div>

          <div>
            <h3 className="font-extrabold text-white">Услуги</h3>
            <div className="mt-4 flex flex-col gap-3">
              {['SEO-продвижение', 'Технический аудит', 'Оптимизация сайта', 'SEO-поддержка'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-white">Компания</h3>
            <div className="mt-4 flex flex-col gap-3">
              {['О нас', 'Кейсы', 'Блог', 'Контакты'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-white">Контакты</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a href="tel:+74951293556" className="flex items-center gap-2 transition hover:text-white">
                <Phone className="h-4 w-4" aria-hidden="true" />
                +7 (495) 129-35-56
              </a>
              <a href="mailto:mail@shelpakov.online" className="flex items-center gap-2 transition hover:text-white">
                <Mail className="h-4 w-4" aria-hidden="true" />
                mail@shelpakov.online
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Москва, Россия
              </span>
            </div>
            <div className="mt-6 flex gap-3">
              <SocialIcon icon={Send} label="Telegram" />
              <SocialIcon icon={MessageCircle} label="WhatsApp" />
              <SocialIcon icon={ShieldCheck} label="VK" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const alternates = getLocaleAlternates('/')
  const title = 'Shelpakov Digital - SEO-продвижение для роста трафика и заявок'
  const description = 'Комплексное SEO-продвижение для малого и среднего бизнеса: аудит, семантика, оптимизация сайта, рост трафика и заявок.'

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      siteName: 'Shelpakov Digital',
    },
  }
}
