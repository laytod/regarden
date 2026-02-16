/**
 * Fetches and parses a public (or secret) Google Calendar iCal feed at build time,
 * so events can be managed in Google Calendar and displayed on the site.
 *
 * Set GOOGLE_CALENDAR_ICAL_URL in the environment to enable.
 * - Public calendar: https://calendar.google.com/calendar/ical/{CALENDAR_ID}/public/basic.ics
 * - Private (secret): use "Secret address in iCal format" from Calendar → Settings → Integrate calendar
 */

import ical from 'node-ical'

/** Event shape used by the events page and FullCalendar (must match EventsClient / EventViewModal) */
export interface CalendarEvent {
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

const VALID_RANGE_START = new Date('2026-01-01')
const VALID_RANGE_END = new Date()
VALID_RANGE_END.setFullYear(VALID_RANGE_END.getFullYear() + 2)

function formatDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatTimeLocal(d: Date): string {
  return d.toTimeString().slice(0, 5) // HH:MM
}

/** Create a safe, unique id for an event instance (handles recurring instances) */
function eventId(uid: string, start: Date): string {
  const base = `${uid}-${start.getTime()}`
  return base.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 128)
}

/** node-ical parsed VEVENT shape (minimal for our use) */
interface IcalVevent {
  type?: string
  summary?: unknown
  description?: unknown
  location?: unknown
  uid?: unknown
  start?: Date
  end?: Date
  rrule?: unknown
  event?: { description?: unknown; location?: unknown }
}

/** node-ical can return summary/description as string or { value: string } */
function stringValue(v: unknown): string {
  if (typeof v === 'string') return v.trim()
  if (v && typeof v === 'object' && 'value' in v) return String((v as { value: unknown }).value).trim()
  return ''
}

function mapIcalToEvent(
  summary: string,
  description: string,
  location: string,
  start: Date,
  end: Date,
  uid: string
): CalendarEvent {
  const dateStr = formatDateLocal(start)
  const startTime = formatTimeLocal(start)
  const endTime = formatTimeLocal(end)
  return {
    id: eventId(uid, start),
    title: summary || 'Untitled',
    date: dateStr,
    startTime,
    endTime,
    location: location || '',
    description: description || '',
    type: 'event',
    contactPerson: '',
    contactEmail: '',
  }
}

/**
 * Fetch events from a Google Calendar iCal URL. Used at build time.
 * Returns an array of events in the app's Event shape; recurring events are expanded.
 */
export async function fetchGoogleCalendarEvents(
  icalUrl: string
): Promise<CalendarEvent[]> {
  const raw = (await ical.async.fromURL(icalUrl, {
    headers: { 'User-Agent': 'ReGarden/1.0' },
  })) as Record<string, unknown> | null | undefined
  const data = raw && typeof raw === 'object' ? raw : {}

  const events: CalendarEvent[] = []
  const from = VALID_RANGE_START
  const to = VALID_RANGE_END

  for (const key of Object.keys(data)) {
    const ev = data[key] as IcalVevent | null | undefined
    if (!ev || ev.type !== 'VEVENT') continue

    const summary = String(ev.summary ?? '').trim()
    const description = ev.description ? String(ev.description).trim() : ''
    const location = ev.location ? String(ev.location).trim() : ''
    const uid = ev.uid ? String(ev.uid) : key

    if (ev.rrule) {
      const instances = ical.expandRecurringEvent(ev as Parameters<typeof ical.expandRecurringEvent>[0], { from, to })
      for (const instance of instances) {
        const start = instance.start
        const end = instance.end
        if (end <= from || start >= to) continue
        events.push(
          mapIcalToEvent(
            stringValue(instance.summary) || summary,
            stringValue(instance.event?.description) ?? description,
            stringValue(instance.event?.location) ?? location,
            start,
            end,
            uid
          )
        )
      }
    } else {
      const start = ev.start
      const end = ev.end
      if (!start || !end) continue
      if (end <= from || start >= to) continue
      events.push(
        mapIcalToEvent(summary, description, location, start, end, uid)
      )
    }
  }

  events.sort(
    (a, b) =>
      new Date(`${a.date}T${a.startTime}`).getTime() -
      new Date(`${b.date}T${b.startTime}`).getTime()
  )
  return events
}
