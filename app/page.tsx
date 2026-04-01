import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Gem,
  LineChart,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { buildCaseListing } from '@/lib/case-listing'
import { buildLocalizedBlogListing } from '@/lib/blog-localization'
import { hasRussianCaseContent, localizeCaseRecord } from '@/lib/case-localization'
import { getBlogCover, getCaseCover, isInlineImageAsset } from '@/lib/content-covers'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { buildLocalizedReviewListing } from '@/lib/review-listing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { getTrustLinks } from '@/lib/trust-content'
import LazyContactForm from '@/components/LazyContactForm'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'

const verificationCode = 'yilk8rn94r0d3m5v'

function canUseHomepageCardCover(src?: string | null) {
  if (!src) {
    return false
  }

  return /\.(png|jpe?g|webp|avif)$/i.test(src)
}

const homeCopy: Record<Locale, any> = {
  ru: {
    metadata: {
      title: 'Частный SEO-специалист для сайтов услуг и B2B | Shelpakov Digital',
      description:
        'Независимый SEO-специалист для небольших и средних проектов: аудит, структура сайта, ключевые страницы, техническая база и рост обращений из поиска.',
      keywords:
        'частный seo специалист, seo фрилансер, seo для сайтов услуг, seo для b2b, технический seo, переработка сайта под заявки',
    },
    heroChip: 'Независимый SEO-специалист',
    heroTitle:
      'Перерабатываю сайты услуг так, чтобы они выглядели сильнее, понятнее продавали услугу и приводили обращения из поиска.',
    heroText:
      'Работаю с небольшими и средними проектами: аудит, структура, ключевые страницы, техническая база и сценарий заявки. Без агентской прослойки, без потока “менеджер -> отдел -> подрядчик” и без декоративных правок ради отчёта.',
    primaryCta: 'Получить разбор сайта',
    secondaryCta: 'Посмотреть кейсы',
    heroBadges: ['Малый и средний бизнес', 'Личное ведение проекта', 'Фокус на заявках и качестве сайта'],
    heroMetrics: [
      {
        value: '1 специалист',
        label: 'Стратегия, приоритеты и ключевые решения не теряются между менеджерами и отделами.',
      },
      {
        value: 'Без лишнего объёма',
        label: 'Стартуем не с максимального пакета, а с того слоя, который реально тормозит рост.',
      },
      {
        value: 'Сайт как актив',
        label: 'Цель не только трафик, но и нормальная упаковка услуги, доверие и следующий шаг к заявке.',
      },
    ],
    heroPanels: [
      {
        title: 'Подходит, если',
        items: [
          'сайт уже есть, но выглядит слабее самой услуги',
          'трафик идёт, а обращений мало или они нестабильны',
          'нужно понять, что чинить первым: структуру, страницы или техбазу',
        ],
      },
      {
        title: 'Как веду работу',
        items: [
          'сам разбираю сайт, спрос и коммерческий слой',
          'не обещаю магию за месяц и не продаю лишний процесс',
          'даю приоритеты, которые можно внедрять без хаоса',
        ],
      },
    ],
    problemsKicker: 'Что обычно ломает результат',
    problemsTitle: 'Проблема редко в одном тексте или одной техошибке.',
    problemsText:
      'Чаще сайт теряет обращения на стыке нескольких слоёв: плохо разведённый спрос, слабые страницы услуг, неочевидный следующий шаг и техническая база, которая мешает росту.',
    problemCards: [
      {
        icon: FileText,
        title: 'Страницы не объясняют ценность',
        text: 'Пользователь видит общие слова, но не понимает, почему стоит оставить заявку именно здесь и именно сейчас.',
      },
      {
        icon: LineChart,
        title: 'Приоритеты выбраны неверно',
        text: 'Команда правит всё подряд: тексты, блоки, теги, дизайн. Но главное узкое место остаётся нетронутым.',
      },
      {
        icon: BarChart3,
        title: 'Сайт не держит взрослую упаковку',
        text: 'Структура, шаблоны и визуальный слой не тянут серьёзную подачу услуги и мешают масштабировать проект дальше.',
      },
    ],
    formatsKicker: 'Форматы работы',
    formatsTitle: 'Можно начать с нужного слоя, а не с максимального чека.',
    formatsText:
      'Если проекту нужен сначала диагноз — начинаем с диагноза. Если уже понятно, что ломается, идём сразу в ключевые страницы, техбазу или системную работу.',
    packages: [
      {
        name: 'Разбор и план внедрения',
        price: '15 000 ₽',
        accent: 'Когда сначала нужно понять, где сайт реально теряет обращения и что исправлять первым.',
        icon: Rocket,
        items: [
          'Аудит структуры, индексации и ключевых страниц',
          'Приоритеты без второстепенного шума',
          'Понимание следующего рационального шага',
        ],
      },
      {
        name: 'Усиление ключевых страниц',
        price: '30 000 ₽',
        accent: 'Когда оффер есть, но страницы услуг не дотягивают до уровня самой услуги и слабо ведут к заявке.',
        icon: Gem,
        items: [
          'Пересборка ключевых посадочных',
          'Усиление структуры доверия и CTA',
          'Упаковка спроса под реальную конверсию',
        ],
      },
      {
        name: 'Системная работа по росту',
        price: '50 000 ₽',
        accent: 'Когда нужно не одно исправление, а связка из структуры, внедрения, SEO и контроля движения по приоритетам.',
        icon: BarChart3,
        items: [
          'Работа по спринтам и реальным задачам проекта',
          'Новые страницы и усиление текущих шаблонов',
          'Приоритетное сопровождение и контроль внедрения',
        ],
      },
    ],
    soloKicker: 'Формат взаимодействия',
    soloTitle: 'Не студия и не конвейер, а прямой рабочий контакт.',
    soloText:
      'Если нужен взрослый сайт под SEO и заявки, часто выигрывает не “больше людей в процессе”, а более жёсткая логика приоритизации и один ответственный за картину целиком.',
    soloPoints: [
      'Лично разбираю сайт, спрос, коммерческий слой и точки потери заявки.',
      'Не раздуваю проект большим производственным контуром, если для роста это не нужно.',
      'Сначала исправляю критичное, потом масштабирую. Не наоборот.',
    ],
    fitTitle: 'Кому это подходит лучше всего',
    fitGoodTitle: 'Подходит',
    fitGoodItems: [
      'малому и среднему бизнесу, где нужен прямой рабочий контакт без агентской прослойки',
      'сайтам услуг и B2B-проектам, где важны доверие, логика страницы и качество обращения',
      'проектам после редизайна или серии хаотичных правок, где нужна взрослая пересборка',
    ],
    fitBadTitle: 'Скорее не подойдёт',
    fitBadItems: [
      'если нужен большой производственный контур с несколькими отделами и отдельным аккаунт-менеджером',
      'если задача звучит как “сделайте красиво за пару дней без пересборки смысла и структуры”',
      'если проекту критичнее медийная машина или массовый контент-поток, чем точная работа с сайтом',
    ],
    processTitle: 'Как обычно выглядит работа по этапам',
    processText:
      'Без тумана и “вечной подготовки”. На каждом этапе понятно, что проверяется, что делается и что это должно улучшить.',
    processBlocks: [
      {
        step: '01',
        title: 'Смотрю исходную ситуацию',
        text: 'Разбираю структуру, страницы услуг, путь к заявке, спрос и технические ограничения проекта.',
      },
      {
        step: '02',
        title: 'Собираю рабочую очередь задач',
        text: 'Фиксирую, что нужно делать сейчас, что позже, а что вообще не даст заметного эффекта в текущем состоянии сайта.',
      },
      {
        step: '03',
        title: 'Дорабатываю сайт по приоритету',
        text: 'Правлю страницы, логику блоков, структуру и техбазу так, чтобы сайт не только рос, но и выглядел взрослее и убедительнее.',
      },
    ],
    trustTitle: 'Документы доверия и открытый рабочий контур',
    trustText:
      'Если хотите понять, как принимаются решения и на чём держится качество рекомендаций, лучше смотреть не обещания, а методологию, политику и страницу о подходе.',
    casesTitle: 'Кейсы, где видно не только цифры, но и логику изменений',
    casesLink: 'Открыть кейсы',
    caseLabel: 'Кейс',
    caseFallback:
      'Разбор проекта, где видно, что менялось в структуре, страницах и логике сайта, а не только итоговый график.',
    caseEmptyTitle: 'Кейсы скоро пополнятся новыми разборами',
    caseEmptyText:
      'Здесь будут проекты, где можно посмотреть не только результат, но и ход работы: что было сломано, что менялось и почему именно так.',
    openCase: 'Смотреть кейс',
    blogTitle: 'Материалы, которые помогают принять решение до старта',
    blogLink: 'Перейти в блог',
    blogCardKicker: 'Материал',
    blogFallback:
      'Практический материал о структуре сайта, миграциях, GEO, AI-выдаче и коммерческих страницах.',
    blogEmptyTitle: 'Здесь будут материалы по взрослой переработке сайта',
    blogEmptyText:
      'В блоге собираются не абстрактные заметки, а разборы конкретных решений по структуре, SEO и заявочному слою сайта.',
    reviewsTitle: 'Отзывы по реальным рабочим задачам',
    reviewsEmptyTitle: 'Блок отзывов ещё пополняется',
    reviewsEmptyText:
      'Когда новые отзывы будут добавлены, здесь останутся только конкретные задачи, а не шаблонные похвалы “всё понравилось”.',
    contactTitle: 'Можно начать с короткого разбора сайта',
    contactText:
      'От вас нужен домен и короткое описание задачи. В ответе скажу, где сайт теряет силу, что мешает заявке и с какого шага логичнее начать.',
    contactPromises: [
      {
        icon: Clock3,
        title: 'Отвечаю сам',
        text: 'Без sales-менеджера, без длинной переписки по скрипту и без “мы передали коллегам”.',
      },
      {
        icon: ShieldCheck,
        title: 'Даю конкретный первый шаг',
        text: 'Если нужен аудит — скажу аудит. Если проблема в страницах или техбазе — скажу это прямо.',
      },
      {
        icon: CheckCircle2,
        title: 'Без лишнего процесса',
        text: 'Только то, что помогает проекту стать сильнее визуально, структурно и коммерчески.',
      },
    ],
  },
  en: {
    metadata: {
      title: 'Independent SEO consultant for service websites and B2B | Shelpakov Digital',
      description:
        'Independent SEO consultant for small and mid-size projects: audits, site structure, key pages, technical foundations, and stronger lead flow from search.',
      keywords:
        'independent seo consultant, seo freelancer, seo for service websites, b2b seo consultant, technical seo, website redesign for lead generation',
    },
    heroChip: 'Independent SEO consultant',
    heroTitle:
      'I rebuild service websites so they look more credible, explain the offer better, and generate stronger inquiries from search.',
    heroText:
      'I work with small and mid-size projects: audits, structure, key pages, technical foundations, and the path to inquiry. No agency handoff chain, no decorative fixes for reporting, and no inflated process for its own sake.',
    primaryCta: 'Get a website review',
    secondaryCta: 'View case studies',
    heroBadges: ['Small and mid-size business', 'Direct project ownership', 'Focused on lead quality'],
    heroMetrics: [
      {
        value: 'One accountable specialist',
        label: 'Strategy, priorities, and key decisions are not diluted across managers and departments.',
      },
      {
        value: 'No unnecessary scope',
        label: 'The work starts from the layer that is actually blocking growth, not from the biggest package.',
      },
      {
        value: 'Website as an asset',
        label: 'The goal is not just traffic, but a site that presents the service credibly and moves people toward inquiry.',
      },
    ],
    heroPanels: [
      {
        title: 'A good fit when',
        items: [
          'the website exists but looks weaker than the service behind it',
          'traffic is present but inquiries stay weak or unstable',
          'you need clarity on what to fix first: structure, pages, or technical foundations',
        ],
      },
      {
        title: 'How I work',
        items: [
          'I review the site, demand, and commercial layer personally',
          'I do not sell magic timelines or padded process',
          'the output is a practical priority queue that can actually be implemented',
        ],
      },
    ],
    problemsKicker: 'What usually breaks the result',
    problemsTitle: 'The issue is rarely one piece of copy or one technical error.',
    problemsText:
      'Most service websites lose inquiries at the intersection of multiple layers: poor demand separation, weak service pages, an unclear next step, and technical foundations that slow down growth.',
    problemCards: [
      {
        icon: FileText,
        title: 'Pages do not explain the value clearly',
        text: 'A visitor sees generic statements but still cannot tell why this service is worth the next step here and now.',
      },
      {
        icon: LineChart,
        title: 'The wrong priorities were chosen',
        text: 'The team keeps touching everything at once, while the main constraint remains untouched.',
      },
      {
        icon: BarChart3,
        title: 'The website cannot support serious positioning',
        text: 'Structure, templates, and the visual layer are too weak to support a more credible and conversion-ready presentation.',
      },
    ],
    formatsKicker: 'Working formats',
    formatsTitle: 'You can start from the right layer, not from the highest retainer.',
    formatsText:
      'If the project needs diagnosis first, we start with diagnosis. If the bottleneck is already obvious, the work can go directly into key pages, technical cleanup, or ongoing structured execution.',
    packages: [
      {
        name: 'Review and implementation roadmap',
        price: 'from ₽15,000',
        accent: 'When the first need is clarity on where the website is losing inquiries and what should be fixed first.',
        icon: Rocket,
        items: [
          'Audit of structure, indexation, and key pages',
          'A clean priority map without secondary noise',
          'A rational next-step recommendation',
        ],
      },
      {
        name: 'Key-page strengthening',
        price: 'from ₽30,000',
        accent: 'When the offer exists, but the service pages are not strong enough to support trust and inquiry intent.',
        icon: Gem,
        items: [
          'Rebuild of the most important landing pages',
          'Stronger trust structure and calls to action',
          'Demand capture aligned with conversion logic',
        ],
      },
      {
        name: 'Systematic growth work',
        price: 'from ₽50,000',
        accent: 'When the project needs more than a one-off fix and requires an ongoing loop across structure, implementation, and SEO priorities.',
        icon: BarChart3,
        items: [
          'Sprint-based work on real project priorities',
          'New pages and stronger existing templates',
          'Priority support with implementation control',
        ],
      },
    ],
    soloKicker: 'Working model',
    soloTitle: 'Not a studio and not a conveyor belt, but direct working contact.',
    soloText:
      'For a serious website, what often matters most is not more people in the process, but tighter prioritization and one person who keeps the whole picture coherent.',
    soloPoints: [
      'I review the website, demand, commercial logic, and inquiry bottlenecks personally.',
      'I do not inflate the delivery setup if the business does not benefit from it.',
      'Critical fixes come first. Scaling comes second.',
    ],
    fitTitle: 'Who this works best for',
    fitGoodTitle: 'Good fit',
    fitGoodItems: [
      'small and mid-size businesses that want direct working contact without agency layers',
      'service websites and B2B projects where trust, page logic, and lead quality matter',
      'projects after a weak redesign or a long series of chaotic edits',
    ],
    fitBadTitle: 'Probably not the best fit',
    fitBadItems: [
      'if you need a large production setup with multiple departments and a separate account manager',
      'if the task is basically “make it prettier in two days” without rebuilding structure and messaging',
      'if the project needs a broad media machine more than precise website work',
    ],
    processTitle: 'How the work usually moves',
    processText:
      'No foggy preparation phase and no endless circulation. Each stage has a clear purpose, clear output, and a concrete expectation for what should improve next.',
    processBlocks: [
      {
        step: '01',
        title: 'I assess the current state',
        text: 'I review the structure, service pages, path to inquiry, search demand, and technical constraints of the project.',
      },
      {
        step: '02',
        title: 'I build the actual task queue',
        text: 'The plan separates what needs fixing now, what can wait, and what is unlikely to move the result in the current state.',
      },
      {
        step: '03',
        title: 'I strengthen the website by priority',
        text: 'Pages, block logic, structure, and technical foundations are improved so the site looks more credible and is easier to scale.',
      },
    ],
    trustTitle: 'Trust pages and an open working frame',
    trustText:
      'If you want to understand how decisions are made and why the recommendations can be trusted, the best place to look is the methodology, editorial policy, and approach pages.',
    casesTitle: 'Case studies that show both the numbers and the logic behind the changes',
    casesLink: 'Open case studies',
    caseLabel: 'Case study',
    caseFallback:
      'A breakdown showing what changed in structure, pages, and website logic instead of showing only a final chart.',
    caseEmptyTitle: 'New case studies will appear here',
    caseEmptyText:
      'This section is meant to show not just outcomes, but the sequence of decisions: what was broken, what changed, and why.',
    openCase: 'View case study',
    blogTitle: 'Reading that helps make a decision before the work starts',
    blogLink: 'Go to the blog',
    blogCardKicker: 'Article',
    blogFallback:
      'A practical article on site structure, migrations, GEO, AI search, and commercial pages.',
    blogEmptyTitle: 'This section will collect practical website decisions',
    blogEmptyText:
      'The goal is not generic blogging, but specific material on structure, SEO, conversion layers, and stronger service pages.',
    reviewsTitle: 'Feedback tied to real project work',
    reviewsEmptyTitle: 'The review block is still growing',
    reviewsEmptyText:
      'When new reviews appear, the focus stays on the real task and the business context rather than generic praise.',
    contactTitle: 'You can start with a short website review',
    contactText:
      'A domain and a short problem description are enough. I will reply with where the site is losing strength, what blocks inquiries, and what the rational first step looks like.',
    contactPromises: [
      {
        icon: Clock3,
        title: 'Direct reply',
        text: 'No sales handoff, no scripted discovery chain, and no internal forwarding loops.',
      },
      {
        icon: ShieldCheck,
        title: 'A concrete first step',
        text: 'If the right start is an audit, I will say audit. If the problem is pages or technical foundations, I will say that directly.',
      },
      {
        icon: CheckCircle2,
        title: 'No padded process',
        text: 'Only what helps the project become stronger visually, structurally, and commercially.',
      },
    ],
  },
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
      {children}
    </span>
  )
}

export default async function HomePage() {
  const locale = await getRequestLocale()
  const copy = homeCopy[locale]
  const trustLinks = getTrustLinks(locale)

  let reviews: any[] = []
  let cases: any[] = []
  let posts: any[] = []

  try {
    reviews = await prisma.review.findMany({ orderBy: { order: 'asc' }, take: 3 })
    cases = await prisma.case.findMany({ orderBy: { order: 'asc' }, take: 2 })
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }

  reviews = buildLocalizedReviewListing(reviews, locale)
  posts = buildLocalizedBlogListing(posts, locale).slice(0, 3)

  const featuredCases = buildCaseListing(cases)
    .slice(0, 2)
    .map((caseItem) => localizeCaseRecord(caseItem, locale))
    .filter((caseItem) => (locale === 'en' ? !hasRussianCaseContent(caseItem) : true))

  return (
    <div className="overflow-hidden pb-16 md:pb-24">
      <section className="section-shell-tight !pb-8 !pt-5 md:!pb-12 md:!pt-8">
        <div className="hero-panel hero-sheen relative overflow-hidden rounded-[38px] border border-slate-200 px-5 py-6 md:px-8 md:py-8 xl:px-10 xl:py-10">
          <div className="hero-grid-mask" />
          <div className="hidden" aria-hidden="true">
            {verificationCode}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:gap-10">
            <div>
              <SectionEyebrow>{copy.heroChip}</SectionEyebrow>

              <h1 className="mt-5 max-w-[920px] text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-slate-950">
                {copy.heroTitle}
              </h1>

              <p className="mt-5 max-w-[780px] text-[1rem] leading-8 text-slate-600 md:text-[1.08rem]">
                {copy.heroText}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {copy.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>

                <Link
                  href={prefixPathWithLocale('/cases', locale)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-950 hover:bg-slate-50"
                >
                  {copy.secondaryCta}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {copy.heroBadges.map((badge: string) => (
                  <span
                    key={badge}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {copy.heroMetrics.map((metric: any) => (
                  <div
                    key={metric.value}
                    className="rounded-[26px] border border-slate-200 bg-white px-4 py-4 shadow-[0_18px_36px_rgba(15,23,42,0.06)]"
                  >
                    <div className="text-[1.05rem] font-semibold tracking-[-0.03em] text-slate-950">{metric.value}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {copy.heroPanels.map((panel: any) => (
                <div
                  key={panel.title}
                  className="rounded-[30px] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_44px_rgba(15,23,42,0.07)]"
                >
                  <h2 className="text-[1.35rem] font-semibold tracking-[-0.035em] text-slate-950">{panel.title}</h2>
                  <ul className="mt-5 space-y-3">
                    {panel.items.map((item: string) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-950" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
          <div className="surface-grid surface-pad">
            <SectionEyebrow>{copy.problemsKicker}</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950">
              {copy.problemsTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-slate-600">{copy.problemsText}</p>
          </div>

          <div className="uniform-grid-3">
            {copy.problemCards.map((item: any) => {
              const Icon = item.icon

              return (
                <div key={item.title} className="glass-panel interactive-card p-7">
                  <Icon className="h-8 w-8 text-slate-950" />
                  <h3 className="mt-5 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-signal surface-pad">
          <SectionEyebrow>{copy.formatsKicker}</SectionEyebrow>
          <div className="mt-4 grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
            <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950">
              {copy.formatsTitle}
            </h2>
            <p className="max-w-2xl text-[0.98rem] leading-8 text-slate-600 xl:justify-self-end">
              {copy.formatsText}
            </p>
          </div>

          <div className="uniform-grid-3 mt-8">
            {copy.packages.map((pkg: any) => {
              const Icon = pkg.icon

              return (
                <div key={pkg.name} className="glass-panel p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{pkg.price}</span>
                  </div>

                  <h3 className="mt-6 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950">
                    {pkg.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{pkg.accent}</p>

                  <ul className="mt-6 space-y-3">
                    {pkg.items.map((item: string) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-950" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ServicesCatalogSection compact />

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="surface-grid surface-pad">
            <SectionEyebrow>{copy.soloKicker}</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950">
              {copy.soloTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-8 text-slate-600">{copy.soloText}</p>

            <ul className="mt-8 space-y-4">
              {copy.soloPoints.map((point: string) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-slate-600">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-950" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.035em] text-slate-950">{copy.fitTitle}</h3>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-semibold text-slate-950">{copy.fitGoodTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {copy.fitGoodItems.map((item: string) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-950" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_22px_42px_rgba(15,23,42,0.16)]">
                <h3 className="text-lg font-semibold">{copy.fitBadTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {copy.fitBadItems.map((item: string) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-slate-200">
                      <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="surface-grid surface-pad">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <h2 className="max-w-3xl text-[clamp(1.85rem,3.5vw,2.85rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-slate-950">
                {copy.processTitle}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 lg:text-right">{copy.processText}</p>
            </div>

            <div className="mt-7 grid gap-4">
              {copy.processBlocks.map((block: any) => (
                <div key={block.step} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)] md:p-6">
                  <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
                    <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {block.step}
                    </div>
                    <div>
                      <h3 className="text-[1.3rem] font-semibold tracking-[-0.03em] text-slate-950">{block.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{block.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-[1.5rem] font-semibold tracking-[-0.035em] text-slate-950">{copy.trustTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{copy.trustText}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {trustLinks.links.map((item) => (
                  <Link
                    key={item.href}
                    href={prefixPathWithLocale(item.href, locale)}
                    className="group rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-slate-950/12 hover:shadow-[0_22px_42px_rgba(15,23,42,0.1)]"
                  >
                    <h4 className="text-lg font-semibold leading-[1.15] text-slate-950">{item.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                      {locale === 'ru' ? 'Открыть' : 'Open'}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
            <h2 className="max-w-[860px] text-[clamp(1.85rem,3.5vw,2.95rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-slate-950">
              {copy.casesTitle}
            </h2>
            <Link href={prefixPathWithLocale('/cases', locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-slate-700">
              {copy.casesLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {featuredCases.length > 0 ? (
              featuredCases.map((item, index) => {
                const cover = getCaseCover(item)
                const showCover = canUseHomepageCardCover(cover)

                const content = (
                  <>
                    {showCover ? (
                      <div className="px-5 pt-5 md:px-6 md:pt-6">
                        <div className="relative h-44 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
                          <Image
                            src={cover!}
                            alt={item.title || copy.caseLabel}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            unoptimized={isInlineImageAsset(cover!)}
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {`${copy.caseLabel} ${index + 1}`}
                      </span>
                      <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 md:text-[1.7rem]">
                        {item.title}
                      </h3>
                      <p
                        className="mt-3 flex-1 text-[0.96rem] leading-7 text-slate-600"
                        style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {item.description || item.content || copy.caseFallback}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                        {copy.openCase}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </>
                )

                return item.slug ? (
                  <Link
                    key={item.id}
                    href={prefixPathWithLocale(`/cases/${item.slug}`, locale)}
                    className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_52px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-slate-950/12 hover:shadow-[0_28px_62px_rgba(15,23,42,0.12)]"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={item.id}
                    className="flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_52px_rgba(15,23,42,0.08)]"
                  >
                    {content}
                  </div>
                )
              })
            ) : (
              <div className="glass-panel p-8 lg:col-span-2">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.caseEmptyTitle}</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{copy.caseEmptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
            <h2 className="max-w-[860px] text-[clamp(1.85rem,3.5vw,2.95rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-slate-950">
              {copy.blogTitle}
            </h2>
            <Link href={prefixPathWithLocale('/blog', locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-slate-700">
              {copy.blogLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => {
                const cover = getBlogCover(post)
                const showCover = canUseHomepageCardCover(cover)

                return (
                  <Link
                    key={post.id}
                    href={prefixPathWithLocale(`/blog/${post.slug}`, locale)}
                    className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-slate-950/12 hover:shadow-[0_26px_58px_rgba(15,23,42,0.12)]"
                  >
                    {showCover ? (
                      <div className="px-5 pt-5 md:px-6 md:pt-6">
                        <div className="relative h-40 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100">
                          <Image
                            src={cover!}
                            alt={post.title || copy.blogCardKicker}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            unoptimized={isInlineImageAsset(cover!)}
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {copy.blogCardKicker}
                      </span>
                      <h3 className="mt-3 text-[1.25rem] font-semibold leading-[1.12] tracking-[-0.03em] text-slate-950 md:text-[1.45rem]">
                        {post.title}
                      </h3>
                      <p
                        className="mt-3 flex-1 text-[0.95rem] leading-7 text-slate-600"
                        style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {post.excerpt || copy.blogFallback}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                        {locale === 'ru' ? 'Открыть материал' : 'Open article'}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="glass-panel p-7 md:col-span-2 xl:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.blogEmptyTitle}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy.blogEmptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
            <h2 className="max-w-[860px] text-[clamp(1.85rem,3.5vw,2.95rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-slate-950">
              {copy.reviewsTitle}
            </h2>
            <div className="text-sm leading-7 text-slate-500">
              {locale === 'ru' ? 'Без шаблонной похвалы и общих формулировок.' : 'No generic praise and no vague marketing language.'}
            </div>
          </div>

          <div className="uniform-grid-3 mt-7">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="glass-panel p-7">
                  <div className="text-base font-semibold text-slate-950">{review.author}</div>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{review.text}</p>
                  {(review.company || review.position) && (
                    <div className="mt-6 text-sm text-slate-400">
                      {[review.company, review.position].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-2 xl:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.reviewsEmptyTitle}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy.reviewsEmptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact-form" className="scroll-mt-32 section-shell">
        <div className="surface-grid p-4 md:p-6">
          <div className="soft-section grid gap-0 overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-slate-200 p-5 sm:p-8 lg:border-b-0 lg:border-r">
              <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-slate-950">
                {copy.contactTitle}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>

              <div className="mt-8 grid gap-4">
                {copy.contactPromises.map((item: any) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="text-base font-semibold text-slate-950">{item.title}</div>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <LazyContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() {
  const locale = await getRequestLocale()
  const copy = homeCopy[locale]

  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
  } catch (error) {
    page = null
  }

  const localizedPage = locale === 'ru' ? page : null
  const alternates = getLocaleAlternates('/')
  const title = normalizeMetaTitle(localizedPage?.title, copy.metadata.title)
  const description = normalizeMetaDescription(localizedPage?.description, copy.metadata.description)

  return {
    title,
    description,
    keywords: localizedPage?.keywords || copy.metadata.keywords,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    },
  }
}
