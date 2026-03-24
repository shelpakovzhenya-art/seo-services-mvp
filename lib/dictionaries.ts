import type { Locale } from '@/lib/i18n'
import en from '@/locales/en'
import ru from '@/locales/ru'

const dictionaries = {
  ru,
  en,
} as const

export function getDictionary(locale: Locale) {
  return dictionaries[locale]
}
