import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  Gem,
  LineChart,
  Rocket,
} from 'lucide-react'
import { buildCaseListing } from '@/lib/case-listing'
import { buildLocalizedBlogListing } from '@/lib/blog-localization'
import { hasRussianCaseContent, localizeCaseRecord } from '@/lib/case-localization'
import { type Locale, prefixPathWithLocale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { getRequestLocale } from '@/lib/request-locale'
import { buildLocalizedReviewListing } from '@/lib/review-listing'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getLocaleAlternates } from '@/lib/site-url'
import { getTrustLinks } from '@/lib/trust-content'
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
    heroTitle: 'SEO и доработка сайта, чтобы из поиска приходили обращения, а не просто трафик.',
    heroText:
      'Помогаю навести порядок в структуре, ключевых страницах, оффере и технической базе сайта, чтобы органика давала не только визиты, но и понятный поток обращений.',
    primaryCta: 'Получить разбор сайта',
    secondaryCta: 'Посмотреть кейсы',
    heroBadges: ['Ответ по заявке в течение дня', 'Понятный первый шаг', 'Фокус на заявке, а не на отчётности'],
    trustMetrics: [
      { value: 'Трафик и заявки', label: 'Смотрим не только на позиции, но и на страницы, которые реально доводят человека до заявки.' },
      { value: 'Услуги и B2B', label: 'Подходит там, где клиент выбирает долго и ему важно быстро понять, кому можно доверять.' },
      { value: 'Понятный план', label: 'После старта ясно, какие задачи идут первыми, что переносится на потом и что пока не трогаем.' },
    ],
    approachKicker: 'Подход к проекту',
    approachTitle: 'Где сайт обычно теряет и спрос, и заявки',
    approachText:
      'Чаще всего просадка сидит не в одной ошибке, а в связке: структура, слабые посадочные, пустые коммерческие блоки и неочевидный следующий шаг.',
    advantageCards: [
      { icon: FileText, title: 'Сначала критичное', text: 'Сразу видно, какие страницы и шаблоны мешают больше всего, а что можно не трогать прямо сейчас.' },
      { icon: LineChart, title: 'Фокус на ключевых страницах', text: 'Работа идёт не по абстрактному чек-листу, а по тем страницам, где формируется обращение.' },
      { icon: BarChart3, title: 'Без хаотичных правок', text: 'Структура, контент и техбаза приводятся в порядок так, чтобы сайт можно было спокойно развивать дальше.' },
    ],
    trustLayerTitle: 'Что можно посмотреть сразу, чтобы понять подход к работе',
    trustLayerText:
      'Это не второстепенные страницы “для галочки”, а ядро trust-layer: кто отвечает за решения, как принимаются SEO-приоритеты и по каким правилам собирается экспертный контент.',
    trustLayerCta: 'Открыть страницу',
    decisionKicker: 'С чего начинать',
    decisionTitle: 'С какого шага лучше начать',
    decisionText:
      'Обычно деньги теряются не потому, что выбрали совсем не ту услугу, а потому, что начали не с той проблемы.',
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
    packageTitle: 'Форматы работ под разную ситуацию',
    packageText: 'Можно начать с диагностики, точечной переработки страниц или полноценной системной работы. Без лишнего объёма на старте.',
    packages: [
      { name: 'Диагностика и приоритеты', price: '15 000 ₽', accent: 'Когда сначала нужно увидеть узкие места сайта, а не покупать широкое сопровождение вслепую.', icon: Rocket, items: ['SEO-аудит с приоритетами внедрения', 'Проверка индексации, структуры и ключевых страниц', 'Список быстрых правок без фонового шума', 'Решение: что делать следующим этапом, а что не делать'] },
      { name: 'Усиление ключевых страниц', price: '30 000 ₽', accent: 'Когда сайт уже живой, но упирается в слабую упаковку услуг, сценарии заявки и недоработанные посадочные.', icon: Gem, items: ['Всё из сценария диагностики', 'Сбор приоритетной семантики и кластеров', 'Доработка ключевых страниц услуг', 'Усиление коммерческих факторов, CTA и структуры доверия'] },
      { name: 'Системный рост', price: '50 000 ₽', accent: 'Когда нужен не разовый разбор, а постоянная связка из структуры, контента, SEO и внедрения под органический канал.', icon: BarChart3, items: ['Всё из сценария усиления', 'Расширение структуры и новых посадочных', 'Контентные и продуктовые гипотезы', 'Приоритетное сопровождение и контроль внедрения'] },
    ],
    packageButton: 'Выбрать тариф',
    industryKicker: 'Кому особенно полезно',
    industryTitle: 'Кому это обычно подходит',
    industryBlocks: ['Сайты услуг, где трафик есть, а заявок мало.', 'B2B-проекты с длинным циклом принятия решения.', 'Локальный бизнес с плотной конкуренцией в выдаче.', 'Проекты, где сайт выглядит слабее самой услуги.'],
    processBlocks: [
      { step: '01', title: 'Разбираю спрос и текущее состояние сайта', text: 'Смотрю структуру, ключевые страницы, коммерческие блоки и путь пользователя до заявки.' },
      { step: '02', title: 'Собираю рабочий план', text: 'Фиксирую приоритеты: что исправить срочно, что усилить следующим этапом и куда не тратить ресурсы.' },
      { step: '03', title: 'Дорабатываю сайт по приоритетам', text: 'Правлю страницы, сценарии заявки и техбазу так, чтобы сайт было проще развивать и проще продавать.' },
    ],
    casesKicker: 'Кейсы',
    casesTitle: 'Проекты с понятным разбором работ',
    casesLink: 'Открыть кейсы',
    caseLabel: 'Кейс',
    caseFallback: 'Разбор проекта, где видно, что именно меняли в структуре, контенте и ключевых страницах сайта.',
    caseEmptyTitle: 'Кейсы с разбором задачи, работ и результата',
    caseEmptyText: 'Здесь публикуются проекты, в которых видно, как структура сайта, SEO и коммерческие факторы влияют на трафик, заявки и стоимость обращения.',
    openCase: 'Открыть кейс',
    blogKicker: 'Блог',
    blogTitle: 'Что почитать перед запуском работ',
    blogLink: 'Перейти в блог',
    blogCardKicker: 'Материал',
    blogFallback: 'Материал по конкретной проблеме сайта: структура, миграция, GEO, коммерческие страницы или контент.',
    blogEmptyTitle: 'Материалы по структуре, миграциям и спросу',
    blogEmptyText: 'Здесь лучше всего работают статьи, которые помогают разобрать конкретную проблему сайта, а не читать общую теорию.',
    reviewsKicker: 'Отзывы',
    reviewsTitle: 'Отзывы клиентов',
    reviewsEmptyTitle: 'Пока нет блока с отзывами',
    reviewsEmptyText: 'Когда появятся новые отзывы, здесь будут имя, компания и короткая суть задачи без шаблонных похвал.',
    contactKicker: 'Следующий шаг',
    contactTitle: 'Можно прислать сайт на быстрый разбор',
    contactText: 'Достаточно домена и короткого описания задачи. В ответе скажу, где сайт теряет заявки и с чего лучше начинать.',
    contactFastTitle: 'Быстрая обратная связь',
    contactFastText: 'Обычно отвечаю в течение дня после заявки.',
    contactConcreteTitle: 'Конкретные выводы',
    contactConcreteText: 'В ответе будет конкретный первый шаг: аудит, техработы, переработка страниц или перезапуск.',
  },
  en: {
    metadata: {
      title: 'SEO for lead growth | Shelpakov Digital',
      description:
        'SEO strategy, audits, and site structure improvements built to increase qualified inquiries, trust, and organic growth for service businesses, B2B brands, and local companies.',
      keywords: 'seo services, seo audit, technical seo, conversion-focused seo, lead growth, organic traffic',
    },
    heroChip: 'SEO built for lead generation',
    heroTitle: 'SEO and site improvements built to turn search into inquiries, not just traffic.',
    heroText:
      'I help clean up structure, key pages, the offer, and technical foundations so organic search brings actual conversations, not empty visits.',
    primaryCta: 'Get a website review',
    secondaryCta: 'View case studies',
    heroBadges: ['Reply within one business day', 'Clear first step', 'Focused on inquiries, not reporting'],
    trustMetrics: [
      { value: 'Traffic and leads', label: 'The focus is not just rankings, but the pages that actually move a person toward inquiry.' },
      { value: 'Services and B2B', label: 'Useful where the buyer needs to understand quickly who can be trusted and why.' },
      { value: 'Clear roadmap', label: 'From the start it is clear what to do first, what can wait, and what not to waste time on.' },
    ],
    approachKicker: 'Approach',
    approachTitle: 'Where websites usually lose both demand and leads',
    approachText: 'Most drops do not come from one isolated error. They come from a mix of structure, weak landing pages, thin commercial blocks, and an unclear next step.',
    advantageCards: [
      { icon: FileText, title: 'Critical issues first', text: 'You see right away which templates and pages do the most damage and what can wait.' },
      { icon: LineChart, title: 'Focused on key pages', text: 'The work is centered on the pages where inquiries are won or lost, not on a generic checklist.' },
      { icon: BarChart3, title: 'No chaotic fixes', text: 'Structure, content, and technical foundations are cleaned up so the site can keep evolving without turning into a mess.' },
    ],
    trustLayerTitle: 'What to open first if you want to understand how the work is run',
    trustLayerText:
      'These are not decorative support pages. They form the trust layer: who is accountable for decisions, how SEO priorities are made, and how expert content is reviewed and updated.',
    trustLayerCta: 'Open page',
    decisionKicker: 'Where to start',
    decisionTitle: 'What the right first step usually looks like',
    decisionText:
      'The usual mistake is not choosing a completely wrong service. It is starting from the wrong problem.',
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
    packageTitle: 'Work formats for different situations',
    packageText: 'You can start from diagnosis, focused page work, or a broader ongoing setup. No unnecessary scope on day one.',
    packages: [
      { name: 'Diagnosis and priorities', price: 'from ₽15,000', accent: 'When the first need is to see the real bottlenecks instead of buying broad support blindly.', icon: Rocket, items: ['SEO audit with implementation priorities', 'Indexation, structure, and key-page review', 'Quick wins without background noise', 'Decision on the most rational next step'] },
      { name: 'Key-page strengthening', price: 'from ₽30,000', accent: 'When the site is live, but its service pages, demand capture, and commercial presentation are underperforming.', icon: Gem, items: ['Everything from the diagnostic scenario', 'Priority keyword clustering', 'Improvement of core service pages', 'Stronger commercial signals and CTA structure'] },
      { name: 'System growth', price: 'from ₽50,000', accent: 'When the project needs a recurring growth loop across structure, content, SEO, and implementation.', icon: BarChart3, items: ['Everything from the key-page scenario', 'Structure expansion and new landing pages', 'Content and positioning hypotheses', 'Priority support and implementation control'] },
    ],
    packageButton: 'Choose a package',
    industryKicker: 'Best fit',
    industryTitle: 'Who this usually fits',
    industryBlocks: ['Service websites that already get traffic but too few inquiries.', 'B2B projects with a long and complex decision cycle.', 'Local businesses competing in crowded search results.', 'Projects where the website looks weaker than the service itself.'],
    processBlocks: [
      { step: '01', title: 'I assess demand and the current state of the site', text: 'I review the structure, key pages, commercial blocks, and the user path toward a lead.' },
      { step: '02', title: 'I assemble a working roadmap', text: 'I lock priorities: what needs urgent fixing, what should be strengthened next, and where resources should not be wasted.' },
      { step: '03', title: 'I fix the site by priority', text: 'I improve pages, lead flow, and technical foundations so the site is easier to grow and easier to sell from.' },
    ],
    casesKicker: 'Case studies',
    casesTitle: 'Projects with a clear breakdown of the work',
    casesLink: 'Open case studies',
    caseLabel: 'Case study',
    caseFallback: 'A project breakdown showing how structural work, better content, and stronger key pages improved organic potential.',
    caseEmptyTitle: 'Case studies with task, implementation, and outcome',
    caseEmptyText: 'This section features projects where you can clearly see how site structure, SEO, and commercial signals influence traffic, leads, and acquisition efficiency.',
    openCase: 'Open case study',
    blogKicker: 'Blog',
    blogTitle: 'What to read before starting the work',
    blogLink: 'Go to the blog',
    blogCardKicker: 'Article',
    blogFallback: 'A practical article about a specific website problem: structure, migration, GEO, commercial pages, or content.',
    blogEmptyTitle: 'Articles on structure, migrations, and demand capture',
    blogEmptyText: 'The best materials here are the ones that help solve a specific site problem, not generic theory.',
    reviewsKicker: 'Reviews',
    reviewsTitle: 'Client reviews',
    reviewsEmptyTitle: 'No public review block yet',
    reviewsEmptyText: 'When new reviews are added, this section should show the person, company, and the task without generic praise.',
    contactKicker: 'Next step',
    contactTitle: 'Send the site for a quick review',
    contactText: 'A domain and a short task description are enough. I will tell you where leads are being lost and what to start with.',
    contactFastTitle: 'Fast feedback',
    contactFastText: 'I usually reply within one business day after a request.',
    contactConcreteTitle: 'Clear conclusions',
    contactConcreteText: 'The reply will name a concrete first step: an audit, technical work, page rewrites, or a relaunch.',
  },
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
              <h1 className="max-w-[1100px] text-[clamp(2.15rem,3.4vw,4rem)] font-semibold leading-[0.93] tracking-[-0.045em] text-slate-950">
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
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-tight !pb-10 !pt-4 md:!pb-12 md:!pt-6">
        <div className="surface-signal surface-pad">
          <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">
            {locale === 'ru' ? 'Где теряются заявки' : 'Where leads get lost'}
          </h2>

          <div className="uniform-grid-3 mt-6">
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
          <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{trustLinks.heading}</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {trustLinks.links.map((item) => (
              <Link
                key={item.href}
                href={prefixPathWithLocale(item.href, locale)}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition hover:border-cyan-200 hover:shadow-[0_24px_56px_rgba(15,23,42,0.12)]"
              >
                <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServicesCatalogSection compact />

      <section className="section-shell">
        <div className="surface-grid surface-pad">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.casesTitle}</h2>
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
                    <div className="flex items-center justify-end">
                      <Building2 className="h-5 w-5 text-cyan-700" />
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.description || item.content || copy.caseFallback}</p>
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
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.blogTitle}</h2>
            <Link href={prefixPathWithLocale('/blog', locale)} className="inline-flex items-center gap-2 text-cyan-700 transition hover:text-slate-950">
              {copy.blogLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="uniform-grid-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={prefixPathWithLocale(`/blog/${post.slug}`, locale)} className="uniform-card glass-panel interactive-card group p-7 transition hover:border-cyan-200">
                  <h3 className="text-2xl font-semibold text-slate-950">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.excerpt || copy.blogFallback}</p>
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
          <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.reviewsTitle}</h2>

          <div className="uniform-grid-3 mt-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="uniform-card glass-panel interactive-card p-7">
                  <div className="text-base font-semibold text-slate-950">{review.author}</div>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{review.text}</p>
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
                <h2 className="text-3xl font-semibold text-slate-950 md:text-5xl">{copy.contactTitle}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contactText}</p>
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
