const DAY_MAP: Record<string, number> = {
  '\u043f\u043d': 1,
  '\u0432\u0442': 2,
  '\u0441\u0440': 3,
  '\u0447\u0442': 4,
  '\u043f\u0442': 5,
  '\u0441\u0431': 6,
  '\u0432\u0441': 7,
}

const DAY_PATTERN =
  /(\u043f\u043d|\u0432\u0442|\u0441\u0440|\u0447\u0442|\u043f\u0442|\u0441\u0431|\u0432\u0441)/g

function getMoscowDate() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  })

  const parts = formatter.formatToParts(now)
  const get = (type: string) => parts.find((part) => part.type === type)?.value || ''

  const weekdayRaw = get('weekday').toLowerCase()
  const weekdayMap: Record<string, number> = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    sun: 7,
  }

  return {
    dayOfWeek: weekdayMap[weekdayRaw] || 1,
    hours: Number(get('hour') || '0'),
    minutes: Number(get('minute') || '0'),
  }
}

function normalizeSchedule(schedule: string) {
  return schedule
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDays(schedule: string) {
  const normalized = normalizeSchedule(schedule)
  const rangeMatch = normalized.match(
    /(\u043f\u043d|\u0432\u0442|\u0441\u0440|\u0447\u0442|\u043f\u0442|\u0441\u0431|\u0432\u0441)\s*-\s*(\u043f\u043d|\u0432\u0442|\u0441\u0440|\u0447\u0442|\u043f\u0442|\u0441\u0431|\u0432\u0441)/,
  )

  if (rangeMatch) {
    const start = DAY_MAP[rangeMatch[1]]
    const end = DAY_MAP[rangeMatch[2]]

    if (start && end) {
      if (start <= end) {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index)
      }

      return [1, 2, 3, 4, 5, 6, 7].filter((day) => day >= start || day <= end)
    }
  }

  const matches = [...normalized.matchAll(DAY_PATTERN)]
    .map((match) => DAY_MAP[match[1]])
    .filter(Boolean)

  return matches.length > 0 ? matches : [1, 2, 3, 4, 5]
}

function parseTime(schedule: string) {
  const normalized = normalizeSchedule(schedule)
  const timeMatch = normalized.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)

  if (!timeMatch) {
    return {
      startMinutes: 9 * 60,
      endMinutes: 17 * 60,
    }
  }

  return {
    startMinutes: Number(timeMatch[1]) * 60 + Number(timeMatch[2]),
    endMinutes: Number(timeMatch[3]) * 60 + Number(timeMatch[4]),
  }
}

export function getWorkStatus(workSchedule?: string | null) {
  const schedule = workSchedule?.trim() || '\u041f\u043d-\u041f\u0442 09:00-17:00'
  const moscow = getMoscowDate()
  const { startMinutes, endMinutes } = parseTime(schedule)
  const activeDays = parseDays(schedule)
  const currentMinutes = moscow.hours * 60 + moscow.minutes
  const isWorking = activeDays.includes(moscow.dayOfWeek) && currentMinutes >= startMinutes && currentMinutes <= endMinutes

  return {
    isWorking,
    text: isWorking ? '\u0412 \u0441\u0435\u0442\u0438' : '\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438',
    badgeClass: isWorking
      ? 'border-emerald-200 bg-emerald-50/90 text-emerald-700'
      : 'border-red-200 bg-red-50/90 text-red-700',
    dotClass: isWorking ? 'bg-emerald-500' : 'bg-red-500',
    pingClass: isWorking ? 'bg-emerald-400/50' : 'bg-red-400/50',
  }
}
