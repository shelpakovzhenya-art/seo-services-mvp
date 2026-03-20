import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { headers } from "next/headers"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEO Услуги - Профессиональное продвижение сайтов",
    template: "%s | SEO Update"
  },
  description: "Профессиональные SEO услуги для вашего бизнеса. Увеличение трафика, рост позиций в поисковых системах, повышение конверсий.",
  keywords: ["SEO", "продвижение сайтов", "поисковая оптимизация", "контекстная реклама", "SEO услуги"],
  authors: [{ name: "SEO Update" }],
  creator: "SEO Update",
  publisher: "SEO Update",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "SEO Update",
    title: "SEO Услуги - Профессиональное продвижение сайтов",
    description: "Профессиональные SEO услуги для вашего бизнеса",
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
    // Add Yandex and Google verification codes here when available
    // yandex: "verification_code",
    // google: "verification_code",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="ru">
      <body>
        {!isAdmin && <Header />}
        <main className={isAdmin ? "" : "min-h-screen"}>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}

