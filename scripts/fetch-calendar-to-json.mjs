#!/usr/bin/env node
/**
 * Pre-build script: fetch Google Calendar iCal feed and write data/events.json.
 * Runs in plain Node (not Next.js bundle) so node-ical works (no BigInt issue).
 *
 * Set GOOGLE_CALENDAR_ICAL_URL in the environment, or in .env.local / .env (one line:
 * GOOGLE_CALENDAR_ICAL_URL=https://...).
 * If not set, exits 0 without writing — npm run build still succeeds (see skip message below).
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(rootDir, 'data')
const outPath = path.join(dataDir, 'events.json')

/** Read GOOGLE_CALENDAR_ICAL_URL from the first matching line in env files. */
function loadGoogleCalendarUrlFromFiles() {
  for (const name of ['.env.local', '.env']) {
    const envPath = path.join(rootDir, name)
    try {
      const content = fs.readFileSync(envPath, 'utf8')
      for (const line of content.split('\n')) {
        const m = line.match(
          /^\s*(?:export\s+)?GOOGLE_CALENDAR_ICAL_URL\s*=\s*(.*)\s*$/
        )
        if (m) {
          const val = m[1].trim().replace(/^["']|["']$/g, '')
          if (val && !val.startsWith('#')) return val
        }
      }
    } catch {
      // missing or unreadable
    }
  }
  return null
}

const rawEnv = process.env.GOOGLE_CALENDAR_ICAL_URL
const urlFromEnv =
  typeof rawEnv === 'string' && rawEnv.trim().length > 0
    ? rawEnv.trim().replace(/^["']|["']$/g, '')
    : ''
const url = urlFromEnv || loadGoogleCalendarUrlFromFiles()

if (!url || !url.startsWith('http')) {
  console.warn(
    '[fetch-calendar] Skipping: GOOGLE_CALENDAR_ICAL_URL is not set or invalid.\n' +
      '  Deploy/build will keep the existing data/events.json (may be stale).\n' +
      '  Fix: add GOOGLE_CALENDAR_ICAL_URL to .env.local (or .env), or export it before npm run deploy.'
  )
  process.exit(0)
}

console.log('[fetch-calendar] Fetching Google Calendar iCal feed…')

function pad2(n) {
  return String(n).padStart(2, '0')
}
function formatDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function formatTime(d) {
  return d.toTimeString().slice(0, 5)
}
function eventId(uid, start) {
  return `${uid}-${start.getTime()}`.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 128)
}
function stringValue(v) {
  if (typeof v === 'string') return v.trim()
  if (v && typeof v === 'object' && 'value' in v) return String(v.value).trim()
  return ''
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const FETCH_RETRIES = 3
const RETRY_DELAY_MS = 4000

async function main() {
  const ical = await import('node-ical')
  const from = new Date('2026-01-01')
  const to = new Date()
  to.setFullYear(to.getFullYear() + 2)

  let data
  let lastErr
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt++) {
    try {
      data = await ical.default.async.fromURL(url, {
        headers: { 'User-Agent': 'ReGarden/1.0' },
      })
      break
    } catch (err) {
      lastErr = err
      if (attempt < FETCH_RETRIES) {
        console.warn(`Calendar fetch attempt ${attempt}/${FETCH_RETRIES} failed (${err.message}). Retrying in ${RETRY_DELAY_MS / 1000}s...`)
        await sleep(RETRY_DELAY_MS)
      } else {
        throw lastErr
      }
    }
  }

  const events = []
  for (const key of Object.keys(data)) {
    const ev = data[key]
    if (!ev || ev.type !== 'VEVENT') continue

    const summary = stringValue(ev.summary) || ''
    const description = stringValue(ev.description) || ''
    const location = stringValue(ev.location) || ''
    const uid = ev.uid ? String(ev.uid) : key

    if (ev.rrule) {
      const instances = ical.default.expandRecurringEvent(ev, { from, to })
      for (const instance of instances) {
        const start = instance.start
        const end = instance.end
        if (end <= from || start >= to) continue
        events.push({
          id: eventId(uid, start),
          title: stringValue(instance.summary) || summary,
          date: formatDate(start),
          startTime: formatTime(start),
          endTime: formatTime(end),
          location: stringValue(instance.event?.location) ?? location,
          description: stringValue(instance.event?.description) ?? description,
          type: 'event',
          contactPerson: '',
          contactEmail: '',
        })
      }
    } else {
      if (!ev.start || !ev.end) continue
      if (ev.end <= from || ev.start >= to) continue
      events.push({
        id: eventId(uid, ev.start),
        title: summary || 'Untitled',
        date: formatDate(ev.start),
        startTime: formatTime(ev.start),
        endTime: formatTime(ev.end),
        location,
        description,
        type: 'event',
        contactPerson: '',
        contactEmail: '',
      })
    }
  }

  events.sort(
    (a, b) =>
      new Date(`${a.date}T${a.startTime}`).getTime() -
      new Date(`${b.date}T${b.startTime}`).getTime()
  )

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(outPath, JSON.stringify(events, null, 2), 'utf8')
  console.log('Fetched', events.length, 'events → data/events.json')
}

main().catch((err) => {
  console.warn('Calendar fetch failed (build will continue using existing data/events.json if any):', err.message)
  if (err.cause) console.warn('Cause:', err.cause)
  process.exit(0)
})
