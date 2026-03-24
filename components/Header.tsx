import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";
import TelegramIconLink from "@/components/TelegramIconLink";
import { normalizeTelegramLink } from "@/lib/contact-links";

export default async function Header() {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "Студия Английского";
  const [firstWord, ...restWords] = siteName.split(" ");
  const restName = restWords.join(" ");
  const telegramLink = normalizeTelegramLink(settings.telegram) || "#contact";

  return (
    <header className="site-shell relative z-10 flex items-center justify-between gap-4 py-6">
      <Link href="/" className="brand-lockup no-underline">
        <span className="brand-lockup-accent" aria-hidden="true" />
        <span className="brand-lockup-body">
          <span className="brand-lockup-kicker">{firstWord}</span>
          <span className="brand-lockup-name">{restName || firstWord}</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href="#about">О нас</a>
        <a href="#programs">Программы</a>
        <a href="#advantages">Преимущества</a>
        <a href="#contact">Контакты</a>
      </nav>

      <div className="flex items-center gap-3">
        <TelegramIconLink href={telegramLink} />
        <Button asChild className="rounded-full px-5">
          <a href="#contact">Оставить заявку</a>
        </Button>
      </div>
    </header>
  );
}
