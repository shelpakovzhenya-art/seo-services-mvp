import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import { type Locale, locales, prefixPathWithLocale } from '@/lib/i18n'

const flagMap: Record<Locale, string> = {
  ru: '🇷🇺',
  en: '🇺🇸',
}

type LanguageSwitcherProps = {
  locale: Locale
  pathname: string
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
            <span aria-hidden="true" className="language-flag">
              {flagMap[item]}
            </span>
            <span>{dictionary.localeLabel}</span>
          </Link>
        )
      })}
    </div>
  )
}
