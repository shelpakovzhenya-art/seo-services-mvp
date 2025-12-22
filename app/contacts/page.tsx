import { prisma } from '@/lib/prisma'
import ContactForm from '@/components/ContactForm'
import { Mail, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default async function ContactsPage() {
  let page: any = null
  let settings: any = null
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
    settings = await prisma.siteSettings.findFirst()
  } catch (error) {
    console.error('Error loading contacts page:', error)
    page = null
    settings = null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{page?.h1 || 'Контакты'}</h1>
      
      {page?.description && (
        <p className="text-xl text-gray-600 mb-8">{page.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Свяжитесь с нами</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <a 
                href={`mailto:${settings?.email || 'shelpakovzhenya@gmail.com'}`}
                className="text-lg hover:text-primary"
              >
                {settings?.email || 'shelpakovzhenya@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-lg">
                {settings?.workSchedule || 'ПН–ПТ 9:00–17:00'}
              </span>
            </div>
          </div>

          {page?.content && (
            <div className="prose max-w-none">
              <ReactMarkdown>{page.content}</ReactMarkdown>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Форма обратной связи</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'contacts' } })
  } catch (error) {
    page = null
  }
  const { getFullUrl } = await import('@/lib/site-url')
  const contactsUrl = getFullUrl('/contacts')
  
  return {
    title: page?.title || 'Контакты | SEO Update',
    description: page?.description || 'Свяжитесь с нами для консультации по продвижению вашего сайта',
    alternates: {
      canonical: contactsUrl,
    },
    openGraph: {
      title: page?.title || 'Контакты',
      description: page?.description || 'Свяжитесь с нами для консультации по продвижению вашего сайта',
      url: contactsUrl,
      type: 'website',
    },
  }
}

