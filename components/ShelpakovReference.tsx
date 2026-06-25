import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  FileSearch,
  Instagram,
  Link2,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  PenTool,
  Phone,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'

export type ReferenceCard = {
  title: string
  text: string
  icon: LucideIcon
}

export const contactEmail = 'mail@shelpakov.online'
export const contactPhone = '+7 (495) 129-35-56'
export const telegramUrl = 'https://t.me/whoamikon'

export const referenceServices: ReferenceCard[] = [
  {
    title: 'SEO-продвижение',
    text: 'Выводим сайты в топ и увеличиваем целевой трафик.',
    icon: Search,
  },
  {
    title: 'Контекстная реклама',
    text: 'Настраиваем рекламу в Яндекс и Google для получения заявок.',
    icon: Megaphone,
  },
  {
    title: 'Техническая поддержка',
    text: 'Решаем технические проблемы и улучшаем производительность.',
    icon: Settings2,
  },
  {
    title: 'Аудит сайта',
    text: 'Проводим полный анализ сайта и выявляем точки роста.',
    icon: FileSearch,
  },
  {
    title: 'Контент-маркетинг',
    text: 'Создаём контент, который привлекает и конвертирует.',
    icon: PenTool,
  },
  {
    title: 'Линкбилдинг',
    text: 'Наращиваем качественную ссылочную массу для роста позиций.',
    icon: Link2,
  },
]

export const processCards: ReferenceCard[] = [
  {
    title: 'Технический аудит',
    text: 'Проверяем сайт на ошибки и технические проблемы.',
    icon: Search,
  },
  {
    title: 'Сбор семантики',
    text: 'Собираем коммерческие запросы и кластеры.',
    icon: Target,
  },
  {
    title: 'Оптимизация сайта',
    text: 'Делаем страницы понятными для людей и поиска.',
    icon: Wrench,
  },
  {
    title: 'Продвижение',
    text: 'Выводим сайт в топ и увеличиваем трафик.',
    icon: BarChart3,
  },
  {
    title: 'Аналитика и отчёты',
    text: 'Показываем динамику, задачи и результаты.',
    icon: ClipboardCheck,
  },
]

const navItems = [
  { label: 'Услуги', href: '/services' },
  { label: 'Кейсы', href: '/cases' },
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about' },
  { label: 'Процесс', href: '/services#process' },
  { label: 'Контакты', href: '/contacts' },
]

export function localizedPath(path: string, locale: Locale) {
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path
  }

  return prefixPathWithLocale(path, locale)
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-black lowercase text-white shadow-[0_0_28px_rgba(61,107,255,0.52)]">
        m
      </span>
      <span className={compact ? 'truncate text-sm font-extrabold text-white' : 'truncate text-lg font-extrabold text-white'}>
        Shelpakov Digital
      </span>
    </span>
  )
}

export function ShelpakovHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/10 bg-[#030814]/94 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[70px] w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={localizedPath('/', locale)} aria-label="Shelpakov Digital" className="min-w-0">
          <LogoLockup />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={localizedPath(item.href, locale)} className="transition hover:text-blue-300">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="text-sm font-bold text-white">
            {contactPhone}
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-200 transition hover:border-blue-300/55 hover:bg-blue-500/20"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            href={localizedPath('/contacts', locale)}
            aria-label="Контакты"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-200 transition hover:border-blue-300/55 hover:bg-blue-500/20"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={localizedPath('/contacts', locale)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(44,92,255,0.38)] transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Получить аудит
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-blue-200/20 bg-blue-500/10 text-white [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-14 w-[250px] rounded-lg border border-blue-200/15 bg-[#061126] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.48)]">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={localizedPath(item.href, locale)} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-blue-500/10">
                  {item.label}
                </Link>
              ))}
              <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-blue-500/10">
                {contactPhone}
              </a>
              <Link href={localizedPath('/contacts', locale)} className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-extrabold text-white">
                Получить аудит
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}

export function ShelpakovFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-blue-200/10 bg-[#030814] text-slate-400">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href={localizedPath('/', locale)}>
            <LogoLockup />
          </Link>
          <p className="mt-5 max-w-[280px] text-sm leading-6">
            Комплексное SEO-продвижение для малого и среднего бизнеса: структура, спрос, трафик и заявки.
          </p>
          <p className="mt-8 text-xs">© 2026 Shelpakov Digital. Все права защищены.</p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white">Услуги</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {referenceServices.slice(0, 4).map((item) => (
              <Link key={item.title} href={localizedPath('/services', locale)} className="transition hover:text-white">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white">Разделы</h3>
          <div className="mt-4 grid gap-3 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={localizedPath(item.href, locale)} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white">Контакты</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 transition hover:text-white">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {contactPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 transition hover:text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {contactEmail}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Москва, Россия
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function ReferencePage({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020713] text-white">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_4%,rgba(38,92,255,0.20),transparent_30%),radial-gradient(circle_at_12%_24%,rgba(31,167,255,0.10),transparent_24%),linear-gradient(180deg,#020713_0%,#040b18_48%,#020713_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(68,111,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(68,111,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string
  title: string
  description: string
  aside?: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-200/10 bg-[#07142b]/86 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.36)] sm:p-8 lg:p-9">
      <div className={aside ? 'grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]' : ''}>
        <div>
          <span className="inline-flex rounded-md border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-blue-300">
            {eyebrow}
          </span>
          <h1 className="mt-6 max-w-[760px] text-[34px] font-extrabold leading-[1.08] tracking-normal text-white sm:text-[42px] lg:text-[52px]">
            {title}
          </h1>
          <p className="mt-4 max-w-[640px] text-base leading-8 text-slate-300">{description}</p>
        </div>
        {aside}
      </div>
    </section>
  )
}

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300 shadow-[0_0_22px_rgba(58,114,255,0.32)]">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

export function ServiceCard({ card }: { card: ReferenceCard }) {
  return (
    <article className="min-h-[190px] rounded-lg border border-blue-200/10 bg-slate-950/42 p-5 transition hover:-translate-y-1 hover:border-blue-300/35">
      <IconTile icon={card.icon} />
      <h2 className="mt-5 text-lg font-extrabold text-white">{card.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400">
        Подробнее
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </article>
  )
}

export function DashboardVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'relative min-h-[190px]' : 'relative min-h-[300px]'}>
      <div className="absolute inset-0 rounded-lg border border-blue-200/10 bg-[radial-gradient(circle_at_76%_12%,rgba(40,101,255,0.22),transparent_32%),linear-gradient(135deg,rgba(5,14,34,0.96),rgba(4,9,23,0.96))] shadow-[inset_0_0_80px_rgba(45,102,255,0.14)]" />
      <div className="absolute left-[9%] top-[14%] w-[70%] rounded-lg border border-blue-300/20 bg-slate-950/56 p-5 shadow-[0_22px_54px_rgba(0,0,0,0.38)]">
        <p className="text-xs text-slate-400">Рост трафика</p>
        <p className="mt-1 text-3xl font-black text-white">+178%</p>
        <MiniChart className="mt-5 h-16 w-full" />
      </div>
      <div className="absolute bottom-[12%] right-[8%] w-[38%] rounded-lg border border-blue-300/20 bg-slate-950/62 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
        <div className="flex items-end gap-2">
          <span className="h-8 flex-1 rounded-t bg-blue-600" />
          <span className="h-14 flex-1 rounded-t bg-blue-400" />
          <span className="h-20 flex-1 rounded-t bg-cyan-300" />
        </div>
      </div>
    </div>
  )
}

export function MiniChart({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 56" fill="none" aria-hidden="true">
      <path d="M4 48H216" stroke="rgba(90,142,255,0.24)" strokeWidth="1" />
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

export function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p> : null}
    </div>
  )
}

export function ProjectCta({ locale }: { locale: Locale }) {
  return (
    <section className="mt-5 overflow-hidden rounded-lg border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Есть проект? Давайте обсудим</h2>
          <p className="mt-3 max-w-[460px] text-sm leading-7 text-slate-300">
            Расскажите о своей задаче, и мы предложим лучшее решение.
          </p>
          <Link
            href={localizedPath('/contacts', locale)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(42,90,255,0.42)] transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Получить консультацию
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <DashboardVisual compact />
      </div>
    </section>
  )
}

export function BlogCover({
  src,
  title,
}: {
  src: string
  title: string
}) {
  return (
    <div className="relative h-44 overflow-hidden rounded-t-lg border-b border-blue-200/10 bg-slate-950">
      <Image src={src} alt={title} fill className="object-cover opacity-82 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(3,8,18,0.52))]" />
    </div>
  )
}

export function TrustItem({ title, text }: { title: string; text: string }) {
  return (
    <article className="flex gap-4 rounded-lg border border-blue-200/10 bg-slate-950/42 p-5">
      <IconTile icon={ShieldCheck} />
      <div>
        <h2 className="text-lg font-extrabold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
      </div>
    </article>
  )
}

export function StatsStrip() {
  return (
    <div className="grid gap-3 rounded-lg border border-blue-200/10 bg-slate-950/42 p-5 sm:grid-cols-4">
      {[
        ['5+', 'лет опыта'],
        ['100+', 'проектов'],
        ['50+', 'довольных клиентов'],
        ['98%', 'клиентов рекомендуют'],
      ].map(([value, label]) => (
        <div key={label}>
          <p className="text-2xl font-black text-blue-400">{value}</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">{label}</p>
        </div>
      ))}
    </div>
  )
}

export function ContactMap() {
  return (
    <div className="relative min-h-[270px] overflow-hidden rounded-lg border border-blue-200/10 bg-[#061126]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(65,118,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(65,118,255,0.10)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/25" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
      <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_44px_rgba(45,114,255,0.8)]">
        <MapPin className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <p className="text-sm font-bold text-white">Shelpakov Digital</p>
        <p className="mt-1 text-xs text-slate-400">Москва, Россия</p>
      </div>
    </div>
  )
}

export const referenceCaseCards = [
  {
    title: 'Интернет-магазин мебели',
    subtitle: 'Рост трафика',
    result: '+178%',
    image: '/blog/seo-lead-quality-cover.svg',
  },
  {
    title: 'Сайт медицинского центра',
    subtitle: 'Заявки',
    result: '+233%',
    image: '/cases/botiq/audit-cover.png',
  },
  {
    title: 'Интернет-магазин техники',
    subtitle: 'Рост продаж',
    result: '+185%',
    image: '/blog/meta-tags-practice-cover.svg',
  },
  {
    title: 'Корпоративный сайт',
    subtitle: 'Рост трафика',
    result: '+968%',
    image: '/blog/domain-migration-plan-cover.svg',
  },
  {
    title: 'Локальный бизнес',
    subtitle: 'Рост заявок',
    result: '+215%',
    image: '/blog/reputation-seo-cover.svg',
  },
  {
    title: 'Интернет-магазин одежды',
    subtitle: 'Рост продаж',
    result: '+132%',
    image: '/blog/seo-trends-2026-cover.svg',
  },
]

export const referenceBlogCards = [
  {
    title: 'Как вывести сайт в топ в 2026 году',
    date: '12 мая 2026',
    image: '/blog/seo-trends-2026-cover.svg',
  },
  {
    title: 'Технический аудит: что проверить в первую очередь',
    date: '5 мая 2026',
    image: '/blog/site-speed-optimization-cover.svg',
  },
  {
    title: 'SEO для интернет-магазинов: полное руководство',
    date: '28 апреля 2026',
    image: '/blog/seo-site-requirements-cover.svg',
  },
  {
    title: 'Как увеличить конверсию сайта на 300%',
    date: '18 апреля 2026',
    image: '/blog/seo-lead-quality-cover.svg',
  },
  {
    title: 'Локальное SEO: как продвигать бизнес в регионе',
    date: '10 апреля 2026',
    image: '/blog/geo-ai-readiness-cover.svg',
  },
  {
    title: 'Контент-стратегия: от стратегии к результату',
    date: '2 апреля 2026',
    image: '/blog/expert-blog-growth-cover.svg',
  },
]

export const aboutPrinciples = [
  {
    title: '5+ лет опыта',
    text: 'Успешно продвигаем сайты разных ниш с 2019 года.',
  },
  {
    title: '100+ проектов',
    text: 'Реализовали более 100 успешных проектов для наших клиентов.',
  },
  {
    title: 'Прозрачность',
    text: 'Предоставляем понятные отчёты и объясняем все процессы.',
  },
  {
    title: 'Результат',
    text: 'Работаем на результат и рост вашего бизнеса.',
  },
]

export const quickBenefits = [
  'Прозрачная отчётность',
  'Без долгосрочных контрактов',
  'Гарантия результата',
]

export const trustHighlights = [
  { icon: Sparkles, label: 'от 3 месяцев', text: 'первые результаты уже через 90 дней' },
  { icon: BarChart3, label: 'по срезам', text: 'сравниваем старт и текущую динамику' },
  { icon: UsersRound, label: 'с источником', text: 'данные показываем только с подтверждением' },
  { icon: Briefcase, label: 'план работ', text: 'следующие действия фиксируются по приоритетам' },
]
