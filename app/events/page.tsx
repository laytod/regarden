import fs from 'fs'
import path from 'path'
import EventsClient from './EventsClient'

function getEventsAtBuildTime() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function EventsPage() {
  const events = getEventsAtBuildTime()
  return <EventsClient initialEvents={events} />
}
