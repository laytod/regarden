/**
 * @jest-environment node
 */
import type { CalendarEvent } from '@/lib/googleCalendar'

const mockFromURL = jest.fn()
jest.mock('node-ical', () => ({
  __esModule: true,
  default: {
    async: { fromURL: (...args: unknown[]) => mockFromURL(...args) },
    expandRecurringEvent: jest.fn(),
  },
}))

async function loadModule() {
  const mod = await import('@/lib/googleCalendar')
  return mod.fetchGoogleCalendarEvents
}

describe('fetchGoogleCalendarEvents', () => {
  beforeEach(() => mockFromURL.mockReset())

  it('returns empty array when URL returns no data', async () => {
    mockFromURL.mockResolvedValue(null)
    const fetchEvents = await loadModule()
    const events = await fetchEvents('https://example.com/calendar.ics')
    expect(events).toEqual([])
  })

  it('maps VEVENT to CalendarEvent shape and sorts by date/time', async () => {
    const start = new Date('2026-06-10T14:00:00')
    const end = new Date('2026-06-10T15:00:00')
    mockFromURL.mockResolvedValue({
      'ev-1': {
        type: 'VEVENT',
        summary: 'Garden Day',
        description: 'Weeding and planting',
        location: 'Main Garden',
        uid: 'ev-1',
        start,
        end,
      },
    })
    const fetchEvents = await loadModule()
    const events = await fetchEvents('https://example.com/calendar.ics')
    expect(events).toHaveLength(1)
    const ev = events[0] as CalendarEvent
    expect(ev.title).toBe('Garden Day')
    expect(ev.description).toBe('Weeding and planting')
    expect(ev.location).toBe('Main Garden')
    expect(ev.date).toBe('2026-06-10')
    expect(ev.startTime).toBe('14:00')
    expect(ev.endTime).toBe('15:00')
    expect(ev.type).toBe('event')
    expect(ev.id).toBeDefined()
  })

  it('skips non-VEVENT entries', async () => {
    mockFromURL.mockResolvedValue({
      'vtodo-1': { type: 'VTODO', summary: 'Todo' },
    })
    const fetchEvents = await loadModule()
    const events = await fetchEvents('https://example.com/calendar.ics')
    expect(events).toEqual([])
  })
})
