import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="site-shell relative z-10 flex items-center justify-between gap-4 py-6">
      <Link href="/" className="flex flex-col no-underline">
        <span className="text-sm uppercase tracking-[0.3em] text-rose-500">
          Онлайн-центр
        </span>
        <span className="text-xl font-extrabold text-slate-900 md:text-2xl">
          {settings.siteName || "Студия Английского"}
        </span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href="#about">О нас</a>
        <a href="#programs">Программы</a>
        <a href="#advantages">Преимущества</a>
        <a href="#contact">Контакты</a>
      </nav>

      <div className="flex items-center gap-3">
        {settings.telegram ? (
          <a
            href={settings.telegram}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:text-rose-600 md:inline-flex"
          >
            Telegram
          </a>
        ) : null}
        <Button asChild className="rounded-full px-5">
          <a href="#contact">Оставить заявку</a>
        </Button>
      </div>
    </header>
  );
}
