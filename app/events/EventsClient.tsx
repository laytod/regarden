'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventViewModal from '@/components/Events/EventViewModal'
import LocationLink from '@/components/Events/LocationLink'
import { formatTime12h } from '@/lib/formatTime'
import { sanitizeEventDescription } from '@/lib/sanitizeHtml'
import { EventInput } from '@fullcalendar/core'

export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  description: string
  type: string
  contactPerson: string
  contactEmail: string
}

function localYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function localYearMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * When the current month has no events, default the grid to the next month that
 * does; if all events are in the past, show the month of the latest event so
 * entries are visible without hunting through prev/next.
 *
 * (No special-case for year < 2026: forcing Jan 2026 made the grid look
 * empty whenever the machine clock was still in 2025.)
 */
function calendarInitialDate(events: Event[]): string | undefined {
  if (events.length === 0) return undefined
  const now = new Date()
  const ymd = localYmd(now)
  const monthPrefix = ymd.slice(0, 7)
  const hasInCurrentMonth = events.some((e) => e.date.startsWith(monthPrefix))
  if (hasInCurrentMonth) return undefined

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
  const next = sorted.find((e) => e.date >= ymd)
  if (next) return next.date

  return sorted[sorted.length - 1].date
}

interface EventsClientProps {
  initialEvents: Event[]
}

function toLocalIsoDateTime(date: string, timeHHMM: string): string {
  const t = timeHHMM.length === 5 ? `${timeHHMM}:00` : timeHHMM
  return `${date}T${t}`
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [displayMonth, setDisplayMonth] = useState(() => localYearMonth(new Date()))
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(() =>
    Math.max(2026, new Date().getFullYear())
  )
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null)

  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const initialCalendarDate = useMemo(
    () => calendarInitialDate(initialEvents),
    [initialEvents]
  )

  const handleMonthPickerOpen = () => {
    setShowMonthPicker(true)
    const [y] = displayMonth.split('-').map(Number)
    setPickerYear(Math.max(2026, y))
  }

  // FullCalendar resets badly if `events` gets a new array reference every React render.
  const calendarEvents: EventInput[] = useMemo(() => {
    return events.map((event) => {
      const allDay =
        event.startTime === '00:00' &&
        (event.endTime === '00:00' || event.endTime === event.startTime)

      const base = {
        id: event.id,
        title: event.title,
        extendedProps: {
          location: event.location,
          description: event.description,
          type: event.type,
          contactPerson: event.contactPerson,
          contactEmail: event.contactEmail,
          startTime: event.startTime,
          endTime: event.endTime,
        },
        classNames: [`event-type-${event.type}`, 'cursor-pointer'],
      }

      if (allDay) {
        return { ...base, start: event.date, allDay: true }
      }

      const start = toLocalIsoDateTime(event.date, event.startTime)
      let end = toLocalIsoDateTime(event.date, event.endTime)
      if (end <= start) {
        const d = new Date(toLocalIsoDateTime(event.date, event.startTime))
        d.setMinutes(d.getMinutes() + 60)
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        end = toLocalIsoDateTime(event.date, `${hh}:${mm}`)
      }

      return { ...base, start, end }
    })
  }, [events])

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    const event = events.find((e) => e.id === clickInfo.event.id)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDatesSet = (arg: { start: Date }) => {
    setDisplayMonth(
      `${arg.start.getFullYear()}-${String(arg.start.getMonth() + 1).padStart(2, '0')}`
    )
  }

  const handlePickMonth = (monthIndex: number) => {
    calendarRef.current?.getApi().gotoDate(new Date(pickerYear, monthIndex, 1))
    setShowMonthPicker(false)
  }

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const todayStr = localYmd(now)
    const monthPrefix = todayStr.slice(0, 7)

    return events
      .filter((e) => {
        if (!e.date.startsWith(monthPrefix)) return false

        const allDay =
          e.startTime === '00:00' &&
          (e.endTime === '00:00' || e.endTime === e.startTime)
        if (allDay) return e.date >= todayStr

        const start = new Date(toLocalIsoDateTime(e.date, e.startTime))
        return start.getTime() >= now.getTime()
      })
      .sort(
        (a, b) =>
          new Date(toLocalIsoDateTime(a.date, a.startTime)).getTime() -
          new Date(toLocalIsoDateTime(b.date, b.startTime)).getTime()
      )
  }, [events])

  const formatEventDateLong = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {upcomingEvents.length > 0 ? (
        <section className="mb-10" aria-labelledby="upcoming-events-heading">
          <h2 id="upcoming-events-heading" className="text-xl font-semibold text-slate-100 mb-4">
            Upcoming events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-primary-500/30 bg-slate-800/50 overflow-hidden"
              >
                <div className="px-4 py-3 space-y-1.5">
                  <h3 className="text-base font-bold text-primary-400">{event.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {formatEventDateLong(event.date)}
                    {' · '}
                    {formatTime12h(event.startTime)}
                    {event.endTime && event.endTime !== event.startTime
                      ? ` – ${formatTime12h(event.endTime)}`
                      : ''}
                  </p>
                  {event.location && (
                    <p className="text-slate-300 text-sm">
                      <LocationLink
                        location={event.location}
                        className="text-primary-400 hover:underline"
                      />
                    </p>
                  )}
                  {event.description && (
                    <div
                      className="text-slate-200 text-sm whitespace-pre-wrap pt-1 [&_strong]:text-purple-300 [&_b]:text-purple-300 [&_a]:text-primary-400 [&_a]:hover:underline [&_a]:underline-offset-1"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeEventDescription(event.description),
                      }}
                    />
                  )}
                  {(event.contactPerson || event.contactEmail) && (
                    <p className="text-slate-300 text-sm">
                      Contact:{' '}
                      {event.contactPerson && <span>{event.contactPerson}</span>}
                      {event.contactPerson && event.contactEmail && ' · '}
                      {event.contactEmail && <span>{event.contactEmail}</span>}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        events.length > 0 && (
          <p className="mb-8 text-center text-slate-300 text-sm max-w-xl mx-auto">
            No upcoming events on the calendar right now. Use the month view below
            to browse scheduled dates (including earlier in the year).
          </p>
        )
      )}

      <div className="mb-8 bg-[rgb(220,240,225)] rounded-lg shadow-lg p-4 border border-primary-500/30">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          {...(initialCalendarDate != null && { initialDate: initialCalendarDate })}
          validRange={{ start: '2026-01-01' }}
          customButtons={{
            selectMonth: {
              text: 'Select month',
              click: handleMonthPickerOpen,
            },
          }}
          headerToolbar={{
            left: 'selectMonth,prev,next today',
            center: 'title',
            right: '',
          }}
          datesSet={handleDatesSet}
          events={calendarEvents}
          eventClick={handleEventClick}
          editable={false}
          selectable={false}
          height="auto"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>

      {/* Month picker modal: custom year + month grid */}
      {showMonthPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowMonthPicker(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="month-picker-title"
        >
          <div
            className="bg-slate-800 rounded-lg shadow-xl max-w-sm w-full border border-purple-500/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                id="month-picker-title"
                className="text-xl font-bold text-primary-400"
              >
                Pick a month
              </h2>
              <button
                type="button"
                onClick={() => setShowMonthPicker(false)}
                className="text-slate-200 hover:text-white text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPickerYear((y) => Math.max(2026, y - 1))}
                disabled={pickerYear <= 2026}
                className="fc-button fc-button-primary rounded px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous year"
              >
                ←
              </button>
              <span className="text-slate-200 font-semibold min-w-[4rem] text-center">
                {pickerYear}
              </span>
              <button
                type="button"
                onClick={() => setPickerYear((y) => y + 1)}
                className="fc-button fc-button-primary rounded px-3 py-1.5 text-sm"
                aria-label="Next year"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handlePickMonth(i)}
                  className="rounded px-3 py-2 text-sm font-medium bg-slate-700/60 text-slate-200 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event detail modal (view only) */}
      {isModalOpen && selectedEvent && (
        <EventViewModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  )
}
