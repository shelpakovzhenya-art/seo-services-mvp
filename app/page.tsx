import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Clock3,
  FileText,
  Gem,
  LineChart,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { buildCaseListing } from '@/lib/case-listing'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { Button } from '@/components/ui/button'
import LazyContactForm from '@/components/LazyContactForm'
import ServicesCatalogSection from '@/components/services/ServicesCatalogSection'

const verificationCode = 'yilk8rn94r0d3m5v'

const homeCopy: Record<Locale, any> = {
  ru: {
    metadata: {
      title: 'SEO-продвижение сайтов под заявки | Shelpakov Digital',
      description:
        'SEO-продвижение, аудит и доработка структуры сайта под заявки, доверие и рост органического трафика для услуг, B2B-проектов и локального бизнеса.',
      keywords:
        'seo продвижение сайтов, seo аудит, техническое seo, коммерческие факторы, рост заявок, органический трафик',
    },
    heroChip: 'SEO-продвижение под заявки',
    heroTitle: 'SEO и структура сайта, которые помогают получать больше обращений, а не просто расти по позициям.',
    heroText:
      'Помогаю бизнесу усиливать сайт под поиск и под клиента: дорабатываю ключевые страницы, оффер, структуру, коммерческие факторы и логику заявки, чтобы органика становилась каналом роста.',
    primaryCta: 'Получить разбор сайта',
    secondaryCta: 'Посмотреть кейсы',
    heroBadges: ['Быстрый ответ по заявке', 'План работ после созвона', 'Фокус на заявках и доверии'],
    trustMetrics: [
      { value: 'Трафик и заявки', label: 'Поисковый рост должен приводить не только к визитам, но и к обращениям в бизнес.' },
      { value: 'Услуги и B2B', label: 'Особенно полезно там, где клиенту важно доверие, экспертность и понятный следующий шаг.' },
      { value: 'Понятный план', label: 'После старта проекта есть приоритеты, логика внедрения и список точек роста.' },
    ],
    approachKicker: 'Подход к проекту',
    approachTitle: 'Сайт должен быть убедительным и для поиска, и для клиента',
    approachText:
      'Поэтому работа строится вокруг связки: спрос, структура, коммерческие блоки, тексты, доверие и путь к заявке.',
    advantageCards: [
      { icon: FileText, title: 'Аудит без воды', text: 'Сначала показываю, где сайт реально теряет потенциал, а не перегружаю второстепенными замечаниями.' },
      { icon: LineChart, title: 'Фокус на результате', text: 'Работа строится вокруг органики, доверия и конверсии, а не вокруг формального списка SEO-действий.' },
      { icon: BarChart3, title: 'Системный подход', text: 'Структура, контент, техническая база и подача сайта собираются в одну рабочую систему роста.' },
    ],
    decisionKicker: 'С чего начинать',
    decisionTitle: 'Три частые развилки, на которых бизнес обычно теряет время и бюджет',
    decisionText:
      'На практике главная ошибка не в том, что проект покупает “не ту услугу”, а в том, что он начинает слишком широко или слишком поздно трогает корневую проблему.',
    decisionCards: [
      {
        title: 'Сначала аудит, а не месячное сопровождение',
        text: 'Если непонятно, где именно сайт теряет рост, логичнее сначала получить карту проблем и приоритетов, а не сразу подписываться на широкий пул задач.',
        href: '/services/seo-audit',
        cta: 'Смотреть SEO-аудит',
      },
      {
        title: 'Сначала техбаза, а не ещё один текстовый слой',
        text: 'Если индекс ломается, шаблоны шумят, а после редизайна сайт ведёт себя нестабильно, технический слой даст больше эффекта, чем новая пачка контента.',
        href: '/services/technical-seo',
        cta: 'Смотреть technical SEO',
      },
      {
        title: 'Сначала перезапуск сайта, а не бесконечные косметические правки',
        text: 'Если площадка слабо упаковывает услугу, не ведёт к заявке и тяжело масштабируется, правильнее пересобрать базу, чем латать её ещё полгода.',
        href: '/services/website-development',
        cta: 'Смотреть разработку',
      },
    ],
    packageKicker: 'Рабочие форматы',
    packageTitle: 'Не “тарифы ради тарифа”, а логичные сценарии старта',
    packageText: 'Каждый формат отвечает на разный уровень зрелости проекта: от диагностики до системного роста без лишнего объёма в первый месяц.',
    packages: [
      { name: 'Диагностика и приоритеты', price: '15 000 ₽', accent: 'Когда сначала нужно увидеть узкие места сайта, а не покупать широкое сопровождение вслепую.', icon: Rocket, items: ['SEO-аудит с приоритетами внедрения', 'Проверка индексации, структуры и ключевых страниц', 'Список быстрых правок без фонового шума', 'Решение: что делать следующим этапом, а что не делать'] },
      { name: 'Усиление ключевых страниц', price: '30 000 ₽', accent: 'Когда сайт уже живой, но упирается в слабую упаковку услуг, сценарии заявки и недоработанные посадочные.', icon: Gem, items: ['Всё из сценария диагностики', 'Сбор приоритетной семантики и кластеров', 'Доработка ключевых страниц услуг', 'Усиление коммерческих факторов, CTA и структуры доверия'] },
      { name: 'Системный рост', price: '50 000 ₽', accent: 'Когда нужен не разовый разбор, а постоянная связка из структуры, контента, SEO и внедрения под органический канал.', icon: BarChart3, items: ['Всё из сценария усиления', 'Расширение структуры и новых посадочных', 'Контентные и продуктовые гипотезы', 'Приоритетное сопровождение и контроль внедрения'] },
    ],
    packageButton: 'Выбрать тариф',
    industryKicker: 'Кому особенно полезно',
    industryTitle: 'Если сайт уже есть, но работает слабее, чем должен',
    industryBlocks: ['Сайты услуг, где трафик есть, а заявок мало.', 'B2B-проекты с длинным циклом принятия решения.', 'Локальный бизнес с плотной конкуренцией в выдаче.', 'Проекты, которым нужен более сильный и дорогой образ.'],
    processBlocks: [
      { step: '01', title: 'Разбираю спрос и текущее состояние сайта', text: 'Смотрю структуру, ключевые страницы, коммерческие блоки и путь пользователя до заявки.' },
      { step: '02', title: 'Собираю рабочий план', text: 'Фиксирую приоритеты: что исправить срочно, что усилить следующим этапом и куда не тратить ресурсы.' },
      { step: '03', title: 'Дорабатываю сайт под рост', text: 'Усиливаю страницы, тексты, доверие и SEO-основу так, чтобы сайт выглядел и работал сильнее.' },
    ],
    casesKicker: 'Кейсы',
    casesTitle: 'Примеры проектов, где сайт стал сильнее',
    casesLink: 'Открыть кейсы',
    caseLabel: 'Кейс',
    caseFallback: 'Разбор проекта, в котором доработка структуры, контента и ключевых страниц усилила органический потенциал сайта.',
    caseEmptyTitle: 'Кейсы с разбором задачи, работ и результата',
    caseEmptyText: 'Здесь публикуются проекты, в которых видно, как структура сайта, SEO и коммерческие факторы влияют на трафик, заявки и стоимость обращения.',
    openCase: 'Открыть кейс',
    blogKicker: 'Блог',
    blogTitle: 'Материалы, которые усиливают экспертность сайта',
    blogLink: 'Перейти в блог',
    blogCardKicker: 'Материал',
    blogFallback: 'Материал, который помогает клиенту лучше понять подход, ошибки и точки роста сайта.',
    blogEmptyTitle: 'Блог усиливает доверие и поисковое покрытие',
    blogEmptyText: 'Здесь лучше всего работают экспертные материалы: разборы ошибок, практика по SEO и ответы на частые вопросы клиентов.',
    reviewsKicker: 'Отзывы',
    reviewsTitle: 'Подтверждение, которое работает на доверие',
    reviewsEmptyTitle: 'Отзывы клиентов и рабочий контекст проекта',
    reviewsEmptyText: 'Лучше всего этот блок работает, когда в нём есть реальные отзывы с именем, компанией и коротким описанием задачи, которую нужно было решить.',
    contactKicker: 'Следующий шаг',
    contactTitle: 'Оставьте заявку, и я подготовлю разбор сайта',
    contactText: 'Покажу, что мешает росту, где сайт недожимает по заявкам и с каких изменений логичнее начать.',
    contactFastTitle: 'Быстрая обратная связь',
    contactFastText: 'Обычно отвечаю в течение дня после заявки.',
    contactConcreteTitle: 'Конкретные выводы',
    contactConcreteText: 'Без общих фраз: только понятные точки роста и следующий шаг.',
  },
  en: {
    metadata: {
      title: 'SEO for lead growth | Shelpakov Digital',
      description:
        'SEO strategy, audits, and site structure improvements built to increase qualified inquiries, trust, and organic growth for service businesses, B2B brands, and local companies.',
      keywords: 'seo services, seo audit, technical seo, conversion-focused seo, lead growth, organic traffic',
    },
    heroChip: 'SEO built for lead generation',
    heroTitle: 'SEO and site structure that help you win more inquiries, not just better rankings.',
    heroText:
      'I help businesses strengthen their websites for both search and the client journey: refining key pages, the offer, structure, commercial signals, and conversion logic so organic traffic becomes a real growth channel.',
    primaryCta: 'Get a website review',
    secondaryCta: 'View case studies',
    heroBadges: ['Fast response to new inquiries', 'Clear action plan after the call', 'Focused on leads and trust'],
    trustMetrics: [
      { value: 'Traffic and leads', label: 'Search growth should lead not only to visits, but to real business conversations.' },
      { value: 'Services and B2B', label: 'Especially valuable where trust, expertise, and a clear next step shape the buying decision.' },
      { value: 'Clear roadmap', label: 'Every project starts with priorities, delivery logic, and a defined list of growth opportunities.' },
    ],
    approachKicker: 'Approach',
    approachTitle: 'A website should be convincing for both search engines and real clients',
    approachText: 'That is why the work is built around a connected system: demand, structure, commercial blocks, copy, trust, and the path to conversion.',
    advantageCards: [
      { icon: FileText, title: 'No-noise audits', text: 'I show where the website is genuinely losing momentum instead of overwhelming the project with secondary remarks.' },
      { icon: LineChart, title: 'Outcome-driven work', text: 'The process is built around organic growth, trust, and conversion, not a checklist of formal SEO tasks.' },
      { icon: BarChart3, title: 'System thinking', text: 'Structure, content, technical foundations, and presentation are assembled into one working growth system.' },
    ],
    decisionKicker: 'Where to start',
    decisionTitle: 'Three common forks where teams usually lose time and budget',
    decisionText:
      'The most expensive mistake is rarely choosing the wrong service entirely. It is starting too wide or touching the visible symptom instead of the real bottleneck.',
    decisionCards: [
      {
        title: 'Start with an audit, not a broad monthly retainer',
        text: 'If it is still unclear where the website is losing momentum, a diagnostic map with priorities is stronger than jumping into a wide support plan blindly.',
        href: '/services/seo-audit',
        cta: 'View SEO audit',
      },
      {
        title: 'Start with technical foundations, not another layer of copy',
        text: 'If indexation is unstable, templates create noise, or the site became fragile after a redesign, technical work will outperform another round of generic content.',
        href: '/services/technical-seo',
        cta: 'View technical SEO',
      },
      {
        title: 'Start with a relaunch, not endless cosmetic fixes',
        text: 'If the platform no longer presents the offer well, fails to guide users to inquiry, and resists expansion, rebuilding the base is the more rational move.',
        href: '/services/website-development',
        cta: 'View development',
      },
    ],
    packageKicker: 'Working formats',
    packageTitle: 'Not “packages for the sake of packages”, but practical entry scenarios',
    packageText: 'Each format matches a different stage of project maturity: from diagnosis to ongoing growth without unnecessary scope inflation on month one.',
    packages: [
      { name: 'Diagnosis and priorities', price: 'from ₽15,000', accent: 'When the first need is to see the real bottlenecks instead of buying broad support blindly.', icon: Rocket, items: ['SEO audit with implementation priorities', 'Indexation, structure, and key-page review', 'Quick wins without background noise', 'Decision on the most rational next step'] },
      { name: 'Key-page strengthening', price: 'from ₽30,000', accent: 'When the site is live, but its service pages, demand capture, and commercial presentation are underperforming.', icon: Gem, items: ['Everything from the diagnostic scenario', 'Priority keyword clustering', 'Improvement of core service pages', 'Stronger commercial signals and CTA structure'] },
      { name: 'System growth', price: 'from ₽50,000', accent: 'When the project needs a recurring growth loop across structure, content, SEO, and implementation.', icon: BarChart3, items: ['Everything from the key-page scenario', 'Structure expansion and new landing pages', 'Content and positioning hypotheses', 'Priority support and implementation control'] },
    ],
    packageButton: 'Choose a package',
    industryKicker: 'Best fit',
    industryTitle: 'When the site already exists, but is performing below its potential',
    industryBlocks: ['Service websites that already get traffic but too few inquiries.', 'B2B projects with a long and complex decision cycle.', 'Local businesses competing in crowded search results.', 'Projects that need a stronger and more premium digital image.'],
    processBlocks: [
      { step: '01', title: 'I assess demand and the current state of the site', text: 'I review the structure, key pages, commercial blocks, and the user path toward a lead.' },
      { step: '02', title: 'I assemble a working roadmap', text: 'We lock priorities: what needs urgent fixing, what should be strengthened next, and where resources should not be wasted.' },
      { step: '03', title: 'I refine the site for growth', text: 'I strengthen pages, copy, trust signals, and SEO foundations so the website looks sharper and performs better.' },
    ],
    casesKicker: 'Case studies',
    casesTitle: 'Examples of projects where the website became stronger',
    casesLink: 'Open case studies',
    caseLabel: 'Case study',
    caseFallback: 'A project breakdown showing how structural work, better content, and stronger key pages improved organic potential.',
    caseEmptyTitle: 'Case studies with task, implementation, and outcome',
    caseEmptyText: 'This section features projects where you can clearly see how site structure, SEO, and commercial signals influence traffic, leads, and acquisition efficiency.',
    openCase: 'Open case study',
    blogKicker: 'Blog',
    blogTitle: 'Articles that strengthen your website’s expert positioning',
    blogLink: 'Go to the blog',
    blogCardKicker: 'Article',
    blogFallback: 'A practical article that helps clients better understand the approach, mistakes, and growth points of a website.',
    blogEmptyTitle: 'The blog reinforces trust and search visibility',
    blogEmptyText: 'Expert content works especially well here: practical SEO notes, breakdowns of common mistakes, and answers to recurring client questions.',
    reviewsKicker: 'Reviews',
    reviewsTitle: 'Proof that supports trust',
    reviewsEmptyTitle: 'Client reviews and working context',
    reviewsEmptyText: 'This section works best when it includes real feedback with a name, company, and a brief description of the task that had to be solved.',
    contactKicker: 'Next step',
    contactTitle: 'Send a request and I will prepare a website review',
    contactText: 'I will show what is blocking growth, where the site is underperforming on leads, and which changes make the most sense to start with.',
    contactFastTitle: 'Fast feedback',
    contactFastText: 'I usually reply within one business day after a request.',
    contactConcreteTitle: 'Clear conclusions',
    contactConcreteText: 'No vague talk, only understandable growth points and a sensible next step.',
  },
}

export default async function HomePage() {
  const locale = await getRequestLocale()
  const copy = homeCopy[locale]

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

  const featuredCases = buildCaseListing(cases).slice(0, 2)

  return (
    <div className="overflow-hidden pb-16 md:pb-20">
      <section className="section-grid relative border-b border-white/10">
        <div className="section-shell-tight relative !pb-8 !pt-6 md:!pb-10 md:!pt-8">
          <div className="hero-panel hero-sheen relative overflow-hidden rounded-[32px] border border-white/70 px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-7">
            <div className="hero-grid-mask" />
            <div className="hero-orb float-slow left-[-30px] top-10 h-28 w-28 bg-[radial-gradient(circle,rgba(255,163,102,0.34),rgba(255,163,102,0))]" />
            <div className="hero-orb float-reverse right-10 top-[-16px] h-24 w-24 bg-[radial-gradient(circle,rgba(56,189,248,0.28),rgba(56,189,248,0))]" />
            <div className="hero-orb pulse-glow bottom-8 right-[-20px] h-40 w-40 bg-[radial-gradient(circle,rgba(255,214,153,0.3),rgba(255,214,153,0))]" />
            <div className="hero-fragment drift-right right-[7%] top-[14%] hidden md:flex">
              <span className="hero-fragment-line w-16" />
              <span className="hero-fragment-line w-8" />
            </div>
            <div className="hero-fragment drift-left left-[56%] top-[26%] hidden lg:flex">
              <span className="hero-fragment-dot" />
              <span className="hero-fragment-line w-20" />
            </div>
            <div className="hero-fragment float-slow bottom-[20%] right-[18%] hidden md:flex">
              <span className="hero-fragment-line w-10" />
              <span className="hero-fragment-line w-24" />
            </div>
            <div className="hero-beam drift-right" />

            <div className="relative max-w-none">
              <div className="hidden" aria-hidden="true">
                {verificationCode}
              </div>
              <span className="warm-chip">{copy.heroChip}</span>
              <h1 className="mt-4 max-w-[1100px] text-[clamp(2.15rem,3.4vw,4rem)] font-semibold leading-[0.93] tracking-[-0.045em] text-slate-950">
                {copy.heroTitle}
              </h1>
              <p className="mt-4 max-w-[860px] text-[0.95rem] leading-7 text-slate-600 md:text-[1.02rem] md:leading-7">{copy.heroText}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a href="#contact-form">
                  <Button size="lg" className="rounded-full px-5 py-5 text-sm">
                    {copy.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href={prefixPathWithLocale('/cases', locale)}>
                  <Button size="lg" variant="outline" className="rounded-full border-slate-300 bg-white px-5 py-5 text-sm text-slate-900 hover:bg-slate-50">
                    {copy.secondaryCta}
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-[12px] text-slate-600 md:text-[13px]">
                {copy.heroBadges.map((badge: string) => (
                  <span key={badge} className="rounded-full border border-orange-200 bg-white/90 px-3.5 py-1.5 shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid max-w-[980px] gap-2.5 md:grid-cols-3">
                {copy.trustMetrics.map((metric: any) => (
                  <div key={metric.value} className="rounded-[20px] border border-orange-100 bg-white/82 p-3.5 shadow-[0_18px_35px_rgba(138,103,63,0.06)] backdrop-blur-sm">
                    <div className="text-base font-semibold text-slate-950 md:text-lg">{metric.value}</div>
                    <div className="mt-1 text-[12px] leading-5 text-slate-600 md:text-[13px] md:leading-5">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-tight !pb-10 !pt-4 md:!pb-12 md:!pt-6">
        <div className="surface-signal surface-pad">
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.approachKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.approachTitle}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{copy.approachText}</p>
          </div>

          <div className="uniform-grid-3">
            {copy.advantageCards.map((item: any) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="uniform-card glass-panel interactive-card p-7">
                  <Icon className="h-8 w-8 text-cyan-700" />
                  <h3 className="mt-5 text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.decisionKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.decisionTitle}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{copy.decisionText}</p>
          </div>

          <div className="uniform-grid-3">
            {copy.decisionCards.map((item: any) => (
              <Link key={item.title} href={prefixPathWithLocale(item.href, locale)} className="uniform-card glass-panel interactive-card p-7">
                <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-dawn surface-pad">
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.packageKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.packageTitle}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{copy.packageText}</p>
          </div>

          <div className="uniform-grid-3">
            {copy.packages.map((pkg: any, index: number) => {
              const Icon = pkg.icon
              return (
                <div
                  key={pkg.name}
                  className={`uniform-card interactive-card relative rounded-[30px] border p-7 ${
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
                    <Icon className="h-8 w-8 text-cyan-700" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{pkg.accent}</p>
                  <div className="mt-6 flex-1 space-y-3">
                    {pkg.items.map((item: string) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
                        <span className="text-sm leading-6 text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact-form" className="mt-6">
                    <Button className="w-full rounded-2xl">{copy.packageButton}</Button>
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ServicesCatalogSection compact />

      <section className="section-shell">
        <div className="surface-dawn surface-pad">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="glass-panel interactive-card p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.industryKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{copy.industryTitle}</h2>
              <div className="mt-8 space-y-4">
                {copy.industryBlocks.map((item: string) => (
                  <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {copy.processBlocks.map((item: any) => (
                <div key={item.step} className="glass-panel interactive-card flex flex-col gap-4 p-6 sm:flex-row sm:gap-5">
                  <div className="text-3xl font-semibold text-cyan-700">{item.step}</div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.casesKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.casesTitle}</h2>
            </div>
            <Link href={prefixPathWithLocale('/cases', locale)} className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
              {copy.casesLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="uniform-grid-2">
            {featuredCases.length > 0 ? (
              featuredCases.map((item, index) => {
                const cardContent = (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm uppercase tracking-[0.24em] text-orange-700">{`${copy.caseLabel} ${index + 1}`}</span>
                      <Building2 className="h-5 w-5 text-cyan-700" />
                    </div>
                    <h3 className="mt-6 text-3xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{item.description || item.content || copy.caseFallback}</p>
                    {item.slug ? (
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition group-hover:text-slate-950">
                        {copy.openCase}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    ) : null}
                  </>
                )

                return item.slug ? (
                  <Link key={item.id} href={prefixPathWithLocale(`/cases/${item.slug}`, locale)} className="uniform-card glass-panel interactive-card group block p-8 transition hover:border-cyan-200">
                    {cardContent}
                  </Link>
                ) : (
                  <div key={item.id} className="uniform-card glass-panel interactive-card p-8">
                    {cardContent}
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
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.blogKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.blogTitle}</h2>
            </div>
            <Link href={prefixPathWithLocale('/blog', locale)} className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
              {copy.blogLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="uniform-grid-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={prefixPathWithLocale(`/blog/${post.slug}`, locale)} className="uniform-card glass-panel interactive-card group p-7 transition hover:border-cyan-200">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{copy.blogCardKicker}</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{post.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{post.excerpt || copy.blogFallback}</p>
                </Link>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.blogEmptyTitle}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy.blogEmptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-signal surface-pad">
          <div className="section-heading">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.reviewsKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.reviewsTitle}</h2>
            </div>
          </div>

          <div className="uniform-grid-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="uniform-card glass-panel interactive-card p-7">
                  <div className="text-sm uppercase tracking-[0.24em] text-orange-700">{review.author}</div>
                  <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">{review.text}</p>
                  {(review.company || review.position) && (
                    <div className="mt-6 text-sm text-slate-400">{[review.company, review.position].filter(Boolean).join(', ')}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-panel p-7 md:col-span-3">
                <h3 className="text-2xl font-semibold text-slate-950">{copy.reviewsEmptyTitle}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{copy.reviewsEmptyText}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact-form" className="scroll-mt-32">
        <div className="section-shell">
          <div className="surface-grid p-4 md:p-6">
            <div className="soft-section grid gap-8 overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-orange-100 p-5 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.24em] text-orange-700">{copy.contactKicker}</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                    <div className="flex items-center gap-3 text-slate-900">
                      <Clock3 className="h-5 w-5 text-cyan-700" />
                      <span className="font-medium">{copy.contactFastTitle}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{copy.contactFastText}</p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                    <div className="flex items-center gap-3 text-slate-900">
                      <ShieldCheck className="h-5 w-5 text-cyan-700" />
                      <span className="font-medium">{copy.contactConcreteTitle}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{copy.contactConcreteText}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <LazyContactForm />
              </div>
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

  const alternates = getLocaleAlternates('/')
  const title = normalizeMetaTitle(page?.title, copy.metadata.title)
  const description = normalizeMetaDescription(page?.description, copy.metadata.description)

  return {
    title,
    description,
    keywords: page?.keywords || copy.metadata.keywords,
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
