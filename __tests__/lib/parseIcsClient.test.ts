import { parseIcsToEvents } from '@/lib/parseIcsClient'

const MINIMAL_ICS = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:test-event-1
DTSTART:20260215T100000
DTEND:20260215T110000
SUMMARY:Test Event
LOCATION:Community Garden
DESCRIPTION:Come join us.
END:VEVENT
END:VCALENDAR
`.trim()

describe('parseIcsToEvents', () => {
  it('parses minimal ICS and returns events with expected shape', async () => {
    const events = await parseIcsToEvents(MINIMAL_ICS)
    expect(Array.isArray(events)).toBe(true)
    expect(events.length).toBeGreaterThanOrEqual(1)
    const ev = events[0]
    expect(ev).toMatchObject({
      title: 'Test Event',
      date: '2026-02-15',
      startTime: '10:00',
      endTime: '11:00',
      location: 'Community Garden',
      description: 'Come join us.',
      type: 'event',
    })
    expect(ev.id).toBeDefined()
    expect(typeof ev.id).toBe('string')
    expect(ev.contactPerson).toBe('')
    expect(ev.contactEmail).toBe('')
  })
})
