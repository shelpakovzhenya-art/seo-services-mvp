import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import {
  aboutPrinciples,
  ProjectCta,
  ReferencePage,
  SectionTitle,
  StatsStrip,
  TrustItem,
} from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates, getSiteUrl } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

const pageMetadata: Metadata = {
  title: 'О нас | Shelpakov Digital',
  description:
    'Shelpakov Digital помогает бизнесу расти в поиске: SEO-аудит, структура сайта, техническая база, контент и прозрачная аналитика.',
}

export default async function AboutPage() {
  const locale = await getRequestLocale()
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'О нас', path: '/about' },
    ],
    { locale }
  )
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${getSiteUrl()}/about#about`,
    url: `${getSiteUrl()}/about`,
    name: 'О нас | Shelpakov Digital',
    description: pageMetadata.description,
  }

  return (
    <ReferencePage>
      <JsonLd id="about-breadcrumbs-schema" data={breadcrumbSchema} />
      <JsonLd id="about-page-schema" data={aboutPageSchema} />

      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-lg border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <p className="text-sm font-extrabold uppercase text-blue-400">О нас</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">
            Команда профессионалов, которая помогает бизнесу расти
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Мы соединяем SEO-аналитику, структуру сайта, технические доработки и понятную коммуникацию без лишнего процесса.
          </p>
          <div className="mt-7">
          <SectionTitle title="Подход" description="Работа строится вокруг результата: больше целевого трафика, заявок и управляемости сайта." />
          </div>
          <div className="mt-7 grid gap-4">
            {aboutPrinciples.map((item) => (
              <TrustItem key={item.title} title={item.title} text={item.text} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <SectionTitle title="Почему выбирают нас" description="Ставим приоритеты, показываем данные и объясняем, какие изменения дают рост." />
          <div className="mt-7 grid gap-4">
            <TrustItem title="Прозрачность" text="Показываем задачи, динамику и источники результата в понятном виде." />
            <TrustItem title="Экспертиза" text="Работаем со структурой спроса, коммерческими страницами и технической базой." />
            <TrustItem title="Фокус на заявках" text="Оцениваем не только позиции, но и влияние SEO на обращения и продажи." />
          </div>
          <div className="mt-5">
            <StatsStrip />
          </div>
        </div>
      </section>

      <ProjectCta locale={locale} />
    </ReferencePage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata,
    alternates: getLocaleAlternates('/about'),
    openGraph: {
      title: pageMetadata.title as string,
      description: pageMetadata.description as string,
      type: 'website',
    },
  }
}
