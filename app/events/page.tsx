import EventsClient from './EventsClient'
import type { CalendarEvent } from '@/lib/googleCalendar'
import eventsData from '@/data/events.json'

export default function EventsPage() {
  const events = Array.isArray(eventsData)
    ? (eventsData as CalendarEvent[])
    : []
  return <EventsClient initialEvents={events} />
}
