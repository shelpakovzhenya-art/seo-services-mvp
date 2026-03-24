import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Студия Английского",
  description:
    "Онлайн-центр английского языка с теплой подачей, сильной методикой и эстетичной образовательной средой.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
