import en from "@/locales/en";
import ru from "@/locales/ru";

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const dictionaries = {
  ru,
  en,
};

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ru" ? "en" : "ru";
}
