#!/usr/bin/env node
/**
 * Test that your Google Calendar iCal URL returns events.
 * Run: node scripts/test-calendar-fetch.mjs "YOUR_ICAL_URL"
 * Or: GOOGLE_CALENDAR_ICAL_URL="..." node scripts/test-calendar-fetch.mjs
 */
const url = process.env.GOOGLE_CALENDAR_ICAL_URL || process.argv[2]
if (!url) {
  console.error('Usage: node scripts/test-calendar-fetch.mjs "https://calendar.google.com/calendar/ical/.../basic.ics"')
  console.error('   Or: GOOGLE_CALENDAR_ICAL_URL="..." node scripts/test-calendar-fetch.mjs')
  process.exit(1)
}

async function main() {
  const ical = await import('node-ical')
  console.log('Fetching', url.slice(0, 60) + '...')
  const data = await ical.default.async.fromURL(url, { headers: { 'User-Agent': 'ReGarden/1.0' } })
  const from = new Date('2026-01-01')
  const to = new Date()
  to.setFullYear(to.getFullYear() + 2)

  const events = []
  for (const key of Object.keys(data)) {
    const ev = data[key]
    if (!ev || ev.type !== 'VEVENT') continue
    const summary = String(ev.summary ?? '').trim()
    if (ev.rrule) {
      const instances = ical.default.expandRecurringEvent(ev, { from, to })
      for (const i of instances) {
        const d = i.start
        events.push({ date: d.toISOString().slice(0, 10), title: summary })
      }
    } else if (ev.start && ev.end && ev.end > from && ev.start < to) {
      events.push({ date: ev.start.toISOString().slice(0, 10), title: summary })
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date))
  console.log('Events in range 2026-01-01 to', to.toISOString().slice(0, 10) + ':', events.length)
  events.slice(0, 10).forEach((e, i) => console.log(' ', i + 1 + '.', e.date, '-', e.title))
  if (events.length > 10) console.log(' ...')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
