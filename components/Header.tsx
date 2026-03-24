import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";
import TelegramIconLink from "@/components/TelegramIconLink";

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="site-shell relative z-10 flex items-center justify-between gap-4 py-6">
      <Link href="/" className="brand-lockup no-underline">
        <span className="brand-lockup-mark">Studio</span>
        <span className="brand-lockup-name">
          {settings.siteName || "Студия Английского"}
        </span>
        <span className="brand-lockup-note">online english center</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href="#about">О нас</a>
        <a href="#programs">Программы</a>
        <a href="#advantages">Преимущества</a>
        <a href="#contact">Контакты</a>
      </nav>

      <div className="flex items-center gap-3">
        {settings.telegram ? (
          <TelegramIconLink href={settings.telegram} className="hidden md:flex" />
        ) : null}
        <Button asChild className="rounded-full px-5">
          <a href="#contact">Оставить заявку</a>
        </Button>
      </div>
    </header>
  );
}
