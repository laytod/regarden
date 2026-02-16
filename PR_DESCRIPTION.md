# Google Calendar integration for Events

## Summary

Events can now be driven from a **Google Calendar** (public or private) via its iCal feed. Events are managed in Google Calendar and displayed on the `/events` page, with optional build-time or client-side fetching.

## Changes

### Calendar integration

- **Build-time fetch**  
  - Pre-build script `scripts/fetch-calendar-to-json.mjs` runs before `next build` when `GOOGLE_CALENDAR_ICAL_URL` is set.  
  - Fetches the iCal feed (with retries), parses with `node-ical`, expands recurring events, and writes `data/events.json`.  
  - Keeps the iCal URL server-side only (suitable for private/secret feeds).

- **Client-side fetch (optional)**  
  - When `NEXT_PUBLIC_GOOGLE_CALENDAR_ICAL_URL` is set, the events page fetches the feed in the browser on load and parses it with `ical-expander`.  
  - Events stay up to date without rebuilding. Intended for **public** calendar URLs only (URL is visible in the client).

- **Fallback**  
  - If neither env var is set, the site continues to use `data/events.json` as before.

### New / updated code

- **`lib/googleCalendar.ts`** – Build-time calendar fetch and parsing (node-ical), shared `CalendarEvent` type, date range 2026–(now+2 years).
- **`lib/parseIcsClient.ts`** – Client-side ICS parsing (ical-expander) for the “fetch on page load” path; recurrence expansion in the same range.
- **`app/events/page.tsx`** – Chooses initial events from file vs empty (when using client fetch), passes `icalFeedUrl` and optional `calendarErrorMessage` to the client.
- **`app/events/EventsClient.tsx`** – Accepts `icalFeedUrl` and `calendarErrorMessage`; when `icalFeedUrl` is set, fetches feed on mount, parses via `parseIcsToEvents`, and updates calendar; shows loading/error states.
- **`components/Events/LocationLink.tsx`** – New component: event location as a link (Apple Maps on iOS, `geo:` on Android, Google Maps on desktop).
- **`components/Events/EventViewModal.tsx`** – Uses `LocationLink` for the location field.
- **`scripts/fetch-calendar-to-json.mjs`** – Standalone script for build: reads `GOOGLE_CALENDAR_ICAL_URL` from env or `.env.local`, fetches, parses, writes `data/events.json`; no-op if URL not set.
- **`scripts/test-calendar-fetch.mjs`** – Script to test the calendar fetch (run via `npm run calendar:test`).

### Build & config

- **`package.json`**  
  - Build script: `node scripts/fetch-calendar-to-json.mjs && npm run clean && next build`.  
  - New script: `calendar:test` for testing the fetch.  
  - New dependencies: `node-ical`, `ical-expander`.

- **`data/events.json`** – Updated/regenerated when using the fetch script (structure unchanged for existing consumers).

### Docs and cleanup

- **`README.md`** – Documents Google Calendar setup (public calendar, iCal URL), env vars (`GOOGLE_CALENDAR_ICAL_URL` vs `NEXT_PUBLIC_GOOGLE_CALENDAR_ICAL_URL`), and build-time vs client-side behaviour.
- **Removed** `ADMIN_PANEL_IMPLEMENTATION_PLAN.md` and `ADMIN_SETUP.md` (out-of-scope admin docs).

### Other

- **`app/donate/page.tsx`** – Minor updates (e.g. copy or layout).
- **`app/layout.tsx`** – Minor updates.

## How to test

1. **No calendar URL**  
   - Don’t set any calendar env vars; run `npm run build` and open `/events`. Events should come from `data/events.json`.

2. **Build-time fetch**  
   - Set `GOOGLE_CALENDAR_ICAL_URL` in `.env.local` (or env) to a public or secret iCal URL.  
   - Run `npm run build`; then open `/events`. Events should match the feed (and `data/events.json` should be updated).

3. **Client-side fetch**  
   - Set `NEXT_PUBLIC_GOOGLE_CALENDAR_ICAL_URL` to a **public** iCal URL.  
   - Build and open `/events`; events should load in the browser and reflect the current calendar.

4. **Location links**  
   - Open an event that has a location; the location should be a clickable link (maps on mobile/desktop as above).

## Checklist

- [ ] README instructions for Google Calendar and env vars are accurate for your setup.
- [ ] Build succeeds with and without `GOOGLE_CALENDAR_ICAL_URL` set.
- [ ] Events page shows loading/error state when client fetch is used and the feed fails.
- [ ] Removing `ADMIN_PANEL_IMPLEMENTATION_PLAN.md` and `ADMIN_SETUP.md` is intentional (or restore them in a follow-up).
