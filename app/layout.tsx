import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import JsonLd from '@/components/JsonLd'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import SiteAtmosphere from '@/components/SiteAtmosphere'
import { getRouteLocale } from '@/lib/i18n'
import { normalizeMetaDescription, normalizeMetaTitle } from '@/lib/seo-meta'
import { getSiteUrl } from '@/lib/site-url'
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/structured-data'
import './globals.css'

const siteUrl = getSiteUrl()
const yandexMetrikaId = 108185358
const defaultTitle = normalizeMetaTitle(undefined, 'SEO, структура сайта и рост заявок')
const defaultDescription = normalizeMetaDescription(
  undefined,
  'SEO-продвижение, аудит и доработка структуры сайта под рост заявок, доверия и органического трафика для услуг, B2B-проектов и экспертных ниш.'
)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: '/site.webmanifest',
  title: defaultTitle,
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
    title: defaultTitle,
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
  verification: {
    google: 'uGg4lRxDJJQ1iLONhHqtWqrZvkirPNE5yHXxSfCPejs',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const locale = getRouteLocale(headersList.get('x-locale'))
  const isAdmin = pathname.startsWith('/admin')
  const organizationSchema = createOrganizationSchema()
  const websiteSchema = createWebsiteSchema()

  return (
    <html lang={locale}>
      <body className={isAdmin ? 'admin-theme admin-body' : 'site-shell'}>
        {!isAdmin ? (
          <>
            <JsonLd id="site-organization-schema" data={organizationSchema} />
            <JsonLd id="site-website-schema" data={websiteSchema} />
          </>
        ) : null}
        {!isAdmin ? (
          <>
            <Script
              id="yandex-metrika"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(m,e,t,r,i,k,a){
                    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    for (var j = 0; j < document.scripts.length; j++) {
                      if (document.scripts[j].src === r) { return; }
                    }
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
                  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${yandexMetrikaId}', 'ym');

                  ym(${yandexMetrikaId}, 'init', {
                    ssr: true,
                    webvisor: true,
                    clickmap: true,
                    ecommerce: 'dataLayer',
                    referrer: document.referrer,
                    url: location.href,
                    accurateTrackBounce: true,
                    trackLinks: true
                  });
                `,
              }}
            />
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                  style={{ position: 'absolute', left: '-9999px' }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        ) : null}
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
