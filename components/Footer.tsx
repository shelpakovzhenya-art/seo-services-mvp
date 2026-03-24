import { getSiteSettings } from "@/lib/site-settings";
import TelegramIconLink from "@/components/TelegramIconLink";
import { normalizeExternalLink, normalizeTelegramLink } from "@/lib/contact-links";
import type { Dictionary, Locale } from "@/lib/i18n";

export default async function Footer({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const settings = await getSiteSettings();
  const telegramLink = normalizeTelegramLink(settings.telegram) || `/${locale}#contact`;
  const whatsappLink = normalizeExternalLink(settings.whatsapp);

  return (
    <footer className="site-shell py-10 text-center text-sm text-slate-500">
      <p>{dictionary.footer.description}</p>

      {(telegramLink || whatsappLink || settings.email || settings.phone) ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <TelegramIconLink href={telegramLink} />

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
            >
              {dictionary.footer.whatsapp}
            </a>
          ) : null}

          {settings.phone ? (
            <a
              href={`tel:${settings.phone}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
            >
              {settings.phone}
            </a>
          ) : null}

          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:text-rose-600"
            >
              {settings.email}
            </a>
          ) : null}
        </div>
      ) : null}
    </footer>
  );
}
