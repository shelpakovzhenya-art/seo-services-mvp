import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MapPin, Search, TrendingUp } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { Button } from '@/components/ui/button'
import { getFullUrl } from '@/lib/site-url'
import { podocenterCase } from '@/lib/podocenter-case'

const serviceLinks = [
  { href: '/services/seo', label: 'SEO-продвижение' },
  { href: '/services/technical-seo', label: 'техническое SEO' },
  { href: '/services/local-seo', label: 'Local SEO' },
  { href: '/services/seo-content', label: 'SEO-контент' },
]

const caseVisuals = [
  {
    src: '/cases/podocenter/traffic-growth.svg',
    alt: 'Рост органического трафика PodoCenter из Google и Яндекса',
    title: 'Рост трафика из органики',
    text: 'На визуале видно, как после усиления структуры и посадочных сайт начал получать больше целевых визитов из поиска.',
  },
  {
    src: '/cases/podocenter/visibility-growth.svg',
    alt: 'Рост видимости PodoCenter по локальным запросам в Казани',
    title: 'Усиление видимости в поиске',
    text: 'Локальная выдача начала лучше реагировать на новые страницы услуг и связку коммерческого спроса с блогом.',
  },
  {
    src: '/cases/podocenter/cpl-dynamics.svg',
    alt: 'Динамика заявок и снижение CPL по проекту PodoCenter',
    title: 'Больше заявок при снижении CPL',
    text: 'При сохранении бюджета стоимость обращения снижалась, а органический канал становился эффективнее для бизнеса.',
  },
  {
    src: '/cases/podocenter/positions-heatmap.svg',
    alt: 'Тепловая карта роста позиций PodoCenter по приоритетным запросам',
    title: 'Закрепление запросов в ТОП',
    text: 'Часть важных запросов вышла в ТОП-1, а значимый массив закрепился в ТОП-10, что усилило стабильность выдачи.',
  },
]

export default function PodocenterCasePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: getFullUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Кейсы',
        item: getFullUrl('/cases'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: podocenterCase.h1,
        item: getFullUrl(podocenterCase.url),
      },
    ],
  }

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="soft-section p-8 md:p-10">
        <span className="warm-chip">SEO-кейс локального проекта</span>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold text-slate-950 md:text-6xl">
          {podocenterCase.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{podocenterCase.excerpt}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#case-contact">
            <Button size="lg" className="rounded-full px-7">
              Обсудить продвижение медицинского проекта
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link href="/services/seo" className="inline-flex">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-7 text-slate-900 hover:bg-slate-50"
            >
              Посмотреть услугу SEO-продвижения
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Ниша</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">Подология и медицина</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Высокая чувствительность к доверию, локальной релевантности и качеству посадочных страниц.
            </p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Регион</div>
            <div className="mt-3 flex items-center gap-3 text-2xl font-semibold text-slate-950">
              <MapPin className="h-6 w-6 text-cyan-700" />
              Казань
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Локальная конкуренция, где важны и видимость в поиске, и понятный сценарий записи.
            </p>
          </div>
          <div className="page-card">
            <div className="text-sm uppercase tracking-[0.22em] text-orange-700">Итог</div>
            <div className="mt-3 text-2xl font-semibold text-slate-950">Рост по SEO и заявкам</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Проект усилил видимость, получил больше целевого трафика и превратил поиск в рабочий канал
              обращений.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="page-card">
          <span className="warm-chip">О проекте</span>
          <ul className="mt-6 space-y-4 text-base leading-7 text-slate-700">
            {podocenterCase.about.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="page-card">
          <span className="warm-chip">Точка А и цели</span>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">С какими проблемами пришли</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {podocenterCase.pointA.map((item) => (
                  <li key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Что нужно было получить</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {podocenterCase.goals.map((item) => (
                  <li key={item} className="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">Что сделали</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Не набор правок, а система роста для локального медицинского проекта
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
          В проекте нельзя было ограничиться только метатегами или точечными техническими задачами. Чтобы
          получить рост по органике и обращениям, мы выстроили связку из структуры, услуг, контента,
          коммерческих факторов и базовой SEO-оптимизации.
        </p>

        <div className="mt-10 space-y-6">
          {podocenterCase.work.map((section) => (
            <article key={section.title} className="rounded-[28px] border border-orange-100 bg-white/85 p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-cyan-100 bg-cyan-50/70 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-950 md:text-3xl">Где это усилило коммерческий результат</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Когда у проекта появляется полноценная структура под спрос, поисковый трафик становится качественнее,
            а страницы начинают лучше конвертировать пользователя в обращение. Именно поэтому для таких задач мы
            чаще рекомендуем не разовые правки, а связку из{' '}
            <Link href="/services/seo" className="font-medium text-cyan-700 transition hover:text-slate-950">
              SEO-продвижения
            </Link>
            ,{' '}
            <Link href="/services/technical-seo" className="font-medium text-cyan-700 transition hover:text-slate-950">
              технического SEO
            </Link>{' '}
            и проработки посадочных страниц под интент пользователя.
          </p>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">Результаты</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Что изменилось после внедрения структуры, контента и коммерческих факторов
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {podocenterCase.results.map((item) => (
            <div key={item.metric} className="rounded-[26px] border border-orange-100 bg-[#fffaf5] p-6">
              <div className="flex items-center gap-3 text-orange-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.22em]">{item.metric}</span>
              </div>
              <p className="mt-4 text-lg font-semibold leading-7 text-slate-950">{item.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.impact}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-500">
          Если захотите, сюда можно подставить фактические значения из Метрики, Search Console и CRM в формате
          «было → стало». На странице я сознательно не выдумывал цифры, которых вы не присылали.
        </p>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">Подтверждение динамики</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Визуальные доказательства роста, аккуратно встроенные в кейс
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
          Скрины с метриками оформили как часть страницы, чтобы блок с результатами не выглядел сухо. Они работают
          как поддержка текста: показывают динамику трафика, видимости, CPL и позиций без ощущения “отчёта ради отчёта”.
        </p>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {caseVisuals.map((item, index) => (
            <article
              key={item.src}
              className={`flex h-full flex-col overflow-hidden rounded-[30px] border border-orange-100 bg-white shadow-[0_22px_55px_rgba(148,107,61,0.08)] ${
                index === 0 || index === 1 ? 'xl:col-span-1' : 'xl:col-span-1'
              }`}
            >
              <div className="relative min-h-[260px] w-full overflow-hidden border-b border-orange-100 bg-[linear-gradient(180deg,#fffdf8,#f7fbff)] p-4 sm:min-h-[320px] sm:p-5">
                <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                  <Image src={item.src} alt={item.alt} fill className="object-contain p-2 sm:p-3" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="page-card">
          <span className="warm-chip">Что дало результат</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Почему стратегия сработала</h2>
          <div className="mt-6 space-y-4">
            {podocenterCase.whyItWorked.map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-base leading-8 text-slate-600">{podocenterCase.conclusion}</p>
        </div>

        <div className="page-card">
          <span className="warm-chip">Вывод</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Что важно для похожих проектов</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Для локального сервиса недостаточно просто получить трафик. Нужны правильные страницы услуг, понятная
            логика записи, сильные коммерческие сигналы и техническая база, которая помогает поиску правильно
            понимать сайт. Если у вас похожая задача, чаще всего стоит начинать с{' '}
            <Link href="/services/seo-audit" className="font-medium text-cyan-700 transition hover:text-slate-950">
              SEO-аудита
            </Link>{' '}
            или сразу собирать полноценный план{' '}
            <Link href="/services/local-seo" className="font-medium text-cyan-700 transition hover:text-slate-950">
              локального SEO-продвижения
            </Link>
            .
          </p>

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="text-sm uppercase tracking-[0.22em] text-cyan-300">CTA</div>
            <h3 className="mt-3 text-2xl font-semibold">Нужен похожий результат для медицинского или локального проекта?</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Разберу, где сайт теряет поисковый потенциал, какие страницы нужно усиливать в первую очередь и как
              связать SEO с обращениями, а не только с позициями.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#case-contact">
                <Button className="rounded-full">Заказать SEO-разбор проекта</Button>
              </a>
              <Link href="/calculator">
                <Button
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  Оценить формат работ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">FAQ</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Частые вопросы по кейсу и стратегии</h2>
        <div className="mt-8 grid gap-4">
          {podocenterCase.faq.map((item) => (
            <details key={item.question} className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-950">{item.question}</summary>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">SEO-мета для сайта клиента</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
          Рекомендованные title, description и H1 для ключевых страниц PodoCenter
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">
          Ниже собрал базовый комплект SEO-мета для основных коммерческих и контентных страниц сайта с учётом
          локального интента «Казань». Эти формулировки можно использовать как ориентир при внедрении.
        </p>

        <div className="mt-8 grid gap-5">
          {podocenterCase.podocenterMeta.map((item) => (
            <div key={item.page} className="rounded-[26px] border border-orange-100 bg-white/80 p-6">
              <div className="text-sm uppercase tracking-[0.22em] text-orange-700">{item.page}</div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Title</div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.title}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Description</div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">H1</div>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.h1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 page-card">
        <span className="warm-chip">Связанные услуги</span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">Что может усилить такой же проект</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[24px] border border-orange-100 bg-[#fffaf5] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200"
            >
              <div className="flex items-center gap-3 text-cyan-700">
                <Search className="h-5 w-5" />
                <span className="text-sm uppercase tracking-[0.22em]">Услуга</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Подходит, если проекту нужен следующий шаг после диагностики или системный рост поискового канала.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="case-contact" className="mt-8 soft-section overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
            <span className="warm-chip">Обсудить проект</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
              Нужен кейс не на словах, а рост по поиску и обращениям?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Разберу сайт, покажу слабые места в структуре, контенте и коммерческих факторах, а затем соберу
              понятный план продвижения под ваш регион и спрос.
            </p>
            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-600">
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                Ответ в течение дня
              </div>
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                Без обязательств и навязчивых продаж
              </div>
              <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3">
                Покажу точки роста по SEO, структуре и заявкам
              </div>
            </div>
          </div>

          <div className="p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateMetadata() {
  const url = getFullUrl(podocenterCase.url)

  return {
    title: podocenterCase.title,
    description: podocenterCase.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: podocenterCase.title,
      description: podocenterCase.description,
      url,
      type: 'article',
    },
  }
}
