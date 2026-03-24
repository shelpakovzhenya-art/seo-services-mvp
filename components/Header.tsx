import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";
import TelegramIconLink from "@/components/TelegramIconLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { normalizeTelegramLink } from "@/lib/contact-links";
import type { Dictionary, Locale } from "@/lib/i18n";

export default async function Header({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const settings = await getSiteSettings();
  const telegramLink = normalizeTelegramLink(settings.telegram) || `/${locale}#contact`;

  return (
    <header className="site-shell relative z-10 flex items-center justify-between gap-4 py-6">
      <Link href={`/${locale}`} className="brand-lockup no-underline">
        <span className="brand-lockup-accent" aria-hidden="true" />
        <span className="brand-lockup-body">
          <span className="brand-lockup-kicker">{dictionary.header.brandPrimary}</span>
          <span className="brand-lockup-name">{dictionary.header.brandSecondary}</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
        <a href={`/${locale}#about`}>{dictionary.header.nav.about}</a>
        <a href={`/${locale}#programs`}>{dictionary.header.nav.programs}</a>
        <a href={`/${locale}#advantages`}>{dictionary.header.nav.advantages}</a>
        <a href={`/${locale}#contact`}>{dictionary.header.nav.contact}</a>
      </nav>

      <div className="flex items-center gap-3">
        <LanguageSwitcher locale={locale} />
        <TelegramIconLink href={telegramLink} />
        <Button asChild className="rounded-full px-5">
          <a href={`/${locale}#contact`}>{dictionary.header.cta}</a>
        </Button>
      </div>
    </header>
  );
}
