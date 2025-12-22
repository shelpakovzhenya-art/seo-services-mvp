import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "SEO Услуги",
  description: "Профессиональные SEO услуги для вашего бизнеса",
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
      <body className={inter.className}>
        {!isAdmin && <Header />}
        <main className={isAdmin ? "" : "min-h-screen"}>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}

