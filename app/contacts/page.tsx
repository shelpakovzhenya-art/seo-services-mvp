import type { Metadata } from 'next'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import LazyContactForm from '@/components/LazyContactForm'
import {
  contactEmail,
  ContactMap,
  contactPhone,
  ReferencePage,
  SectionTitle,
  telegramUrl,
} from '@/components/ShelpakovReference'
import { getRequestLocale } from '@/lib/request-locale'
import { getLocaleAlternates } from '@/lib/site-url'
import { createBreadcrumbSchema } from '@/lib/structured-data'

const pageMetadata: Metadata = {
  title: 'Контакты | Shelpakov Digital',
  description: 'Свяжитесь с Shelpakov Digital, чтобы обсудить SEO-аудит, продвижение, структуру сайта и рост заявок.',
}

export default async function ContactsPage() {
  const locale = await getRequestLocale()
  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Главная', path: '/' },
      { name: 'Контакты', path: '/contacts' },
    ],
    { locale }
  )

  return (
    <ReferencePage>
      <JsonLd id="contacts-breadcrumbs-schema" data={breadcrumbSchema} />

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-blue-200/10 bg-[#07142b]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <p className="text-sm font-extrabold uppercase text-blue-400">Контакты</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-white sm:text-4xl">Готовы обсудить ваш проект</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Напишите нам удобным способом, и мы свяжемся с вами в ближайшее время.
          </p>
          <div className="mt-7">
          <SectionTitle title="Контакты" description="Готовы обсудить сайт, аудит или регулярное SEO-сопровождение." />
          </div>

          <div className="mt-7 grid gap-4">
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 rounded-lg border border-blue-200/10 bg-slate-950/42 p-4 text-slate-200 transition hover:border-blue-300/35 hover:text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs text-slate-400">Email</span>
                <span className="font-bold">{contactEmail}</span>
              </span>
            </a>
            <a href={telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg border border-blue-200/10 bg-slate-950/42 p-4 text-slate-200 transition hover:border-blue-300/35 hover:text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300">
                <Send className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs text-slate-400">Telegram</span>
                <span className="font-bold">@whoamikon</span>
              </span>
            </a>
            <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-4 rounded-lg border border-blue-200/10 bg-slate-950/42 p-4 text-slate-200 transition hover:border-blue-300/35 hover:text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs text-slate-400">Телефон</span>
                <span className="font-bold">{contactPhone}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 rounded-lg border border-blue-200/10 bg-slate-950/42 p-4 text-slate-200">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/10 text-blue-300">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs text-slate-400">Локация</span>
                <span className="font-bold">Москва, Россия</span>
              </span>
            </div>
          </div>

          <div className="mt-5">
            <ContactMap />
          </div>
        </div>

        <div id="contact-form" className="rounded-lg border border-blue-200/10 bg-[#061126]/88 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] sm:p-8">
          <SectionTitle title="Напишите нам" description="Оставьте контакты и коротко расскажите о проекте." />
          <div className="mt-7">
            <LazyContactForm />
          </div>
        </div>
      </section>
    </ReferencePage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...pageMetadata,
    alternates: getLocaleAlternates('/contacts'),
    openGraph: {
      title: pageMetadata.title as string,
      description: pageMetadata.description as string,
      type: 'website',
    },
  }
}
