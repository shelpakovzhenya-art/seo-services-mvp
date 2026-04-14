export type SocialLinkType = 'telegram' | 'whatsapp' | 'vk' | 'max'

const HAS_URI_SCHEME_RE = /^[a-z][a-z\d+.-]*:/i

export function normalizeSocialUrl(value: string | null | undefined, type: SocialLinkType): string | null {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  if (HAS_URI_SCHEME_RE.test(trimmed)) {
    return trimmed
  }

  if (type === 'telegram') {
    const username = trimmed.replace(/^@/, '')

    if (/^(?:t\.me|telegram\.me)\//i.test(username)) {
      return `https://${username}`
    }

    if (/^[a-z\d_]{5,}$/i.test(username)) {
      return `https://t.me/${username}`
    }
  }

  if (type === 'whatsapp') {
    const compact = trimmed.replace(/\s+/g, '')

    if (/^(?:wa\.me|api\.whatsapp\.com)\//i.test(compact)) {
      return `https://${compact}`
    }

    const digits = compact.replace(/\D/g, '')

    if (digits.length >= 7) {
      return `https://wa.me/${digits}`
    }
  }

  if (type === 'vk') {
    const username = trimmed.replace(/^@/, '')

    if (/^(?:vk\.com|m\.vk\.com)\//i.test(username)) {
      return `https://${username}`
    }

    if (/^[a-z\d_.-]+$/i.test(username)) {
      return `https://vk.com/${username}`
    }
  }

  if (type === 'max' && /^(?:max\.ru|m\.max\.ru)\//i.test(trimmed)) {
    return `https://${trimmed}`
  }

  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`
  }

  return trimmed
}
