import LazyCalculator from '@/components/LazyCalculator'
import LazyContactForm from '@/components/LazyContactForm'
import RichContent from '@/components/RichContent'
import { stripLeadingMarkdownH1 } from '@/lib/content-headings'
import { prisma } from '@/lib/prisma'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getMergedServicePricingList } from '@/lib/service-pricing-overrides'

const defaultCalculatorTitle = 'Калькулятор SEO-услуг | Shelpakov Digital'
const defaultCalculatorDescription =
  'Калькулятор SEO-услуг для предварительной оценки бюджета на аудит, техническую базу, контент, сопровождение и рост органического канала.'

const calculatorHighlights = [
  'Рыночный ориентир по стоимости',
  'Без навязывания лишних задач',
  'Понятный старт под ваш проект',
]

const calculatorSteps = [
  {
    title: 'Соберите нужные направления',
    description: 'Отметьте услуги, которые сейчас действительно нужны проекту: от аудита и техбазы до системного SEO или разработки.',
  },
  {
    title: 'Получите ориентир по бюджету',
    description: 'Калькулятор показывает стартовую стоимость по выбранной связке услуг и помогает быстро сверить сценарии запуска.',
  },
  {
    title: 'Уточним состав работ вручную',
    description: 'После заявки я смотрю масштаб сайта, число разделов, состояние базы и подсказываю, что брать сейчас, а что можно отложить.',
  },
]

const pricingFactors = [
  'Чем больше шаблонов, разделов и точек входа в спрос, тем выше объём аналитики, контента и внедрения.',
  'Для eCommerce, B2B и геозависимых проектов обычно требуется более глубокая структура и отдельная работа с коммерческими страницами.',
  'Если часть базы уже сделана, можно начать с точечной услуги и не брать полное сопровождение с первого шага.',
]

export default async function CalculatorPage() {
  let page: any = null
  const pricing = await getMergedServicePricingList()

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    console.error('Error loading calculator page:', error)
    page = null
  }

  const pageContent = stripLeadingMarkdownH1(page?.content, page?.h1 || page?.title || 'Калькулятор SEO-услуг')

  return (
    <div className="page-shell">
      <section className="surface-grid surface-pad">
        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr] xl:items-end">
          <div>
            <span className="warm-chip">Калькулятор SEO-услуг</span>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              {page?.h1 || 'Подберите формат SEO-работ и получите ориентир по бюджету'}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {page?.description ||
                'Собрал калькулятор по текущей линейке услуг: от аудита и технической базы до системного SEO, контента и запуска новых разделов под рост заявок.'}
            </p>
          </div>

          <div className="glass-panel p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Как пользоваться</p>
            <div className="mt-4 space-y-3">
              {calculatorSteps.map((item, index) => (
                <div key={item.title} className="rounded-[22px] border border-orange-100 bg-white/75 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{`0${index + 1}`}</span>
                    <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
          {calculatorHighlights.map((item) => (
            <span key={item} className="rounded-full border border-orange-200 bg-white px-4 py-2">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 surface-grid p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Предварительный расчёт</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">Соберите рабочую связку услуг под ваш сайт</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Калькулятор не заменяет разбор проекта, но помогает быстро понять порядок бюджета и выбрать разумный старт без лишних этапов.
          </p>
        </div>

        <LazyCalculator
          services={pricing.map((service) => ({
            id: service.slug,
            slug: service.slug,
            name: service.name,
            description: service.shortDescription,
            price: service.priceFrom,
            unit: service.priceLabel,
            hint: service.calculatorHint,
            deliverables: service.deliverables,
          }))}
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <div className="reading-shell h-full">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Что влияет на стоимость</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Цена зависит не только от услуги, но и от масштаба проекта</h2>
          <div className="mt-6 space-y-3">
            {pricingFactors.map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-5 py-4 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div id="contact-form" className="soft-section h-full scroll-mt-32 overflow-hidden md:scroll-mt-36">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="border-b border-orange-100 p-8 lg:border-b-0 lg:border-r">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">Обсудить задачу</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">Оставьте заявку, если нужен точный расчёт</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
                Напишите сайт, текущую задачу и что уже делали. В ответ покажу, какой формат работ подойдёт именно сейчас и где можно не переплачивать.
              </p>
            </div>
            <div className="p-8">
              <LazyContactForm />
            </div>
          </div>
        </div>
      </section>

      {pageContent ? (
        <section className="mt-8 reading-shell">
          <div className="editorial-prose max-w-none">
            <RichContent content={pageContent} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null

  try {
    page = await prisma.page.findUnique({ where: { slug: 'calculator' } })
  } catch (error) {
    page = null
  }

  const { getFullUrl } = await import('@/lib/site-url')
  const calculatorUrl = getFullUrl('/calculator')
  const title = normalizeMetaTitle(page?.title, defaultCalculatorTitle)
  const description = normalizeMetaDescription(page?.description, defaultCalculatorDescription)

  return {
    title,
    description,
    alternates: {
      canonical: calculatorUrl,
    },
    openGraph: {
      title,
      description,
      url: calculatorUrl,
      type: 'website',
    },
  }
}
