export function containsCyrillic(value?: string | null) {
  return /[А-Яа-яЁё]/.test(value || '')
}

export function shouldUseLocalizedFallback(locale: 'ru' | 'en', value?: string | null) {
  if (!value?.trim()) {
    return true
  }

  return locale === 'en' ? containsCyrillic(value) : false
}
