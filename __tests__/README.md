# Test Suite for ReGarden

## Overview

This test suite covers core utilities for the ReGarden nonprofit website: content management, calendar parsing, form submission, time formatting, and HTML sanitization. Tests use mocked dependencies (file system, node-ical) so they run quickly without external I/O.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests (`lib/`)

- **`lib/content.test.ts`** - Content utilities
  - getContent: read, parse, defaults on error
  - updateContent: merge partial updates, write to file

- **`lib/parseIcsClient.test.ts`** - iCal parsing for event calendar
  - parseIcsToEvents: parses ICS string to event shape (title, date, startTime, endTime, location, description)

- **`lib/formatTime.test.ts`** - Time formatting for display
  - formatTime12h: 24h → 12h with AM/PM, padding, invalid input handling

- **`lib/submitForm.test.ts`** - Volunteer/donation form submission
  - submitForm: builds mailto URL with subject and formatted body
  - Field formatting (single values, arrays)
  - Callback receives URL for opening email client

- **`lib/googleCalendar.test.ts`** - Google Calendar iCal fetch (Node env)
  - fetchGoogleCalendarEvents: maps VEVENT to CalendarEvent, sorts by date/time
  - Returns empty array when URL returns no data
  - Skips non-VEVENT entries

- **`lib/sanitizeHtml.test.ts`** - HTML sanitization for event descriptions
  - sanitizeEventDescription: allows safe tags (bold, italic, links, breaks)
  - Strips script and style tags
  - Strips dangerous attributes (e.g. onclick)

## Adding New Tests

1. Create test file in `__tests__/` (mirror the source path, e.g. `__tests__/lib/foo.test.ts` for `lib/foo.ts`)
2. Use naming convention: `*.test.ts` or `*.test.tsx`
3. Group related tests with `describe` blocks
4. Mock external dependencies (file system, node-ical, etc.)
5. Update this README with the new test file and what it covers

## Notes

- Tests use mocked file system operations (no actual file I/O)
- `lib/content.test.ts` and `lib/googleCalendar.test.ts` use `@jest-environment node` (Node APIs)
- All tests should be fast and isolated
