import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ContactForm from '@/components/ContactForm'
import Calculator from '@/components/Calculator'
import ReactMarkdown from 'react-markdown'

export default async function HomePage() {
  let page: any = null
  let services: any[] = []
  let settings: any = null
  let reviews: any[] = []
  
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    settings = await prisma.siteSettings.findFirst()
    reviews = await prisma.review.findMany({
      orderBy: { order: 'asc' },
      take: 3
    })
  } catch (error) {
    console.error('Error loading homepage data:', error)
    // Use defaults if DB error
    page = null
    services = []
    settings = null
    reviews = []
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {page?.h1 || 'Помогаю молодым компаниям, сайтам, b2b сегмент'}
          </h1>
          <p className="text-xl mb-6 text-blue-100">
            {page?.description || 'Рост трафика, рост позиций в выдаче поисковых систем'}
          </p>
          <ul className="space-y-2 mb-8">
            <li className="flex items-center gap-2">
              <span className="text-blue-200">✓</span>
              <span>Увеличение конверсий</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-200">✓</span>
              <span>Ответственность, вовлечённость, трудолюбие, внимание к мелочам</span>
            </li>
          </ul>
          <a href="#contact-form">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Получить консультацию
            </Button>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-primary">
                  {service.price.toLocaleString('ru-RU')} {service.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Description */}
      {page?.content && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="prose max-w-none">
              <ReactMarkdown>{page.content}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Калькулятор стоимости</h2>
          <Calculator />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Отзывы</h2>
          {settings?.yandexReviewsEmbed ? (
            <div 
              className="mb-8"
              dangerouslySetInnerHTML={{ __html: settings.yandexReviewsEmbed }}
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-yellow-800">Подключите виджет Яндекс Отзывов в админке</p>
            </div>
          )}
          {reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2">{review.text}</p>
                  <p className="text-sm text-gray-500">— {review.author}</p>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/reviews">
              <Button variant="outline">Все отзывы</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Свяжитесь с нами</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata() {
  let page: any = null
  try {
    page = await prisma.page.findUnique({ where: { slug: 'home' } })
  } catch (error) {
    page = null
  }
  const { getSiteUrl } = await import('@/lib/site-url')
  const siteUrl = getSiteUrl()
  
  return {
    title: page?.title || 'SEO Услуги - Главная',
    description: page?.description || 'Профессиональные SEO услуги для вашего бизнеса',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: page?.title || 'SEO Услуги - Главная',
      description: page?.description || 'Профессиональные SEO услуги для вашего бизнеса',
      url: siteUrl,
      type: 'website',
    },
  }
}

