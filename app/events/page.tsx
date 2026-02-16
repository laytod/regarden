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
  const events = getEventsFromFile()
  return <EventsClient initialEvents={events} />
}
