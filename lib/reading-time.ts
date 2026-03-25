type ReadingLocale = 'ru' | 'en' | string

const DEFAULT_WORDS_PER_MINUTE = 180

function stripMarkup(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, ' $1 ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/&nbsp;|&amp;|&quot;|&#39;|&lt;|&gt;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getReadingTimeMinutes(content: string | null | undefined, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE) {
  if (!content) {
    return 1
  }

  const plainText = stripMarkup(content)
  const words = plainText.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []

  if (!words.length) {
    return 1
  }

  return Math.max(1, Math.ceil(words.length / wordsPerMinute))
}

export function formatReadingTime(minutes: number, locale: ReadingLocale = 'ru') {
  return locale.toLowerCase().startsWith('en') ? `${minutes} min read` : `${minutes} мин чтения`
}

export function getReadingTimeLabel(content: string | null | undefined, locale: ReadingLocale = 'ru') {
  return formatReadingTime(getReadingTimeMinutes(content), locale)
}
