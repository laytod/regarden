/**
 * Parse ICS string in the browser (client-side only).
 * Used when fetching the Google Calendar feed on page load.
 * Uses ical-expander for recurrence expansion.
 */

export interface ParsedCalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  description: string
  type: string
  contactPerson: string
  contactEmail: string
}

const RANGE_START = new Date('2026-01-01')
const RANGE_END = new Date()
RANGE_END.setFullYear(RANGE_END.getFullYear() + 2)

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function formatTime(d: Date): string {
  return d.toTimeString().slice(0, 5)
}

function safeId(uid: string, start: Date): string {
  return `${uid}-${start.getTime()}`.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 128)
}

function str(v: unknown): string {
  if (typeof v === 'string') return v.trim()
  return ''
}

/**
 * Parse ICS text and return events in the app's Event shape.
 * Recurring events are expanded for the next two years.
 * Call only on the client (dynamically imports ical-expander).
 */
export async function parseIcsToEvents(
  icsText: string
): Promise<ParsedCalendarEvent[]> {
  const { default: IcalExpander } = await import('ical-expander')
  const expander = new IcalExpander({ ics: icsText, maxIterations: 999 })
  const { events, occurrences } = expander.between(RANGE_START, RANGE_END)

  const result: ParsedCalendarEvent[] = []

  for (const ev of events) {
    const start = ev.startDate.toJSDate()
    const end = ev.endDate.toJSDate()
    const uid = str(ev.uid) || `ev-${start.getTime()}`
    result.push({
      id: safeId(uid, start),
      title: str(ev.summary) || 'Untitled',
      date: formatDate(start),
      startTime: formatTime(start),
      endTime: formatTime(end),
      location: str(ev.location),
      description: str(ev.description),
      type: 'event',
      contactPerson: '',
      contactEmail: '',
    })
  }

  for (const occ of occurrences) {
    const start = occ.startDate.toJSDate()
    const end = occ.endDate.toJSDate()
    const item = occ.item ?? occ
    const uid = str(item.uid) || `occ-${start.getTime()}`
    result.push({
      id: safeId(uid, start),
      title: str(item.summary) || 'Untitled',
      date: formatDate(start),
      startTime: formatTime(start),
      endTime: formatTime(end),
      location: str(item.location),
      description: str(item.description),
      type: 'event',
      contactPerson: '',
      contactEmail: '',
    })
  }

  result.sort(
    (a, b) =>
      new Date(`${a.date}T${a.startTime}`).getTime() -
      new Date(`${b.date}T${b.startTime}`).getTime()
  )
  return result
}
