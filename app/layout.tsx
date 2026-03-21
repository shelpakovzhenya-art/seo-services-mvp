import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SiteAtmosphere from '@/components/SiteAtmosphere'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const siteUrl = getSiteUrl()
const defaultDescription =
  'SEO-РїСЂРѕРґРІРёР¶РµРЅРёРµ, Р°СѓРґРёС‚ Рё РґРѕСЂР°Р±РѕС‚РєР° СЃС‚СЂСѓРєС‚СѓСЂС‹ СЃР°Р№С‚Р° РїРѕРґ СЂРѕСЃС‚ Р·Р°СЏРІРѕРє, РґРѕРІРµСЂРёСЏ Рё РѕСЂРіР°РЅРёС‡РµСЃРєРѕРіРѕ С‚СЂР°С„РёРєР° РґР»СЏ СѓСЃР»СѓРі, B2B-РїСЂРѕРµРєС‚РѕРІ Рё СЌРєСЃРїРµСЂС‚РЅС‹С… РЅРёС€.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: '/site.webmanifest',
  title: {
    default: 'SEO-РїСЂРѕРґРІРёР¶РµРЅРёРµ СЃР°Р№С‚РѕРІ | Shelpakov Digital',
    template: '%s | Shelpakov Digital',
  },
  description: defaultDescription,
  keywords: [
    'seo-РїСЂРѕРґРІРёР¶РµРЅРёРµ СЃР°Р№С‚РѕРІ',
    'РїРѕРёСЃРєРѕРІРѕРµ РїСЂРѕРґРІРёР¶РµРЅРёРµ',
    'seo-Р°СѓРґРёС‚',
    'СЃС‚СЂСѓРєС‚СѓСЂР° СЃР°Р№С‚Р°',
    'РєРѕРјРјРµСЂС‡РµСЃРєРёРµ С„Р°РєС‚РѕСЂС‹',
    'СЂРѕСЃС‚ Р·Р°СЏРІРѕРє',
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
    title: 'SEO-РїСЂРѕРґРІРёР¶РµРЅРёРµ СЃР°Р№С‚РѕРІ | Shelpakov Digital',
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
          {!isAdmin && <Footer />}
        </div>
      </body>
    </html>
  )
}
