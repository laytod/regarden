import fs from 'fs'
import path from 'path'
import EventsClient from './EventsClient'
import type { CalendarEvent } from '@/lib/googleCalendar'

function getEventsFromFile(): CalendarEvent[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const clientFetchIcalUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ICAL_URL

  // Client fetch on load: pass URL so the client fetches when the page loads (use for public calendars).
  // Build-time: when GOOGLE_CALENDAR_ICAL_URL is set, events are filled by the pre-build script (scripts/fetch-calendar-to-json.mjs) and we just read data/events.json.
  let events: CalendarEvent[]
  if (clientFetchIcalUrl != null && clientFetchIcalUrl !== '') {
    events = []
  } else {
    events = getEventsFromFile()
  }

  return (
    <EventsClient
      initialEvents={events}
      icalFeedUrl={
        clientFetchIcalUrl != null && clientFetchIcalUrl !== ''
          ? clientFetchIcalUrl
          : undefined
      }
    />
  )
}
