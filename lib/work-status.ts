const DAY_MAP: Record<string, number> = {
  пн: 1,
  вт: 2,
  ср: 3,
  чт: 4,
  пт: 5,
  сб: 6,
  вс: 7,
}

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

function parseDays(schedule: string) {
  const normalized = schedule.toLowerCase().replace(/–|—/g, '-')
  const rangeMatch = normalized.match(/(пн|вт|ср|чт|пт|сб|вс)\s*-\s*(пн|вт|ср|чт|пт|сб|вс)/)

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

  const matches = [...normalized.matchAll(/\b(пн|вт|ср|чт|пт|сб|вс)\b/g)].map((match) => DAY_MAP[match[1]])
  return matches.length > 0 ? matches : [1, 2, 3, 4, 5]
}

function parseTime(schedule: string) {
  const normalized = schedule.replace(/–|—/g, '-')
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
  const schedule = workSchedule?.trim() || 'Пн-Пт 09:00-17:00'
  const moscow = getMoscowDate()
  const { startMinutes, endMinutes } = parseTime(schedule)
  const activeDays = parseDays(schedule)
  const currentMinutes = moscow.hours * 60 + moscow.minutes
  const isWorking = activeDays.includes(moscow.dayOfWeek) && currentMinutes >= startMinutes && currentMinutes <= endMinutes

  return {
    isWorking,
    text: isWorking ? 'Сейчас работаю' : 'Сейчас вне графика',
    toneClass: isWorking ? 'text-emerald-700' : 'text-amber-700',
    dotClass: isWorking ? 'bg-emerald-500' : 'bg-amber-500',
  }
}
