import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { isLocale } from "@/lib/i18n";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://lenochkin-center-production.up.railway.app"
  ),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeHeader = (await headers()).get("x-locale") || "ru";
  const locale = isLocale(localeHeader) ? localeHeader : "ru";

  return (
    <html lang={locale}>
      <body className={`${manrope.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
