import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { headers } from "next/headers"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/site.webmanifest",
  title: {
    default: "Shelpakov Digital",
    template: "%s | Shelpakov Digital"
  },
  description: "SEO-продвижение сайтов, SEO-аудит, контент, коммерческие факторы и рост заявок для бизнеса.",
  keywords: ["SEO-продвижение сайтов", "поисковое продвижение", "SEO-аудит", "коммерческие факторы", "рост заявок"],
  authors: [{ name: "Shelpakov Digital" }],
  creator: "Shelpakov Digital",
  publisher: "Shelpakov Digital",
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon-48.png"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Shelpakov Digital",
    title: "Shelpakov Digital",
    description: "SEO-продвижение сайтов, SEO-аудит и упаковка сайта под рост заявок.",
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
