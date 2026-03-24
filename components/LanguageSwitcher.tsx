"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

function FlagRussia() {
  return (
    <svg viewBox="0 0 18 12" aria-hidden="true" className="h-4 w-5 overflow-hidden rounded-sm">
      <rect width="18" height="12" fill="#fff" />
      <rect y="4" width="18" height="4" fill="#0039A6" />
      <rect y="8" width="18" height="4" fill="#D52B1E" />
    </svg>
  );
}

function FlagUsa() {
  return (
    <svg viewBox="0 0 18 12" aria-hidden="true" className="h-4 w-5 overflow-hidden rounded-sm">
      <rect width="18" height="12" fill="#fff" />
      <g fill="#B22234">
        <rect width="18" height="1" y="0" />
        <rect width="18" height="1" y="2" />
        <rect width="18" height="1" y="4" />
        <rect width="18" height="1" y="6" />
        <rect width="18" height="1" y="8" />
        <rect width="18" height="1" y="10" />
      </g>
      <rect width="8" height="5.6" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="1.2" cy="1.1" r="0.35" />
        <circle cx="3" cy="1.1" r="0.35" />
        <circle cx="4.8" cy="1.1" r="0.35" />
        <circle cx="6.6" cy="1.1" r="0.35" />
        <circle cx="2.1" cy="2.1" r="0.35" />
        <circle cx="3.9" cy="2.1" r="0.35" />
        <circle cx="5.7" cy="2.1" r="0.35" />
        <circle cx="1.2" cy="3.1" r="0.35" />
        <circle cx="3" cy="3.1" r="0.35" />
        <circle cx="4.8" cy="3.1" r="0.35" />
        <circle cx="6.6" cy="3.1" r="0.35" />
        <circle cx="2.1" cy="4.1" r="0.35" />
        <circle cx="3.9" cy="4.1" r="0.35" />
        <circle cx="5.7" cy="4.1" r="0.35" />
      </g>
    </svg>
  );
}

const labels = {
  ru: { short: "RU", icon: <FlagRussia /> },
  en: { short: "US", icon: <FlagUsa /> },
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (targetLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    const tail = segments[0] === "ru" || segments[0] === "en" ? segments.slice(1) : segments;
    const nextPath = `/${targetLocale}${tail.length ? `/${tail.join("/")}` : ""}`;
    const query = searchParams.toString();
    return `${nextPath}${query ? `?${query}` : ""}`;
  };

  return (
    <div className="language-switcher">
      {(["ru", "en"] as Locale[]).map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={buildHref(item)}
            className={`language-pill ${active ? "language-pill-active" : ""}`}
          >
            {labels[item].icon}
            <span>{labels[item].short}</span>
          </Link>
        );
      })}
    </div>
  );
}
