import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import { type Locale, locales, prefixPathWithLocale } from '@/lib/i18n'

type LanguageSwitcherProps = {
  locale: Locale
  pathname: string
}

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === 'ru') {
    return (
      <svg viewBox="0 0 18 12" aria-hidden="true" className="language-flag-svg">
        <rect width="18" height="12" rx="2" fill="#FFFFFF" />
        <rect y="4" width="18" height="4" fill="#2F6BFF" />
        <rect y="8" width="18" height="4" fill="#E54B4B" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 18 12" aria-hidden="true" className="language-flag-svg">
      <rect width="18" height="12" rx="2" fill="#B22234" />
      <path d="M0 2h18M0 4h18M0 6h18M0 8h18M0 10h18" stroke="#fff" strokeWidth="1" />
      <rect width="8" height="6.5" rx="2" fill="#3C3B6E" />
      <circle cx="1.7" cy="1.6" r=".35" fill="#fff" />
      <circle cx="3.4" cy="1.6" r=".35" fill="#fff" />
      <circle cx="5.1" cy="1.6" r=".35" fill="#fff" />
      <circle cx="6.8" cy="1.6" r=".35" fill="#fff" />
      <circle cx="2.55" cy="3.1" r=".35" fill="#fff" />
      <circle cx="4.25" cy="3.1" r=".35" fill="#fff" />
      <circle cx="5.95" cy="3.1" r=".35" fill="#fff" />
      <circle cx="1.7" cy="4.6" r=".35" fill="#fff" />
      <circle cx="3.4" cy="4.6" r=".35" fill="#fff" />
      <circle cx="5.1" cy="4.6" r=".35" fill="#fff" />
      <circle cx="6.8" cy="4.6" r=".35" fill="#fff" />
    </svg>
  )
}

export default function LanguageSwitcher({ locale, pathname }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" aria-label={getDictionary(locale).switchTo}>
      {locales.map((item) => {
        const dictionary = getDictionary(item)
        const active = item === locale

        return (
          <Link
            key={item}
            href={prefixPathWithLocale(pathname, item)}
            className={`language-pill ${active ? 'is-active' : ''}`}
            hrefLang={item}
            lang={item}
          >
            <FlagIcon locale={item} />
            <span>{dictionary.localeLabel}</span>
          </Link>
        )
      })}
    </div>
  )
}
