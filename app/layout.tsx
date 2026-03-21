import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import SiteAtmosphere from '@/components/SiteAtmosphere'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const siteUrl = getSiteUrl()
const defaultDescription =
  'SEO-продвижение, аудит и доработка структуры сайта под рост заявок, доверия и органического трафика для услуг, B2B-проектов и экспертных ниш.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: '/site.webmanifest',
  title: {
    default: 'SEO-продвижение сайтов | Shelpakov Digital',
    template: '%s | Shelpakov Digital',
  },
  description: defaultDescription,
  keywords: [
    'seo-продвижение сайтов',
    'поисковое продвижение',
    'seo-аудит',
    'структура сайта',
    'коммерческие факторы',
    'рост заявок',
  ],
  authors: [{ name: 'Shelpakov Digital' }],
  creator: 'Shelpakov Digital',
  publisher: 'Shelpakov Digital',
  icons: {
    icon: [
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon-48.png'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'Shelpakov Digital',
    title: 'SEO-продвижение сайтов | Shelpakov Digital',
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="ru">
      <body className={isAdmin ? 'admin-theme admin-body' : 'site-shell'}>
        {!isAdmin && <SiteAtmosphere />}
        <div className={isAdmin ? '' : 'site-frame'}>
          {!isAdmin && <Header />}
          <main className={isAdmin ? '' : 'min-h-screen'}>{children}</main>
          {!isAdmin && <ScrollToTopButton />}
          {!isAdmin && <Footer />}
        </div>
      </body>
    </html>
  )
}
